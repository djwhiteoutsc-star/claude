import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { VideoService } from '../services/video.service';

const router = express.Router();
const videoService = new VideoService();

/**
 * GET /api/download/short/:shortId
 * Download a generated short
 */
router.get('/short/:shortId', (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;

    // Find the short across all jobs
    let targetShort: any = null;
    const allJobs = Array.from((videoService as any).jobs.values());

    for (const job of allJobs) {
      const found = job.shorts.find((s: any) => s.id === shortId);
      if (found) {
        targetShort = found;
        break;
      }
    }

    if (!targetShort || !targetShort.outputPath) {
      return res.status(404).json({ error: 'Short not found or not ready' });
    }

    if (!fs.existsSync(targetShort.outputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="short_${shortId}.mp4"`);

    // Stream the file
    const fileStream = fs.createReadStream(targetShort.outputPath);
    fileStream.pipe(res);

  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      error: 'Failed to download short',
      message: error.message
    });
  }
});

/**
 * GET /api/download/thumbnail/:shortId
 * Get thumbnail for a short
 */
router.get('/thumbnail/:shortId', (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;

    // Find the short across all jobs
    let targetShort: any = null;
    const allJobs = Array.from((videoService as any).jobs.values());

    for (const job of allJobs) {
      const found = job.shorts.find((s: any) => s.id === shortId);
      if (found) {
        targetShort = found;
        break;
      }
    }

    if (!targetShort || !targetShort.thumbnailPath) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    if (!fs.existsSync(targetShort.thumbnailPath)) {
      return res.status(404).json({ error: 'Thumbnail file not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');

    // Stream the file
    const fileStream = fs.createReadStream(targetShort.thumbnailPath);
    fileStream.pipe(res);

  } catch (error: any) {
    console.error('Thumbnail error:', error);
    res.status(500).json({
      error: 'Failed to get thumbnail',
      message: error.message
    });
  }
});

/**
 * GET /api/download/job/:jobId
 * Download all shorts from a job as a zip
 */
router.get('/job/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = videoService.getJobStatus(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // For simplicity, return list of download URLs
    // In production, could create a zip file
    const downloads = job.shorts
      .filter(short => short.outputPath)
      .map(short => ({
        id: short.id,
        title: short.title,
        url: `/api/download/short/${short.id}`
      }));

    res.json({
      success: true,
      jobId,
      shorts: downloads
    });

  } catch (error: any) {
    console.error('Job download error:', error);
    res.status(500).json({
      error: 'Failed to get job downloads',
      message: error.message
    });
  }
});

export default router;
