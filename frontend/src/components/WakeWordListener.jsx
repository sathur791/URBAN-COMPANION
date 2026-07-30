import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';

export default function WakeWordListener({ onWakeWordDetected, isActive, onToggleActive }) {
  const [isSupported, setIsSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [lastDetected, setLastDetected] = useState(null);
  const recognitionRef = useRef(null);
  const restartTimerRef = useRef(null);

  // Synthesize audio chime tone for wake word trigger
  const playChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Futuristic ascending dual-chime notes (E5 to A5)
      const now = ctx.currentTime;
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.frequency.setValueAtTime(1318.5, now); // E6
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio chime playback failed:', e);
    }
  }, []);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const handleWakeWordFound = useCallback((transcript) => {
    playChime();
    setLastDetected(new Date().toLocaleTimeString());

    // Extract query spoken immediately after wake phrase if present
    let query = '';
    const match = transcript.match(/(?:urban\s*a\.?i\.?|urban\s*assistant|hey\s*urban|ok\s*urban)\s*(.*)/i);
    if (match && match[1]) {
      query = match[1].trim();
    }

    onWakeWordDetected(query);
  }, [playChime, onWakeWordDetected]);

  const startRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !isActive) return;

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // ignore already stopped
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase();

          // Check for wake word variants
          const containsWakeWord =
            transcript.includes('urban ai') ||
            transcript.includes('urban a i') ||
            transcript.includes('urban a.i') ||
            transcript.includes('hey urban') ||
            transcript.includes('ok urban') ||
            transcript.includes('urban assistant');

          if (containsWakeWord) {
            handleWakeWordFound(event.results[i][0].transcript);
            try {
              recognition.stop();
            } catch (e) {
              // ignore
            }
            break;
          }
        }
      };

      recognition.onerror = (event) => {
        // Handle common non-fatal speech errors like 'no-speech'
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('WakeWord speech recognition error:', event.error);
        }
      };

      recognition.onend = () => {
        setListening(false);
        // Automatically restart listener if active
        if (isActive) {
          restartTimerRef.current = setTimeout(() => {
            startRecognition();
          }, 800);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Failed to start wake word listener:', e);
      setListening(false);
    }
  }, [isActive, handleWakeWordFound]);

  useEffect(() => {
    if (isActive && isSupported) {
      startRecognition();
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setListening(false);
    }

    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isActive, isSupported, startRecognition]);

  if (!isSupported) {
    return (
      <div className="wake-word-badge unsupported" title="Web Speech API not supported in this browser">
        <AlertCircle size={14} />
        <span>Voice Wake-Word Unavailable</span>
      </div>
    );
  }

  return (
    <div className={`wake-word-badge ${isActive ? 'active' : 'inactive'}`}>
      <button
        type="button"
        className="wake-word-toggle-btn"
        onClick={onToggleActive}
        title={isActive ? 'Disable "Urban AI" Voice Wake-Word' : 'Enable "Urban AI" Voice Wake-Word'}
      >
        <div className={`mic-status-pulse ${listening ? 'listening' : ''}`}>
          {isActive ? <Mic size={14} color="#ffffff" /> : <MicOff size={14} color="var(--text-muted)" />}
        </div>
        <div className="wake-word-label">
          <span className="title">Wake-Word: <strong>"Urban AI"</strong></span>
          <span className="status-sub">
            {isActive ? (listening ? 'Listening...' : 'Active') : 'Disabled'}
          </span>
        </div>
      </button>
    </div>
  );
}
