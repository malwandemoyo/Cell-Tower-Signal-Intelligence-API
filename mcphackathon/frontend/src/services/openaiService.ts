// frontend/src/services/openaiService.ts

import { VoiceAnalysis } from  '@/types';

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateRecommendations(factors: {
    cellCoverage: number;
    fiberProximity: number;
    populationDensity: number;
    businessPotential: number;
    signalStrength: number;
  }): Promise<string[]> {
    const prompt = `As a telecommunications infrastructure expert, provide 3-5 specific, actionable recommendations for cell tower placement based on these factors:

Location Analysis Factors:
- Cell Coverage: ${factors.cellCoverage}%
- Fiber Proximity: ${factors.fiberProximity}%
- Population Density: ${factors.populationDensity}%
- Business Potential: ${factors.businessPotential}%
- Signal Strength: ${factors.signalStrength}%

Provide concise recommendations focusing on:
1. Infrastructure investment priorities
2. Business opportunities
3. Risk mitigation
4. Market positioning

Return a JSON array of recommendation strings.`;

    try {
      const completion = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a telecommunications infrastructure expert. Provide concise, actionable recommendations in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        const parsed = JSON.parse(response);
        return parsed.recommendations || parsed.array || [];
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    }

    // Fallback recommendations
    return [
      'Focus on areas with existing fiber infrastructure to reduce deployment costs',
      'Consider population growth trends in the surrounding areas',
      'Evaluate competitor tower density to identify underserved markets',
      'Assess terrain and building heights for optimal signal propagation'
    ];
  }

  async correctSpelling(text: string): Promise<string> {
    const prompt = `Correct any spelling errors in this text while maintaining the original meaning and intent. Return only the corrected text:

Original: "${text}"`;

    try {
      const completion = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that corrects spelling errors. Return only the corrected text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100
      });

      return completion.choices[0]?.message?.content?.trim() || text;
    } catch (error) {
      console.error('Failed to correct spelling:', error);
      return text;
    }
  }

  async analyzeVoiceQuery(query: string): Promise<VoiceAnalysis> {
    const prompt = `Analyze this voice query about cell tower locations and extract the intent, location, and any filters. Return as JSON:

Query: "${query}"

Expected JSON format:
{
  "intent": "search|analyze|compare|etc",
  "location": "extracted location or null",
  "filters": {
    "radioType": "LTE|GSM|UMTS|etc",
    "signalStrength": {"min": -90, "max": -70},
    "area": "urban|rural|suburban"
  }
}`;

    try {
      const completion = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You analyze voice queries about telecom infrastructure and extract structured data. Return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 200
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        return JSON.parse(response);
      }
    } catch (error) {
      console.error('Failed to analyze voice query:', error);
    }

    // Default response
    return {
      intent: 'search',
      location: undefined,
      filters: {}
    };
  }

  async generateLocationInsights(location: { lat: number; lng: number }, analysis: any): Promise<string> {
    const prompt = `Provide strategic insights for this location analysis:

Location: ${location.lat}, ${location.lng}
Overall Score: ${analysis.score}/10
Factors:
- Cell Coverage: ${analysis.factors.cellCoverage}%
- Fiber Proximity: ${analysis.factors.fiberProximity}%
- Population Density: ${analysis.factors.populationDensity}%
- Business Potential: ${analysis.factors.businessPotential}%
- Signal Strength: ${analysis.factors.signalStrength}%

Estimated Monthly Revenue: $${analysis.estimatedRevenue}

Provide a concise paragraph of strategic insights.`;

    try {
      const completion = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You provide strategic telecom infrastructure insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300
      });

      return completion.choices[0]?.message?.content || 'No insights available.';
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return 'Strategic insights unavailable at this time.';
    }
  }
}