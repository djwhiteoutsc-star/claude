# Image Upscaler & Background Remover

A powerful web application for upscaling images, removing backgrounds, and preparing them for print.

## Features

- **Image Upload**: Drag & drop or click to upload images
- **Image Upscaling**: Scale images up to 4x their original size using high-quality Lanczos3 resampling
- **Background Removal**: Automatically remove backgrounds from images
- **Print-Ready Output**: 300 DPI resolution, perfect for printing
- **Multiple Formats**: Export as PNG, JPG, or TIFF
- **Real-time Preview**: Compare original and processed images side-by-side

## Technology Stack

### Backend
- **Node.js** + **Express**: Server framework
- **Sharp**: High-performance image processing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI framework
- **Axios**: HTTP client for API requests
- **Modern CSS**: Responsive design with gradients and animations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Open your browser** to `http://localhost:3000`
3. **Upload an image** by dragging and dropping or clicking the upload area
4. **Configure settings**:
   - Upscale Factor (1x - 4x)
   - Enable/disable background removal
   - Choose output format (PNG/JPG/TIFF)
5. **Click "Process Image"** to start processing
6. **Download** the processed image when ready

## API Endpoints

### POST /api/process-image
Process an image with upscaling and optional background removal.

**Request:**
- `image`: Image file (multipart/form-data)
- `upscaleFactor`: Number (1-4, default: 2)
- `removeBackground`: Boolean (default: true)
- `format`: String ('png', 'jpg', 'tiff', default: 'png')

**Response:**
- Processed image file

### POST /api/remove-background
Advanced background removal endpoint.

**Request:**
- `image`: Image file (multipart/form-data)
- `format`: String ('png', 'jpg', 'tiff', default: 'png')

**Response:**
- Image file with background removed

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Image upscaler service is running"
}
```

## Image Processing Details

- **Upscaling Algorithm**: Lanczos3 kernel (high-quality resampling)
- **DPI**: 300 (print quality)
- **Max File Size**: 50MB
- **Supported Input Formats**: JPEG, PNG, WEBP, TIFF
- **Output Quality**: Maximum (100%)

## Configuration

### Environment Variables

**Backend** (create `.env` in backend directory):
```
PORT=5000
```

**Frontend** (create `.env` in frontend directory):
```
REACT_APP_API_URL=http://localhost:5000
```

## Production Deployment

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

Serve the `build` folder with any static file server (nginx, Apache, etc.)

## Troubleshooting

**CORS Issues:**
- Ensure backend is running on port 5000
- Check that frontend is configured to use the correct API URL

**Image Processing Fails:**
- Check that uploaded file is a valid image format
- Ensure file size is under 50MB
- Check backend logs for detailed error messages

**Background Removal Quality:**
- The current implementation uses basic edge detection
- For professional results, consider integrating a dedicated service like remove.bg or an ML model

## Future Enhancements

- AI-powered background removal using ML models
- Batch processing for multiple images
- Additional image filters and effects
- User accounts and image history
- Cloud storage integration
- Advanced print presets (business cards, posters, etc.)

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
