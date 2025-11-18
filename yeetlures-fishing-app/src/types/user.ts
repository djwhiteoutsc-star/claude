/**
 * User data model
 */

export type SubscriptionStatus = 'free' | 'premium' | 'trial';
export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface UserSubscription {
  status: SubscriptionStatus;
  period?: SubscriptionPeriod;
  startDate?: Date;
  endDate?: Date;
  autoRenew: boolean;
}

export interface UserPreferences {
  units: 'imperial' | 'metric';
  notifications: {
    fishingForecasts: boolean;
    weatherAlerts: boolean;
    catchReminders: boolean;
  };
  defaultLocation?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  subscription: UserSubscription;
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserStats {
  totalCatches: number;
  uniqueSpecies: number;
  biggestCatch?: {
    species: string;
    weight: number;
    date: Date;
  };
  favoriteLocation?: {
    name: string;
    catchCount: number;
  };
}
