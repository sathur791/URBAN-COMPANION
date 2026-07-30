import { Home, Map, Mic, AlertCircle, User } from 'lucide-react';
import './MobileBottomNav.css';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'முகப்பு', icon: Home },
    { id: 'map', label: 'வரைபடம்', icon: Map },
    { id: 'ai_chat', label: 'AI குரல்', icon: Mic, hasBadge: true },
    { id: 'complaints', label: 'புகார்கள்', icon: AlertCircle },
    { id: 'profile', label: 'சுயவிவரம்', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="icon-wrapper">
              <Icon size={20} />
              {item.hasBadge && !isActive && <span className="badge-dot" />}
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
