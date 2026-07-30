import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Locate, Navigation, Flame, AlertCircle, ShieldAlert, Car, ParkingCircle, Bus, MapPin } from 'lucide-react';
import './SmartMapView.css';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom glowing SVG icon for Tamil Nadu locations
const createGlowingIcon = (color = '#fb8c00') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 15px ${color};
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const tnCityCoordinates = {
  chennai: { name: 'Chennai (சென்னை)', lat: 13.0827, lng: 80.2707 },
  coimbatore: { name: 'Coimbatore (கோவை)', lat: 11.0168, lng: 76.9558 },
  madurai: { name: 'Madurai (மதுரை)', lat: 9.9252, lng: 78.1198 },
  trichy: { name: 'Trichy (திருச்சி)', lat: 10.7905, lng: 78.7047 },
  salem: { name: 'Salem (சேலம்)', lat: 11.6643, lng: 78.1460 },
  tirunelveli: { name: 'Tirunelveli (திருநெல்வேலி)', lat: 8.7139, lng: 77.7567 }
};

export default function SmartMapView() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCityKey, setSelectedCityKey] = useState('chennai');
  const [activeLayer, setActiveLayer] = useState({
    heatmap: true,
    traffic: true,
    emergency: true,
    parking: true
  });

  const currentCity = tnCityCoordinates[selectedCityKey];

  const mockTnPoints = [
    { id: 1, lat: 13.0827, lng: 80.2707, type: 'incident', title: 'GCC Waterlogging Alert', location: 'Anna Salai, Thousand Lights', status: 'In Progress', color: '#ef4444' },
    { id: 2, lat: 13.0418, lng: 80.2341, type: 'parking', title: 'T. Nagar Multi-Level Parking', location: 'Usman Road, Chennai', status: '85 Spots Free', color: '#fdd835' },
    { id: 3, lat: 13.0489, lng: 80.2825, type: 'emergency', title: '108 Ambulance Dispatch Hub', location: 'Marina Beach Coastal Zone', status: '108 Patrol Ready', color: '#10b981' },
    { id: 4, lat: 12.9698, lng: 80.2454, type: 'transit', title: 'MTC & CMRL Metro Depot', location: 'OMR IT Corridor', status: 'On Schedule', color: '#06b6d4' }
  ];

  const filteredPoints = mockTnPoints.filter(
    (p) => activeFilter === 'all' || p.type === activeFilter
  );

  return (
    <div className="smart-map-container">
      {/* 1. TOP FILTER CHIPS & CITY SELECTOR */}
      <div className="map-filter-chips">
        <select
          value={selectedCityKey}
          onChange={(e) => setSelectedCityKey(e.target.value)}
          style={{
            background: 'rgba(18, 20, 31, 0.95)',
            border: '1px solid rgba(251, 140, 0, 0.4)',
            color: '#fdd835',
            padding: '8px 14px',
            borderRadius: 99,
            fontWeight: 800,
            fontSize: 12,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {Object.entries(tnCityCoordinates).map(([key, val]) => (
            <option key={key} value={key} style={{ background: '#12141f', color: '#fff' }}>
              {val.name}
            </option>
          ))}
        </select>

        <button
          className={`map-chip ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <Layers size={14} /> All TN Layers
        </button>

        <button
          className={`map-chip ${activeFilter === 'incident' ? 'active' : ''}`}
          onClick={() => setActiveFilter('incident')}
        >
          <AlertCircle size={14} color="#ef4444" /> GCC Waterlogging
        </button>

        <button
          className={`map-chip ${activeFilter === 'parking' ? 'active' : ''}`}
          onClick={() => setActiveFilter('parking')}
        >
          <ParkingCircle size={14} color="#fdd835" /> TN Smart Parking
        </button>

        <button
          className={`map-chip ${activeFilter === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveFilter('emergency')}
        >
          <ShieldAlert size={14} color="#10b981" /> 108 Emergency
        </button>
      </div>

      {/* 2. FLOATING CONTROL BUTTONS */}
      <div className="map-floating-controls">
        <button
          className={`map-control-btn ${activeLayer.heatmap ? 'active' : ''}`}
          onClick={() => setActiveLayer((prev) => ({ ...prev, heatmap: !prev.heatmap }))}
          title="Toggle Monsoon Flood Heatmap"
        >
          <Flame size={20} />
        </button>

        <button
          className={`map-control-btn ${activeLayer.traffic ? 'active' : ''}`}
          onClick={() => setActiveLayer((prev) => ({ ...prev, traffic: !prev.traffic }))}
          title="Toggle Traffic Congestion"
        >
          <Car size={20} />
        </button>

        <button
          className="map-control-btn"
          onClick={() => alert(`Recenter to ${currentCity.name} GPS...`)}
          title="Recenter Location"
        >
          <Locate size={20} />
        </button>
      </div>

      {/* 3. LEAFLET MAP CONTAINER */}
      <MapContainer
        key={selectedCityKey}
        center={[currentCity.lat, currentCity.lng]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> TN Smart City OS'
        />

        {/* Heatmap overlay circle */}
        {activeLayer.heatmap && (
          <Circle
            center={[currentCity.lat, currentCity.lng]}
            radius={1200}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25 }}
          />
        )}

        {/* Map Markers */}
        {filteredPoints.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createGlowingIcon(point.color)}
          >
            <Popup>
              <div style={{ color: '#1e1e24', fontWeight: 700, fontSize: 13 }}>
                <h4>{point.title}</h4>
                <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{point.location}</p>
                <p style={{ fontSize: 12, marginTop: 4, color: '#fb8c00' }}>Status: {point.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 4. BOTTOM LOCATION DETAILS CARD */}
      <div className="map-bottom-details-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fb8c00', textTransform: 'uppercase' }}>
              TAMIL NADU SMART CITY DISTRICT
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
              {currentCity.name}
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Active Sensors: 342 • Anna Salai Flow: 38 km/h • Monsoon Flood Risk: Low
            </p>
          </div>

          <button
            style={{
              background: 'var(--gradient-fire)',
              border: 'none',
              color: 'white',
              padding: '10px 18px',
              borderRadius: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Navigation size={16} /> Navigate
          </button>
        </div>
      </div>
    </div>
  );
}
