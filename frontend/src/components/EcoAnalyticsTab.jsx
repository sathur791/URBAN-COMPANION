import { Award, Flame, Leaf, Zap, TrendingDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function EcoAnalyticsTab() {
  const ecoData = [
    { mode: 'Car', co2: 2.4, color: '#ef4444' },
    { mode: 'Rideshare', co2: 1.8, color: '#f59e0b' },
    { mode: 'Bus', co2: 0.6, color: '#0ea5e9' },
    { mode: 'Metro', co2: 0.3, color: '#3b82f6' },
    { mode: 'E-Bike/Walk', co2: 0.0, color: '#10b981' },
  ];

  const badges = [
    { title: 'Zero Carbon Hero', desc: 'Saved over 25 kg of CO₂ emissions', icon: Leaf, unlocked: true },
    { title: '7-Day Green Streak', desc: 'Commuted eco-friendly 7 days in a row', icon: Flame, unlocked: true },
    { title: 'Night Safety Scout', desc: 'Completed 5 high safety score evening trips', icon: ShieldCheck, unlocked: true },
    { title: 'Public Transit Champion', desc: 'Used Metro/Bus for 10 trips this month', icon: Zap, unlocked: false },
  ];

  return (
    <div className="eco-analytics-container">
      {/* ECO HERO HEADER CARD */}
      <div className="eco-hero-card">
        <div className="eco-badge-header">
          <div className="badge-level">
            <Award size={24} color="#10b981" />
            <div>
              <h3>Green Urbanite Level 4</h3>
              <span className="subtitle">Eco Mobility Pioneer</span>
            </div>
          </div>
          <div className="streak-badge">
            <Flame size={18} color="#f97316" /> 7 Day Streak
          </div>
        </div>

        <div className="eco-stats-grid">
          <div className="eco-stat-box">
            <div className="stat-icon green">
              <Leaf size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">34.8 kg</span>
              <span className="stat-label">Total CO₂ Saved</span>
            </div>
          </div>

          <div className="eco-stat-box blue">
            <div className="stat-icon blue">
              <TrendingDown size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">-68%</span>
              <span className="stat-label">Carbon Cut</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARBON FOOTPRINT COMPARISON */}
      <div className="eco-chart-card">
        <div className="card-section-title">
          <Leaf size={18} color="#10b981" />
          <h4>Commute Carbon Footprint (kg CO₂ / 10km)</h4>
        </div>
        <div style={{ width: '100%', height: 200, marginTop: '12px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ecoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="mode" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="co2" radius={[6, 6, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACHIEVEMENTS & BADGES */}
      <div className="eco-badges-section">
        <h4>Green Commute Badges</h4>
        <div className="badges-list">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon-box">
                  <Icon size={20} />
                </div>
                <div className="badge-info">
                  <h5>{badge.title}</h5>
                  <p>{badge.desc}</p>
                </div>
                {badge.unlocked && <CheckCircle2 size={18} color="#10b981" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
