import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, MapPin, Navigation } from 'lucide-react';

export default function QueryBar({ onQuery, loading }) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onQuery({ text: text.trim() });
    setText('');
  };

  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
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
      onQuery({ text: transcript });
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, onQuery]);

  return (
    <div className="query-bar">
      <form onSubmit={handleSubmit} className="query-form">
        <div className="query-input-wrapper">
          <MapPin size={18} className="input-icon" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Where do you need to go? Ask about traffic, parking, weather..."
            disabled={loading}
            className="query-input"
          />
        </div>

        <button
          type="button"
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleVoice}
          title="Voice input"
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button type="submit" className="send-btn" disabled={!text.trim() || loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
}
