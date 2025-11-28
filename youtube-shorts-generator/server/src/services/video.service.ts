import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { FFmpegUtil } from '../utils/ffmpeg.util';
import { AIService } from './ai.service';
import { AudioService } from './audio.service';
import {
  VideoMetadata,
  GenerationJob,
  Short,
  GenerationPreferences,
  Effect
} from '../types';

export class VideoService {
  private aiService: AIService;
  private audioService: AudioService;
  private uploadDir: string;
  private outputDir: string;
  private jobs: Map<string, GenerationJob>;

  constructor() {
    this.aiService = new AIService();
    this.audioService = new AudioService();
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.outputDir = process.env.OUTPUT_DIR || './outputs';
    this.jobs = new Map();
  }

  /**
   * Process uploaded video and create metadata
   */
  async processUpload(file: Express.Multer.File): Promise<VideoMetadata> {
    const videoId = uuidv4();
    const videoPath = path.join(this.uploadDir, `${videoId}${path.extname(file.originalname)}`);

    // Move uploaded file to permanent location
    await fs.rename(file.path, videoPath);

    // Get video metadata
    const metadata = await FFmpegUtil.getVideoMetadata(videoPath);

    const videoMetadata: VideoMetadata = {
      id: videoId,
      filename: `${videoId}${path.extname(file.originalname)}`,
      originalName: file.originalname,
      size: file.size,
      duration: metadata.duration || 0,
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      fps: metadata.fps || 30,
      uploadedAt: new Date(),
      path: videoPath
    };

    return videoMetadata;
  }

  /**
   * Generate YouTube Shorts from video
   */
  async generateShorts(
    videoMetadata: VideoMetadata,
    preferences: GenerationPreferences
  ): Promise<GenerationJob> {
    const jobId = uuidv4();

    const job: GenerationJob = {
      id: jobId,
      videoId: videoMetadata.id,
      status: 'pending',
      progress: 0,
      preferences,
      shorts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.jobs.set(jobId, job);

    // Process asynchronously
    this.processGeneration(job, videoMetadata).catch(error => {
      console.error('Generation failed:', error);
      job.status = 'failed';
      job.error = error.message;
      this.jobs.set(jobId, job);
    });

    return job;
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs for a video
   */
  getVideoJobs(videoId: string): GenerationJob[] {
    return Array.from(this.jobs.values()).filter(job => job.videoId === videoId);
  }

  // Private methods

  private async processGeneration(job: GenerationJob, videoMetadata: VideoMetadata): Promise<void> {
    try {
      // Update status
      job.status = 'analyzing';
      job.progress = 10;
      this.jobs.set(job.id, job);

      // Analyze video with AI
      const analysis = await this.aiService.analyzeVideo(videoMetadata, {});
      job.progress = 30;
      this.jobs.set(job.id, job);

      // Create shorts from segments
      job.status = 'generating';
      const numberOfShorts = preferences.numberOfShorts || analysis.segments.length;
      const segments = analysis.segments.slice(0, numberOfShorts);

      const shorts: Short[] = [];

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const shortId = uuidv4();

        const short: Short = {
          id: shortId,
          jobId: job.id,
          videoId: videoMetadata.id,
          title: `Short ${i + 1}`,
          hook: analysis.suggestedHooks[i] || 'Check This Out!',
          segment,
          effects: this.getEffectsForIntensity(job.preferences.effectsIntensity || 'medium'),
          status: 'pending',
          createdAt: new Date()
        };

        shorts.push(short);
        job.shorts.push(short);
        this.jobs.set(job.id, job);

        // Process this short
        await this.processShort(short, videoMetadata, job.preferences);

        // Update progress
        job.progress = 30 + ((i + 1) / segments.length) * 60;
        this.jobs.set(job.id, job);
      }

      // Complete
      job.status = 'completed';
      job.progress = 100;
      job.updatedAt = new Date();
      this.jobs.set(job.id, job);

    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      this.jobs.set(job.id, job);
      throw error;
    }
  }

  private async processShort(
    short: Short,
    videoMetadata: VideoMetadata,
    preferences: GenerationPreferences
  ): Promise<void> {
    short.status = 'processing';

    const outputDir = path.join(this.outputDir, short.jobId);
    await fs.mkdir(outputDir, { recursive: true });

    try {
      // Step 1: Extract segment
      const segmentPath = path.join(outputDir, `${short.id}_segment.mp4`);
      await FFmpegUtil.extractSegment(
        videoMetadata.path,
        segmentPath,
        short.segment.startTime,
        short.segment.duration
      );

      // Step 2: Convert to shorts format (9:16)
      const shortsPath = path.join(outputDir, `${short.id}_shorts.mp4`);
      await FFmpegUtil.convertToShortsFormat(segmentPath, shortsPath);

      // Step 3: Add audio if requested
      let currentPath = shortsPath;
      if (preferences.audioStyle && preferences.audioStyle !== 'none') {
        const audioTrack = await this.audioService.getRandomTrack(preferences.audioStyle);
        if (audioTrack) {
          short.audioTrack = audioTrack;
          const withAudioPath = path.join(outputDir, `${short.id}_audio.mp4`);
          await FFmpegUtil.addAudioTrack(currentPath, audioTrack.path, withAudioPath);
          currentPath = withAudioPath;
        }
      }

      // Step 4: Apply effects
      if (short.effects.length > 0) {
        const withEffectsPath = path.join(outputDir, `${short.id}_effects.mp4`);
        await FFmpegUtil.applyEffects(currentPath, withEffectsPath, short.effects);
        currentPath = withEffectsPath;
      }

      // Step 5: Add text hook
      if (preferences.includeHooks !== false) {
        const finalPath = path.join(outputDir, `${short.id}_final.mp4`);
        await FFmpegUtil.addTextOverlay(currentPath, finalPath, short.hook, 'top', 60);
        currentPath = finalPath;
      }

      // Step 6: Generate thumbnail
      const thumbnailPath = path.join(outputDir, `${short.id}_thumb.jpg`);
      await FFmpegUtil.generateThumbnail(currentPath, thumbnailPath, short.segment.duration / 2);

      // Update short with output paths
      short.outputPath = currentPath;
      short.thumbnailPath = thumbnailPath;
      short.status = 'completed';

      // Clean up intermediate files
      await this.cleanupIntermediateFiles(outputDir, short.id, currentPath);

    } catch (error: any) {
      short.status = 'failed';
      console.error(`Failed to process short ${short.id}:`, error);
      throw error;
    }
  }

  private getEffectsForIntensity(intensity: 'low' | 'medium' | 'high'): Effect[] {
    const effects: Effect[] = [];

    switch (intensity) {
      case 'high':
        effects.push({
          type: 'zoom',
          name: 'dynamic_zoom',
          intensity: 1.3,
          params: {}
        });
        effects.push({
          type: 'filter',
          name: 'vibrant',
          intensity: 1.0,
          params: {}
        });
        break;

      case 'medium':
        effects.push({
          type: 'zoom',
          name: 'subtle_zoom',
          intensity: 1.15,
          params: {}
        });
        effects.push({
          type: 'filter',
          name: 'cinematic',
          intensity: 0.7,
          params: {}
        });
        break;

      case 'low':
        effects.push({
          type: 'filter',
          name: 'enhance',
          intensity: 0.5,
          params: {}
        });
        break;
    }

    return effects;
  }

  private async cleanupIntermediateFiles(dir: string, shortId: string, finalPath: string): Promise<void> {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (file.startsWith(shortId) && filePath !== finalPath && !file.includes('thumb')) {
          await fs.unlink(filePath).catch(() => {});
        }
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}
