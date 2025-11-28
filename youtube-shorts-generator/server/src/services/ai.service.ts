import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { AIAnalysis, VideoSegment, VideoMetadata } from '../types';

export class AIService {
  private anthropic?: Anthropic;
  private openai?: OpenAI;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }

    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    if (!this.anthropic && !this.openai) {
      console.warn('Warning: No AI API keys configured. Using fallback analysis.');
    }
  }

  /**
   * Analyze video and suggest optimal segments for shorts
   */
  async analyzeVideo(metadata: VideoMetadata, sceneData: any): Promise<AIAnalysis> {
    const duration = metadata.duration;
    const numberOfShorts = this.calculateOptimalShorts(duration);

    // If no AI configured, use rule-based analysis
    if (!this.anthropic && !this.openai) {
      return this.fallbackAnalysis(duration, numberOfShorts, sceneData);
    }

    const prompt = this.buildAnalysisPrompt(metadata, sceneData, numberOfShorts);

    try {
      let response: any;

      if (this.anthropic) {
        response = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        });

        const content = response.content[0].text;
        return this.parseAIResponse(content, duration);
      } else if (this.openai) {
        response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 2000
        });

        const content = response.choices[0].message.content || '';
        return this.parseAIResponse(content, duration);
      }
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      return this.fallbackAnalysis(duration, numberOfShorts, sceneData);
    }

    return this.fallbackAnalysis(duration, numberOfShorts, sceneData);
  }

  /**
   * Generate catchy hooks for shorts
   */
  async generateHooks(videoContext: string, numberOfHooks: number = 5): Promise<string[]> {
    if (!this.anthropic && !this.openai) {
      return this.fallbackHooks(numberOfHooks);
    }

    const prompt = `Generate ${numberOfHooks} catchy, attention-grabbing text hooks for a YouTube Short video.
Context: ${videoContext}

Requirements:
- Each hook should be 3-7 words
- Make them exciting and create curiosity
- Use action words and emotional triggers
- Perfect for overlaying at the start of the video
- Varied styles (question, statement, command, exclamation)

Return ONLY the hooks, one per line, without numbering or bullet points.`;

    try {
      if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }]
        });

        const content = response.content[0].text;
        return content.split('\n').filter(line => line.trim()).slice(0, numberOfHooks);
      } else if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        });

        const content = response.choices[0].message.content || '';
        return content.split('\n').filter(line => line.trim()).slice(0, numberOfHooks);
      }
    } catch (error) {
      console.error('Hook generation failed, using fallback:', error);
      return this.fallbackHooks(numberOfHooks);
    }

    return this.fallbackHooks(numberOfHooks);
  }

  // Private helper methods

  private calculateOptimalShorts(duration: number): number {
    if (duration < 60) return 1;
    if (duration < 180) return 2;
    if (duration < 300) return 3;
    if (duration < 600) return 4;
    return 5;
  }

  private buildAnalysisPrompt(metadata: VideoMetadata, sceneData: any, numberOfShorts: number): string {
    return `Analyze this video and identify the ${numberOfShorts} best segments for creating engaging YouTube Shorts.

Video Information:
- Duration: ${metadata.duration} seconds
- Resolution: ${metadata.width}x${metadata.height}
- FPS: ${metadata.fps}

Scene Data:
${JSON.stringify(sceneData, null, 2)}

Requirements for each segment:
- Duration: 15-60 seconds (ideal: 30-45 seconds)
- Must be engaging and self-contained
- Should have a clear hook/interesting moment
- Maximize variety across all segments
- Prioritize segments with action, movement, or visual interest

Return a JSON array of segments with this structure:
[
  {
    "startTime": number (seconds),
    "endTime": number (seconds),
    "duration": number (seconds),
    "score": number (0-100),
    "reason": "why this segment is engaging",
    "suggestedHook": "catchy text hook for this segment"
  }
]

Return ONLY valid JSON, no other text.`;
  }

  private parseAIResponse(response: string, videoDuration: number): AIAnalysis {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const segments = JSON.parse(jsonMatch[0]);
      const hooks = segments.map((s: any) => s.suggestedHook || '');

      return {
        segments: segments.map((s: any) => ({
          startTime: s.startTime,
          endTime: s.endTime,
          duration: s.duration,
          score: s.score || 75,
          reason: s.reason || 'Interesting segment',
          hasAudio: true,
          hasFaces: false,
          hasAction: true
        })),
        suggestedHooks: hooks,
        scenes: [],
        highlights: []
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.fallbackAnalysis(videoDuration, 3, null);
    }
  }

  private fallbackAnalysis(duration: number, numberOfShorts: number, sceneData: any): AIAnalysis {
    const segments: VideoSegment[] = [];
    const segmentDuration = 30; // 30 second shorts
    const step = Math.max(segmentDuration, duration / numberOfShorts);

    for (let i = 0; i < numberOfShorts; i++) {
      const startTime = Math.min(i * step, duration - segmentDuration);
      const endTime = Math.min(startTime + segmentDuration, duration);

      segments.push({
        startTime,
        endTime,
        duration: endTime - startTime,
        score: 70 + Math.random() * 20,
        reason: 'Auto-selected segment',
        hasAudio: true,
        hasFaces: false,
        hasAction: true
      });
    }

    return {
      segments,
      suggestedHooks: this.fallbackHooks(numberOfShorts),
      scenes: [],
      highlights: []
    };
  }

  private fallbackHooks(count: number): string[] {
    const hooks = [
      'Watch This!',
      'You Won\'t Believe This',
      'Wait For It...',
      'This Is Incredible',
      'Mind = Blown',
      'Here\'s What Happened',
      'Check This Out',
      'This Changed Everything',
      'The Best Part Coming',
      'Don\'t Skip This'
    ];

    return hooks.slice(0, count);
  }
}
