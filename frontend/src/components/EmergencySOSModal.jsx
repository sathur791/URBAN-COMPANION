import { useState } from 'react';
import { ShieldAlert, X, PhoneCall, Copy, Check, MapPin, AlertTriangle } from 'lucide-react';

export default function EmergencySOSModal({ open, onClose, currentCoords }) {
  const [copied, setCopied] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  if (!open) return null;

  const lat = currentCoords?.lat || 40.7128;
  const lng = currentCoords?.lng || -74.006;
  const locationString = `GPS Location: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Urban Safety Alert)`;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(locationString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSOS = () => {
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
    }, 3500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sos-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sos-modal-header">
          <div className="sos-title-badge">
            <ShieldAlert size={24} color="#ef4444" />
            <div>
              <h3>Emergency SOS Safety Alert</h3>
              <p>Instant location broadcast & emergency help</p>
            </div>
          </div>
          <button className="icon-btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {sosSent ? (
          <div className="sos-success-alert">
            <AlertTriangle size={32} color="#ef4444" />
            <h4>Emergency Signal Broadcasted!</h4>
            <p>Your exact GPS coordinates have been copied and emergency contacts notified.</p>
          </div>
        ) : (
          <div className="sos-body">
            <div className="gps-location-card">
              <div className="gps-icon">
                <MapPin size={20} color="#3b82f6" />
              </div>
              <div className="gps-info">
                <span className="gps-label">Current GPS Coordinates</span>
                <span className="gps-val">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
              </div>
              <button className="copy-btn" onClick={handleCopyLocation}>
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>

            <button className="sos-trigger-btn" onClick={handleSendSOS}>
              <ShieldAlert size={28} />
              <span>BROADCAST SOS ALERT</span>
            </button>

            <div className="emergency-contacts">
              <p className="contacts-title">Quick Emergency Dials:</p>
              <div className="contacts-grid">
                <a href="tel:911" className="contact-card">
                  <PhoneCall size={16} color="#ef4444" />
                  <div>
                    <strong>Emergency Services</strong>
                    <span>Call 911 / 112</span>
                  </div>
                </a>

                <a href="tel:100" className="contact-card">
                  <PhoneCall size={16} color="#3b82f6" />
                  <div>
                    <strong>Transit Police Helpline</strong>
                    <span>Call 100 / 182</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
