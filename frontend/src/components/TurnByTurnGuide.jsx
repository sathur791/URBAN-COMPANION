import { useState } from 'react';
import { Navigation, ChevronDown, ChevronUp } from 'lucide-react';

export default function TurnByTurnGuide({ steps }) {
  const [expanded, setExpanded] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: '15px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
          <Navigation size={18} />
          <span>Turn-by-Turn Directions ({steps.length} steps)</span>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '8px 12px',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '11px',
                flexShrink: 0
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {step.instruction || 'Continue on route'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {step.distance_m > 1000 ? `${(step.distance_m / 1000).toFixed(1)} km` : `${step.distance_m} m`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
