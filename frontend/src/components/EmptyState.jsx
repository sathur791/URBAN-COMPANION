import { Inbox, SearchX, BellOff, WifiOff } from 'lucide-react';

export default function EmptyState({ type = 'complaints', message, onAction }) {
  const configs = {
    complaints: {
      icon: Inbox,
      title: 'No Complaints Found',
      subtitle: 'You have not reported any civic issues yet. Click below to submit your first report.'
    },
    notifications: {
      icon: BellOff,
      title: 'All Clear!',
      subtitle: 'You have no new unread notifications or emergency broadcasts.'
    },
    search: {
      icon: SearchX,
      title: 'No Matching Results',
      subtitle: 'Try searching with different keywords or check spelling.'
    },
    offline: {
      icon: WifiOff,
      title: 'No Internet Connection',
      subtitle: 'Please check your Wi-Fi or cellular network settings.'
    }
  };

  const current = configs[type] || configs.complaints;
  const Icon = current.icon;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        background: 'rgba(18, 20, 31, 0.6)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: 'rgba(251, 140, 0, 0.15)',
          color: '#fb8c00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>{current.title}</h3>
      <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, maxWidth: 360 }}>
        {message || current.subtitle}
      </p>

      {onAction && (
        <button
          style={{
            marginTop: 20,
            background: 'var(--gradient-fire)',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 14,
            fontWeight: 700,
            cursor: 'pointer'
          }}
          onClick={onAction}
        >
          Take Action
        </button>
      )}
    </div>
  );
}
