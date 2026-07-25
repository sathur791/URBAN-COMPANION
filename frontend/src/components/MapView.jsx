import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, ParkingCircle, Navigation } from 'lucide-react';

export default function MapView({ conditions, originCoords, destCoords, originAddress, destAddress, routesGeometry, selectedMode, onPickLocation }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [showTraffic, setShowTraffic] = useState(true);
  const [showParking, setShowParking] = useState(true);
  const [showRoute, setShowRoute] = useState(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const defaultLat = originCoords?.lat || 40.7128;
    const defaultLng = originCoords?.lng || -74.006;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([defaultLat, defaultLng], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', (e) => {
      if (onPickLocation) {
        onPickLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map layers based on coordinates, OSRM geometry & toggles
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear existing markers and lines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    const oLat = originCoords?.lat || 40.7128;
    const oLng = originCoords?.lng || -74.006;
    const dLat = destCoords?.lat || 40.758;
    const dLng = destCoords?.lng || -73.9855;

    // Origin Marker
    const originMarker = L.marker([oLat, oLng], {
      icon: L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid white;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
        ">A</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    }).addTo(map);
    originMarker.bindPopup(`<b>Origin</b><br>${originAddress || 'Selected Origin'}`);

    // Destination Marker
    const destMarker = L.marker([dLat, dLng], {
      icon: L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #6366f1;
          border: 3px solid white;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
        ">B</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      }),
    }).addTo(map);
    destMarker.bindPopup(`<b>Destination</b><br>${destAddress || 'Selected Arrival Point'}`);

    // Draw Real Road Polyline Geometry
    if (showRoute) {
      const modeKey = (selectedMode || 'drive').toLowerCase();
      let geom = routesGeometry?.[modeKey] || routesGeometry?.['drive'];

      if (!geom || geom.length === 0) {
        geom = [[oLat, oLng], [dLat, dLng]];
      }

      const colorMap = { drive: '#6366f1', bike: '#f59e0b', walk: '#10b981', transit: '#0ea5e9' };
      const routeColor = colorMap[modeKey] || '#6366f1';

      L.polyline(geom, {
        color: routeColor,
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // Traffic congestion overlay circles
    const traffic = conditions?.traffic;
    if (showTraffic && traffic) {
      const congestionColors = { light: '#22c55e', moderate: '#f59e0b', heavy: '#ef4444' };
      const color = congestionColors[traffic.congestion_level] || '#6366f1';
      const midLat = (oLat + dLat) / 2;
      const midLng = (oLng + dLng) / 2;

      L.circle([midLat, midLng], {
        radius: 800,
        color: color,
        fillColor: color,
        fillOpacity: 0.18,
        weight: 2,
      }).addTo(map).bindPopup(`<b>Live Traffic Telemetry</b><br>Status: <strong>${traffic.congestion_level || 'Moderate'}</strong>`);
    }

    // Parking spot markers
    const parking = conditions?.parking;
    if (showParking && parking) {
      const spots = [
        [dLat - 0.003, dLng - 0.002],
        [dLat + 0.004, dLng + 0.003],
        [dLat - 0.001, dLng + 0.005],
      ];
      spots.forEach((pos, i) => {
        L.circleMarker(pos, {
          radius: 9,
          color: (parking.nearby_spots || 0) > 40 ? '#10b981' : '#f59e0b',
          fillColor: (parking.nearby_spots || 0) > 40 ? '#10b981' : '#f59e0b',
          fillOpacity: 0.85,
        }).addTo(map).bindPopup(`<b>Parking Garage #${i + 1}</b><br>${parking.nearby_spots || 35} open spots<br>Price: $${parking.avg_price_per_hour || '4.00'}/hr`);
      });
    }

    // Fit map bounds cleanly around origin & destination
    map.fitBounds([[oLat, oLng], [dLat, dLng]], { padding: [60, 60] });

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [conditions, originCoords, destCoords, originAddress, destAddress, routesGeometry, selectedMode, showTraffic, showParking, showRoute]);

  return (
    <div className="map-card-wrapper">
      <div className="map-header-controls">
        <button
          className={`layer-toggle-btn ${showTraffic ? 'active' : ''}`}
          onClick={() => setShowTraffic(!showTraffic)}
        >
          <Car size={14} /> Traffic
        </button>
        <button
          className={`layer-toggle-btn ${showParking ? 'active' : ''}`}
          onClick={() => setShowParking(!showParking)}
        >
          <ParkingCircle size={14} /> Parking
        </button>
        <button
          className={`layer-toggle-btn ${showRoute ? 'active' : ''}`}
          onClick={() => setShowRoute(!showRoute)}
        >
          <Navigation size={14} /> Real Geometry
        </button>
      </div>

      <div ref={mapRef} className="map-view" />
    </div>
  );
}
