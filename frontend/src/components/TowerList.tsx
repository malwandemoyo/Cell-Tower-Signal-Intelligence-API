import React from 'react';
import { Signal, MapPin, Radio, BarChart3, Wifi, Navigation } from 'lucide-react';
import { CellTower } from '../types';

interface TowerListProps {
  towers: CellTower[];
  selectedTower: CellTower | null;
  onTowerSelect: (tower: CellTower) => void;
  loading?: boolean;
}

const TowerList: React.FC<TowerListProps> = ({ 
  towers, 
  selectedTower, 
  onTowerSelect,
  loading = false 
}) => {
  const getSignalQuality = (signal: number) => {
    if (signal >= -70) return { text: 'Excellent', class: 'excellent', color: '#10b981' };
    if (signal >= -80) return { text: 'Good', class: 'good', color: '#f59e0b' };
    if (signal >= -90) return { text: 'Fair', class: 'fair', color: '#f97316' };
    return { text: 'Poor', class: 'poor', color: '#ef4444' };
  };

  const getRadioIcon = (radio: string) => {
    switch (radio.toUpperCase()) {
      case 'LTE': return <Wifi size={14} />;
      case 'GSM': return <Radio size={14} />;
      case 'UMTS': return <Navigation size={14} />;
      case 'CDMA': return <BarChart3 size={14} />;
      case '5G': return <Signal size={14} />;
      default: return <Radio size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="tower-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading towers...</p>
        </div>
      </div>
    );
  }

  if (towers.length === 0) {
    return (
      <div className="tower-list">
        <div className="empty-state">
          <Radio size={48} className="empty-icon" />
          <h3>No Towers Found</h3>
          <p>Try adjusting your search criteria or load all towers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tower-list">
      <div className="tower-list-header">
        <h3>Cell Towers ({towers.length})</h3>
        <div className="list-stats">
          <span className="stat-badge excellent">
            {towers.filter(t => t.averageSignal >= -70).length} Excellent
          </span>
          <span className="stat-badge good">
            {towers.filter(t => t.averageSignal >= -80 && t.averageSignal < -70).length} Good
          </span>
        </div>
      </div>
      <div className="tower-list-content">
        {towers.map(tower => {
          const signalInfo = getSignalQuality(tower.averageSignal);
          return (
            <div
              key={tower.id}
              className={`tower-item ${selectedTower?.id === tower.id ? 'selected' : ''}`}
              onClick={() => onTowerSelect(tower)}
            >
              <div className="tower-header">
                <div className="tower-main-info">
                  <span className="tower-id">Tower {tower.id}</span>
                  <div className="tower-type-badge">
                    {getRadioIcon(tower.radio)}
                    <span>{tower.radio}</span>
                  </div>
                </div>
                <div 
                  className={`signal-indicator ${signalInfo.class}`}
                  style={{ backgroundColor: signalInfo.color }}
                  title={`${signalInfo.text} Signal: ${tower.averageSignal} dBm`}
                ></div>
              </div>
              
              <div className="tower-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <Signal size={12} />
                    <span className="detail-label">Signal:</span>
                    <span className="detail-value">{tower.averageSignal} dBm</span>
                  </div>
                  <div className="detail-item">
                    <BarChart3 size={12} />
                    <span className="detail-label">Samples:</span>
                    <span className="detail-value">{tower.samples}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={12} />
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">
                      {tower.lat.toFixed(4)}, {tower.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
                
                <div className="tower-meta">
                  <div className="meta-tags">
                    <span className="meta-tag">MCC: {tower.mcc}</span>
                    <span className="meta-tag">Cell: {tower.cell}</span>
                    <span className="meta-tag">Area: {tower.area}</span>
                    <span className="meta-tag">Net: {tower.net}</span>
                  </div>
                </div>
                
                <div className="signal-quality-badge">
                  <span className={`quality-tag ${signalInfo.class}`}>
                    {signalInfo.text} Signal
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TowerList;