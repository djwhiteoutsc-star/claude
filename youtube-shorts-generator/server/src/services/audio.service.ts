import { AudioTrack } from '../types';
import path from 'path';

export class AudioService {
  private audioLibrary: AudioTrack[];

  constructor() {
    // Initialize with sample audio tracks
    // In production, this would be loaded from a database or file system
    this.audioLibrary = this.initializeAudioLibrary();
  }

  /**
   * Get random audio track by style
   */
  async getRandomTrack(style: string): Promise<AudioTrack | null> {
    const filtered = this.audioLibrary.filter(track =>
      track.mood.toLowerCase() === style.toLowerCase()
    );

    if (filtered.length === 0) {
      // Return any track if no match
      return this.audioLibrary[Math.floor(Math.random() * this.audioLibrary.length)];
    }

    // Sort by trend score and pick from top 3
    const sorted = filtered.sort((a, b) => b.trendScore - a.trendScore);
    const topTracks = sorted.slice(0, 3);
    return topTracks[Math.floor(Math.random() * topTracks.length)];
  }

  /**
   * Get all tracks by mood
   */
  getTracksByMood(mood: string): AudioTrack[] {
    return this.audioLibrary.filter(track =>
      track.mood.toLowerCase() === mood.toLowerCase()
    );
  }

  /**
   * Get trending tracks
   */
  getTrendingTracks(limit: number = 10): AudioTrack[] {
    return [...this.audioLibrary]
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  }

  private initializeAudioLibrary(): AudioTrack[] {
    // Sample audio library
    // In production, replace with actual audio files
    return [
      {
        id: '1',
        name: 'Energetic Beat',
        artist: 'Production Music',
        genre: 'Electronic',
        mood: 'energetic',
        duration: 30,
        path: path.join(__dirname, '../../audio/energetic_beat.mp3'),
        trendScore: 95
      },
      {
        id: '2',
        name: 'Chill Vibes',
        artist: 'Lofi Studio',
        genre: 'Lofi',
        mood: 'chill',
        duration: 45,
        path: path.join(__dirname, '../../audio/chill_vibes.mp3'),
        trendScore: 88
      },
      {
        id: '3',
        name: 'Epic Drama',
        artist: 'Cinematic Sounds',
        genre: 'Orchestral',
        mood: 'dramatic',
        duration: 60,
        path: path.join(__dirname, '../../audio/epic_drama.mp3'),
        trendScore: 82
      },
      {
        id: '4',
        name: 'Upbeat Pop',
        artist: 'Happy Tunes',
        genre: 'Pop',
        mood: 'upbeat',
        duration: 30,
        path: path.join(__dirname, '../../audio/upbeat_pop.mp3'),
        trendScore: 91
      },
      {
        id: '5',
        name: 'Motivational Rise',
        artist: 'Inspire Music',
        genre: 'Corporate',
        mood: 'energetic',
        duration: 40,
        path: path.join(__dirname, '../../audio/motivational.mp3'),
        trendScore: 87
      }
    ];
  }

  /**
   * Add new track to library
   */
  addTrack(track: AudioTrack): void {
    this.audioLibrary.push(track);
  }

  /**
   * Update trend scores (would be called periodically)
   */
  updateTrendScores(): void {
    // In production, this would fetch latest trending data
    // For now, just simulate some variation
    this.audioLibrary.forEach(track => {
      track.trendScore = Math.max(60, Math.min(100, track.trendScore + (Math.random() - 0.5) * 10));
    });
  }
}
