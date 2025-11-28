import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export interface GenerationPreferences {
  numberOfShorts?: number;
  duration?: 15 | 30 | 60;
  audioStyle?: 'energetic' | 'chill' | 'dramatic' | 'upbeat' | 'none';
  effectsIntensity?: 'low' | 'medium' | 'high';
  includeHooks?: boolean;
  includeCaptions?: boolean;
}

export interface Short {
  id: string;
  title: string;
  hook: string;
  status: string;
  duration: number;
  thumbnailUrl: string | null;
  downloadUrl: string | null;
}

export interface Job {
  id: string;
  videoId: string;
  status: 'pending' | 'analyzing' | 'generating' | 'completed' | 'failed';
  progress: number;
  error?: string;
  shorts: Short[];
  createdAt: Date;
  updatedAt: Date;
}

export const videoApi = {
  uploadVideo: async (file: File): Promise<VideoMetadata> => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.video;
  },

  storeMetadata: async (metadata: VideoMetadata): Promise<void> => {
    await api.post('/generate/store-metadata', metadata);
  },

  generateShorts: async (
    videoId: string,
    preferences: GenerationPreferences,
    videoMetadata?: VideoMetadata
  ): Promise<{ jobId: string }> => {
    const response = await api.post('/generate', {
      videoId,
      preferences,
      videoMetadata,
    });

    return { jobId: response.data.job.id };
  },

  getJobStatus: async (jobId: string): Promise<Job> => {
    const response = await api.get(`/status/${jobId}`);
    return response.data.job;
  },

  downloadShort: (shortId: string): string => {
    return `${API_BASE_URL}/download/short/${shortId}`;
  },

  getThumbnail: (shortId: string): string => {
    return `${API_BASE_URL}/download/thumbnail/${shortId}`;
  },
};
