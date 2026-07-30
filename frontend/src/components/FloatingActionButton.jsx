import { useState } from 'react';
import { Plus, AlertCircle, Mic, ShieldAlert } from 'lucide-react';
import './FloatingActionButton.css';

export default function FloatingActionButton({ onReportIssue, onVoiceAi, onSos }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-options-menu">
          <button
            className="fab-option-btn"
            onClick={() => {
              setIsOpen(false);
              onReportIssue && onReportIssue();
            }}
          >
            <span>Report Complaint</span>
            <div className="fab-option-icon">
              <AlertCircle size={16} />
            </div>
          </button>

          <button
            className="fab-option-btn"
            onClick={() => {
              setIsOpen(false);
              onVoiceAi && onVoiceAi();
            }}
          >
            <span>AI Voice Command</span>
            <div className="fab-option-icon">
              <Mic size={16} />
            </div>
          </button>

          <button
            className="fab-option-btn"
            style={{ borderColor: '#ef4444', color: '#f87171' }}
            onClick={() => {
              setIsOpen(false);
              onSos && onSos();
            }}
          >
            <span>Emergency SOS</span>
            <div className="fab-option-icon" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
              <ShieldAlert size={16} color="#ef4444" />
            </div>
          </button>
        </div>
      )}

      <button
        className={`fab-main-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Smart City Actions"
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
