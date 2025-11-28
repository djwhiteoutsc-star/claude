# Setup Guide - YouTube Shorts Generator

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **FFmpeg** - Required for video processing

### Installing FFmpeg

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
1. Download from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract and add to PATH
3. Or use chocolatey: `choco install ffmpeg`

Verify installation:
```bash
ffmpeg -version
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd youtube-shorts-generator
```

### 2. Install Dependencies

Install both server and client dependencies:

```bash
npm run install:all
```

Or install manually:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Set Up Environment Variables

#### Server Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Required: Choose ONE AI provider
OPENAI_API_KEY=sk-...           # Get from https://platform.openai.com/api-keys
# OR
ANTHROPIC_API_KEY=sk-ant-...    # Get from https://console.anthropic.com/

# Optional: Firebase for cloud storage (can work without this initially)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@xxx.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

# App settings (defaults are fine for development)
PORT=3001
MAX_VIDEO_SIZE_MB=500
OUTPUT_DIR=./outputs
UPLOAD_DIR=./uploads
```

#### Client Configuration

```bash
cd client
cp .env.example .env
```

The default settings should work:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Set Up AI Provider

#### Option A: OpenAI (Recommended)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Add to `.env`: `OPENAI_API_KEY=sk-...`

**Pricing**: ~$0.01 per video analysis with GPT-4

#### Option B: Anthropic Claude

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Get your API key
4. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

**Pricing**: ~$0.008 per video analysis with Claude 3.5 Sonnet

### 5. Set Up Trending Audio Library (Optional)

The app comes with placeholder audio tracks. To add real audio:

1. Create `server/audio/` directory:
```bash
mkdir -p server/audio
```

2. Add royalty-free MP3 files:
   - `energetic_beat.mp3`
   - `chill_vibes.mp3`
   - `epic_drama.mp3`
   - `upbeat_pop.mp3`
   - `motivational.mp3`

**Free Audio Sources**:
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/music/royalty-free/)
- [Bensound](https://www.bensound.com/)

### 6. Create Required Directories

```bash
mkdir -p uploads outputs server/audio
```

## Running the Application

### Development Mode

Start both frontend and backend together:
```bash
npm run dev
```

This will start:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## Verify Installation

1. Open browser to http://localhost:5173
2. You should see the YouTube Shorts Generator interface
3. Try uploading a small test video (< 30 seconds)
4. Check that processing completes successfully

## Troubleshooting

### FFmpeg not found
**Error**: `FFmpeg not found in PATH`

**Solution**:
```bash
# Verify FFmpeg is installed
ffmpeg -version

# If not found, install it (see Prerequisites section)
```

### Module not found errors
**Error**: `Cannot find module '...'`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install:all
```

### AI API errors
**Error**: `Invalid API key` or `API request failed`

**Solution**:
- Verify your API key is correct in `.env`
- Check API key has sufficient credits
- Ensure no extra spaces in `.env` file
- Restart the server after changing `.env`

### Upload fails
**Error**: Video upload fails or times out

**Solution**:
- Check `MAX_VIDEO_SIZE_MB` in `.env`
- Ensure `uploads/` directory exists and is writable
- Try a smaller test video first
- Check server logs for detailed error

### Port already in use
**Error**: `Port 3001 is already in use`

**Solution**:
```bash
# Change port in .env
PORT=3002

# Or kill the process using the port
lsof -ti:3001 | xargs kill
```

## Next Steps

Once everything is running:

1. Upload a test video
2. Adjust generation preferences
3. Download your first shorts!
4. Customize audio tracks and effects
5. Deploy to production (see DEPLOY.md)

## Getting Help

- Check the [README.md](README.md) for feature documentation
- Review server logs in the terminal
- Check browser console for frontend errors
- Ensure all environment variables are set correctly

## Development Tips

- Keep videos under 5 minutes for faster processing
- Start with 1-2 shorts to test
- Use 'medium' effects intensity for balance
- Enable hooks for better engagement
- Test with different video formats (MP4, MOV, etc.)

---

**Ready to create amazing YouTube Shorts!** 🎬✨
