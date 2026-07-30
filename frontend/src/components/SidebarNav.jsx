import React from 'react';
import { 
  Compass, 
  Mic, 
  Bot, 
  Leaf, 
  Clock, 
  Navigation, 
  BarChart3, 
  User, 
  ShieldAlert, 
  Sun, 
  Moon, 
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './SidebarNav.css';

export default function SidebarNav({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  onOpenSos,
  onOpenProfile,
  theme,
  toggleTheme,
  onLogout
}) {
  const navItems = [
    { id: 'home', label: 'Planner & Map', icon: Compass, badge: 'Live' },
    { id: 'ai_chat', label: 'AI Voice Companion', icon: Mic, badge: 'Voice AI' },
    { id: 'eco_stats', label: 'Eco Analytics', icon: Leaf },
    { id: 'departure', label: 'Departure Window', icon: Clock },
    { id: 'navigation', label: 'Turn-by-Turn', icon: Navigation },
    { id: 'explainability', label: 'ML Insights', icon: BarChart3 },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  return (
    <aside className={`sidebar-nav ${isCollapsed ? 'collapsed' : ''}`}>
      {/* BRAND LOGO HEADER */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <Sparkles size={20} className="brand-glow-icon" />
        </div>
        {!isCollapsed && (
          <div className="brand-details">
            <h2 className="brand-name">URBAN COMPANION</h2>
            <span className="brand-sub">AI Mobility Operating System</span>
          </div>
        )}
        <button 
          className="collapse-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* GROK ENGINE BADGE */}
      {!isCollapsed && (
        <div className="grok-engine-pill">
          <span className="grok-pulse-dot"></span>
          <span>Grok AI Engine Active</span>
        </div>
      )}

      {/* NAVIGATION ITEMS LIST */}
      <nav className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="link-icon-container">
                <Icon size={20} />
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
      </nav>

      {/* SIDEBAR FOOTER ACTIONS */}
      <div className="sidebar-footer">
        {/* SOS EMERGENCY BUTTON */}
        <button 
          className="sidebar-action-btn sos-btn"
          onClick={onOpenSos}
          title="Emergency Safety SOS"
        >
          <ShieldAlert size={18} />
          {!isCollapsed && <span>Emergency SOS</span>}
        </button>

        {/* THEME TOGGLE */}
        <button 
          className="sidebar-action-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!isCollapsed && <span>{theme === 'dark' ? 'Light Theme' : 'Obsidian Theme'}</span>}
        </button>

        {/* LOGOUT */}
        {onLogout && (
          <button 
            className="sidebar-action-btn logout-btn"
            onClick={onLogout}
            title="Log Out"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
