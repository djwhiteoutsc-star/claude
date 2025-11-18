/**
 * AI Service - Fishing forecasts and pattern detection using Claude/OpenAI
 */

import axios from 'axios';
import { FishingForecast, PatternDetection, CatchAnalytics, Catch, Lure } from '../types';
import { weatherService } from './weather.service';

const AI_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || 'YOUR_API_KEY';
const AI_API_URL = process.env.ANTHROPIC_API_KEY
  ? 'https://api.anthropic.com/v1/messages'
  : 'https://api.openai.com/v1/chat/completions';

class AIService {
  /**
   * Generate fishing forecast for a location
   */
  async generateFishingForecast(
    userId: string,
    latitude: number,
    longitude: number,
    locationName: string,
    lures: Lure[]
  ): Promise<FishingForecast> {
    try {
      // Get weather conditions
      const weather = await weatherService.getWeatherConditions(latitude, longitude, locationName);

      // Build AI prompt
      const prompt = this.buildForecastPrompt(weather, lures);

      // Call AI API
      const aiResponse = await this.callAI(prompt);

      // Parse and structure the forecast
      const forecast: FishingForecast = {
        id: `forecast_${Date.now()}`,
        userId,
        location: {
          latitude,
          longitude,
          name: locationName,
        },
        date: new Date(),
        overallRating: this.extractRating(aiResponse),
        bestTimes: this.extractBestTimes(aiResponse, weather.solunar),
        recommendedLures: this.extractLureRecommendations(aiResponse, lures),
        conditions: {
          temperature: weather.current.temperature,
          weather: weather.current.conditions,
          barometricPressure: weather.current.barometricPressure,
          moonPhase: weather.sunMoon.moonPhase,
          solunarRating: weather.solunar.rating,
        },
        reasoning: this.extractReasoning(aiResponse),
        generatedAt: new Date(),
      };

      return forecast;
    } catch (error) {
      console.error('Error generating fishing forecast:', error);
      throw error;
    }
  }

  /**
   * Detect patterns in user's catch history
   */
  async detectPatterns(userId: string, catches: Catch[], lures: Lure[]): Promise<PatternDetection> {
    try {
      if (catches.length < 10) {
        throw new Error('Need at least 10 catches to detect patterns');
      }

      const prompt = this.buildPatternDetectionPrompt(catches, lures);
      const aiResponse = await this.callAI(prompt);

      const patterns: PatternDetection = {
        id: `pattern_${Date.now()}`,
        userId,
        patterns: this.extractPatterns(aiResponse, catches),
        recommendations: this.extractRecommendations(aiResponse),
        generatedAt: new Date(),
      };

      return patterns;
    } catch (error) {
      console.error('Error detecting patterns:', error);
      throw error;
    }
  }

  /**
   * Generate catch analytics
   */
  generateCatchAnalytics(
    userId: string,
    catches: Catch[],
    period: 'week' | 'month' | 'season' | 'year',
    lures: Lure[]
  ): CatchAnalytics {
    const now = new Date();
    const startDate = this.getStartDate(now, period);

    const periodCatches = catches.filter(
      c => new Date(c.timestamp) >= startDate
    );

    // Species breakdown
    const speciesMap = new Map<string, number>();
    periodCatches.forEach(c => {
      speciesMap.set(c.species, (speciesMap.get(c.species) || 0) + 1);
    });

    const speciesBreakdown = Array.from(speciesMap.entries())
      .map(([species, count]) => ({
        species,
        count,
        percentage: (count / periodCatches.length) * 100,
        averageWeight: this.calculateAverageWeight(periodCatches, species),
      }))
      .sort((a, b) => b.count - a.count);

    // Best locations
    const locationMap = new Map<string, { location: any; count: number }>();
    periodCatches.forEach(c => {
      if (c.location) {
        const key = `${c.location.latitude},${c.location.longitude}`;
        const existing = locationMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          locationMap.set(key, { location: c.location, count: 1 });
        }
      }
    });

    const bestLocations = Array.from(locationMap.values())
      .map(({ location, count }) => ({
        name: location.name || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
        latitude: location.latitude,
        longitude: location.longitude,
        catchCount: count,
      }))
      .sort((a, b) => b.catchCount - a.catchCount)
      .slice(0, 5);

    // Best lures
    const lureMap = new Map<string, number>();
    periodCatches.forEach(c => {
      if (c.lureUsed) {
        lureMap.set(c.lureUsed, (lureMap.get(c.lureUsed) || 0) + 1);
      }
    });

    const bestLures = Array.from(lureMap.entries())
      .map(([lureId, count]) => {
        const lure = lures.find(l => l.id === lureId);
        return {
          lureId,
          lureName: lure?.name || 'Unknown',
          catchCount: count,
          successRate: (count / periodCatches.length) * 100,
        };
      })
      .sort((a, b) => b.catchCount - a.catchCount)
      .slice(0, 5);

    // Best conditions
    const weatherConditions = periodCatches
      .filter(c => c.weather)
      .map(c => c.weather!.conditions);
    const uniqueWeather = Array.from(new Set(weatherConditions));

    const temperatures = periodCatches
      .filter(c => c.weather?.temperature)
      .map(c => c.weather!.temperature);

    const pressures = periodCatches
      .filter(c => c.weather?.barometricPressure)
      .map(c => c.weather!.barometricPressure);

    const moonPhases = periodCatches
      .filter(c => c.weather?.moonPhase)
      .map(c => c.weather!.moonPhase);

