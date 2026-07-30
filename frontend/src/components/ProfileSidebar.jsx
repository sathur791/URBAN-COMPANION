import { useState, useEffect } from 'react';
import { History, X, Settings, LogOut, User, Check, SlidersHorizontal, MapPin, Key, Cpu } from 'lucide-react';
import { user } from '../api';

export default function ProfileSidebar({ open, onClose, onLogout, onReQuery }) {
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [grokApiKey, setGrokApiKey] = useState(localStorage.getItem('grok_api_key') || '');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  useEffect(() => {
    if (open) {
      user.getProfile().then(r => setProfile(r.data)).catch(() => {});
      user.getTrips().then(r => setTrips(r.data)).catch(() => {});
      user.getPreferences().then(r => setPreferences(r.data)).catch(() => {});
    }
  }, [open]);

  const handleSaveGrokKey = (e) => {
    e.preventDefault();
    localStorage.setItem('grok_api_key', grokApiKey.trim());
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  const handleUpdatePref = async (key, val) => {
    setUpdatingKey(key);
    try {
      await user.updatePreference(key, val);
      const updated = await user.getPreferences();
      setPreferences(updated.data);
    } catch (e) {
      console.error('Failed to update preference', e);
    } finally {
      setUpdatingKey(null);
    }
  };

  const prefOptions = [
    { key: 'preferred_mode', label: 'Preferred Mode', options: ['drive', 'transit', 'walk', 'bike'] },
    { key: 'priority', label: 'Route Priority', options: ['fastest', 'eco', 'cheapest'] },
    { key: 'max_walk_minutes', label: 'Max Walking (Min)', options: ['5', '10', '15', '25'] },
  ];

  const getPrefVal = (key) => {
    const p = preferences.find(x => x.preference_key === key);
    return p ? (typeof p.preference_value === 'string' ? p.preference_value : JSON.stringify(p.preference_value)) : '';
  };

  if (!open) return null;

  return (
    <>
      <div className="profile-overlay" onClick={onClose} />

      <div className={`profile-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>User Settings & Grok AI</h3>
          <button className="icon-btn" onClick={onClose} style={{ width: 32, height: 32 }}>
            <X size={18} />
          </button>
        </div>

        {profile && (
          <div className="profile-info">
            <div className="avatar">{profile.username?.[0]?.toUpperCase()}</div>
            <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{profile.username}</strong>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{profile.email}</span>
          </div>
        )}

        {/* GROK API KEY CONFIGURATION */}
        <div className="sidebar-section">
          <h4><Cpu size={14} color="var(--primary)" /> Grok AI Engine Key</h4>
          <form onSubmit={handleSaveGrokKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="password"
                placeholder="Enter Grok API Key (xai-...)"
                value={grokApiKey}
                onChange={(e) => setGrokApiKey(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-violet) 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
            {savedKeySuccess && (
              <span style={{ fontSize: '11px', color: '#00f5a0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Grok API Key Saved Successfully!
              </span>
            )}
          </form>
        </div>

        <div className="sidebar-section">
          <h4><SlidersHorizontal size={14} /> Travel Preferences</h4>
          <div className="pref-list">
            {prefOptions.map(p => {
              const currentVal = getPrefVal(p.key);
              return (
                <div key={p.key} className="pref-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{p.label}</span>
                  <div style={{ display: 'flex', gap: '6px', width: '100%', flexWrap: 'wrap' }}>
                    {p.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleUpdatePref(p.key, opt)}
                        disabled={updatingKey === p.key}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          border: currentVal === opt ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                          background: currentVal === opt ? 'var(--primary-light)' : 'var(--bg-surface)',
                          color: currentVal === opt ? 'var(--primary)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sidebar-section">
          <h4><History size={14} /> Recent Trips & Queries</h4>
          <div className="trip-list">
            {trips.length === 0 && <p className="empty-text" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No past trips logged yet.</p>}
            {trips.slice(0, 8).map(t => (
              <div
                key={t.id}
                className="trip-item"
                onClick={() => onReQuery && onReQuery({ origin_name: t.origin_name, dest_name: t.dest_name, text: `Route from ${t.origin_name || 'Origin'} to ${t.dest_name || 'Destination'}` })}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.origin_name || 'Origin'} → {t.dest_name || 'Destination'}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.mode || 'transit'} · {new Date(t.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={16} /> Sign Out Account
        </button>
      </div>
    </>
  );
}
