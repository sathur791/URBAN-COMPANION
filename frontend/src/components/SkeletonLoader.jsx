export default function SkeletonLoader() {
  return (
    <div style={{
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%',
      padding: '24px 28px',
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Map skeleton */}
        <div style={{
          height: '480px',
          borderRadius: '20px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ textAlign: 'center', opacity: 0.7 }}>
            <div className="spinner" style={{ width: 36, height: 36, borderColor: 'var(--primary)', borderTopColor: 'transparent', margin: '0 auto 12px' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Analyzing live traffic, weather, & route conditions...</span>
          </div>
        </div>

        {/* Recommendation skeleton */}
        <div style={{
          padding: '24px',
          borderRadius: '20px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ width: '120px', height: '24px', borderRadius: '12px', background: 'var(--border-color)' }} />
          <div style={{ width: '90%', height: '16px', borderRadius: '8px', background: 'var(--border-color)' }} />
          <div style={{ width: '75%', height: '16px', borderRadius: '8px', background: 'var(--border-color)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            height: '72px',
            borderRadius: '14px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)'
          }} />
        ))}
      </div>
    </div>
  );
}
