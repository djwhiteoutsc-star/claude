import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { VideoMetadata } from '../types';

// Set FFmpeg and FFprobe paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export class FFmpegUtil {
  /**
   * Get video metadata using ffprobe
   */
  static async getVideoMetadata(videoPath: string): Promise<Partial<VideoMetadata>> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

        if (!videoStream) {
          reject(new Error('No video stream found'));
          return;
        }

        resolve({
          duration: metadata.format.duration || 0,
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          format: metadata.format.format_name || 'unknown',
          fps: this.parseFps(videoStream.r_frame_rate || '30'),
        });
      });
    });
  }

  /**
   * Convert to YouTube Shorts format (9:16, 1080x1920)
   */
  static async convertToShortsFormat(
    inputPath: string,
    outputPath: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .outputOptions([
          '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '23',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-ar', '44100',
          '-movflags', '+faststart'
        ])
        .output(outputPath);

      if (onProgress) {
        command.on('progress', (progress) => {
          onProgress(progress.percent || 0);
        });
      }

      command
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Extract segment from video
   */
  static async extractSegment(
    inputPath: string,
    outputPath: string,
    startTime: number,
    duration: number,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        .outputOptions([
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '23',
          '-c:a', 'aac',
          '-b:a', '128k'
        ])
        .output(outputPath);

      if (onProgress) {
        command.on('progress', (progress) => {
          onProgress(progress.percent || 0);
        });
      }

      command
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Add audio to video
   */
  static async addAudioTrack(
    videoPath: string,
    audioPath: string,
    outputPath: string,
    audioVolume: number = 0.3,
    videoVolume: number = 0.7
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .complexFilter([
          `[0:a]volume=${videoVolume}[a1]`,
          `[1:a]volume=${audioVolume}[a2]`,
          `[a1][a2]amix=inputs=2:duration=shortest[aout]`
        ])
        .outputOptions([
          '-map', '0:v',
          '-map', '[aout]',
          '-c:v', 'copy',
          '-c:a', 'aac',
          '-shortest'
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Apply visual effects
   */
  static async applyEffects(
    inputPath: string,
    outputPath: string,
    effects: any[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let filterComplex = '';

      // Build filter chain based on effects
      effects.forEach((effect, index) => {
        switch (effect.type) {
          case 'zoom':
            filterComplex += this.getZoomFilter(effect);
            break;
          case 'filter':
            filterComplex += this.getColorFilter(effect);
            break;
          default:
            break;
        }
      });

      const command = ffmpeg(inputPath)
        .outputOptions([
          '-vf', filterComplex || 'null',
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '23',
          '-c:a', 'copy'
        ])
        .output(outputPath);

      command
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Add text overlay
   */
  static async addTextOverlay(
    inputPath: string,
    outputPath: string,
    text: string,
    position: 'top' | 'center' | 'bottom' = 'top',
    fontSize: number = 48
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const yPosition = position === 'top' ? 'h*0.1' : position === 'center' ? 'h*0.5' : 'h*0.9';

      const drawtext = `drawtext=text='${text.replace(/'/g, "\\'")}':` +
        `fontsize=${fontSize}:fontcolor=white:` +
        `x=(w-text_w)/2:y=${yPosition}:` +
        `box=1:boxcolor=black@0.5:boxborderw=10`;

      ffmpeg(inputPath)
        .outputOptions([
          '-vf', drawtext,
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '23',
          '-c:a', 'copy'
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Generate thumbnail
   */
  static async generateThumbnail(
    videoPath: string,
    outputPath: string,
    timestamp: number = 0
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timestamp],
          filename: outputPath,
          size: '1080x1920'
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
  }

  // Helper methods
  private static parseFps(fpsString: string): number {
    const parts = fpsString.split('/');
    if (parts.length === 2) {
      return parseInt(parts[0]) / parseInt(parts[1]);
    }
    return parseFloat(fpsString) || 30;
  }

  private static getZoomFilter(effect: any): string {
    const intensity = effect.intensity || 1.2;
    return `zoompan=z='min(zoom+0.0015,${intensity})':d=125:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',`;
  }

  private static getColorFilter(effect: any): string {
    switch (effect.name) {
      case 'vibrant':
        return 'eq=contrast=1.2:brightness=0.05:saturation=1.4,';
      case 'dramatic':
        return 'eq=contrast=1.3:brightness=-0.1:saturation=0.9,';
      case 'vintage':
        return 'curves=vintage,';
      case 'cinematic':
        return 'eq=contrast=1.1:brightness=-0.05:saturation=1.1,colorbalance=rs=0.1:gs=-0.1:bs=-0.1,';
      default:
        return '';
    }
  }
}
