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
import AIChatbot from './AIChatbot';
import MobileBottomNav from './MobileBottomNav';
import EmergencySOSModal from './EmergencySOSModal';
import EcoAnalyticsTab from './EcoAnalyticsTab';
import VoiceAssistant from './VoiceAssistant';

import { query as queryApi } from '../api';
import { Compass, Moon, Sun, User, Share2, Car, Bus, ParkingCircle, ShieldAlert, Sparkles, Flame, Zap } from 'lucide-react';

export default function Dashboard({ onLogout, theme, toggleTheme }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // Mobile Bottom Navigation Tab state ('home', 'routes', 'ai_chat', 'eco_stats', 'profile')
  const [activeTab, setActiveTab] = useState('home');

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
      // Auto-switch to Routes tab after query succeeds
      setActiveTab('routes');

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

  const handleVoiceRoute = useCallback(async (origin, dest) => {
    setOriginName(origin);
    setDestName(dest);
    handleQuery({ origin_name: origin, dest_name: dest });
  }, [handleQuery]);

  // Handle bottom tab selection
  const handleTabChange = (tabId) => {
    if (tabId === 'profile') {
      setSidebarOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="dashboard dashboard-mobile-padding">
      {/* MOBILE APP HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="brand-icon-wrapper">
            <Compass size={24} />
          </div>
          <div className="brand-title-group">
            <h1>Urban Companion</h1>
            <div className="live-tag">
              <span className="live-dot" /> Real-Time Urban Mobility
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* EMERGENCY SOS SAFETY TRIGGER */}
          <button className="icon-btn sos-header-btn" onClick={() => setSosModalOpen(true)} title="Emergency SOS">
            <ShieldAlert size={18} /> SOS
          </button>

          {response && (
            <button className="icon-btn" onClick={() => setExportModalOpen(true)} title="Export & Share Route">
              <Share2 size={18} />
            </button>
          )}

          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme (Dark / Light)">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Profile & Preferences">
            <User size={18} />
          </button>
        </div>
      </header>

      {/* EMERGENCY SOS MODAL */}
      <EmergencySOSModal
        open={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        currentCoords={originCoords}
      />

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

      {/* TAB 1: HOME TAB */}
      {activeTab === 'home' && (
        <div style={{ padding: '16px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          {/* DAILY ECO STREAK & WELCOME BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #111111 0%, #1c1c1e 100%)',
            borderRadius: '24px',
            padding: '24px',
            color: '#ffffff',
            marginBottom: '20px',
            border: '1px solid rgba(229, 0, 16, 0.25)',
            boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229, 0, 16, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#e50010', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                H&M EDITORIAL EDITION • URBAN COMPANION
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '6px 0 8px 0', letterSpacing: '-0.02em' }}>Where would you like to explore?</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '16px', fontWeight: 700, color: '#fafaf9' }}>
                  <Flame size={14} color="#e50010" /> 7 Day Streak
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '16px', fontWeight: 700, color: '#fafaf9' }}>
                  <Zap size={14} color="#c59b27" /> 34.8kg CO₂ Saved
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('ai_chat')}
              style={{
                background: '#e50010',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 18px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(229, 0, 16, 0.4)',
                whiteSpace: 'nowrap',
                position: 'relative',
                zIndex: 1,
                transition: 'transform 0.2s ease, background 0.2s ease'
              }}
            >
              <Sparkles size={16} /> Ask AI Concierge
            </button>
          </div>

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

          {/* QUICK DESTINATION PRESETS */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Quick Route Suggestions
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
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
        </div>
      )}

      {/* ERROR BANNER */}
      {error && (
        <div className="error-banner" style={{ margin: '16px 28px 0 28px', borderRadius: '12px' }}>
          {error}
        </div>
      )}

      {/* SKELETON LOADER */}
      {loading && <SkeletonLoader />}

      {/* TAB 2: ROUTES & MAP VIEW */}
      {activeTab === 'routes' && !loading && (
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '16px' }}>
          {!response ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <Compass size={40} />
              </div>
              <h2>No Active Route Selected</h2>
              <p>Enter your origin & destination on the Home tab to view turn-by-turn navigation, interactive maps, and live conditions.</p>
              <button className="btn-primary" onClick={() => setActiveTab('home')} style={{ maxWidth: '200px' }}>
                Go to Route Planner
              </button>
            </div>
          ) : (
            <div className="dashboard-content" style={{ padding: 0 }}>
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
        </div>
      )}

      {/* TAB 3: URBAN AI CHATBOT */}
      {activeTab === 'ai_chat' && (
        <div style={{ padding: '16px', width: '100%' }}>
          <AIChatbot onSelectRoutePrompt={(promptText) => handleQuery({ text: promptText })} />
        </div>
      )}

      {/* TAB 4: ECO ANALYTICS STATS */}
      {activeTab === 'eco_stats' && (
        <div style={{ padding: '16px', width: '100%' }}>
          <EcoAnalyticsTab />
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <VoiceAssistant onVoiceRoute={handleVoiceRoute} currentOrigin={originName} currentDest={destName} />
      <MobileBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}
