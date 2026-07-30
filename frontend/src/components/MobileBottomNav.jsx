import { Home, MapPin, Mic, Leaf, User } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'routes', label: 'Routes', icon: MapPin },
    { id: 'ai_chat', label: 'Voice AI', icon: Mic, badge: 'Voice' },
    { id: 'eco_stats', label: 'Eco Stats', icon: Leaf },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="icon-container">
              <Icon size={20} />
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
