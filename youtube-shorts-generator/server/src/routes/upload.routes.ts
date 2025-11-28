import express, { Request, Response } from 'express';
import multer from 'multer';
import { VideoService } from '../services/video.service';

const router = express.Router();
const videoService = new VideoService();

// Configure multer for video uploads
const upload = multer({
  dest: process.env.UPLOAD_DIR || './uploads',
  limits: {
    fileSize: (parseInt(process.env.MAX_VIDEO_SIZE_MB || '500')) * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, AVI, and MKV are allowed.'));
    }
  }
});

/**
 * POST /api/upload
 * Upload a video file
 */
router.post('/', upload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const metadata = await videoService.processUpload(req.file);

    res.json({
      success: true,
      video: metadata
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload video',
      message: error.message
    });
  }
});

export default router;
