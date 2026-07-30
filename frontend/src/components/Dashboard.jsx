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
import VoiceBotModal from './VoiceBotModal';
import WakeWordListener from './WakeWordListener';
import VoiceAssistant from './VoiceAssistant';
import SidebarNav from './SidebarNav';

import { query as queryApi } from '../api';
import { Compass, Moon, Sun, User, Share2, Car, Bus, ParkingCircle, ShieldAlert, Sparkles, Flame, Zap, Clock, Navigation, BarChart3, Bot, Leaf, Mic } from 'lucide-react';

export default function Dashboard({ onLogout, theme, toggleTheme }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Voice AI Assistant Pop-up & Wake Word State
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceInitialQuery, setVoiceInitialQuery] = useState('');
  const [wakeWordActive, setWakeWordActive] = useState(true);

  const handleWakeWordDetected = useCallback((query) => {
    setVoiceInitialQuery(query || '');
    setVoiceModalOpen(true);
  }, []);

  // Tab state ('home', 'voice', 'ai_chat', 'eco_stats', 'departure', 'navigation', 'explainability', 'profile')
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

  const handleTabChange = (tabId) => {
    if (tabId === 'voice') {
      setIsVoiceOpen(true);
    } else if (tabId === 'profile') {
      setSidebarOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenSos={() => setSosModalOpen(true)}
        onOpenProfile={() => setSidebarOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
      />

      {/* MAIN CONTAINER */}
      <div 
        style={{ 
          flex: 1, 
          marginLeft: isSidebarCollapsed ? '76px' : '260px', 
          transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
        className="main-app-content"
      >
        {/* HEADER BAR */}
        <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
          <div className="header-left">
            <div className="brand-title-group">
              <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Urban Companion
              </h1>
              <div className="live-tag" style={{ fontSize: '11px' }}>
                <span className="live-dot" /> Real-Time Mobility & Grok AI
              </div>
            </div>
          </div>

          <div className="header-right">
            {/* VOICE WAKE-WORD LISTENER STATUS BADGE */}
            <WakeWordListener
              isActive={wakeWordActive && !voiceModalOpen}
              onToggleActive={() => setWakeWordActive(!wakeWordActive)}
              onWakeWordDetected={handleWakeWordDetected}
            />

            <button className="icon-btn sos-header-btn" onClick={() => setSosModalOpen(true)} title="Emergency SOS">
              <ShieldAlert size={18} /> SOS
            </button>

            {response && (
              <button className="icon-btn" onClick={() => setExportModalOpen(true)} title="Export & Share Route">
                <Share2 size={18} />
              </button>
            )}

            <button className="icon-btn" onClick={toggleTheme} title="Toggle Obsidian Dark / Light Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Profile & Preferences">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* MODALS & DRAWERS */}
        <EmergencySOSModal open={sosModalOpen} onClose={() => setSosModalOpen(false)} currentCoords={originCoords} />
        <ExportRouteModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          originCoords={originCoords}
          destCoords={destCoords}
          originAddress={response?.origin_address || originName}
          destAddress={response?.dest_address || destName}
        />
        <ProfileSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
          onReQuery={(data) => {
            setSidebarOpen(false);
            handleQuery(data);
          }}
        />

        {/* ERROR BANNER */}
        {error && (
          <div className="error-banner" style={{ margin: '16px 28px 0 28px', borderRadius: '14px', background: 'rgba(255, 42, 95, 0.15)', border: '1px solid rgba(255, 42, 95, 0.35)', color: '#ff477e', padding: '14px 20px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* SKELETON LOADER */}
        {loading && <SkeletonLoader />}

        {/* VIEW 1: PLANNER & MAP DASHBOARD */}
        {activeTab === 'home' && !loading && (
          <div style={{ padding: '28px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
            {/* HERO BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)',
              borderRadius: '24px',
              padding: '28px 32px',
              color: 'var(--text-primary)',
              marginBottom: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md), var(--shadow-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  OBSIDIAN EDITION • GROK AI POWERED
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 10px 0', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Where would you like to explore?
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <Flame size={15} color="var(--accent-rose)" /> 7 Day Eco Streak
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <Zap size={15} color="var(--accent-amber)" /> 34.8kg CO₂ Saved
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai_chat')}
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-violet) 100%)',
                  color: '#070913',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '14px 24px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px var(--primary-glow)',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                }}
              >
                <Mic size={18} /> AI Voice Companion
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

            {/* QUICK PRESETS */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Quick Route Suggestions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div
                  className="condition-card"
                  style={{ cursor: 'pointer', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}
                  onClick={() => handleQuery({ text: 'Generate fastest route', origin_name: 'Times Square, NY', dest_name: 'Central Park, NY' })}
                >
                  <div className="condition-icon" style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '10px', borderRadius: '14px' }}>
                    <Car size={22} />
                  </div>
                  <div className="condition-info" style={{ textAlign: 'left' }}>
                    <span className="condition-label" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Times Square → Central Park</span>
                    <span className="condition-value" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Fastest Route</span>
                  </div>
                </div>

                <div
                  className="condition-card"
                  style={{ cursor: 'pointer', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}
                  onClick={() => handleQuery({ text: 'Find parking near airport', origin_name: 'Downtown', dest_name: 'JFK Airport' })}
                >
                  <div className="condition-icon" style={{ color: 'var(--accent-emerald)', background: 'rgba(0, 245, 160, 0.12)', padding: '10px', borderRadius: '14px' }}>
                    <ParkingCircle size={22} />
                  </div>
                  <div className="condition-info" style={{ textAlign: 'left' }}>
                    <span className="condition-label" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Downtown → JFK Airport</span>
                    <span className="condition-value" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Smart Parking</span>
                  </div>
                </div>

                <div
                  className="condition-card"
                  style={{ cursor: 'pointer', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}
                  onClick={() => handleQuery({ text: 'Eco transit route', origin_name: 'Grand Central', dest_name: 'Empire State Building' })}
                >
                  <div className="condition-icon" style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.12)', padding: '10px', borderRadius: '14px' }}>
                    <Bus size={22} />
                  </div>
                  <div className="condition-info" style={{ textAlign: 'left' }}>
                    <span className="condition-label" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Grand Central → Empire State</span>
                    <span className="condition-value" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Eco Transit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE ROUTE DETAILS */}
            {response && (
              <div style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Compass size={20} color="var(--primary)" /> Active Travel Recommendation
                </h3>
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
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: DEPARTURE OPTIMIZER TAB */}
        {activeTab === 'departure' && (
          <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={24} color="var(--primary)" /> Departure Window Optimization
            </h2>
            {response?.departure_windows ? (
              <DepartureOptimizer windows={response.departure_windows} />
            ) : (
              <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3>No Route Selected</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Please calculate a route on the Planner tab to view optimal departure windows.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: TURN-BY-TURN NAV TAB */}
        {activeTab === 'navigation' && (
          <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={24} color="var(--primary)" /> Turn-by-Turn Navigation Guide
            </h2>
            {response?.turn_by_turn_steps ? (
              <TurnByTurnGuide steps={response.turn_by_turn_steps} />
            ) : (
              <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3>No Active Navigation</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Search a route on the Planner tab to unlock turn-by-turn directions.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: EXPLAINABILITY & ML INSIGHTS TAB */}
        {activeTab === 'explainability' && (
          <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={24} color="var(--primary)" /> Machine Learning SHAP Explainability
            </h2>
            {response?.shap_explanations ? (
              <ExplainabilityPanel explanations={response.shap_explanations} />
            ) : (
              <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <h3>ML Insights Available After Search</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Perform a query on the Planner tab to analyze ML feature impacts.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: URBAN AI VOICE COMPANION */}
        {activeTab === 'ai_chat' && (
          <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <AIChatbot onSelectRoutePrompt={(promptText) => {
              setActiveTab('home');
              handleQuery({ text: promptText });
            }} />
          </div>
        )}

        {/* VIEW 6: ECO ANALYTICS STATS */}
        {activeTab === 'eco_stats' && (
          <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <EcoAnalyticsTab />
          </div>
        )}
      </div>

      {/* GLOBAL VOICE ASSISTANT MODAL & WAKE WORD LISTENER */}
      <VoiceAssistant
        onVoiceRoute={handleVoiceRoute}
        currentOrigin={originName}
        currentDest={destName}
        isOpen={isVoiceOpen}
        setIsOpen={setIsVoiceOpen}
      />

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* URBAN AI VOICE BOT OVERLAY MODAL */}
      <VoiceBotModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        initialQuery={voiceInitialQuery}
        onActionTrigger={(promptText) => handleQuery({ text: promptText })}
      />

      {/* FLOATING VOICE ASSISTANT BUTTON */}
      <button
        type="button"
        className="floating-voice-btn"
        onClick={() => {
          setVoiceInitialQuery('');
          setVoiceModalOpen(true);
        }}
        title="Activate Voice AI Assistant ('Say Urban AI')"
      >
        <span className="pulse-ring" />
        <Mic size={22} color="#ffffff" />
        <span className="floating-voice-label">Urban AI Voice</span>
      </button>
    </div>
  );
}
