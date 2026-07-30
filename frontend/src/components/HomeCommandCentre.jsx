import { useState } from 'react';
import {
  Sparkles,
  Search,
  Mic,
  Sun,
  Wind,
  Car,
  ShieldAlert,
  Droplets,
  Zap,
  Activity,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ParkingCircle,
  Bus,
  AlertCircle,
  Landmark,
  Radio
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './HomeCommandCentre.css';

// Mini mockup data for graphs
const sparklineData = [
  { val: 32 }, { val: 34 }, { val: 35 }, { val: 33 }, { val: 34 }, { val: 32 }
];
const trafficSparkline = [
  { val: 50 }, { val: 75 }, { val: 90 }, { val: 65 }, { val: 45 }, { val: 38 }
];

export default function HomeCommandCentre({ onNavigate, onReportIssue, onOpenVoice }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai (சென்னை)');

  const tnCities = [
    'Chennai (சென்னை)',
    'Coimbatore (கோவை)',
    'Madurai (மதுரை)',
    'Tiruchirappalli (திருச்சி)',
    'Salem (சேலம்)',
    'Tirunelveli (திருநெல்வேலி)'
  ];

  const suggestedPrompts = [
    'MTC Bus timing from Anna Nagar to Central Station?',
    'சென்னை அண்ணா சாலையில் மழைநீர் தேக்கம் உள்ளதா?',
    'Pay TANGEDCO EB bill online via e-Sevai',
    'Where is available parking near T. Nagar Usman Road?'
  ];

  return (
    <div className="command-centre-container">
      {/* 1. HERO AI COMMAND BANNER */}
      <div className="hero-ai-banner">
        <div className="hero-ai-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="hero-ai-orb-mini">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="hero-ai-badge">தமிழ்நாடு AI உதவி எஞ்சின்</span>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                வணக்கம்! How can I assist your TN city today?
              </h2>
            </div>
          </div>

          {/* City Switcher Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={18} color="#fb8c00" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                background: 'rgba(18, 20, 31, 0.9)',
                border: '1px solid rgba(251, 140, 0, 0.4)',
                color: '#fdd835',
                padding: '6px 14px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {tnCities.map((city, i) => (
                <option key={i} value={city} style={{ background: '#12141f', color: '#fff' }}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Animated Search Bar with Voice Waveform */}
        <div className="hero-search-wrapper">
          <Search size={20} color="#94a3b8" />
          <input
            className="hero-search-input"
            type="text"
            placeholder="Search MTC buses, TANGEDCO bills, AQI, GCC complaints or speak in Tamil..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="hero-waveform-btn" onClick={onOpenVoice}>
            <Mic size={16} /> தமிழ் குரல் (Voice)
          </button>
        </div>

        {/* Suggested Prompts */}
        <div className="suggested-pills-row">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="suggested-pill"
              onClick={() => {
                setSearchQuery(prompt);
                onNavigate && onNavigate('ai_chat');
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TODAY'S CITY STATUS BAR (TAMIL NADU SPECIFIC) */}
      <div className="city-status-banner">
        <div className="status-stat-item">
          <div className="status-icon-glow" style={{ background: 'var(--gradient-fire)' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              TN City Health Score
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fdd835' }}>
              95 / 100 <span style={{ fontSize: 12, color: '#10b981' }}>+3.1%</span>
            </div>
          </div>
        </div>

        <div className="status-stat-item">
          <div className="status-icon-glow" style={{ background: 'rgba(251, 140, 0, 0.2)', color: '#fb8c00' }}>
            <Sun size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Weather ({selectedCity.split(' ')[0]})
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>32°C Humid / Sunny</div>
          </div>
        </div>

        <div className="status-stat-item">
          <div className="status-icon-glow" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <Wind size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Air Quality (AQI)
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>52 Moderate</div>
          </div>
        </div>

        <div className="status-stat-item">
          <div className="status-icon-glow" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              108 Emergency Patrol
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>Ready (தயார்)</div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS ROW */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em', color: '#94a3b8' }}>
          விரைவு சேவைகள் (QUICK CIVIC ACTIONS)
        </h3>
        <div className="quick-actions-row">
          <button className="quick-action-chip" onClick={onReportIssue}>
            <AlertCircle size={18} color="#ef4444" /> புகார் பதிவு (Report Complaint)
          </button>
          <button className="quick-action-chip" onClick={() => onNavigate('map')}>
            <MapPin size={18} color="#fb8c00" /> தமிழ்நாடு வரைபடம் (TN Map)
          </button>
          <button className="quick-action-chip" onClick={() => onNavigate('gov_services')}>
            <Landmark size={18} color="#8b5cf6" /> TN e-Sevai & TANGEDCO
          </button>
          <button className="quick-action-chip" onClick={() => onNavigate('transit')}>
            <Bus size={18} color="#06b6d4" /> MTC பஸ் & CMRL மெட்ரோ
          </button>
          <button className="quick-action-chip" onClick={() => onNavigate('parking')}>
            <ParkingCircle size={18} color="#fdd835" /> ஸ்மார்ட் பார்க்கிங்
          </button>
        </div>
      </div>

      {/* 4. DASHBOARD CARDS GRID */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.01em', color: '#94a3b8' }}>
          TAMIL NADU LIVE MUNICIPAL CARDS
        </h3>
        <div className="dashboard-cards-grid">
          {/* Weather Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg, #fb8c00, #fdd835)' }}>
                <Sun size={24} />
              </div>
              <span className="dash-card-title">வானிலை (Weather)</span>
            </div>
            <div className="dash-card-value">32°C</div>
            <div className="dash-card-sub">Humidity: 68% • Coastal Breeze Active</div>
            <div style={{ height: 40, width: '100%', marginTop: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="val" stroke="#fdd835" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AQI Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Wind size={24} />
              </div>
              <span className="dash-card-title">காற்று தரம் (AQI)</span>
            </div>
            <div className="dash-card-value" style={{ color: '#10b981' }}>52 AQI</div>
            <div className="dash-card-sub">PM2.5: 12.4 µg/m³ • Moderate Air Quality</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8, marginTop: 12 }}>
              <div style={{ width: '76%', height: '100%', background: '#10b981', borderRadius: 99 }} />
            </div>
          </div>

          {/* Traffic Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg, #e53935, #fb8c00)' }}>
                <Car size={24} />
              </div>
              <span className="dash-card-title">அண்ணா சாலை (Traffic)</span>
            </div>
            <div className="dash-card-value" style={{ color: '#fb8c00' }}>38 km/h</div>
            <div className="dash-card-sub">Anna Salai & Guindy Traffic Flowing</div>
            <div style={{ height: 40, width: '100%', marginTop: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficSparkline}>
                  <Bar dataKey="val" fill="#fb8c00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emergency Status Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
                <ShieldAlert size={24} />
              </div>
              <span className="dash-card-title">108 ஆம்புலன்ஸ் (108 SOS)</span>
            </div>
            <div className="dash-card-value" style={{ color: '#10b981' }}>108 Active</div>
            <div className="dash-card-sub">TN Dispatch Units: 24 Ready • Response ~5 min</div>
            <button
              style={{
                marginTop: 8,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12
              }}
              onClick={onReportIssue}
            >
              108 Emergency Alert
            </button>
          </div>

          {/* Water Supply Card (CMWSSB) */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                <Droplets size={24} />
              </div>
              <span className="dash-card-title">CMWSSB குடிநீர் (Water)</span>
            </div>
            <div className="dash-card-value" style={{ color: '#06b6d4' }}>96% Pressure</div>
            <div className="dash-card-sub">Chembarambakkam & Poondi Reservoirs: 88%</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8, marginTop: 12 }}>
              <div style={{ width: '88%', height: '100%', background: '#06b6d4', borderRadius: 99 }} />
            </div>
          </div>

          {/* TANGEDCO Power Grid Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg, #fdd835, #fb8c00)' }}>
                <Zap size={24} />
              </div>
              <span className="dash-card-title">TANGEDCO மின்சாரம் (Power)</span>
            </div>
            <div className="dash-card-value" style={{ color: '#fdd835' }}>Grid Normal</div>
            <div className="dash-card-sub">0 Power Cuts Reported • Solar Wind 45MW</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8, marginTop: 12 }}>
              <div style={{ width: '100%', height: '100%', background: '#fdd835', borderRadius: 99 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
