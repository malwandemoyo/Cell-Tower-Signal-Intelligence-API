// types.ts
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
  created: number;
  updated: number;
  averageSignal: number;
  signalQuality?: string;
}

export interface AIAnalysis {
  answer: string;
  insights: string[];
  recommendations: string[];
  issues: string[];
  visualizations?: any[];
  confidence?: number;
  coverageGaps?: Array<{ lat: number; lon: number; reason: string }>;
  optimalLocations?: Array<{ lat: number; lon: number; reason: string }>;
}
// Add to your existing types
export interface MapVisualization {
  type: 'heatmap' | 'markers' | 'clusters' | 'coverage';
  data: any[];
  center?: { lat: number; lng: number };
  zoom?: number;
  title: string;
}

export interface MapProps {
  towers: CellTower[];
  selectedTower: CellTower | null;
  onTowerSelect: (tower: CellTower | null) => void;
  dataVersion?: number;
  loading?: boolean;
  aiAnalysis?: any;
  visualization?: MapVisualization | null;
  onVisualizationComplete?: () => void;
}