// services/api.ts
import { CellTower } from '../types';

const API_BASE_URL =process.env.VITE_Spring_Boot_API_URL||process.env.VITE_CELL_TOWER_API_URL || 
  'https://signal-intelligence-api-production.up.railway.app/api/cell-towers';

const MCP_SERVER_URL = 'http://localhost:3001'; // Your MCP server URL

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

const getCacheKey = (url: string, params?: any) => {
  return `${url}${params ? JSON.stringify(params) : ''}`;
};

const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Enhanced fetch with caching and retries
const enhancedFetch = async <T>(
  url: string, 
  options: RequestInit = {}, 
  useCache = true
): Promise<T> => {
  const cacheKey = getCacheKey(url, options.body);
  
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
      return [] as T;
    }

    const data = await response.json();
    
    if (useCache) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data;
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    throw error;
  }
};

// MCP Server Integration
export const callMCPServer = async (toolName: string, arguments_: any = {}) => {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/tools/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arguments_),
    });

    if (!response.ok) {
      throw new Error(`MCP Server error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('MCP Server call failed:', error);
    // Fallback to local analysis
    return performLocalAnalysis(toolName, arguments_);
  }
};

// Local analysis fallback
const performLocalAnalysis = (toolName: string, args: any) => {
  switch (toolName) {
    case 'analyze_coverage':
      return {
        coverageGaps: [],
        recommendations: ['Implement local analysis fallback'],
        riskAreas: [],
        optimalLocations: []
      };
    default:
      return { message: 'Local analysis fallback' };
  }
};

// AI Analysis via MCP
export const performAIAnalysis = async (towers: CellTower[]) => {
  try {
    return await callMCPServer('analyze_coverage', { towers });
  } catch (error) {
    console.error('AI analysis failed:', error);
    throw error;
  }
};

// Existing API functions with caching
export const fetchTowers = async (page = 0, size = 10000): Promise<CellTower[]> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: 'id',
      sortDirection: 'asc'
    });

    const data = await enhancedFetch<{
      content: CellTower[];
      totalElements: number;
    }>(`${API_BASE_URL}/paged?${params}`, {}, true);

    return data.content || [];
  } catch (error) {
    console.error('Error fetching towers:', error);
    return [];
  }
};

export const fetchTowersByRadio = async (radio: string): Promise<CellTower[]> => {
  return enhancedFetch<CellTower[]>(`${API_BASE_URL}/radio/${radio}`);
};

export const fetchTowersByMcc = async (mcc: number): Promise<CellTower[]> => {
  return enhancedFetch<CellTower[]>(`${API_BASE_URL}/mcc/${mcc}`);
};

export const fetchTowersBySignalRange = async (
  minSignal: number,
  maxSignal: number
): Promise<CellTower[]> => {
  const params = new URLSearchParams({
    minSignal: minSignal.toString(),
    maxSignal: maxSignal.toString(),
  });
  
  return enhancedFetch<CellTower[]>(`${API_BASE_URL}/signal?${params}`);
};

export const fetchTowersWithHighSamples = async (minSamples: number): Promise<CellTower[]> => {
  return enhancedFetch<CellTower[]>(`${API_BASE_URL}/samples/${minSamples}`);
};

export const getTowerStats = async (): Promise<{
  total: number;
  avgSignal: number;
  totalSamples: number;
}> => {
  const cacheKey = 'tower_stats';
  const cached = cache.get(cacheKey);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  try {
    const towers = await fetchTowers(0, 5000);
    
    const stats = {
      total: towers.length,
      avgSignal: towers.reduce((sum, tower) => sum + tower.averageSignal, 0) / towers.length,
      totalSamples: towers.reduce((sum, tower) => sum + tower.samples, 0)
    };
    
    cache.set(cacheKey, { data: stats, timestamp: Date.now() });
    return stats;
  } catch (error) {
    console.error('Error getting tower stats:', error);
    return {
      total: 0,
      avgSignal: 0,
      totalSamples: 0
    };
  }
};

// Clear cache utility
export const clearCache = (): void => {
  cache.clear();
  localStorage.removeItem('towers_cache');
  localStorage.removeItem('towers_cache_time');
  localStorage.removeItem('ai_analysis_cache');
};

export { API_BASE_URL };