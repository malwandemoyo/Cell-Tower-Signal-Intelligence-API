// frontend/src/types.ts

export interface CellTower {
  id: number;
  radio: string;
  mcc: number;
  net: number;
  area: number;
  cell: number;
  unit: number;
  lon: number;
  lat: number;
  range: number;
  samples: number;
  changeable: number;
  created: string;
  updated: string;
  averageSignal: number;
}

export interface FiberInfrastructure {
  layer: string;
  geometry: any;
  properties: Record<string, any>;
}

export interface LocationAnalysis {
  score: number;
  factors: {
    cellCoverage: number;
    fiberProximity: number;
    populationDensity: number;
    businessPotential: number;
    signalStrength: number;
  };
  recommendations: string[];
  risks: string[];
  estimatedRevenue: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface SearchRequest {
  query: string;
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number;
}

export interface VoiceAnalysis {
  intent: string;
  location?: string;
  filters?: {
    radioType?: string;
    signalStrength?: {
      min?: number;
      max?: number;
    };
    area?: string;
  };
}

export interface GoogleMapsLocation {
  lat: number;
  lng: number;
  address: string;
}

// Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}