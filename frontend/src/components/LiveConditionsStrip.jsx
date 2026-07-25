import { Cloud, Car, ParkingCircle, Wind, Bus, Navigation } from 'lucide-react';

export default function LiveConditionsStrip({ conditions }) {
  if (!conditions) return null;

  const weather = conditions.weather || {};
  const traffic = conditions.traffic || {};
  const parking = conditions.parking || {};
  const pollution = conditions.air_quality || {};

  const congestionColors = { light: '#22c55e', moderate: '#f59e0b', heavy: '#ef4444' };
  const aqiColors = { Good: '#22c55e', Fair: '#84cc16', Moderate: '#f59e0b', Poor: '#ef4444' };

  const cards = [
    {
      icon: <Cloud size={18} />,
      label: 'Weather',
      value: `${weather.temperature || '--'}°C`,
      detail: weather.description || '--',
      color: (weather.rain_1h || 0) > 0 ? '#60a5fa' : '#f59e0b',
    },
    {
      icon: <Car size={18} />,
      label: 'Traffic',
      value: traffic.congestion_level || '--',
      detail: traffic.is_rush_hour ? 'Rush hour' : 'Normal',
      color: congestionColors[traffic.congestion_level] || '#6366f1',
    },
    {
      icon: <ParkingCircle size={18} />,
      label: 'Parking',
      value: `${parking.nearby_spots || '--'} spots`,
      detail: `$${parking.avg_price_per_hour?.toFixed(2) || '--'}/hr`,
      color: (parking.nearby_spots || 0) > 50 ? '#22c55e' : '#f59e0b',
    },
    {
      icon: <Wind size={18} />,
      label: 'Air Quality',
      value: pollution.label || '--',
      detail: `AQI ${pollution.aqi || '--'}`,
      color: aqiColors[pollution.label] || '#6366f1',
    },
    {
      icon: <Bus size={18} />,
      label: 'Transit',
      value: `${conditions.transit?.estimated_time_minutes || '--'} min`,
      detail: conditions.transit?.next_departure || '--',
      color: '#6366f1',
    },
  ];

  return (
    <div className="live-strip">
      {cards.map((card, i) => (
        <div key={i} className="condition-card">
          <div className="condition-icon" style={{ color: card.color }}>{card.icon}</div>
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
