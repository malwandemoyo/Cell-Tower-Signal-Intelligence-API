// frontend/src/services/analysisService.ts

import { CellTower} from  '@/types';
import { CellTowerService } from './cellTowerService';
import { GoogleMapsService } from './googleMapsService';
import { OpenAIService } from './openaiService';

export class AnalysisService {
  private cellTowerService: CellTowerService;
  private googleMaps: GoogleMapsService;
  private openAI: OpenAIService;

  constructor(
    googleMapsApiKey: string,
    openAIApiKey: string,
    cellTowerApiUrl?: string
  ) {
    this.cellTowerService = new CellTowerService(cellTowerApiUrl);
    this.googleMaps = new GoogleMapsService(googleMapsApiKey);
    this.openAI = new OpenAIService(openAIApiKey);
  }

  async analyzeLocation(lat: number, lng: number, radius: number = 5000): Promise<LocationAnalysis> {
    console.log(`Analyzing location: ${lat}, ${lng} with radius: ${radius}m`);

    // Get nearby cell towers
    const nearbyTowers = await this.getNearbyTowers(lat, lng, radius);
    
    // Calculate factors
    const cellCoverage = this.calculateCellCoverage(nearbyTowers, radius);
    const fiberProximity = await this.calculateFiberProximity(lat, lng);
    const populationDensity = await this.calculatePopulationDensity(lat, lng);
    const businessPotential = await this.calculateBusinessPotential(lat, lng);
    const signalStrength = this.calculateAverageSignalStrength(nearbyTowers);

    // Calculate overall score (weighted average)
    const score = this.calculateOverallScore({
      cellCoverage,
      fiberProximity,
      populationDensity,
      businessPotential,
      signalStrength
    });

    // Get address
    const address = await this.googleMaps.reverseGeocode(lat, lng);

    // Generate recommendations using AI
    const recommendations = await this.openAI.generateRecommendations({
      cellCoverage,
      fiberProximity,
      populationDensity,
      businessPotential,
      signalStrength
    });

    const estimatedRevenue = this.calculateEstimatedRevenue(score, populationDensity, businessPotential);
    const risks = this.identifyRisks(score, { cellCoverage, fiberProximity, nearbyTowers: nearbyTowers.length });

    return {
      score: Math.round(score * 100) / 100,
      factors: {
        cellCoverage: Math.round(cellCoverage * 100),
        fiberProximity: Math.round(fiberProximity * 100),
        populationDensity: Math.round(populationDensity * 100),
        businessPotential: Math.round(businessPotential * 100),
        signalStrength: Math.round(signalStrength * 100)
      },
      recommendations,
      risks,
      estimatedRevenue,
      location: {
        lat,
        lng,
        address: address || undefined
      }
    };
  }

