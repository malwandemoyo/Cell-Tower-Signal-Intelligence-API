import React, { useState } from 'react';
import { MapContainer, TileLayer, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DemandScore } from '../../mcp-server/src/types';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'map' | 'analysis' | 'business'>('map');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_CELL_TOWER_API_URL;
      if (!apiUrl) {
        console.error('VITE_CELL_TOWER_API_URL is not defined');
        return;
      }

      const response = await fetch(`${apiUrl}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: searchQuery, radius: 10 })
      });

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch();
    };

    recognition.start();
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
          <div className="map-container" style={{ height: '600px' }}>
            <MapContainer center={[-26.2041, 28.0473]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {Array.isArray(searchResults?.demandScores) &&
                searchResults.demandScores.map((score: DemandScore, index: number) => {
                  const lat = score?.location?.lat ?? -26.2041;
                  const lng = score?.location?.lng ?? 28.0473;
                  const color = score.score > 80 ? 'green' : score.score > 60 ? 'orange' : 'red';

                  return (
                    <Circle
                      key={index}
                      center={[lat, lng]}
                      radius={500}
                      pathOptions={{ color, fillColor: color, fillOpacity: 0.2 }}
                    >
                      <Popup>
                        <div>
                          <h3>Demand Score: {score.score}</h3>
                          <p>Population Density: {score.factors?.populationDensity?.toFixed(1) ?? 'N/A'}</p>
                          <p>Existing Coverage: {score.factors?.existingCoverage?.toFixed(1) ?? 'N/A'}%</p>
                          <p>Fiber Proximity: {score.factors?.fiberProximity?.toFixed(1) ?? 'N/A'}</p>
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}
            </MapContainer>
          </div>
        )}

        {view === 'analysis' && searchResults && (
          <div className="analysis-container">
            <h2>Demand Analysis</h2>
            <p>Metrics and charts will display here.</p>
          </div>
        )}

        {view === 'business' && searchResults && (
          <div className="business-container">
            <h2>Business Opportunities</h2>
            <p>Business opportunities list will display here.</p>
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
