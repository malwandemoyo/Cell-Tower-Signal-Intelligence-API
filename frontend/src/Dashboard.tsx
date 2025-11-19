// Dashboard.tsx - FIXED VERSION WITH ON-CLICK FILTERS
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  BarChart3,
  Menu,
  X,
  Filter,
  Settings,
  User,
  Bell,
  Download,
  ChevronDown,
  ChevronUp,
  Signal,
  Wifi,
  MapPin,
  Activity
} from "lucide-react";
import GoogleMap from "./components/GoogleMap";
import TowerList from "./components/TowerList";
import AIService from "./components/EnhancedAIService";
import {
  fetchTowers,
  fetchTowersByRadio,
  fetchTowersByMcc,
  fetchTowersBySignalRange,
  fetchTowersWithHighSamples,
  getTowerStats
} from "./services/api";
import "./Dashboard.css";
import { CellTower } from "./types";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [towers, setTowers] = useState<CellTower[]>([]);
  const [filteredTowers, setFilteredTowers] = useState<CellTower[]>([]);
  const [selectedTower, setSelectedTower] = useState<CellTower | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [aiServiceOpen, setAIServiceOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [mapVisualization, setMapVisualization] = useState<any>(null);
  
  // Filter state - separated UI state from applied state
  const [activeFilters, setActiveFilters] = useState({
    networkType: "all",
    signalStrength: "all",
    country: "all",
    samples: "all"
  });
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({
    networkType: "all",
    signalStrength: "all",
    country: "all",
    samples: "all"
  });

  // Memoized filter counts to prevent recalculation on every render
  const filterCounts = useMemo(() => {
    return {
      networkType: {
        all: towers.length,
        LTE: towers.filter(t => t.radio === "LTE").length,
        GSM: towers.filter(t => t.radio === "GSM").length,
        UMTS: towers.filter(t => t.radio === "UMTS").length
      },
      signalStrength: {
        all: towers.length,
        excellent: towers.filter(t => t.averageSignal >= -70).length,
        good: towers.filter(t => t.averageSignal >= -80 && t.averageSignal < -70).length,
        fair: towers.filter(t => t.averageSignal >= -90 && t.averageSignal < -80).length,
        poor: towers.filter(t => t.averageSignal < -90).length
      },
      country: {
        all: towers.length,
        "655": towers.filter(t => t.mcc === 655).length,
        "262": towers.filter(t => t.mcc === 262).length,
        "310": towers.filter(t => t.mcc === 310).length
      },
      samples: {
        all: towers.length,
        high: towers.filter(t => t.samples >= 50).length,
        medium: towers.filter(t => t.samples >= 20 && t.samples < 50).length,
        low: towers.filter(t => t.samples < 20).length
      }
    };
  }, [towers]);

  // Signal quality helper
  const getSignalQuality = useCallback((signal: number) => {
    if (signal >= -70) return 'excellent';
    if (signal >= -80) return 'good';
    if (signal >= -90) return 'fair';
    return 'poor';
  }, []);

  // Memoized data processing
  const processedTowers = useMemo(() => {
    return filteredTowers.map(tower => ({
      ...tower,
      signalQuality: getSignalQuality(tower.averageSignal)
    }));
  }, [filteredTowers, getSignalQuality]);

  // Optimized data loading
  const loadTowers = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const cacheKey = 'towers_cache';
      const cacheTimeKey = 'towers_cache_time';
      const cacheExpiry = 5 * 60 * 1000;
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);
        
        if (cached && cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          if (age < cacheExpiry) {
            const data = JSON.parse(cached);
            setTowers(data);
            setFilteredTowers(data);
            setStats(await getTowerStats());
            setLoading(false);
            return;
          }
        }
      }
      
      const data = await fetchTowers();
      setTowers(data);
      setFilteredTowers(data);
      
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      
      setStats(await getTowerStats());
      setDataVersion(prev => prev + 1);
    } catch (err) {
      setError("Failed to load tower data");
      console.error("Error loading towers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Modern filter categories with memoized options
  const filterOptions = useMemo(() => ({
    networkType: [
      { id: "all", label: "All Networks", count: filterCounts.networkType.all, icon: Wifi },
      { id: "LTE", label: "LTE", count: filterCounts.networkType.LTE, icon: Activity },
      { id: "GSM", label: "GSM", count: filterCounts.networkType.GSM, icon: Signal },
      { id: "UMTS", label: "UMTS", count: filterCounts.networkType.UMTS, icon: BarChart3 }
    ],
    signalStrength: [
      { id: "all", label: "All Signals", count: filterCounts.signalStrength.all, icon: Signal },
      { id: "excellent", label: "Excellent (-70dBm+)", count: filterCounts.signalStrength.excellent, level: "excellent" },
      { id: "good", label: "Good (-80 to -70dBm)", count: filterCounts.signalStrength.good, level: "good" },
      { id: "fair", label: "Fair (-90 to -80dBm)", count: filterCounts.signalStrength.fair, level: "fair" },
      { id: "poor", label: "Poor (< -90dBm)", count: filterCounts.signalStrength.poor, level: "poor" }
    ],
    country: [
      { id: "all", label: "All Countries", count: filterCounts.country.all, icon: MapPin },
      { id: "655", label: "South Africa", count: filterCounts.country["655"], flag: "🇿🇦" },
      { id: "262", label: "Germany", count: filterCounts.country["262"], flag: "🇩🇪" },
      { id: "310", label: "United States", count: filterCounts.country["310"], flag: "🇺🇸" }
    ],
    samples: [
      { id: "all", label: "Any Samples", count: filterCounts.samples.all, icon: Activity },
      { id: "high", label: "High Samples (50+)", count: filterCounts.samples.high },
      { id: "medium", label: "Medium (20-49)", count: filterCounts.samples.medium },
      { id: "low", label: "Low (< 20)", count: filterCounts.samples.low }
    ]
  }), [filterCounts]);

  // ON-CLICK FILTER FUNCTIONS THAT CALL API
  const handleFilterClick = useCallback(async (filterType: string, value: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let filteredData: CellTower[] = [];

      switch (filterType) {
        case 'networkType':
          if (value === 'all') {
            filteredData = await fetchTowers();
          } else {
            filteredData = await fetchTowersByRadio(value);
          }
          break;

        case 'signalStrength':
          if (value === 'all') {
            filteredData = await fetchTowers();
          } else {
            switch (value) {
              case 'excellent':
                filteredData = await fetchTowersBySignalRange(-70, -30);
                break;
              case 'good':
                filteredData = await fetchTowersBySignalRange(-80, -70);
                break;
              case 'fair':
                filteredData = await fetchTowersBySignalRange(-90, -80);
                break;
              case 'poor':
                filteredData = await fetchTowersBySignalRange(-120, -90);
                break;
              default:
                filteredData = await fetchTowers();
            }
          }
          break;

        case 'country':
          if (value === 'all') {
            filteredData = await fetchTowers();
          } else {
            filteredData = await fetchTowersByMcc(parseInt(value));
          }
          break;

        case 'samples':
          if (value === 'all') {
            filteredData = await fetchTowers();
          } else {
            switch (value) {
              case 'high':
                filteredData = await fetchTowersWithHighSamples(50);
                break;
              case 'medium':
                filteredData = await fetchTowersWithHighSamples(20);
                break;
              case 'low':
                // For low samples, we need to filter client-side since API only has high samples endpoint
                const allTowers = await fetchTowers();
                filteredData = allTowers.filter(t => t.samples < 20);
                break;
              default:
                filteredData = await fetchTowers();
            }
          }
          break;

        default:
          filteredData = await fetchTowers();
      }

      setFilteredTowers(filteredData);
      
      // Update applied filters state
      setAppliedFilters(prev => ({
        ...prev,
        [filterType]: value
      }));

      // Update active filters for UI
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));

      console.log(`Applied ${filterType} filter: ${value}, found ${filteredData.length} towers`);

    } catch (err) {
      setError(`Failed to apply ${filterType} filter`);
      console.error("Filter error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle filter selection (just updates UI, doesn't call API yet)
  const handleFilterSelect = useCallback((filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Apply all selected filters with one click - CLIENT-SIDE ONLY (no API calls)
  const handleApplyFilters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let filteredData = [...towers]; // Start with all towers

      // Apply network type filter
      if (activeFilters.networkType !== "all") {
        filteredData = filteredData.filter(tower => tower.radio === activeFilters.networkType);
      }

      // Apply signal strength filter
      if (activeFilters.signalStrength !== "all") {
        switch (activeFilters.signalStrength) {
          case "excellent":
            filteredData = filteredData.filter(t => t.averageSignal >= -70);
            break;
          case "good":
            filteredData = filteredData.filter(t => t.averageSignal >= -80 && t.averageSignal < -70);
            break;
          case "fair":
            filteredData = filteredData.filter(t => t.averageSignal >= -90 && t.averageSignal < -80);
            break;
          case "poor":
            filteredData = filteredData.filter(t => t.averageSignal < -90);
            break;
        }
      }

      // Apply country filter
      if (activeFilters.country !== "all") {
        filteredData = filteredData.filter(tower => tower.mcc.toString() === activeFilters.country);
      }

      // Apply samples filter
      if (activeFilters.samples !== "all") {
        switch (activeFilters.samples) {
          case "high":
            filteredData = filteredData.filter(t => t.samples >= 50);
            break;
          case "medium":
            filteredData = filteredData.filter(t => t.samples >= 20 && t.samples < 50);
            break;
          case "low":
            filteredData = filteredData.filter(t => t.samples < 20);
            break;
        }
      }

      setFilteredTowers(filteredData);
      setAppliedFilters({ ...activeFilters });

      console.log(`Applied all filters, found ${filteredData.length} towers`);

    } catch (err) {
      setError("Failed to apply filters");
      console.error("Filter error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, towers]);

  // Reset all filters
  const resetFilters = useCallback(async () => {
    try {
      setLoading(true);
      setFilteredTowers(towers);
      
      const resetState = {
        networkType: "all",
        signalStrength: "all",
        country: "all",
        samples: "all"
      };
      
      setActiveFilters(resetState);
      setAppliedFilters(resetState);
      
      console.log("Reset all filters");
    } catch (err) {
      setError("Failed to reset filters");
      console.error("Reset error:", err);
    } finally {
      setLoading(false);
    }
  }, [towers]);

  // FIXED: Handle search - only filters when search is submitted or has minimum length
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Only apply search if query is long enough or empty
    if (query.trim().length === 0) {
      // Reset to current applied filters
      handleApplyFilters();
      return;
    }

    // Only search if query is at least 2 characters
    if (query.trim().length < 2) {
      return;
    }
    
    try {
      setLoading(true);
      
      const result = towers.filter(
        (t) =>
          t.radio.toLowerCase().includes(query.toLowerCase()) ||
          t.mcc.toString().includes(query) ||
          t.cell.toString().includes(query) ||
          t.net.toString().includes(query)
      );
      
      setFilteredTowers(result);
    } catch (err) {
      setError("Search failed");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [towers, handleApplyFilters]);

  // Debounced search to prevent too many re-renders
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for search execution
    const newTimeout = setTimeout(() => {
      handleSearch(query);
    }, 500); // 500ms delay
    
    setSearchTimeout(newTimeout);
  }, [searchTimeout, handleSearch]);

  const handleAnalysisComplete = useCallback((analysis: any) => {
    setAiAnalysis(analysis);
    console.log('AI Analysis completed:', analysis);
  }, []);

  const handleAIVisualization = useCallback((visualization: any) => {
    setMapVisualization(visualization);
    setAIServiceOpen(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadTowers();
  }, [loadTowers]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(value => value !== "all").length;
  const appliedFilterCount = Object.values(appliedFilters).filter(value => value !== "all").length;

  return (
    <div className="dashboard-wrapper">
      {/* Enhanced AI Service Modal */}
      {aiServiceOpen && (
        <AIService 
          towers={towers}
          onClose={() => setAIServiceOpen(false)}
          onAnalysisComplete={handleAnalysisComplete}
          onVisualizeOnMap={handleAIVisualization}
        />
      )}

      {/* Modern Sidebar */}
      <div className={`modern-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="app-logo">Synergy</div>
            <div className="app-subtitle">Network Analytics</div>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="sidebar-content">
          {/* Navigation */}
          <nav className="sidebar-nav">
            <button className="nav-back" onClick={() => navigate("/")}>
              <ArrowLeft size={18} />
              Back to Home
            </button>
            
            <div className="nav-section">
              <div className="nav-section-title">Data Management</div>
              <button className="nav-btn">
                <Download size={18} />
                Export Data
              </button>
              <button className="nav-btn" onClick={() => loadTowers(true)}>
                <RefreshCw size={18} />
                Refresh Data
              </button>
            </div>

            <div className="nav-section">
              <div className="nav-section-title">Analysis Tools</div>
              <button 
                className="nav-btn ai-tool"
                onClick={() => setAIServiceOpen(true)}
              >
                <BarChart3 size={18} />
                AI Analysis
              </button>
            </div>
          </nav>

          {/* Quick Stats */}
          {stats && (
            <div className="sidebar-stats">
              <div className="stats-title">Network Overview</div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.total?.toLocaleString()}</div>
                  <div className="stat-label">Total Towers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{Math.round(stats.avgSignal)}</div>
                  <div className="stat-label">Avg Signal (dBm)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalSamples?.toLocaleString()}</div>
                  <div className="stat-label">Samples</div>
                </div>
              </div>
            </div>
          )}

          {/* Modern Filter Section */}
          <div className="filter-section-modern">
            <div className="filter-header">
              <div className="filter-title">
                <Filter size={16} />
                Filters
                {appliedFilterCount > 0 && (
                  <span className="active-filter-count">{appliedFilterCount}</span>
                )}
              </div>
              <button 
                className="filter-toggle"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {filtersOpen && (
              <div className="filter-content">
                {/* Network Type Filter */}
                <div className="filter-group">
                  <label className="filter-group-label">Network Type</label>
                  <div className="filter-options">
                    {filterOptions.networkType.map(option => (
                      <button
                        key={option.id}
                        className={`filter-option ${activeFilters.networkType === option.id ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('networkType', option.id)}
                      >
                        <div className="filter-option-content">
                          <option.icon size={14} />
                          <span>{option.label}</span>
                        </div>
                        <span className="filter-count">{option.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Signal Strength Filter */}
                <div className="filter-group">
                  <label className="filter-group-label">Signal Strength</label>
                  <div className="filter-options">
                    {filterOptions.signalStrength.map(option => (
                      <button
                        key={option.id}
                        className={`filter-option signal-${option.level} ${activeFilters.signalStrength === option.id ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('signalStrength', option.id)}
                      >
                        <div className="filter-option-content">
                          {option.level && (
                            <div className={`signal-indicator ${option.level}`} />
                          )}
                          <span>{option.label}</span>
                        </div>
                        <span className="filter-count">{option.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country Filter */}
                <div className="filter-group">
                  <label className="filter-group-label">Country</label>
                  <div className="filter-options">
                    {filterOptions.country.map(option => (
                      <button
                        key={option.id}
                        className={`filter-option ${activeFilters.country === option.id ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('country', option.id)}
                      >
                        <div className="filter-option-content">
                          <span className="flag">{option.flag}</span>
                          <span>{option.label}</span>
                        </div>
                        <span className="filter-count">{option.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Samples Filter */}
                <div className="filter-group">
                  <label className="filter-group-label">Sample Count</label>
                  <div className="filter-options">
                    {filterOptions.samples.map(option => (
                      <button
                        key={option.id}
                        className={`filter-option ${activeFilters.samples === option.id ? 'active' : ''}`}
                        onClick={() => handleFilterSelect('samples', option.id)}
                      >
                        <div className="filter-option-content">
                          <Activity size={14} />
                          <span>{option.label}</span>
                        </div>
                        <span className="filter-count">{option.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="filter-actions">
                  <button 
                    className="apply-filters-btn"
                    onClick={handleApplyFilters}
                    disabled={loading || activeFilterCount === 0}
                  >
                    Apply Filters
                  </button>
                  
                  {(activeFilterCount > 0 || appliedFilterCount > 0) && (
                    <button className="reset-filters-btn" onClick={resetFilters}>
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="quick-filters-section">
            <div className="section-title">Quick Filters</div>
            <div className="quick-filter-buttons">
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterClick('networkType', 'LTE')}
                disabled={loading}
              >
                <Activity size={14} />
                LTE Only
              </button>
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterClick('signalStrength', 'excellent')}
                disabled={loading}
              >
                <Signal size={14} />
                Strong Signal
              </button>
              <button 
                className="quick-filter-btn"
                onClick={() => handleFilterClick('country', '655')}
                disabled={loading}
              >
                <MapPin size={14} />
                South Africa
              </button>
            </div>
          </div>

          {/* User Section */}
          <div className="user-section">
            <button className="user-btn">
              <User size={18} />
              Account
            </button>
            <button className="user-btn">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Top Bar */}
        <div className="modern-topbar">
          <div className="topbar-search">
            <div className="search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search towers, networks, or locations..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="topbar-actions">
            <button className="action-btn">
              <Bell size={18} />
            </button>
            <button 
              className="action-btn refresh-btn"
              onClick={() => loadTowers(true)} 
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              {loading ? "Updating..." : "Refresh"}
            </button>
            <div className="user-avatar">
              <User size={20} />
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="map-content-area">
          <div className="map-container">
            <GoogleMap
              towers={processedTowers}
              selectedTower={selectedTower}
              onTowerSelect={setSelectedTower}
              dataVersion={dataVersion}
              loading={loading}
              aiAnalysis={aiAnalysis}
              visualization={mapVisualization}
              onVisualizationComplete={() => setMapVisualization(null)}
            />
          </div>

          {/* Tower List Panel */}
          {filteredTowers.length > 0 && (
            <div className="tower-list-panel">
              <div className="panel-header">
                <h3>Network Towers</h3>
                <div className="panel-info">
                  <span className="tower-count">{filteredTowers.length} towers</span>
                  {appliedFilterCount > 0 && (
                    <span className="filter-badge">{appliedFilterCount} active filters</span>
                  )}
                </div>
              </div>
              <div className="tower-list-content">
                <TowerList
                  towers={processedTowers}
                  selectedTower={selectedTower}
                  onTowerSelect={setSelectedTower}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;