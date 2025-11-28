# 🎬 YouTube Shorts Generator

AI-powered application that transforms your long-form videos into multiple polished, ready-to-upload YouTube Shorts complete with trending audio, visual effects, and catchy hooks.

## ✨ Features

- **📤 Easy Upload** - Drag and drop or browse to upload videos
- **🤖 AI-Powered Analysis** - Automatically detects the best moments and highlights
- **✂️ Smart Segmentation** - Creates 3-5 optimized shorts from a single video
- **🎵 Trending Audio** - Adds popular background music from curated library
- **💫 Visual Effects** - Professional transitions, zooms, filters, and effects
- **🎯 Catchy Hooks** - AI-generated text overlays and captions
- **📱 YouTube Ready** - Exports in perfect 9:16 format (1080x1920, <60s)
- **🎨 Customization** - Edit and fine-tune each generated short
- **⚡ Fast Processing** - Optimized video processing pipeline

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for styling
- **Framer Motion** for smooth animations
- **React Dropzone** for file uploads

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **FFmpeg** for video processing
- **OpenAI/Claude** for AI-powered analysis
- **Firebase Storage** for cloud storage

## 📋 Prerequisites

- Node.js 18+ and npm
- FFmpeg installed on your system
- OpenAI API key or Anthropic Claude API key
- Firebase project (for storage)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd youtube-shorts-generator
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**

Create `.env` in the root directory:
```env
PORT=3001
NODE_ENV=development

# AI Provider (choose one)
OPENAI_API_KEY=your_openai_key
# OR
ANTHROPIC_API_KEY=your_anthropic_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_STORAGE_BUCKET=your_bucket

# App Config
MAX_VIDEO_SIZE_MB=500
OUTPUT_DIR=./outputs
UPLOAD_DIR=./uploads
```

4. **Start development servers**
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📖 How It Works

1. **Upload Video** - User uploads a video file (MP4, MOV, AVI, etc.)

2. **AI Analysis** - The AI analyzes the video for:
   - Scene changes and transitions
   - Audio peaks and interesting moments
   - Face detection and best frames
   - Action and movement detection

3. **Segment Generation** - Creates 3-5 short clips (15-60s each) based on:
   - Content variety
   - Engagement potential
   - Optimal pacing

4. **Enhancement Pipeline**:
   - Converts to vertical 9:16 format
   - Adds trending background music
   - Applies visual effects (zooms, transitions)
   - Generates and overlays catchy hooks
   - Adds auto-captions if speech detected

5. **Preview & Edit** - User can:
   - Preview each generated short
   - Customize text, audio, effects
   - Regenerate specific shorts
   - Download all or selected shorts

6. **Export** - Downloads YouTube-ready shorts in optimal format

## 🎨 Video Effects Library

- **Transitions**: Fade, slide, zoom, wipe
- **Filters**: Vintage, dramatic, vibrant, cinematic
- **Text Styles**: Bold hooks, animated captions, call-to-actions
- **Zoom Effects**: Ken Burns, punch-in, dynamic zoom
- **Color Grading**: Auto-enhance, saturation boost, contrast

## 🎵 Audio Library

Curated collection of trending, royalty-free audio tracks categorized by:
- Genre (Pop, Electronic, Hip-Hop, Ambient)
- Mood (Energetic, Chill, Dramatic, Upbeat)
- Trend Score (Updated weekly)

## 📊 Project Structure

```
youtube-shorts-generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   │   ├── video/     # Video processing
│   │   │   ├── ai/        # AI analysis
│   │   │   └── audio/     # Audio processing
│   │   ├── utils/         # Helper functions
│   │   ├── types/         # TypeScript types
│   │   └── middleware/    # Express middleware
│   └── package.json
│
├── uploads/               # Temporary upload storage
├── outputs/               # Generated shorts
└── package.json           # Root package.json
```

## 🔧 API Endpoints

### Video Upload
```
POST /api/upload
Content-Type: multipart/form-data
Body: { video: File }
```

### Generate Shorts
```
POST /api/generate
Body: {
  videoId: string,
  numberOfShorts: number,
  preferences: {
    duration: [15, 30, 60],
    audioStyle: string,
    effectsIntensity: 'low' | 'medium' | 'high'
  }
}
```

### Get Generation Status
```
GET /api/status/:jobId
```

### Download Short
```
GET /api/download/:shortId
```

## 🎯 Future Enhancements

- [ ] Real-time preview during generation
- [ ] Custom audio upload
- [ ] Advanced text animation templates
- [ ] Batch processing multiple videos
- [ ] Direct upload to YouTube API
- [ ] Analytics and engagement predictions
- [ ] Collaborative editing
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- FFmpeg for powerful video processing
- OpenAI/Anthropic for AI capabilities
- The React and Node.js communities

---

**Made with ❤️ for content creators**
