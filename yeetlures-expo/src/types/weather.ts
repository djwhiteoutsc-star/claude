/**
 * Weather data model
 */

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  conditions: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionCardinal: string;
  barometricPressure: number;
  pressureTrend: 'rising' | 'falling' | 'steady';
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  timestamp: Date;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  conditions: string;
  conditionIcon: string;
}

export interface SunMoonData {
  sunrise: Date;
  sunset: Date;
  moonrise: Date;
  moonset: Date;
  moonPhase: string;
  moonIllumination: number; // 0-1
}

export interface SolunarPeriod {
  type: 'major' | 'minor';
  start: Date;
  end: Date;
  rating: number; // 0-5
}

export interface SolunarData {
  date: Date;
  rating: number; // Overall day rating 0-5
  periods: SolunarPeriod[];
  bestTimes: Date[];
}

export interface WeatherConditions {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  sunMoon: SunMoonData;
  solunar: SolunarData;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  lastUpdated: Date;
}
