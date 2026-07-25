import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';

export default function ExplainabilityPanel({ explanations }) {
  const [expanded, setExpanded] = useState(true);

  if (!explanations || explanations.length === 0) return null;

  const maxContribution = Math.max(...explanations.map(e => Math.abs(e.contribution)), 1);

  return (
    <div className="explainability-panel">
      <button className="panel-toggle" onClick={() => setExpanded(!expanded)}>
        <div className="panel-toggle-left">
          <Sparkles size={18} />
          <span>Why This Recommendation?</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            SHAP Feature Analysis
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="explanation-bars">
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
            Key urban factors influencing our ML recommendation model for your requested route:
          </div>
          {explanations.map((exp, i) => {
            const width = Math.min((Math.abs(exp.contribution) / maxContribution) * 100, 100);
            const isPositive = exp.direction === 'increases' || exp.contribution >= 0;
            return (
              <div key={i} className="explanation-item">
                <div className="exp-label">
                  <span className="exp-name">{exp.feature?.replace(/_/g, ' ')}</span>
                  <span className={`exp-direction ${isPositive ? 'increases' : 'decreases'}`}>
                    {isPositive ? '▲ Positive Impact' : '▼ Negative Impact'} ({exp.contribution > 0 ? '+' : ''}{exp.contribution}%)
                  </span>
                </div>
                <div className="exp-bar-track">
                  <div
                    className={`exp-bar-fill ${isPositive ? 'increases' : 'decreases'}`}
                    style={{ width: `${Math.max(width, 8)}%` }}
                  />
                </div>
                {exp.value !== undefined && (
                  <span className="exp-value">Value observed: {String(exp.value)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
