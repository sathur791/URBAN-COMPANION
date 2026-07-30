import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line
} from 'recharts';
import { Activity, TrendingUp, BarChart3, PieChart as PieIcon, Zap } from 'lucide-react';
import './AnalyticsScreen.css';

const issueDistributionData = [
  { name: 'GCC Potholes & Drainage', value: 45, color: '#e53935' },
  { name: 'CMWSSB Water Supply', value: 25, color: '#06b6d4' },
  { name: 'TANGEDCO Power Grid', value: 18, color: '#fdd835' },
  { name: 'MTC & Traffic Signals', value: 12, color: '#10b981' },
];

const deptPerformanceData = [
  { dept: 'GCC Chennai', resolved: 284, avgHours: 2.8 },
  { dept: 'TANGEDCO', resolved: 195, avgHours: 1.5 },
  { dept: 'CMWSSB Water', resolved: 160, avgHours: 3.1 },
  { dept: 'MTC Transit', resolved: 120, avgHours: 1.2 },
];

const trendLineData = [
  { day: 'Mon', responseHours: 4.8 },
  { day: 'Tue', responseHours: 4.2 },
  { day: 'Wed', responseHours: 3.5 },
  { day: 'Thu', responseHours: 2.9 },
  { day: 'Fri', responseHours: 2.4 },
  { day: 'Sat', responseHours: 2.1 },
  { day: 'Sun', responseHours: 1.9 },
];

export default function AnalyticsScreen() {
  return (
    <div className="analytics-container">
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
          தமிழ்நாடு நகர்ப்புற தரவு பகுப்பாய்வு (TN Analytics Engine)
        </h2>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
          SLA benchmarks and resolution trends for GCC, TANGEDCO, CMWSSB, and MTC Transit.
        </p>
      </div>

      {/* TOP STATS GAUGE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              TN Smart City Health Score
            </span>
            <Activity size={20} color="#fdd835" />
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fdd835' }}>
            95 / 100
          </div>
          <p style={{ fontSize: 12, color: '#10b981' }}>+3.1% overall municipal efficiency</p>
        </div>

        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Avg Complaint Resolution Time
            </span>
            <TrendingUp size={20} color="#fb8c00" />
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#fb8c00' }}>
            1.9 Hours
          </div>
          <p style={{ fontSize: 12, color: '#10b981' }}>-45 min reduction across TN districts</p>
        </div>

        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              GCC & TN Resolved Tickets
            </span>
            <Zap size={20} color="#e53935" />
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#ffffff' }}>
            759 Tickets
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>98.6% AI verification accuracy</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="analytics-charts-grid">
        {/* Issue Distribution Pie Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PieIcon size={20} color="#fb8c00" />
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>TN Department Issue Breakdown</h3>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={issueDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                  {issueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance Bar Chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart3 size={20} color="#fdd835" />
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Corporations Resolved Tickets</h3>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData}>
                <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="resolved" fill="#fb8c00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Trend Line Chart */}
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={20} color="#e53935" />
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Weekly Resolution Speed Trend (Hours)</h3>
          </div>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendLineData}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="responseHours" stroke="#e53935" strokeWidth={3} dot={{ r: 5, fill: '#fdd835' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
