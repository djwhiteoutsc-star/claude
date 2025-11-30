const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and TIFF are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Image upscaler service is running' });
});

// Image processing endpoint
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { upscaleFactor = 2, removeBackground = 'true', format = 'png' } = req.body;
    const scaleFactor = parseFloat(upscaleFactor);
    const shouldRemoveBackground = removeBackground === 'true';

    console.log(`Processing image: upscale=${scaleFactor}x, removeBackground=${shouldRemoveBackground}, format=${format}`);

    // Get original image metadata
    const metadata = await sharp(req.file.buffer).metadata();
    console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

    // Calculate new dimensions
    const newWidth = Math.round(metadata.width * scaleFactor);
    const newHeight = Math.round(metadata.height * scaleFactor);

    console.log(`Target dimensions: ${newWidth}x${newHeight}`);

    // Start image processing pipeline
    let processedImage = sharp(req.file.buffer);

    // Step 1: Upscale the image
    processedImage = processedImage.resize(newWidth, newHeight, {
      kernel: sharp.kernel.lanczos3, // High-quality resampling
      fit: 'fill'
    });

    // Step 2: Remove background if requested
    if (shouldRemoveBackground) {
      // Use Sharp's built-in threshold and transparency features
      // This is a simplified background removal - for better results,
      // you would need a dedicated ML model or API like remove.bg
      processedImage = processedImage
        .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .removeAlpha()
        .threshold(240, { greyscale: false })
        .toColorspace('srgb');

      // Add alpha channel for transparency
      processedImage = processedImage.ensureAlpha();
    }

    // Step 3: Optimize for print
    // High DPI (300), proper color profile, and format
    const outputFormat = format === 'jpg' ? 'jpeg' : format;

    const outputOptions = {
      quality: 100,
      compression: 'lzw',
      density: 300 // 300 DPI for print quality
    };

    if (outputFormat === 'jpeg') {
      processedImage = processedImage.jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4',
        mozjpeg: true
      });
    } else if (outputFormat === 'png') {
      processedImage = processedImage.png({
        quality: 100,
        compressionLevel: 9,
        palette: false
      });
    } else if (outputFormat === 'tiff') {
      processedImage = processedImage.tiff({
        quality: 100,
        compression: 'lzw'
      });
    }

    // Set metadata for print
    processedImage = processedImage.withMetadata({
      density: 300
    });

    // Convert to buffer
    const outputBuffer = await processedImage.toBuffer();

    console.log(`Processed image size: ${(outputBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Send the processed image
    res.set({
      'Content-Type': `image/${outputFormat}`,
      'Content-Disposition': `attachment; filename="upscaled-${Date.now()}.${outputFormat}"`,
      'Content-Length': outputBuffer.length
    });

    res.send(outputBuffer);

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      error: 'Failed to process image',
      message: error.message
    });
  }
});

// Advanced background removal endpoint (using edge detection)
app.post('/api/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { format = 'png' } = req.body;

    console.log('Removing background with advanced processing...');

    // Use Sharp's edge detection and masking
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    // Create a mask based on edge detection
    const processed = await image
      .greyscale()
      .normalise()
      .blur(1)
      .threshold(200)
      .negate()
      .toBuffer();

    // Apply the mask to the original image
    const result = await sharp(req.file.buffer)
      .composite([{
        input: processed,
        blend: 'dest-in'
      }])
      .png({ quality: 100 })
      .toBuffer();

    res.set({
      'Content-Type': `image/${format}`,
      'Content-Disposition': `attachment; filename="bg-removed-${Date.now()}.${format}"`,
      'Content-Length': result.length
    });

    res.send(result);

  } catch (error) {
    console.error('Error removing background:', error);
    res.status(500).json({
      error: 'Failed to remove background',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Image upscaler server running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - POST /api/process-image`);
  console.log(`   - POST /api/remove-background`);
  console.log(`   - GET  /api/health`);
});

module.exports = app;
