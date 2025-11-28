import express, { Request, Response } from 'express';
import { VideoService } from '../services/video.service';

const router = express.Router();
const videoService = new VideoService();

/**
 * GET /api/status/:jobId
 * Get the status of a generation job
 */
router.get('/:jobId', (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const job = videoService.getJobStatus(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Return job status with shorts info
    res.json({
      success: true,
      job: {
        id: job.id,
        videoId: job.videoId,
        status: job.status,
        progress: job.progress,
        error: job.error,
        shorts: job.shorts.map(short => ({
          id: short.id,
          title: short.title,
          hook: short.hook,
          status: short.status,
          duration: short.segment.duration,
          thumbnailUrl: short.thumbnailPath ? `/api/download/thumbnail/${short.id}` : null,
          downloadUrl: short.outputPath ? `/api/download/short/${short.id}` : null
        })),
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Failed to get job status',
      message: error.message
    });
  }
});

/**
 * GET /api/status/video/:videoId
 * Get all jobs for a video
 */
router.get('/video/:videoId', (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const jobs = videoService.getVideoJobs(videoId);

    res.json({
      success: true,
      jobs: jobs.map(job => ({
        id: job.id,
        status: job.status,
        progress: job.progress,
        shortsCount: job.shorts.length,
        createdAt: job.createdAt
      }))
    });
  } catch (error: any) {
    console.error('Video jobs error:', error);
    res.status(500).json({
      error: 'Failed to get video jobs',
      message: error.message
    });
  }
});

export default router;
