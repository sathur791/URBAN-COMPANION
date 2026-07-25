import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { feedback } from '../api';

export default function RecommendationCard({ recommendation, queryId }) {
  const [reaction, setReaction] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleReaction = async (type) => {
    setReaction(type);
    try {
      await feedback.submit({
        query_text: '',
        recommendation_json: recommendation,
        reaction: type,
      });
    } catch {}
  };

  return (
    <div className="recommendation-card">
      <div className="rec-header">
        <div className="rec-badge">Recommended</div>
        <h3>AI Travel Advisor</h3>
      </div>

      <div className="rec-text">
        {recommendation.recommendation}
      </div>

      {recommendation.ranked_options && recommendation.ranked_options.length > 0 && (
        <div className="rec-top-option">
          <div className="option-score">{recommendation.ranked_options[0].score}</div>
          <div className="option-details">
            <strong>{recommendation.ranked_options[0].label}</strong>
            <span>{recommendation.ranked_options[0].travel_time_minutes} min · {recommendation.ranked_options[0].mode}</span>
          </div>
        </div>
      )}

      <div className="rec-actions">
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${reaction === 'up' ? 'active positive' : ''}`}
            onClick={() => handleReaction('up')}
          >
            <ThumbsUp size={16} />
            <span>Helpful</span>
          </button>
          <button
            className={`feedback-btn ${reaction === 'down' ? 'active negative' : ''}`}
            onClick={() => handleReaction('down')}
          >
            <ThumbsDown size={16} />
            <span>Not helpful</span>
          </button>
        </div>

        <button className="follow-btn">
          <span>Did you follow this?</span>
          <div className="toggle-switch" />
        </button>
      </div>
    </div>
  );
}
