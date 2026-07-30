import { useState } from 'react';
import SidebarNav from './SidebarNav';
import MobileBottomNav from './MobileBottomNav';
import FloatingActionButton from './FloatingActionButton';
import EmergencySOSModal from './EmergencySOSModal';

// Screens
import HomeCommandCentre from './HomeCommandCentre';
import AIAssistantScreen from './AIAssistantScreen';
import SmartMapView from './SmartMapView';
import ComplaintsScreen from './ComplaintsScreen';
import GovServicesScreen from './GovServicesScreen';
import NotificationCentre from './NotificationCentre';
import AnalyticsScreen from './AnalyticsScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import RewardsScreen from './RewardsScreen';

import { ShieldAlert, Sun, Moon, User, Bell } from 'lucide-react';

export default function Dashboard({ onLogout, theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeCommandCentre
            onNavigate={(tab) => setActiveTab(tab)}
            onReportIssue={() => setActiveTab('complaints')}
            onOpenVoice={() => setActiveTab('ai_chat')}
          />
        );
      case 'ai_chat':
        return <AIAssistantScreen />;
      case 'map':
      case 'traffic':
      case 'parking':
      case 'transit':
        return <SmartMapView />;
      case 'complaints':
        return <ComplaintsScreen />;
      case 'gov_services':
        return <GovServicesScreen />;
      case 'notifications':
        return <NotificationCentre />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={onLogout} onNavigate={(t) => setActiveTab(t)} />;
      case 'settings':
        return <SettingsScreen theme={theme} toggleTheme={toggleTheme} />;
      case 'rewards':
        return <RewardsScreen />;
      default:
        return (
          <HomeCommandCentre
            onNavigate={(tab) => setActiveTab(tab)}
            onReportIssue={() => setActiveTab('complaints')}
            onOpenVoice={() => setActiveTab('ai_chat')}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* DESKTOP SIDEBAR NAVIGATION (17 Items) */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenSos={() => setSosModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT CONTAINER */}
      <div
        style={{
          flex: 1,
          marginLeft: isSidebarCollapsed ? '76px' : '260px',
          transition: 'margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingBottom: '80px'
        }}
      >
        {/* HEADER BAR */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 900,
            height: '76px',
            background: 'rgba(10, 11, 16, 0.88)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'var(--gradient-fire)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              TN Smart City OS
            </h1>
            <span
              style={{
                fontSize: 11,
                background: 'rgba(251, 140, 0, 0.15)',
                color: '#fdd835',
                padding: '4px 10px',
                borderRadius: 99,
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              தமிழ்நாடு அரசு (Live)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '8px 16px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={() => setSosModalOpen(true)}
            >
              <ShieldAlert size={18} /> 108 அவசரம்
            </button>

            <button
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                width: 40,
                height: 40,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('notifications')}
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            <button
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                width: 40,
                height: 40,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                width: 40,
                height: 40,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('profile')}
              title="Profile"
            >
              <User size={18} />
            </button>
          </div>
        </header>

        {/* ACTIVE SCREEN CONTENT */}
        <main style={{ flex: 1 }}>{renderActiveScreen()}</main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION (5 Items) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* FLOATING ACTION BUTTON (FAB) */}
      <FloatingActionButton
        onReportIssue={() => setActiveTab('complaints')}
        onVoiceAi={() => setActiveTab('ai_chat')}
        onSos={() => setSosModalOpen(true)}
      />

      {/* EMERGENCY SOS MODAL */}
      <EmergencySOSModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
    </div>
  );
}
