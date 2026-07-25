import { Clock, Zap, CheckCircle2 } from 'lucide-react';

export default function DepartureOptimizer({ windows }) {
  if (!windows || windows.length === 0) return null;

  const bestWindow = windows.find(w => w.is_recommended) || windows[0];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} style={{ color: 'var(--primary)' }} />
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Smart Departure Window
          </h4>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Zap size={12} /> AI Traffic Forecast
        </span>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Optimal departure choice: <strong style={{ color: 'var(--accent-emerald)' }}>{bestWindow.label}</strong> ({bestWindow.est_travel_time} mins estimated travel time).
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
        gap: '8px'
      }}>
        {windows.map((w, idx) => {
          const isSelected = w.is_recommended;
          const bg = isSelected ? 'var(--primary)' : 'var(--bg-main)';
          const color = isSelected ? 'white' : 'var(--text-primary)';
          const subColor = isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)';

          return (
            <div
              key={idx}
              style={{
                background: bg,
                color: color,
                borderRadius: 'var(--radius-md)',
                padding: '10px 8px',
                textAlign: 'center',
                border: isSelected ? 'none' : '1px solid var(--border-color)',
                boxShadow: isSelected ? '0 4px 12px var(--primary-glow)' : 'none',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-4px',
                  background: 'var(--accent-emerald)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={12} />
                </div>
              )}

              <div style={{ fontSize: '11px', fontWeight: 700 }}>{w.label}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0' }}>{w.est_travel_time}m</div>
              <div style={{ fontSize: '10px', color: subColor, textTransform: 'capitalize' }}>
                {w.traffic_level} traffic
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
