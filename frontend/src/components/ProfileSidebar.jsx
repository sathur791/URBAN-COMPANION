import { useState, useEffect } from 'react';
import { History, ChevronLeft, ChevronRight, Settings, LogOut, User } from 'lucide-react';
import { user } from '../api';

export default function ProfileSidebar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    if (open && !profile) {
      user.getProfile().then(r => setProfile(r.data)).catch(() => {});
      user.getTrips().then(r => setTrips(r.data)).catch(() => {});
      user.getPreferences().then(r => setPreferences(r.data)).catch(() => {});
    }
  }, [open, profile]);

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        {open ? <ChevronRight size={20} /> : <User size={20} />}
      </button>

      <div className={`profile-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Profile</h3>
          <button onClick={() => setOpen(false)}><ChevronLeft size={18} /></button>
        </div>

        {profile && (
          <div className="profile-info">
            <div className="avatar">{profile.username?.[0]?.toUpperCase()}</div>
            <strong>{profile.username}</strong>
            <span>{profile.email}</span>
          </div>
        )}

        <div className="sidebar-section">
          <h4><History size={14} /> Recent Queries</h4>
          <div className="trip-list">
            {trips.length === 0 && <p className="empty-text">No trips yet</p>}
            {trips.slice(0, 5).map(t => (
              <div key={t.id} className="trip-item">
                <span className="trip-mode">{t.mode || 'trip'}</span>
                <span className="trip-date">{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h4><Settings size={14} /> Preferences</h4>
          <div className="pref-list">
            {preferences.length === 0 && <p className="empty-text">No preferences set</p>}
            {preferences.map(p => (
              <div key={p.id} className="pref-item">
                <span className="pref-key">{p.preference_key}</span>
                <span className="pref-val">{typeof p.preference_value === 'object' ? JSON.stringify(p.preference_value) : String(p.preference_value)}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );
}
