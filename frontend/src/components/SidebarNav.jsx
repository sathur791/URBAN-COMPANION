import React from 'react';
import {
  LayoutDashboard,
  Bot,
  AlertCircle,
  Landmark,
  ShieldAlert,
  Car,
  ParkingCircle,
  Bus,
  Sun,
  Leaf,
  BarChart3,
  Bell,
  Trophy,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sparkles,
  MapPin
} from 'lucide-react';
import './SidebarNav.css';

export default function SidebarNav({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenSos,
  theme,
  toggleTheme,
  onLogout
}) {
  const menuSections = [
    {
      title: 'கட்டளை & AI (Command & AI)',
      items: [
        { id: 'home', label: 'முகப்பு (Dashboard)', icon: LayoutDashboard },
        { id: 'ai_chat', label: 'AI உதவி (AI Assistant)', icon: Bot, badge: 'தமிழ் AI' },
        { id: 'complaints', label: 'புகார்கள் (Complaints)', icon: AlertCircle },
      ]
    },
    {
      title: 'சேவைகள் & போக்குவரத்து (Services & Mobility)',
      items: [
        { id: 'gov_services', label: 'அரசு சேவைகள் (e-Sevai)', icon: Landmark },
        { id: 'emergency', label: '108 அவசரம் (Emergency)', icon: ShieldAlert },
        { id: 'traffic', label: 'போக்குவரத்து (Traffic)', icon: Car },
        { id: 'parking', label: 'பார்க்கிங் (Parking)', icon: ParkingCircle },
        { id: 'transit', label: 'MTC & CMRL பஸ்/மெட்ரோ', icon: Bus },
      ]
    },
    {
      title: 'தரவு & பகுப்பாய்வு (Vitals & Analytics)',
      items: [
        { id: 'weather', label: 'வானிலை (Weather)', icon: Sun },
        { id: 'environment', label: 'சுற்றுச்சூழல் (AQI)', icon: Leaf },
        { id: 'analytics', label: 'பகுப்பாய்வு (Analytics)', icon: BarChart3 },
        { id: 'notifications', label: 'அறிவிப்புகள் (Notifs)', icon: Bell, badge: 'TN Live' },
        { id: 'rewards', label: 'விருதுகள் (Rewards)', icon: Trophy },
      ]
    },
    {
      title: 'அமைப்புகள் (System)',
      items: [
        { id: 'settings', label: 'அமைப்புகள் (Settings)', icon: Settings },
        { id: 'help', label: 'உதவி (Help)', icon: HelpCircle },
        { id: 'about', label: 'பற்றி (About)', icon: Info },
      ]
    }
  ];

  return (
    <aside className={`sidebar-nav ${isCollapsed ? 'collapsed' : ''}`}>
      {/* BRAND LOGO HEADER */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <Sparkles size={22} />
        </div>
        {!isCollapsed && (
          <div className="brand-details">
            <h2 className="brand-name">TN SMART CITY OS</h2>
            <span className="brand-sub">தமிழ்நாடு நகர்ப்புற சேவை</span>
          </div>
        )}
        <button
          className="collapse-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION ITEMS */}
      <nav className="sidebar-menu">
        {menuSections.map((section, idx) => (
          <React.Fragment key={idx}>
            {!isCollapsed && <div className="sidebar-section-label">{section.title}</div>}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (item.id === 'emergency') {
                      onOpenSos && onOpenSos();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="link-icon-container">
                    <Icon size={18} />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="link-label">{item.label}</span>
                      {item.badge && <span className="link-badge">{item.badge}</span>}
                    </>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="sidebar-footer">
        <button
          className="sidebar-action-btn sos-btn"
          onClick={onOpenSos}
          title="Emergency 108 Safety SOS"
        >
          <ShieldAlert size={18} />
          {!isCollapsed && <span style={{ marginLeft: 8 }}>108 அவசரம் (SOS)</span>}
        </button>

        <button
          className="sidebar-action-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Obsidian Dark'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!isCollapsed && (
            <span style={{ marginLeft: 8 }}>{theme === 'dark' ? 'Light Theme' : 'Obsidian Theme'}</span>
          )}
        </button>

        {onLogout && (
          <button
            className="sidebar-action-btn logout-btn"
            onClick={onLogout}
            title="Log Out"
          >
            <LogOut size={18} />
            {!isCollapsed && <span style={{ marginLeft: 8 }}>வெளியேறு (Logout)</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
