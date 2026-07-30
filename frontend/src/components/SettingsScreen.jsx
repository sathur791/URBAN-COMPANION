import { useState } from 'react';
import { Sun, Moon, Volume2, Bell, Shield, Globe, Eye, Palette, Info } from 'lucide-react';
import './SettingsScreen.css';

export default function SettingsScreen({ theme, toggleTheme }) {
  const [language, setLanguage] = useState('English');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="settings-container">
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>System & App Settings</h2>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
          Customize design theme, voice assistant parameters, notifications, and accessibility.
        </p>
      </div>

      {/* 1. APPEARANCE & THEME */}
      <div className="settings-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
          <Palette size={18} color="#fb8c00" /> Appearance & Theme
        </h3>

        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#ffffff' }}>Obsidian Dark / Light Mode</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Toggle app interface theme</div>
          </div>
          <button
            style={{
              background: 'var(--gradient-fire)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Theme' : 'Obsidian Dark'}
          </button>
        </div>

        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#ffffff' }}>Accent Color Palette</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Red-Orange Fire vs Obsidian Cyan</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fdd835' }}>
            🔴 Fire Accent (Active)
          </span>
        </div>
      </div>

      {/* 2. VOICE & AI CONTROLS */}
      <div className="settings-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
          <Volume2 size={18} color="#fdd835" /> Grok Voice AI Settings
        </h3>

        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#ffffff' }}>Auto-Speak AI Responses</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Read answers aloud via neural TTS</div>
          </div>
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={() => setAutoSpeak(!autoSpeak)}
            style={{ width: 20, height: 20, cursor: 'pointer' }}
          />
        </div>

        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#ffffff' }}>App Language</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Multilingual NLP engine</div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: '#1b1f2e',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 10,
              fontSize: 13
            }}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>Hindi</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
      </div>

      {/* 3. NOTIFICATIONS & ACCESSIBILITY */}
      <div className="settings-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
          <Bell size={18} color="#ef4444" /> Push Notifications & Alerts
        </h3>

        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#ffffff' }}>Critical Emergency Alerts</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Flash flood, traffic, and SOS broadcasts</div>
          </div>
          <input
            type="checkbox"
            checked={pushNotifs}
            onChange={() => setPushNotifs(!pushNotifs)}
            style={{ width: 20, height: 20, cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* ABOUT */}
      <div className="settings-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Info size={18} color="#94a3b8" />
          <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>
            Urban Companion OS v3.2.0 • Grok AI Engine
          </span>
        </div>
      </div>
    </div>
  );
}
