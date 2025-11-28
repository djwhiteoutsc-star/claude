import express, { Request, Response } from 'express';
import { VideoService } from '../services/video.service';
import { GenerationPreferences, VideoMetadata } from '../types';

const router = express.Router();
const videoService = new VideoService();

// Temporary in-memory store for video metadata
// In production, use a database
const videoStore = new Map<string, VideoMetadata>();

/**
 * POST /api/generate
 * Generate YouTube Shorts from uploaded video
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { videoId, preferences } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    // In production, fetch from database
    // For now, we'll accept video metadata in the request or use stored data
    const videoMetadata: VideoMetadata = req.body.videoMetadata || videoStore.get(videoId);

    if (!videoMetadata) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const prefs: GenerationPreferences = {
      numberOfShorts: preferences?.numberOfShorts || 3,
      duration: preferences?.duration || 30,
      audioStyle: preferences?.audioStyle || 'energetic',
      effectsIntensity: preferences?.effectsIntensity || 'medium',
      includeHooks: preferences?.includeHooks !== false,
      includeCaptions: preferences?.includeCaptions || false
    };

    const job = await videoService.generateShorts(videoMetadata, prefs);

    res.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        videoId: job.videoId
      }
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Failed to generate shorts',
      message: error.message
    });
  }
});

/**
 * Helper endpoint to store video metadata
 * In production, this would be handled by database
 */
router.post('/store-metadata', (req: Request, res: Response) => {
  const metadata: VideoMetadata = req.body;
  if (metadata && metadata.id) {
    videoStore.set(metadata.id, metadata);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid metadata' });
  }
});

export default router;
