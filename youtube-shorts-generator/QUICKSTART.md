# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- FFmpeg installed (`ffmpeg -version` to verify)
- OpenAI or Anthropic API key

## 1. Install

```bash
# Clone repo
git clone <repo-url>
cd youtube-shorts-generator

# Install dependencies
npm run install:all
```

## 2. Configure

```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your API key:
# OPENAI_API_KEY=sk-your-key-here
# OR
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 3. Run

```bash
npm run dev
```

Open http://localhost:5173

## 4. Create Shorts!

1. Drag & drop a video file
2. Choose settings (defaults are great)
3. Wait 1-3 minutes for processing
4. Download your polished YouTube Shorts!

That's it! 🎉

---

**Need help?** See [SETUP.md](SETUP.md) for detailed instructions.
