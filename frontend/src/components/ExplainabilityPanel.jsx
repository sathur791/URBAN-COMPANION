import { useState } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';

export default function ExplainabilityPanel({ explanations }) {
  const [expanded, setExpanded] = useState(false);

  if (!explanations || explanations.length === 0) return null;

  const maxContribution = Math.max(...explanations.map(e => Math.abs(e.contribution)), 1);

  return (
    <div className="explainability-panel">
      <button className="panel-toggle" onClick={() => setExpanded(!expanded)}>
        <div className="panel-toggle-left">
          <Brain size={18} />
          <span>Why This Recommendation?</span>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expanded && (
        <div className="explanation-bars">
          {explanations.map((exp, i) => {
            const width = Math.min((Math.abs(exp.contribution) / maxContribution) * 100, 100);
            const isPositive = exp.direction === 'increases';
            return (
              <div key={i} className="explanation-item">
                <div className="exp-label">
                  <span className="exp-name">{exp.feature}</span>
                  <span className={`exp-direction ${isPositive ? 'increases' : 'decreases'}`}>
                    {isPositive ? '▲' : '▼'} {exp.contribution > 0 ? '+' : ''}{exp.contribution}%
                  </span>
                </div>
                <div className="exp-bar-track">
                  <div
                    className={`exp-bar-fill ${isPositive ? 'increases' : 'decreases'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="exp-value">{exp.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