  private async getNearbyTowers(lat: number, lng: number, radius: number): Promise<CellTower[]> {
    const allTowers = await this.cellTowerService.getAllTowers();
    
    // Simple distance calculation (in meters)
    return allTowers.filter(tower => {
      const distance = this.calculateDistance(lat, lng, tower.lat, tower.lon);
      return distance <= radius;
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateCellCoverage(towers: CellTower[], radius: number): number {
    if (towers.length === 0) return 0;

    // Calculate coverage based on tower density and range
    const totalRange = towers.reduce((sum, tower) => sum + tower.range, 0);
    const areaCovered = Math.min(totalRange / (Math.PI * radius * radius), 1);
    
    return Math.min(areaCovered * 2, 1); // Normalize to 0-1
  }

  private async calculateFiberProximity(lat: number, lng: number): Promise<number> {
    // Simulate fiber infrastructure proximity
    // In real implementation, this would query fiber infrastructure data
    const businesses = await this.googleMaps.searchNearby(lat, lng, 2000, ['establishment']);
    
    // Assume businesses indicate infrastructure presence
    const businessDensity = Math.min(businesses.length / 20, 1);
    
    // Add some randomness for demo
    return Math.min(businessDensity + Math.random() * 0.3, 1);
  }

  private async calculatePopulationDensity(lat: number, lng: number): Promise<number> {
    // Search for residential areas and points of interest
    const residential = await this.googleMaps.searchNearby(lat, lng, 2000, ['restaurant', 'school', 'hospital', 'shopping_mall']);
    
    // Use POI density as proxy for population density
    const poiDensity = Math.min(residential.length / 15, 1);
    
    return Math.min(poiDensity + Math.random() * 0.2, 1);
  }

  private async calculateBusinessPotential(lat: number, lng: number): Promise<number> {
    // Search for business districts and commercial areas
    const businesses = await this.googleMaps.searchNearby(lat, lng, 2000, ['bank', 'shopping_mall', 'corporate_office', 'convenience_store']);
    
    const businessDensity = Math.min(businesses.length / 10, 1);
    
    // Consider area type (urban vs rural)
    const address = await this.googleMaps.reverseGeocode(lat, lng);
    const isUrban = address?.toLowerCase().includes('city') || 
                   address?.toLowerCase().includes('town') ||
                   address?.toLowerCase().includes('central');
    
    return Math.min(businessDensity * (isUrban ? 1.2 : 0.8), 1);
  }

  private calculateAverageSignalStrength(towers: CellTower[]): number {
    if (towers.length === 0) return 0.1;

    // Convert dBm to a 0-1 scale (-120 dBm to -60 dBm)
    const avgSignal = towers.reduce((sum, tower) => sum + tower.averageSignal, 0) / towers.length;
    const normalized = (avgSignal + 120) / 60; // Convert -120 to -60 range to 0-1
    
    return Math.max(0, Math.min(normalized, 1));
  }

  private calculateOverallScore(factors: {
    cellCoverage: number;
    fiberProximity: number;
    populationDensity: number;
    businessPotential: number;
    signalStrength: number;
  }): number {
    // Weighted average with business focus
    const weights = {
      cellCoverage: 0.20,
      fiberProximity: 0.15,
      populationDensity: 0.25,
      businessPotential: 0.30,
      signalStrength: 0.10
    };

    return (
      factors.cellCoverage * weights.cellCoverage +
      factors.fiberProximity * weights.fiberProximity +
      factors.populationDensity * weights.populationDensity +
      factors.businessPotential * weights.businessPotential +
      factors.signalStrength * weights.signalStrength
    );
  }

  private calculateEstimatedRevenue(score: number, populationDensity: number, businessPotential: number): number {
    // Base revenue model
    const baseRevenue = 75000; // Base monthly revenue potential
    const revenueMultiplier = score * populationDensity * businessPotential;
    
    return Math.round(baseRevenue * revenueMultiplier);
  }

  private identifyRisks(score: number, context: { cellCoverage: number; fiberProximity: number; nearbyTowers: number }): string[] {
    const risks: string[] = [];
    
    if (context.cellCoverage < 0.3) {
      risks.push('Low existing cell coverage may require significant infrastructure investment');
    }
    
    if (context.fiberProximity < 0.2) {
      risks.push('Limited fiber connectivity may increase deployment costs by 20-30%');
    }
    
    if (context.nearbyTowers === 0) {
      risks.push('No existing towers in area - consider phased deployment approach');
    }
    
    if (score < 0.4) {
      risks.push('Overall location score indicates high investment risk');
    } else if (score < 0.6) {
      risks.push('Moderate risk profile - conduct detailed feasibility study');
    }

    if (context.cellCoverage > 0.8 && context.nearbyTowers > 5) {
      risks.push('High competition density may impact market share');
    }

    return risks;
  }

  async compareLocations(locations: Array<{ lat: number; lng: number; name?: string }>): Promise<any[]> {
    const analyses = await Promise.all(
      locations.map(async (location) => {
        const analysis = await this.analyzeLocation(location.lat, location.lng);
        return {
          name: location.name || `Location ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
          ...analysis
        };
      })
    );

    // Sort by score descending
    return analyses.sort((a, b) => b.score - a.score);
  }
}