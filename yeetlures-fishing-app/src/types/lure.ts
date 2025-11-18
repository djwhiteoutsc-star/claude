/**
 * Lure data model
 */

export type LureType =
  | 'crankbait'
  | 'jerkbait'
  | 'topwater'
  | 'spinner'
  | 'spoon'
  | 'jig'
  | 'soft_plastic'
  | 'swimbait';

export type WaterCondition = 'clear' | 'murky' | 'stained';
export type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface ColorRecommendation {
  waterCondition: WaterCondition;
  timeOfDay: TimeOfDay;
  recommendedColors: string[];
  reasoning: string;
}

export interface Lure {
  id: string;
  name: string;
  type: LureType;
  brand: 'YeetLures' | 'Other';
  colors: string[];
  weight?: number;
  length?: number;
  description: string;
  imageUrl?: string;
  targetSpecies: string[];
  idealConditions: {
    waterConditions: WaterCondition[];
    seasons: Season[];
    timeOfDay: TimeOfDay[];
    weatherConditions: string[];
  };
  colorRecommendations: ColorRecommendation[];
  techniques: string[];
  productUrl?: string; // Deep link to YeetLures store
  isPremium: boolean; // Requires premium to see all details
}

export interface UserLureNote {
  id: string;
  userId: string;
  lureId: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}
