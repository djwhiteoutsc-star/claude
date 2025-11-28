export interface VideoMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  format: string;
  fps: number;
  uploadedAt: Date;
  path: string;
}

export interface VideoSegment {
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  reason: string;
  hasAudio: boolean;
  hasFaces: boolean;
  hasAction: boolean;
}

export interface GenerationPreferences {
  numberOfShorts?: number;
  duration?: 15 | 30 | 60;
  audioStyle?: 'energetic' | 'chill' | 'dramatic' | 'upbeat' | 'none';
  effectsIntensity?: 'low' | 'medium' | 'high';
  includeHooks?: boolean;
  includeCaptions?: boolean;
}

export interface GenerationJob {
  id: string;
  videoId: string;
  status: 'pending' | 'analyzing' | 'generating' | 'completed' | 'failed';
  progress: number;
  preferences: GenerationPreferences;
  shorts: Short[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Short {
  id: string;
  jobId: string;
  videoId: string;
  title: string;
  hook: string;
  segment: VideoSegment;
  outputPath?: string;
  thumbnailPath?: string;
  audioTrack?: AudioTrack;
  effects: Effect[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export interface AudioTrack {
  id: string;
  name: string;
  artist: string;
  genre: string;
  mood: string;
  duration: number;
  path: string;
  trendScore: number;
}

export interface Effect {
  type: 'zoom' | 'transition' | 'filter' | 'text' | 'caption';
  name: string;
  startTime?: number;
  duration?: number;
  intensity: number;
  params: Record<string, any>;
}

export interface AIAnalysis {
  segments: VideoSegment[];
  suggestedHooks: string[];
  transcription?: string;
  scenes: Scene[];
  highlights: Highlight[];
}

export interface Scene {
  startTime: number;
  endTime: number;
  description: string;
  hasMovement: boolean;
  hasFaces: boolean;
  brightness: number;
}

export interface Highlight {
  timestamp: number;
  type: 'audio_peak' | 'scene_change' | 'face_detected' | 'action';
  confidence: number;
}
