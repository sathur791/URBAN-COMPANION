import { useState, useCallback } from 'react';
import QueryBar from './QueryBar';
import MapView from './MapView';
import RecommendationCard from './RecommendationCard';
import ExplainabilityPanel from './ExplainabilityPanel';
import LiveConditionsStrip from './LiveConditionsStrip';
import AlternativesList from './AlternativesList';
import ProfileSidebar from './ProfileSidebar';
import SkeletonLoader from './SkeletonLoader';
import DepartureOptimizer from './DepartureOptimizer';
import EcoImpactBadge from './EcoImpactBadge';
import TurnByTurnGuide from './TurnByTurnGuide';
import ExportRouteModal from './ExportRouteModal';
import { query as queryApi } from '../api';
import { Compass, Moon, Sun, User, Share2, Car, Bus, ParkingCircle } from 'lucide-react';

export default function Dashboard({ onLogout, theme, toggleTheme }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [activeMode, setActiveMode] = useState('all');
  const [originName, setOriginName] = useState('Times Square, NY');
  const [destName, setDestName] = useState('Central Park, NY');

  const [originCoords, setOriginCoords] = useState({ lat: 40.7128, lng: -74.006 });
  const [destCoords, setDestCoords] = useState({ lat: 40.758, lng: -73.9855 });
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedMode, setSelectedMode] = useState('drive');

  const handleQuery = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        text: data.text || 'Generate optimal travel recommendation',
        origin_name: data.origin_name !== undefined ? data.origin_name : originName,
        dest_name: data.dest_name !== undefined ? data.dest_name : destName,
        gps_lat: originCoords.lat,
        gps_lng: originCoords.lng,
        dest_lat: destCoords.lat,
        dest_lng: destCoords.lng,
      };

      const res = await queryApi.submit(payload);
      setResponse(res.data);

      if (res.data?.origin_coords) setOriginCoords(res.data.origin_coords);
      if (res.data?.dest_coords) setDestCoords(res.data.dest_coords);
      if (res.data?.ranked_options?.[0]) {
        setSelectedOptionId(res.data.ranked_options[0].option_id);
        setSelectedMode(res.data.ranked_options[0].mode);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to generate travel recommendation. Please check backend API server.');
    } finally {
      setLoading(false);
    }
  }, [originName, destName, originCoords, destCoords]);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="brand-icon-wrapper">
            <Compass size={24} />
          </div>
          <div className="brand-title-group">
            <h1>Urban Companion</h1>
            <div className="live-tag">
              <span className="live-dot" /> Real-Time Urban Intelligence Engine
            </div>
          </div>
        </div>

        <div className="header-right">
          {response && (
            <button className="icon-btn" onClick={() => setExportModalOpen(true)} title="Export & Share Route">
              <Share2 size={18} />
            </button>
          )}

          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme (Dark / Light)">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Profile & Preferences">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* EXPORT ROUTE MODAL */}
      <ExportRouteModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        originCoords={originCoords}
        destCoords={destCoords}
        originAddress={response?.origin_address || originName}
        destAddress={response?.dest_address || destName}
      />

      {/* PROFILE SIDEBAR DRAWER */}
      <ProfileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        onReQuery={(data) => {
          setSidebarOpen(false);
          handleQuery(data);
        }}
      />

      {/* QUERY & SEARCH BAR */}
      <QueryBar
        onQuery={handleQuery}
        loading={loading}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        originName={originName}
        setOriginName={setOriginName}
        destName={destName}
        setDestName={setDestName}
        onSelectOrigin={(loc) => setOriginCoords({ lat: loc.lat, lng: loc.lng })}
        onSelectDest={(loc) => setDestCoords({ lat: loc.lat, lng: loc.lng })}
      />

      {/* ERROR BANNER */}
      {error && (
        <div className="error-banner" style={{ margin: '16px 28px 0 28px', borderRadius: '12px' }}>
          {error}
        </div>
      )}

      {/* SKELETON LOADER */}
      {loading && <SkeletonLoader />}

      {/* MAIN DASHBOARD CONTENT */}
      {!loading && response && (
        <div className="dashboard-content">
          <div className="main-panel">
            <MapView
              conditions={response.live_conditions}
              originCoords={response.origin_coords || originCoords}
              destCoords={response.dest_coords || destCoords}
              originAddress={response.origin_address || originName}
              destAddress={response.dest_address || destName}
              routesGeometry={response.routes_geometry}
              selectedMode={selectedMode}
            />

            <EcoImpactBadge impact={response.eco_impact} />

            <RecommendationCard recommendation={response} />

            <DepartureOptimizer windows={response.departure_windows} />

            <ExplainabilityPanel explanations={response.shap_explanations} />

            <TurnByTurnGuide steps={response.turn_by_turn_steps} />
          </div>

          <div className="side-panel">
            <LiveConditionsStrip conditions={response.live_conditions} />
            <AlternativesList
              options={response.ranked_options}
              selectedOptionId={selectedOptionId}
              onSelectOption={(opt) => {
                setSelectedOptionId(opt.option_id);
                setSelectedMode(opt.mode);
              }}
            />
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !response && (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <Compass size={40} />
          </div>
          <h2>Where would you like to travel?</h2>
          <p>Enter any start location & destination to generate real turn-by-turn routes, traffic forecasts, eco impact analysis, and AI travel advice.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            width: '100%',
            marginTop: '16px'
          }}>
            <div
              className="condition-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleQuery({ text: 'Generate fastest route', origin_name: 'Times Square, NY', dest_name: 'Central Park, NY' })}
            >
              <div className="condition-icon" style={{ color: 'var(--primary)', background: 'var(--primary-light)' }}>
                <Car size={20} />
              </div>
              <div className="condition-info" style={{ textAlign: 'left' }}>
                <span className="condition-label">Times Square → Central Park</span>
                <span className="condition-value" style={{ fontSize: '14px' }}>Fastest Route</span>
              </div>
            </div>

            <div
              className="condition-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleQuery({ text: 'Find parking near airport', origin_name: 'Downtown', dest_name: 'JFK Airport' })}
            >
              <div className="condition-icon" style={{ color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.1)' }}>
                <ParkingCircle size={20} />
              </div>
              <div className="condition-info" style={{ textAlign: 'left' }}>
                <span className="condition-label">Downtown → JFK Airport</span>
                <span className="condition-value" style={{ fontSize: '14px' }}>Smart Parking</span>
              </div>
            </div>

            <div
              className="condition-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleQuery({ text: 'Eco transit route', origin_name: 'Grand Central', dest_name: 'Empire State Building' })}
            >
              <div className="condition-icon" style={{ color: 'var(--accent-teal)', background: 'rgba(14,165,233,0.1)' }}>
                <Bus size={20} />
              </div>
              <div className="condition-info" style={{ textAlign: 'left' }}>
                <span className="condition-label">Grand Central → Empire State</span>
                <span className="condition-value" style={{ fontSize: '14px' }}>Eco Transit</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
