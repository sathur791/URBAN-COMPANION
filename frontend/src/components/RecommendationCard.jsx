import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, Award, Zap, Compass } from 'lucide-react';
import { feedback } from '../api';

export default function RecommendationCard({ recommendation }) {
  const [reaction, setReaction] = useState(null);
  const [followed, setFollowed] = useState(false);

  if (!recommendation) return null;

  const topOption = recommendation.ranked_options?.[0];

  const handleReaction = async (type) => {
    const newReaction = reaction === type ? null : type;
    setReaction(newReaction);
    if (newReaction) {
      try {
        await feedback.submit({
          query_text: recommendation.query_text || '',
          recommendation_json: recommendation,
          reaction: newReaction,
        });
      } catch (e) {
        console.error('Feedback submission failed', e);
      }
    }
  };

  const toggleFollow = async () => {
    const nextState = !followed;
    setFollowed(nextState);
    try {
      await feedback.submit({
        query_text: recommendation.query_text || '',
        recommendation_json: recommendation,
        reaction: reaction || 'follow',
        followed: nextState,
      });
    } catch (e) {
      console.error('Follow feedback failed', e);
    }
  };

  return (
    <div className="recommendation-card">
      <div className="rec-header">
        <div className="rec-badge">
          <Zap size={14} /> AI Recommendation Engine
        </div>
        {topOption && (
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Award size={14} /> {topOption.score}% Confidence Match
          </div>
        )}
      </div>

      <div className="rec-text">
        {recommendation.recommendation || 'Based on live city sensors, weather, and traffic models, here is your optimal route strategy.'}
      </div>

      {topOption && (
        <div className="rec-top-option">
          <div className="option-score-badge">
            {topOption.score}
          </div>
          <div className="option-details">
            <strong>{topOption.label}</strong>
            <span>Est. {topOption.travel_time_minutes} minutes · Mode: {topOption.mode} · Score: {topOption.score}/100</span>
          </div>
        </div>
      )}

      <div className="rec-actions">
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${reaction === 'up' ? 'active positive' : ''}`}
            onClick={() => handleReaction('up')}
            title="Mark recommendation as helpful"
          >
            <ThumbsUp size={16} />
            <span>Helpful</span>
          </button>
          <button
            className={`feedback-btn ${reaction === 'down' ? 'active negative' : ''}`}
            onClick={() => handleReaction('down')}
            title="Mark recommendation as unhelpful"
          >
            <ThumbsDown size={16} />
            <span>Not helpful</span>
          </button>
        </div>

        <button
          className={`follow-toggle-btn ${followed ? 'followed' : ''}`}
          onClick={toggleFollow}
        >
          <span>{followed ? 'Following Route' : 'Follow this route'}</span>
          <div className="toggle-switch" />
        </button>
      </div>
    </div>
  );
}
