import { User, Trophy, ShieldCheck, Award, Star, Settings, LogOut, Edit3 } from 'lucide-react';
import './ProfileScreen.css';

export default function ProfileScreen({ onLogout, onNavigate }) {
  const badges = [
    { title: 'Anna Salai Sentinel', icon: ShieldCheck, color: '#e53935' },
    { title: 'GCC Pothole Patrol', icon: Trophy, color: '#fb8c00' },
    { title: 'TN Eco Champion', icon: Star, color: '#10b981' },
    { title: 'e-Sevai Pioneer', icon: Award, color: '#fdd835' }
  ];

  return (
    <div className="profile-container">
      {/* 1. HERO USER CARD */}
      <div className="profile-hero-card">
        <div className="avatar-glow-ring">
          <div className="avatar-img-placeholder">
            <User size={48} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: 11,
              background: 'rgba(253, 216, 53, 0.2)',
              color: '#fdd835',
              padding: '4px 12px',
              borderRadius: 99,
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Tier 4 TN Urban Guardian (தமிழ்நாடு)
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', marginTop: 6 }}>Karthik Sundaram</h2>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>karthik.s@tn.gov.in • Chennai, Tamil Nadu</p>
        </div>

        <button
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          onClick={() => alert('Edit Profile modal opened')}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="profile-stats-grid">
        <div className="stat-box">
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>GCC / TN Complaints</span>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ffffff' }}>14 Tickets</div>
        </div>

        <div className="stat-box">
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>Issues Resolved</span>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>12 Verified</div>
        </div>

        <div className="stat-box">
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase' }}>Civic Karma Points</span>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fdd835' }}>1,850 pts</div>
        </div>
      </div>

      {/* 3. ACHIEVEMENTS & BADGES */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, color: '#ffffff' }}>
          தமிழ்நாடு சமூக விருதுகள் (TN Achievements)
        </h3>
        <div className="badges-grid">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="badge-card">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `${b.color}20`,
                    color: b.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{b.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. QUICK LINKS */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button
          style={{
            flex: 1,
            background: 'rgba(18, 20, 31, 0.8)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '14px',
            borderRadius: 16,
            color: '#ffffff',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          onClick={() => onNavigate && onNavigate('settings')}
        >
          <Settings size={18} /> அமைப்புகள் (Settings)
        </button>

        <button
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '14px 24px',
            borderRadius: 16,
            color: '#f87171',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          onClick={onLogout}
        >
          <LogOut size={18} /> வெளியேறு (Log Out)
        </button>
      </div>
    </div>
  );
}
