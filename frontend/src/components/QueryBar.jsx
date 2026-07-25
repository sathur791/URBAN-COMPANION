import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, MapPin, Navigation, Sparkles } from 'lucide-react';
import LocationInput from './LocationInput';

export default function QueryBar({ onQuery, loading, activeMode, setActiveMode, originName, setOriginName, destName, setDestName, onSelectOrigin, onSelectDest }) {
  const [queryText, setQueryText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!queryText.trim() && !destName.trim()) || loading) return;

    let fullText = queryText.trim();
    if (destName.trim()) {
      const fromText = originName.trim() ? `from ${originName.trim()} ` : '';
      fullText = `Route ${fromText}to ${destName.trim()}${fullText ? '. ' + fullText : ''}`;
    }

    onQuery({
      text: fullText,
      origin_name: originName.trim(),
      dest_name: destName.trim(),
      mode: activeMode,
    });
  };

  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQueryText(transcript);
      onQuery({ text: transcript, origin_name: originName, dest_name: destName, mode: activeMode });
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, onQuery, originName, destName, activeMode]);

  const modeChips = [
    { id: 'all', label: '⚡ All Modes' },
    { id: 'fastest', label: '🚀 Fastest Route' },
    { id: 'eco', label: '🌱 Eco-Friendly' },
    { id: 'transit', label: '🚌 Public Transit' },
    { id: 'parking', label: '🅿️ Parking First' },
  ];

  const quickPrompts = [
    { origin: 'Times Square, NY', dest: 'Central Park, NY', query: 'Should I leave now or wait?' },
    { origin: 'Downtown', dest: 'Airport', query: 'Find parking near airport' },
    { origin: 'Grand Central', dest: 'Empire State Building', query: 'Eco transit route' },
    { origin: 'Financial District', dest: 'Brooklyn Bridge', query: 'Avoid heavy traffic' },
  ];

  return (
    <div className="query-section">
      <div className="query-container">
        {/* Mode Filter Chips */}
        <div className="mode-filter-chips">
          {modeChips.map((m) => (
            <button
              key={m.id}
              className={`mode-chip ${activeMode === m.id ? 'active' : ''}`}
              onClick={() => setActiveMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSubmit} className="query-form">
          <div className="location-inputs-group">
            <LocationInput
              icon={MapPin}
              value={originName}
              onChange={setOriginName}
              onSelectLocation={onSelectOrigin}
              placeholder="Origin (e.g. Times Square, Central Park)"
            />

            <div className="input-divider" />

            <LocationInput
              icon={Navigation}
              value={destName}
              onChange={setDestName}
              onSelectLocation={onSelectDest}
              placeholder="Destination (e.g. Empire State, JFK)"
            />

            <div className="input-divider" />

            <div className="input-field-wrapper" style={{ flex: 1.2 }}>
              <Sparkles size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ask AI: traffic, weather, parking..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleVoice}
            title="Voice query input"
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="send-btn"
            disabled={(!queryText.trim() && !destName.trim()) || loading}
          >
            {loading ? (
              <div className="spinner" style={{ width: 18, height: 18 }} />
            ) : (
              <>
                <span>Generate Route</span>
                <Send size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Queries Prompts */}
        <div className="quick-queries-strip">
          <span className="quick-chip-label">Sample Routes:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              className="quick-chip"
              onClick={() => {
                setOriginName(qp.origin);
                setDestName(qp.dest);
                setQueryText(qp.query);
                onQuery({
                  text: `Route from ${qp.origin} to ${qp.dest}. ${qp.query}`,
                  origin_name: qp.origin,
                  dest_name: qp.dest,
                  mode: activeMode,
                });
              }}
            >
              📍 {qp.origin} → {qp.dest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
