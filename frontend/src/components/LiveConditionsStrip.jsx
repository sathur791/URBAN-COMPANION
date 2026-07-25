import { Cloud, Car, ParkingCircle, Wind, Bus, RefreshCw } from 'lucide-react';

export default function LiveConditionsStrip({ conditions }) {
  if (!conditions) return null;

  const weather = conditions.weather || {};
  const traffic = conditions.traffic || {};
  const parking = conditions.parking || {};
  const pollution = conditions.air_quality || conditions.pollution || {};
  const transit = conditions.transit || {};

  const congestionColors = { light: '#22c55e', moderate: '#f59e0b', heavy: '#ef4444' };
  const aqiColors = { Good: '#22c55e', Fair: '#84cc16', Moderate: '#f59e0b', Poor: '#ef4444' };

  const cards = [
    {
      icon: <Cloud size={20} />,
      label: 'Weather',
      value: `${weather.temperature || '--'}°C`,
      detail: weather.description || 'Clear',
      color: (weather.rain_1h || 0) > 0 ? '#0ea5e9' : '#f59e0b',
    },
    {
      icon: <Car size={20} />,
      label: 'Traffic Congestion',
      value: traffic.congestion_level || 'Moderate',
      detail: traffic.is_rush_hour ? 'Peak Rush Hour' : 'Normal Flow',
      color: congestionColors[traffic.congestion_level] || '#6366f1',
    },
    {
      icon: <ParkingCircle size={20} />,
      label: 'Parking Availability',
      value: `${parking.nearby_spots || 0} spots`,
      detail: `$${parking.avg_price_per_hour?.toFixed(2) || '3.50'}/hr avg`,
      color: (parking.nearby_spots || 0) > 40 ? '#22c55e' : '#f59e0b',
    },
    {
      icon: <Wind size={20} />,
      label: 'Air Quality Index',
      value: pollution.label || 'Good',
      detail: `AQI Score: ${pollution.aqi || 2}`,
      color: aqiColors[pollution.label] || '#22c55e',
    },
    {
      icon: <Bus size={20} />,
      label: 'Public Transit',
      value: `${transit.next_departure || '5 min'} next`,
      detail: `${transit.estimated_time_minutes || 35} min total transit`,
      color: '#6366f1',
    },
  ];

  return (
    <div className="live-strip">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 2px 8px 2px'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Live City Telemetry
        </h4>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <RefreshCw size={12} className="spin-slow" /> Real-time
        </span>
      </div>

      {cards.map((card, i) => (
        <div key={i} className="condition-card">
          <div className="condition-icon" style={{ color: card.color, background: `${card.color}15` }}>
            {card.icon}
          </div>
          <div className="condition-info">
            <span className="condition-label">{card.label}</span>
            <span className="condition-value">{card.value}</span>
            <span className="condition-detail">{card.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
