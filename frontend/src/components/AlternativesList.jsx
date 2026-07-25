import { Clock, Map, Bus, ArrowRight } from 'lucide-react';

export default function AlternativesList({ options }) {
  if (!options || options.length === 0) return null;

  const modeIcons = {
    drive: <Map size={14} />,
    transit: <Bus size={14} />,
    walk: <Clock size={14} />,
  };

  return (
    <div className="alternatives-panel">
      <h4>Alternative Options</h4>
      <div className="alternatives-list">
        {options.map((opt, i) => (
          <div key={opt.option_id} className={`alt-option ${i === 0 ? 'top-pick' : ''}`}>
            <div className="alt-rank">
              <span className="rank-number">#{i + 1}</span>
              {i === 0 && <span className="top-badge">Best</span>}
            </div>
            <div className="alt-info">
              <div className="alt-header">
                <span className="alt-label">{opt.label}</span>
                <span className="alt-score">{opt.score}/100</span>
              </div>
              <div className="alt-meta">
                <span className="alt-time">{opt.travel_time_minutes} min</span>
                <span className="alt-separator">·</span>
                <span className="alt-mode">{opt.modeIcons || opt.mode}</span>
                {opt.distance_km && (
                  <>
                    <span className="alt-separator">·</span>
                    <span className="alt-distance">{opt.distance_km} km</span>
                  </>
                )}
              </div>
              <p className="alt-desc">{opt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
