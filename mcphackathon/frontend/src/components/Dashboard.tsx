import React, { useState } from 'react';
import { MapContainer, TileLayer, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DemandScore, BusinessOpportunity } from '@/types';


const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'map' | 'analysis' | 'business'>('map');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_CELL_TOWER_API_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: searchQuery, radius: 10 })
      });

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch();
      };

      recognition.start();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Cell Tower Intelligence Dashboard</h1>
        <p>Optimize tower placement with AI-powered demand analysis</p>
      </header>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter location or coordinates..."
            className="search-input"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button onClick={handleVoiceSearch} className="voice-button">
            🎤
          </button>
        </div>
      </div>

      <nav className="view-navigation">
        <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>
          📍 Map View
        </button>
        <button className={view === 'analysis' ? 'active' : ''} onClick={() => setView('analysis')}>
          📊 Demand Analysis
        </button>
        <button className={view === 'business' ? 'active' : ''} onClick={() => setView('business')}>
          💼 Business Opportunities
        </button>
      </nav>

      <main className="main-content">
        {view === 'map' && (
          <div className="map-container">
            <MapContainer
              center={[-26.2041, 28.0473]}
              zoom={10}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {searchResults?.demandScores?.map((score: DemandScore, index: number) => (
                <Circle
                  key={index}
                  center={[score.location.lat, score.location.lng]}
                  radius={500}
                  pathOptions={{
                    color: score.score > 80 ? 'green' : score.score > 60 ? 'orange' : 'red',
                    fillColor: score.score > 80 ? 'green' : score.score > 60 ? 'orange' : 'red',
                    fillOpacity: 0.2
                  }}
                >
                  <Popup>
                    <div>
                      <h3>Demand Score: {score.score}</h3>
                      <p>Population Density: {score.factors.populationDensity.toFixed(1)}</p>
                      <p>Existing Coverage: {score.factors.existingCoverage.toFixed(1)}%</p>
                      <p>Fiber Proximity: {score.factors.fiberProximity.toFixed(1)}</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        )}

        {view === 'analysis' && searchResults && (
          <div className="analysis-container">
            <h2>Demand Analysis</h2>
            {/* Metrics, charts, etc. */}
          </div>
        )}

        {view === 'business' && searchResults && (
          <div className="business-container">
            <h2>Business Opportunities</h2>
            {/* Business opportunities list */}
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>Powered by MCP Server • Cell Tower Intelligence • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Dashboard;
