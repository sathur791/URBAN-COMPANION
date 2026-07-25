export default function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton-badge" />
          <div className="skeleton-title" />
        </div>
        <div className="skeleton-lines">
          <div className="skeleton-line w100" />
          <div className="skeleton-line w80" />
          <div className="skeleton-line w60" />
        </div>
      </div>

      <div className="skeleton-grid">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton-condition-card">
            <div className="skeleton-icon" />
            <div className="skeleton-text">
              <div className="skeleton-line w40" />
              <div className="skeleton-line w60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
