import { useState, useCallback } from 'react';
import QueryBar from './QueryBar';
import MapView from './MapView';
import RecommendationCard from './RecommendationCard';
import ExplainabilityPanel from './ExplainabilityPanel';
import LiveConditionsStrip from './LiveConditionsStrip';
import AlternativesList from './AlternativesList';
import ProfileSidebar from './ProfileSidebar';
import SkeletonLoader from './SkeletonLoader';
import { query as queryApi } from '../api';

export default function Dashboard({ onLogout }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuery = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await queryApi.submit(data);
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="header-icon">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <h1>Urban Companion</h1>
        </div>
        <ProfileSidebar onLogout={onLogout} />
      </header>

      <QueryBar onQuery={handleQuery} loading={loading} />

      {error && <div className="error-banner">{error}</div>}

      {loading && !response && <SkeletonLoader />}

      {response && (
        <div className="dashboard-content">
          <div className="main-panel">
            <MapView conditions={response.live_conditions} />

            <div className="cards-overlay">
              <RecommendationCard recommendation={response} />
              <ExplainabilityPanel explanations={response.shap_explanations} />
            </div>
          </div>

          <div className="side-panel">
            <LiveConditionsStrip conditions={response.live_conditions} />
            <AlternativesList options={response.ranked_options} />
          </div>
        </div>
      )}

      {!response && !loading && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <h2>Where do you need to go?</h2>
          <p>Ask about traffic, parking, weather, or get a personalized travel recommendation.</p>
          <div className="quick-queries">
            {["Should I leave now?", "Find parking near me", "Best route to downtown", "Is traffic bad today?"].map((q) => (
              <button key={q} className="quick-query" onClick={() => handleQuery({ text: q })}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
