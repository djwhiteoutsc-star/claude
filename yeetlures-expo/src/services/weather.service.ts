/**
 * Weather Service - Integration with OpenWeather API
 */

import axios from 'axios';
import SunCalc from 'suncalc';
import { WeatherConditions, CurrentWeather, HourlyForecast, SunMoonData, SolunarData } from '../types';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  /**
   * Get complete weather conditions for a location
   */
  async getWeatherConditions(
    latitude: number,
    longitude: number,
    locationName?: string
  ): Promise<WeatherConditions> {
    try {
      const [currentData, forecastData] = await Promise.all([
        this.getCurrentWeather(latitude, longitude),
        this.getHourlyForecast(latitude, longitude),
      ]);

      const sunMoon = this.getSunMoonData(latitude, longitude, new Date());
      const solunar = this.calculateSolunarData(latitude, longitude, new Date());

      return {
        current: currentData,
        hourly: forecastData,
        sunMoon,
        solunar,
        location: {
          latitude,
          longitude,
          name: locationName || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        },
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error fetching weather conditions:', error);
      throw error;
    }
  }

  /**
   * Get current weather
   */
  private async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<CurrentWeather> {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: 'imperial',
      },
    });

    const data = response.data;

    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      conditions: data.weather[0].main,
      conditionIcon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      windDirectionCardinal: this.degreesToCardinal(data.wind.deg),
      barometricPressure: data.main.pressure,
      pressureTrend: 'steady', // Would need historical data for trend
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: 0, // Would need separate UV index call
      cloudCover: data.clouds.all,
      timestamp: new Date(),
    };
  }

  /**
   * Get hourly forecast (next 24 hours)
   */
  private async getHourlyForecast(
    latitude: number,
    longitude: number
  ): Promise<HourlyForecast[]> {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: OPENWEATHER_API_KEY,
        units: 'imperial',
        cnt: 8, // Next 24 hours (8 x 3-hour intervals)
      },
    });

    return response.data.list.map((item: any) => ({
      time: new Date(item.dt * 1000),
      temperature: item.main.temp,
      precipitation: item.rain?.['3h'] || 0,
      precipitationProbability: item.pop * 100,
      windSpeed: item.wind.speed,
      conditions: item.weather[0].main,
      conditionIcon: item.weather[0].icon,
    }));
  }

  /**
   * Get sun and moon data
   */
  private getSunMoonData(
    latitude: number,
    longitude: number,
    date: Date
  ): SunMoonData {
    const times = SunCalc.getTimes(date, latitude, longitude);
    const moonTimes = SunCalc.getMoonTimes(date, latitude, longitude);
    const moonIllumination = SunCalc.getMoonIllumination(date);

    return {
      sunrise: times.sunrise,
      sunset: times.sunset,
      moonrise: moonTimes.rise,
      moonset: moonTimes.set,
      moonPhase: this.getMoonPhaseName(moonIllumination.phase),
      moonIllumination: moonIllumination.fraction,
    };
  }

  /**
   * Calculate solunar data (best fishing times)
   */
  private calculateSolunarData(
    latitude: number,
    longitude: number,
    date: Date
  ): SolunarData {
    const sunMoon = this.getSunMoonData(latitude, longitude, date);
    const moonPos = SunCalc.getMoonPosition(date, latitude, longitude);

    // Calculate major and minor periods
    const periods = this.calculateSolunarPeriods(sunMoon, date);

    // Calculate overall rating (0-5)
    const rating = this.calculateSolunarRating(sunMoon, moonPos);

    // Best times are the start of major periods
    const bestTimes = periods
      .filter(p => p.type === 'major')
      .map(p => p.start);

    return {
      date,
      rating,
      periods,
      bestTimes,
    };
  }

  /**
   * Calculate solunar periods
   */
  private calculateSolunarPeriods(sunMoon: SunMoonData, date: Date): any[] {
    const periods = [];

    // Major period 1: Moonrise ± 2 hours
    if (sunMoon.moonrise) {
      periods.push({
        type: 'major',
        start: new Date(sunMoon.moonrise.getTime() - 2 * 60 * 60 * 1000),
        end: new Date(sunMoon.moonrise.getTime() + 2 * 60 * 60 * 1000),
        rating: 4,
      });
    }

    // Major period 2: Moonset ± 2 hours
    if (sunMoon.moonset) {
      periods.push({
        type: 'major',
        start: new Date(sunMoon.moonset.getTime() - 2 * 60 * 60 * 1000),
        end: new Date(sunMoon.moonset.getTime() + 2 * 60 * 60 * 1000),
        rating: 4,
      });
    }

    // Minor periods at sunrise and sunset
    periods.push({
      type: 'minor',
      start: new Date(sunMoon.sunrise.getTime() - 1 * 60 * 60 * 1000),
      end: new Date(sunMoon.sunrise.getTime() + 1 * 60 * 60 * 1000),
      rating: 3,
    });

    periods.push({
      type: 'minor',
      start: new Date(sunMoon.sunset.getTime() - 1 * 60 * 60 * 1000),
      end: new Date(sunMoon.sunset.getTime() + 1 * 60 * 60 * 1000),
      rating: 3,
    });

    return periods;
  }

  /**
   * Calculate overall solunar rating
   */
  private calculateSolunarRating(sunMoon: SunMoonData, moonPos: any): number {
    let rating = 2.5; // Base rating

    // Boost for full moon or new moon
    if (sunMoon.moonIllumination > 0.9 || sunMoon.moonIllumination < 0.1) {
      rating += 1.5;
    } else if (sunMoon.moonIllumination > 0.45 && sunMoon.moonIllumination < 0.55) {
      // Quarter moons
      rating += 0.5;
    }

    // Cap at 5
    return Math.min(rating, 5);
  }

  /**
   * Convert wind degrees to cardinal direction
   */
  private degreesToCardinal(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  /**
   * Get moon phase name
   */
  private getMoonPhaseName(phase: number): string {
    if (phase < 0.0625) return 'New Moon';
    if (phase < 0.1875) return 'Waxing Crescent';
    if (phase < 0.3125) return 'First Quarter';
    if (phase < 0.4375) return 'Waxing Gibbous';
    if (phase < 0.5625) return 'Full Moon';
    if (phase < 0.6875) return 'Waning Gibbous';
    if (phase < 0.8125) return 'Last Quarter';
    if (phase < 0.9375) return 'Waning Crescent';
    return 'New Moon';
  }
}

export const weatherService = new WeatherService();
