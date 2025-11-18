/**
 * AI forecasting and pattern detection models
 */

export interface FishingForecast {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  date: Date;
  overallRating: number; // 0-10
  bestTimes: Array<{
    time: Date;
    rating: number;
    reasoning: string;
  }>;
  recommendedLures: Array<{
    lureId: string;
    lureName: string;
    confidence: number; // 0-1
    reasoning: string;
    colorRecommendation: string;
  }>;
  conditions: {
    temperature: number;
    weather: string;
    barometricPressure: number;
    moonPhase: string;
    solunarRating: number;
  };
  reasoning: string;
  generatedAt: Date;
}

export interface PatternDetection {
  id: string;
  userId: string;
  patterns: Array<{
    type: 'time' | 'weather' | 'location' | 'lure' | 'species';
    description: string;
    confidence: number; // 0-1
    dataPoints: number;
    insights: string[];
  }>;
  recommendations: string[];
  generatedAt: Date;
}

export interface CatchAnalytics {
  userId: string;
  period: 'week' | 'month' | 'season' | 'year';
  startDate: Date;
  endDate: Date;
  totalCatches: number;
  speciesBreakdown: Array<{
    species: string;
    count: number;
    percentage: number;
    averageWeight?: number;
  }>;
  bestLocations: Array<{
    name: string;
    latitude: number;
    longitude: number;
    catchCount: number;
  }>;
  bestLures: Array<{
    lureId: string;
    lureName: string;
    catchCount: number;
    successRate: number;
  }>;
  bestConditions: {
    weather: string[];
    temperature: { min: number; max: number };
    pressure: { min: number; max: number };
    moonPhases: string[];
  };
}

export interface HeatMapPoint {
  latitude: number;
  longitude: number;
  weight: number; // Catch count or success rate
}
