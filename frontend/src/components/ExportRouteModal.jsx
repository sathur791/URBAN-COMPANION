import { useState } from 'react';
import { ExternalLink, Copy, Check, Share2, X, MapPin } from 'lucide-react';

export default function ExportRouteModal({ open, onClose, originCoords, destCoords, originAddress, destAddress }) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const oLat = originCoords?.lat || 40.7128;
  const oLng = originCoords?.lng || -74.006;
  const dLat = destCoords?.lat || 40.758;
  const dLng = destCoords?.lng || -73.9855;

  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=driving`;
  const shareText = `Urban Companion Route:\nOrigin: ${originAddress || 'Origin'}\nDestination: ${destAddress || 'Destination'}\nLink: ${gmapsUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="profile-overlay" onClick={onClose} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '460px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        zIndex: 1500,
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={20} style={{ color: 'var(--primary)' }} /> Export & Share Route
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <MapPin size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span><strong>From:</strong> {originAddress || 'Origin Location'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} style={{ color: 'var(--primary)' }} />
            <span><strong>To:</strong> {destAddress || 'Destination Location'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', justifyContent: 'center' }}
          >
            <span>Open Navigation in Google Maps</span>
            <ExternalLink size={18} />
          </a>

          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {copied ? <Check size={18} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={18} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Shareable Trip Link'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
