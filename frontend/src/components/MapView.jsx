import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ conditions }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([40.7128, -74.006], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !conditions) return;

    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstance.current.removeLayer(layer);
      }
    });

    const origin = L.marker([40.7128, -74.006], {
      icon: L.divIcon({
        className: 'marker-origin',
        html: '<div class="marker-dot origin"></div>',
        iconSize: [20, 20],
      }),
    }).addTo(mapInstance.current);
    origin.bindPopup('<b>Origin</b><br>Current Location');

    const dest = L.marker([40.758, -73.9855], {
      icon: L.divIcon({
        className: 'marker-dest',
        html: '<div class="marker-dot dest"></div>',
        iconSize: [20, 20],
      }),
    }).addTo(mapInstance.current);
    dest.bindPopup('<b>Destination</b><br>Target Location');

    L.polyline([[40.7128, -74.006], [40.758, -73.9855]], {
      color: '#6366f1',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 6',
    }).addTo(mapInstance.current);

    const traffic = conditions?.traffic;
    if (traffic) {
      const congestionColor = { light: '#22c55e', moderate: '#f59e0b', heavy: '#ef4444' };
      const color = congestionColor[traffic.congestion_level] || '#6366f1';

      L.circle([40.7354, -73.995], {
        radius: 800,
        color: color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(mapInstance.current).bindPopup(`<b>Traffic Zone</b><br>Status: ${traffic.congestion_level}`);
    }

    const parking = conditions?.parking;
    if (parking) {
      const parkingSpots = [
        [40.755, -73.988],
        [40.761, -73.982],
        [40.757, -73.991],
      ];
      parkingSpots.forEach((pos, i) => {
        L.circleMarker(pos, {
          radius: 8,
          color: parking.nearby_spots > 50 ? '#22c55e' : '#f59e0b',
          fillColor: parking.nearby_spots > 50 ? '#22c55e' : '#f59e0b',
          fillOpacity: 0.7,
        }).addTo(mapInstance.current).bindPopup(`<b>Parking Spot ${i + 1}</b><br>${parking.nearby_spots} spots available`);
      });
    }

    mapInstance.current.fitBounds([[40.7128, -74.006], [40.758, -73.9855]], { padding: [50, 50] });
  }, [conditions]);

  return <div ref={mapRef} className="map-view" />;
}
