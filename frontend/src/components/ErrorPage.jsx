import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({ title = 'Something went wrong', message = 'Failed to load live city server data. Please try again.', onRetry }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 32
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 24,
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20
        }}
      >
        <AlertTriangle size={36} />
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>{title}</h2>
      <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, maxWidth: 420 }}>{message}</p>

      {onRetry && (
        <button
          style={{
            marginTop: 24,
            background: 'var(--gradient-fire)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 16,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 6px 20px rgba(229, 57, 53, 0.5)'
          }}
          onClick={onRetry}
        >
          <RefreshCw size={18} /> Retry Connection
        </button>
      )}
    </div>
  );
}
