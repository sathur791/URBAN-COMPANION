import { Clock, MapPin, Bus, Car, Footprints, Bike, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AlternativesList({ options, onSelectOption, selectedOptionId }) {
  if (!options || options.length === 0) return null;

  const getModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'drive':
      case 'car':
        return <Car size={16} />;
      case 'transit':
      case 'bus':
      case 'train':
        return <Bus size={16} />;
      case 'walk':
      case 'foot':
        return <Footprints size={16} />;
      case 'bike':
      case 'bicycle':
        return <Bike size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="alternatives-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h4>Ranked Travel Options</h4>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{options.length} options evaluated</span>
      </div>

      <div className="alternatives-list">
        {options.map((opt, i) => {
          const isSelected = selectedOptionId === opt.option_id || (i === 0 && !selectedOptionId);
          return (
            <div
              key={opt.option_id || i}
              className={`alt-option ${i === 0 ? 'top-pick' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectOption && onSelectOption(opt)}
            >
              <div className="alt-rank">
                <span className="rank-number">#{i + 1}</span>
                {i === 0 && <span className="top-badge">Top Pick</span>}
              </div>

              <div className="alt-info">
                <div className="alt-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--primary)' }}>{getModeIcon(opt.mode)}</span>
                    <span className="alt-label">{opt.label}</span>
                  </div>
                  <span className="alt-score">{opt.score}/100</span>
                </div>

                <div className="alt-meta">
                  <span className="alt-time">{opt.travel_time_minutes} min travel</span>
                  <span>·</span>
                  <span style={{ textTransform: 'capitalize' }}>{opt.mode}</span>
                  {opt.distance_km && (
                    <>
                      <span>·</span>
                      <span>{opt.distance_km} km</span>
                    </>
                  )}
                </div>

                {opt.description && <p className="alt-desc">{opt.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