    return {
      userId,
      period,
      startDate,
      endDate: now,
      totalCatches: periodCatches.length,
      speciesBreakdown,
      bestLocations,
      bestLures,
      bestConditions: {
        weather: uniqueWeather,
        temperature: {
          min: Math.min(...temperatures),
          max: Math.max(...temperatures),
        },
        pressure: {
          min: Math.min(...pressures),
          max: Math.max(...pressures),
        },
        moonPhases: Array.from(new Set(moonPhases)),
      },
    };
  }

  /**
   * Build forecast prompt for AI
   */
  private buildForecastPrompt(weather: any, lures: Lure[]): string {
    return `You are an expert fishing guide. Analyze the following weather conditions and recommend the best fishing times and lures.

Weather Conditions:
- Temperature: ${weather.current.temperature}°F
- Conditions: ${weather.current.conditions}
- Wind: ${weather.current.windSpeed} mph ${weather.current.windDirectionCardinal}
- Barometric Pressure: ${weather.current.barometricPressure} mb (${weather.current.pressureTrend})
- Moon Phase: ${weather.sunMoon.moonPhase} (${(weather.sunMoon.moonIllumination * 100).toFixed(0)}% illuminated)
- Sunrise: ${weather.sunMoon.sunrise.toLocaleTimeString()}
- Sunset: ${weather.sunMoon.sunset.toLocaleTimeString()}
- Solunar Rating: ${weather.solunar.rating}/5

Available YeetLures:
${lures.filter(l => l.brand === 'YeetLures').map(l => `- ${l.name} (${l.type})`).join('\n')}

Provide:
1. Overall fishing rating (0-10)
2. Top 3 best times to fish today with reasoning
3. Top 3 recommended YeetLures with specific color recommendations and reasoning
4. General fishing strategy for these conditions

Format your response as JSON.`;
  }

  /**
   * Build pattern detection prompt
   */
  private buildPatternDetectionPrompt(catches: Catch[], lures: Lure[]): string {
    const catchSummary = catches.slice(0, 50).map(c => ({
      species: c.species,
      weight: c.weight,
      time: new Date(c.timestamp).toISOString(),
      weather: c.weather?.conditions,
      temp: c.weather?.temperature,
      pressure: c.weather?.barometricPressure,
      moon: c.weather?.moonPhase,
      lure: lures.find(l => l.id === c.lureUsed)?.name,
    }));

    return `Analyze the following fishing catch data and identify patterns.

Catch History:
${JSON.stringify(catchSummary, null, 2)}

Identify patterns related to:
1. Time of day
2. Weather conditions
3. Locations
4. Lure effectiveness
5. Species behavior

Provide insights and recommendations for improving catch rates.
Format your response as JSON.`;
  }

  /**
   * Call AI API (Claude or OpenAI)
   */
  private async callAI(prompt: string): Promise<string> {
    // This is a simplified version - actual implementation would handle API specifics
    const response = await axios.post(
      AI_API_URL,
      {
        model: process.env.ANTHROPIC_API_KEY ? 'claude-3-5-sonnet-20241022' : 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_API_KEY}`,
          ...(process.env.ANTHROPIC_API_KEY && {
            'anthropic-version': '2023-06-01',
          }),
        },
      }
    );

    return process.env.ANTHROPIC_API_KEY
      ? response.data.content[0].text
      : response.data.choices[0].message.content;
  }

  // Helper methods for parsing AI responses
  private extractRating(response: string): number {
    // Parse JSON or extract rating from text
    try {
      const json = JSON.parse(response);
      return json.rating || 5;
    } catch {
      return 5;
    }
  }

  private extractBestTimes(response: string, solunar: any): any[] {
    try {
      const json = JSON.parse(response);
      return json.bestTimes || solunar.bestTimes.map((time: Date) => ({
        time,
        rating: 4,
        reasoning: 'Solunar major period',
      }));
    } catch {
      return solunar.bestTimes.map((time: Date) => ({
        time,
        rating: 4,
        reasoning: 'Solunar major period',
      }));
    }
  }

  private extractLureRecommendations(response: string, lures: Lure[]): any[] {
    try {
      const json = JSON.parse(response);
      return json.lures || lures.slice(0, 3).map(l => ({
        lureId: l.id,
        lureName: l.name,
        confidence: 0.8,
        reasoning: 'Good all-purpose choice',
        colorRecommendation: l.colors[0] || 'Natural',
      }));
    } catch {
      return lures.slice(0, 3).map(l => ({
        lureId: l.id,
        lureName: l.name,
        confidence: 0.8,
        reasoning: 'Good all-purpose choice',
        colorRecommendation: l.colors[0] || 'Natural',
      }));
    }
  }

  private extractReasoning(response: string): string {
    try {
      const json = JSON.parse(response);
      return json.reasoning || response;
    } catch {
      return response;
    }
  }

  private extractPatterns(response: string, catches: Catch[]): any[] {
    try {
      const json = JSON.parse(response);
      return json.patterns || [];
    } catch {
      return [];
    }
  }

  private extractRecommendations(response: string): string[] {
    try {
      const json = JSON.parse(response);
      return json.recommendations || [];
    } catch {
      return [];
    }
  }

  private getStartDate(now: Date, period: string): Date {
    const date = new Date(now);
    switch (period) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'season':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  }

  private calculateAverageWeight(catches: Catch[], species: string): number | undefined {
    const speciesCatches = catches.filter(c => c.species === species && c.weight);
    if (speciesCatches.length === 0) return undefined;

    const total = speciesCatches.reduce((sum, c) => sum + (c.weight || 0), 0);
    return total / speciesCatches.length;
  }
}

export const aiService = new AIService();
