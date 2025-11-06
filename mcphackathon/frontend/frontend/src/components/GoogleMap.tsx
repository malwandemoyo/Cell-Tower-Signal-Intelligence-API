import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapProps } from '../types';

declare global {
  interface Window {
    google: any;
    googleMapMethods?: any;
  }
}

interface MapVisualization {
  type: 'heatmap' | 'markers' | 'clusters' | 'coverage';
  data: any[];
  center?: { lat: number; lng: number };
  zoom?: number;
  title: string;
}

interface ExtendedMapProps extends MapProps {
  visualization?: MapVisualization | null;
  onVisualizationComplete?: () => void;
}

const GoogleMap: React.FC<ExtendedMapProps> = ({ 
  towers, 
  selectedTower, 
  onTowerSelect,
  visualization,
  onVisualizationComplete 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatmapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scriptLoadingRef = useRef(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setScriptLoaded(true);
        return;
      }

      if (scriptLoadingRef.current) {
        return;
      }

      scriptLoadingRef.current = true;

      const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAp5TGX_ToAf9yEiVnDODSnv3xwh5cxtKs';
      
      if (!apiKey) {
        setMapError('Google Maps API key is missing');
        scriptLoadingRef.current = false;
        return;
      }

      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places,visualization`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        setScriptLoaded(true);
        scriptLoadingRef.current = false;
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setMapError('Failed to load Google Maps. Please check your API key and network connection.');
        scriptLoadingRef.current = false;
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || !window.google?.maps?.Map) {
      return;
    }

    const initializeMap = () => {
      try {
        console.log('Initializing Google Map...');
        const defaultCenter = { lat: -28.4793, lng: 24.6727 }; // South Africa center
        
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
          zoom: 6,
          center: defaultCenter,
          mapTypeId: 'roadmap',
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Add search functionality
        mapInstanceRef.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
          createSearchBox()
        );

        setMapReady(true);
        setMapError(null);
        console.log('Google Maps initialized successfully');

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    const createSearchBox = () => {
      const searchContainer = document.createElement('div');
      searchContainer.style.margin = '10px';
      searchContainer.style.padding = '5px';
      searchContainer.style.background = 'white';
      searchContainer.style.borderRadius = '3px';
      searchContainer.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search locations...';
      searchInput.style.border = 'none';
      searchInput.style.outline = 'none';
      searchInput.style.width = '200px';
      searchInput.style.padding = '8px';
      searchInput.style.fontSize = '14px';
      
      searchContainer.appendChild(searchInput);
      
      const searchBox = new window.google.maps.places.SearchBox(searchInput);
      
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;
        
        const place = places[0];
        if (!place.geometry) return;
        
        if (place.geometry.viewport) {
          mapInstanceRef.current.fitBounds(place.geometry.viewport);
        } else {
          mapInstanceRef.current.setCenter(place.geometry.location);
          mapInstanceRef.current.setZoom(12);
        }
        
        new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: place.geometry.location,
          title: place.name
        });
      });
      
      return searchContainer;
    };

    initializeMap();

    return () => {
      markersRef.current.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });
      markersRef.current = [];
      
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
    };
  }, [scriptLoaded]);

  // Update markers when towers change
  useEffect(() => {
    if (!mapReady || !towers.length || !window.google?.maps) {
      return;
    }

    const updateMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });
      markersRef.current = [];

      try {
        const bounds = new window.google.maps.LatLngBounds();
        let markersCreated = 0;

        towers.forEach(tower => {
          if (!tower.lat || !tower.lon) return;

          const position = { lat: tower.lat, lng: tower.lon };
          bounds.extend(new window.google.maps.LatLng(tower.lat, tower.lon));
          
          const marker = new window.google.maps.Marker({
            position,
            map: mapInstanceRef.current,
            title: `Tower ${tower.id} - ${tower.radio}`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: getSignalColor(tower.averageSignal),
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="min-width: 220px; padding: 12px;">
                <h3 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 16px;">Tower ${tower.id}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 13px;">
                  <div><strong>Radio:</strong></div><div>${tower.radio}</div>
                  <div><strong>MCC:</strong></div><div>${tower.mcc}</div>
                  <div><strong>Cell ID:</strong></div><div>${tower.cell}</div>
                  <div><strong>Signal:</strong></div><div>${tower.averageSignal} dBm</div>
                  <div><strong>Quality:</strong></div><div>${getSignalQualityText(tower.averageSignal)}</div>
                  <div><strong>Samples:</strong></div><div>${tower.samples}</div>
                  <div><strong>Location:</strong></div><div>${tower.lat.toFixed(4)}, ${tower.lon.toFixed(4)}</div>
                </div>
              </div>
            `,
          });

          marker.addListener('click', () => {
            onTowerSelect(tower);
            infoWindow.open(mapInstanceRef.current, marker);
          });

          markersRef.current.push(marker);
          markersCreated++;
        });
        
        if (!bounds.isEmpty() && markersCreated > 0) {
          mapInstanceRef.current.fitBounds(bounds);
        }
        
        console.log(`Created ${markersCreated} markers on the map`);
      } catch (error) {
        console.error('Error creating markers:', error);
      }
    };

    updateMarkers();
  }, [towers, mapReady, onTowerSelect]);

  // Apply visualization when it changes
  useEffect(() => {
    if (!mapReady || !visualization || !window.google?.maps) {
      return;
    }

    const applyVisualization = () => {
      try {
        // Clear previous visualization
        if (heatmapRef.current) {
          heatmapRef.current.setMap(null);
        }

        // Clear existing markers for visualization
        markersRef.current.forEach(marker => {
          if (marker.setMap) marker.setMap(null);
        });
        markersRef.current = [];

        switch (visualization.type) {
          case 'heatmap':
            applyHeatmapVisualization(visualization);
            break;
          case 'markers':
            applyMarkerVisualization(visualization);
            break;
          case 'clusters':
            applyClusterVisualization(visualization);
            break;
          case 'coverage':
            applyCoverageVisualization(visualization);
            break;
        }

        // Center map on visualization data
        if (visualization.center) {
          mapInstanceRef.current.setCenter(visualization.center);
          mapInstanceRef.current.setZoom(visualization.zoom || 8);
        }

        console.log(`Applied ${visualization.type} visualization: ${visualization.title}`);

        // Notify parent that visualization is complete
        if (onVisualizationComplete) {
          setTimeout(onVisualizationComplete, 1000);
        }

      } catch (error) {
        console.error('Error applying visualization:', error);
      }
    };

    const applyHeatmapVisualization = (viz: MapVisualization) => {
      const heatmapData = viz.data.map(item => {
        return new window.google.maps.LatLng(item.location.lat, item.location.lng);
      });

      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapInstanceRef.current,
        radius: 30,
        opacity: 0.8,
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      });
    };

    const applyMarkerVisualization = (viz: MapVisualization) => {
      const bounds = new window.google.maps.LatLngBounds();

      viz.data.forEach(item => {
        const marker = new window.google.maps.Marker({
          position: item.position,
          map: mapInstanceRef.current,
          title: item.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: item.color || '#ef4444',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        bounds.extend(new window.google.maps.LatLng(item.position.lat, item.position.lng));
        markersRef.current.push(marker);
      });

      if (!bounds.isEmpty()) {
        mapInstanceRef.current.fitBounds(bounds);
      }
    };

    const applyClusterVisualization = (viz: MapVisualization) => {
      const bounds = new window.google.maps.LatLngBounds();

      viz.data.forEach(item => {
        const color = getTechnologyColor(item.technology);
        const marker = new window.google.maps.Marker({
          position: item.position,
          map: mapInstanceRef.current,
          title: item.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        bounds.extend(new window.google.maps.LatLng(item.position.lat, item.position.lng));
        markersRef.current.push(marker);
      });

      if (!bounds.isEmpty()) {
        mapInstanceRef.current.fitBounds(bounds);
      }
    };

    const applyCoverageVisualization = (viz: MapVisualization) => {
      // Simple coverage visualization using circles
      viz.data.forEach(item => {
        const circle = new window.google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: mapInstanceRef.current,
          center: item.position,
          radius: 5000, // 5km radius
        });
      });
    };

    applyVisualization();

    return () => {
      // Cleanup visualization when component unmounts or visualization changes
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
    };
  }, [visualization, mapReady, onVisualizationComplete]);

  // Center map on selected tower
  useEffect(() => {
    if (selectedTower && mapInstanceRef.current && window.google?.maps) {
      try {
        const position = { lat: selectedTower.lat, lng: selectedTower.lon };
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(12);
      } catch (error) {
        console.error('Error centering map:', error);
      }
    }
  }, [selectedTower]);

  const getSignalColor = (signal: number) => {
    if (signal >= -70) return '#10b981';
    if (signal >= -80) return '#f59e0b';
    if (signal >= -90) return '#f97316';
    return '#ef4444';
  };

  const getTechnologyColor = (technology: string) => {
    switch (technology) {
      case 'LTE': return '#3b82f6';
      case 'GSM': return '#10b981';
      case 'UMTS': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getSignalQualityText = (signal: number) => {
    if (signal >= -70) return 'Excellent';
    if (signal >= -80) return 'Good';
    if (signal >= -90) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="google-map-container">
      <div 
        ref={mapRef} 
        className="google-map" 
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      />
      
      {mapError && (
        <div className="map-error-overlay">
          <div className="error-message">
            <h3>Map Loading Error</h3>
            <p>{mapError}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      )}
      
      {!scriptLoaded && !mapError && (
        <div className="map-loading-overlay">
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Loading Google Maps...
          </div>
        </div>
      )}

      {visualization && (
        <div className="visualization-info">
          <div className="viz-badge">
            <span className="viz-icon">🗺️</span>
            {visualization.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;