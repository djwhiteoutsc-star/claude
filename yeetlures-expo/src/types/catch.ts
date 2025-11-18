/**
 * Catch data model
 */

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface WeatherSnapshot {
  temperature: number;
  conditions: string;
  windSpeed: number;
  windDirection: string;
  barometricPressure: number;
  moonPhase: string;
  moonIllumination: number;
  timestamp: Date;
}

export interface Catch {
  id: string;
  userId: string;
  species: string;
  weight?: number; // in pounds or kg
  length?: number; // in inches or cm
  notes?: string;
  location?: Location;
  weather?: WeatherSnapshot;
  lureUsed?: string; // Lure ID
  photos: string[]; // Storage URLs
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'failed';
}

export interface CatchFormData {
  species: string;
  weight?: string;
  length?: string;
  notes?: string;
  lureUsed?: string;
  photos: string[];
}
