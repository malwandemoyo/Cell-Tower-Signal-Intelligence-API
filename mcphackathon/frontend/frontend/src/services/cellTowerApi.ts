import { CellTower } from '../types';

// Base URL - uses environment variable or defaults to Railway deployment

const API_BASE_URL =
  process.env.VITE_Spring_Boot_API_URL ||
 process.env.VITE_CELL_TOWER_API_URL ||
  'https://signal-intelligence-api-production.up.railway.app/api/cell-towers';

// Helper function for handling responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return [] as T;
  }
  
  return response.json();
};

// ========== CREATE OPERATIONS ==========

export const createCellTower = async (tower: Omit<CellTower, 'id'>): Promise<CellTower> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tower),
  });
  return handleResponse<CellTower>(response);
};

export const createMultipleCellTowers = async (towers: Omit<CellTower, 'id'>[]): Promise<CellTower[]> => {
  const response = await fetch(`${API_BASE_URL}/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(towers),
  });
  return handleResponse<CellTower[]>(response);
};

// ========== READ OPERATIONS ==========

export const fetchAllTowers = async (): Promise<CellTower[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    return await handleResponse<CellTower[]>(response);
  } catch (error) {
    console.error('Error fetching all towers:', error);
    throw error;
  }
};

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const fetchTowersPaged = async (
  page: number = 0,
  size: number = 20,
  sortBy: string = 'id',
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<PagedResponse<CellTower>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDirection,
  });
  
  const response = await fetch(`${API_BASE_URL}/paged?${params}`);
  return handleResponse<PagedResponse<CellTower>>(response);
};

export const fetchTowerById = async (id: number): Promise<CellTower> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse<CellTower>(response);
};

export const fetchTowerByCellId = async (cellId: number): Promise<CellTower[]> => {
  const response = await fetch(`${API_BASE_URL}/cell/${cellId}`);
  return handleResponse<CellTower[]>(response);
};

// ========== UPDATE OPERATIONS ==========

export const updateCellTower = async (id: number, tower: Partial<CellTower>): Promise<CellTower> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tower),
  });
  return handleResponse<CellTower>(response);
};

export const partialUpdateCellTower = async (id: number, tower: Partial<CellTower>): Promise<CellTower> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tower),
  });
  return handleResponse<CellTower>(response);
};

// ========== DELETE OPERATIONS ==========

export const deleteCellTower = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete tower ${id}: ${response.status}`);
  }
};

export const deleteAllCellTowers = async (): Promise<void> => {
  const response = await fetch(API_BASE_URL, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete all towers: ${response.status}`);
  }
};

// ========== CUSTOM QUERY OPERATIONS ==========

export const fetchTowersByRadio = async (radio: string): Promise<CellTower[]> => {
  const response = await fetch(`${API_BASE_URL}/radio/${radio}`);
  return handleResponse<CellTower[]>(response);
};

export const fetchTowersByRadioPaged = async (
  radio: string,
  page: number = 0,
  size: number = 20
): Promise<PagedResponse<CellTower>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/radio/${radio}/paged?${params}`);
  return handleResponse<PagedResponse<CellTower>>(response);
};

export const fetchTowersByMcc = async (mcc: number): Promise<CellTower[]> => {
  const response = await fetch(`${API_BASE_URL}/mcc/${mcc}`);
  return handleResponse<CellTower[]>(response);
};

export const fetchTowersByRadioAndMcc = async (radio: string, mcc: number): Promise<CellTower[]> => {
  const response = await fetch(`${API_BASE_URL}/radio/${radio}/mcc/${mcc}`);
  return handleResponse<CellTower[]>(response);
};

export const fetchTowersByLocation = async (
  minLon: number,
  maxLon: number,
  minLat: number,
  maxLat: number
): Promise<CellTower[]> => {
  const params = new URLSearchParams({
    minLon: minLon.toString(),
    maxLon: maxLon.toString(),
    minLat: minLat.toString(),
    maxLat: maxLat.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/location?${params}`);
  return handleResponse<CellTower[]>(response);
};

export const fetchTowersWithHighSamples = async (minSamples: number): Promise<CellTower[]> => {
  const response = await fetch(`${API_BASE_URL}/samples/${minSamples}`);
  return handleResponse<CellTower[]>(response);
};

export const fetchTowersBySignalRange = async (
  minSignal: number,
  maxSignal: number
): Promise<CellTower[]> => {
  const params = new URLSearchParams({
    minSignal: minSignal.toString(),
    maxSignal: maxSignal.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/signal?${params}`);
  return handleResponse<CellTower[]>(response);
};

export const getCountByRadio = async (radio: string): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/radio/${radio}/count`);
  return handleResponse<number>(response);
};

// ========== UTILITY FUNCTIONS ==========

// Get all unique radio types from towers
export const getRadioTypes = async (): Promise<string[]> => {
  const towers = await fetchAllTowers();
  const radioTypes = new Set(towers.map(tower => tower.radio));
  return Array.from(radioTypes).sort();
};

// Get statistics about towers
export const getTowerStats = async (): Promise<{
  total: number;
  byRadio: { [key: string]: number };
  avgSignal: number;
  totalSamples: number;
}> => {
  const towers = await fetchAllTowers();
  
  const byRadio: { [key: string]: number } = {};
  let totalSignal = 0;
  let totalSamples = 0;
  
  towers.forEach(tower => {
    byRadio[tower.radio] = (byRadio[tower.radio] || 0) + 1;
    totalSignal += tower.averageSignal;
    totalSamples += tower.samples;
  });
  
  return {
    total: towers.length,
    byRadio,
    avgSignal: towers.length > 0 ? totalSignal / towers.length : 0,
    totalSamples,
  };
};

// Export the base URL for direct access if needed
export { API_BASE_URL };