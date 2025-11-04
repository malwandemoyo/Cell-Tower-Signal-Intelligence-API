// frontend/src/services/cellTowerService.ts

import { CellTower } from  '@/types';

export class CellTowerService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://signal-intelligence-api-production.up.railway.app/api/cell-towers') {
    this.baseUrl = baseUrl;
  }

  async getAllTowers(): Promise<CellTower[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cell towers:', error);
      return [];
    }
  }

  async getTowersByLocation(minLat: number, maxLat: number, minLon: number, maxLon: number): Promise<CellTower[]> {
    try {
      const params = new URLSearchParams({
        minLat: minLat.toString(),
        maxLat: maxLat.toString(),
        minLon: minLon.toString(),
        maxLon: maxLon.toString()
      });
      const response = await fetch(`${this.baseUrl}/location?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching towers by location:', error);
      return [];
    }
  }

  async getTowersByRadioType(radio: string): Promise<CellTower[]> {
    try {
      const response = await fetch(`${this.baseUrl}/radio/${radio}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching towers by radio type:', error);
      return [];
    }
  }

  async getTowersBySignalStrength(minSignal: number, maxSignal: number): Promise<CellTower[]> {
    try {
      const params = new URLSearchParams({
        minSignal: minSignal.toString(),
        maxSignal: maxSignal.toString()
      });
      const response = await fetch(`${this.baseUrl}/signal?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching towers by signal strength:', error);
      return [];
    }
  }

  async getTowersByMCC(mcc: number): Promise<CellTower[]> {
    try {
      const response = await fetch(`${this.baseUrl}/mcc/${mcc}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching towers by MCC:', error);
      return [];
    }
  }

  async createTower(towerData: Partial<CellTower>): Promise<CellTower | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(towerData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating cell tower:', error);
      return null;
    }
  }

  async updateTower(id: number, towerData: Partial<CellTower>): Promise<CellTower | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(towerData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating cell tower:', error);
      return null;
    }
  }

  async deleteTower(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting cell tower:', error);
      return false;
    }
  }
}