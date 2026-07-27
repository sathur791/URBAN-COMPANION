import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Play } from 'lucide-react';
import { query as queryApi } from '../api';
import './VoiceAssistant.css';

export default function VoiceAssistant({ onVoiceRoute, currentOrigin, currentDest }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isWakewordEnabled, setIsWakewordEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'agent', text: "Hello! I am your City Companion. Tap the mic or say 'Hey Companion' to ask me anything about the city!" }
  ]);
  const [manualInput, setManualInput] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  const recognitionRef = useRef(null);
  const backgroundRecognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const lastUtteranceRef = useRef(null);

  // Play a premium sound chime
  const playChime = (frequency = 600, duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Chime failed", e);
    }
  };

  // Text-To-Speech helper
  const speak = (text) => {
    if (isMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel(); // cancel any active speaking
      // Strip emojis and clean up markdown formatting for cleaner speech
      const cleanText = text.replace(/[*#_🏨🌟🍽️🛏️🎪🎨🍕🗺️🚨👋]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Try to find a nice female English voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Zira") || v.name.includes("Microsoft")) && v.lang.startsWith("en")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      lastUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    // Active command listener
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("Listening...");
    };

    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleCommand(text);
    };

    rec.onerror = (e) => {
      console.error("Speech Recognition Error:", e);
      if (e.error !== 'no-speech') {
        setTranscript("Sorry, I didn't catch that. Please try again.");
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      // Restart background wake-word listener if enabled
      if (isWakewordEnabled && !isOpen) {
        startBackgroundListening();
      }
    };

    recognitionRef.current = rec;

    // Background wake-word listener
    const bgRec = new SpeechRecognition();
    bgRec.continuous = true;
    bgRec.interimResults = false;
    bgRec.lang = 'en-US';

    bgRec.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (text.includes("companion") || text.includes("hey companion") || text.includes("urban companion")) {
        playChime(660, 0.2);
        setIsOpen(true);
        // Turn off background listener briefly while active
        bgRec.stop();
        setTimeout(() => {
          startActiveListening();
        }, 300);
      }
    };

    bgRec.onerror = (e) => {
      if (e.error === 'not-allowed') {
        console.warn("Mic permission denied for background listening.");
        setIsWakewordEnabled(false);
      }
    };

    bgRec.onend = () => {
      if (isWakewordEnabled && !isListening && !isOpen) {
        startBackgroundListening();
      }
    };

    backgroundRecognitionRef.current = bgRec;

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (backgroundRecognitionRef.current) backgroundRecognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [isWakewordEnabled, isOpen]);

  // Background listening handlers
  const startBackgroundListening = () => {
    try {
      if (backgroundRecognitionRef.current) {
        backgroundRecognitionRef.current.start();
      }
    } catch (e) {
      // already listening
    }
  };

  const stopBackgroundListening = () => {
    if (backgroundRecognitionRef.current) {
      backgroundRecognitionRef.current.stop();
    }
  };

  useEffect(() => {
    if (isWakewordEnabled) {
      startBackgroundListening();
    } else {
      stopBackgroundListening();
    }
  }, [isWakewordEnabled]);

  const startActiveListening = () => {
    if (!recognitionSupported) return;
    if (synthRef.current) synthRef.current.cancel(); // Stop talking when user starts speaking
    stopBackgroundListening();
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        playChime(520, 0.1);
      }
    } catch (e) {
      console.warn("Active recognition already started");
    }
  };

  // Main Command Processor
  const handleCommand = async (commandText) => {
    if (!commandText.trim()) return;

    // Add user question to chat bubble history
    setChatHistory(prev => [...prev, { sender: 'user', text: commandText }]);

    // Regex check for routing command, e.g. "search route from A to B"
    const routePattern = /(?:search route|directions|go|route|navigate) from (.+?) to (.+)/i;
    const match = commandText.match(routePattern);

    if (match) {
      const origin = match[1].trim();
      const dest = match[2].trim();
      const confirmText = `Routing from ${origin} to ${dest}.`;
      setChatHistory(prev => [...prev, { sender: 'agent', text: confirmText }]);
      speak(confirmText);
      onVoiceRoute(origin, dest);
      return;
    }

    // Otherwise, treat as a generic city query and hit the API
    try {
      setTranscript("Thinking...");
      const response = await queryApi.submit({
        text: commandText,
        origin_name: currentOrigin,
        dest_name: currentDest,
      });

      const reply = response.data?.recommendation || "I aggregated the city data, but couldn't generate a recommendation text.";
      setChatHistory(prev => [...prev, { sender: 'agent', text: reply }]);
      speak(reply);
    } catch (err) {
      console.error("Voice Query API Error:", err);
      const fallbackReply = "Sorry, I had trouble contacting the city data server. Please make sure the backend is active.";
      setChatHistory(prev => [...prev, { sender: 'agent', text: fallbackReply }]);
      speak(fallbackReply);
    } finally {
      setTranscript('');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const text = manualInput.trim();
    setManualInput('');
    handleCommand(text);
  };

  return (
    <>
      {/* Floating Microhone FAB Button */}
      <button 
        className={`voice-assistant-fab ${isListening ? 'listening' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => {
              startActiveListening();
            }, 300);
          }
        }}
        title="Voice City Companion"
      >
        {isListening ? <Mic size={24} /> : <MicOff size={24} />}
      </button>

      {/* Voice Assistant Panel Popup */}
      {isOpen && (
        <div className="voice-assistant-panel">
          <div className="voice-panel-header">
            <div className="voice-panel-title-group">
              <span className={`voice-status-dot ${isListening ? 'active' : ''}`}></span>
              <span className="voice-panel-title">City Companion Voice Agent</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                className="voice-close-btn" 
                onClick={() => setIsMuted(!isMuted)} 
                title={isMuted ? "Unmute Assistant" : "Mute Assistant"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button 
                className="voice-close-btn" 
                onClick={() => {
                  setIsOpen(false);
                  if (synthRef.current) synthRef.current.cancel();
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="voice-panel-body">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`voice-bubble ${chat.sender}`}>
                {chat.text}
              </div>
            ))}

            {transcript && (
              <div className="voice-bubble user" style={{ opacity: 0.7, fontStyle: 'italic' }}>
                {transcript}
              </div>
            )}
          </div>

          {/* Soundwave animation strip */}
          {isListening && (
            <div className="voice-wave-container active">
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
            </div>
          )}

          <div className="voice-panel-footer">
            {recognitionSupported ? (
              <label className="voice-wakeword-toggle">
                <input 
                  type="checkbox" 
                  checked={isWakewordEnabled}
                  onChange={(e) => {
                    setIsWakewordEnabled(e.target.checked);
                    if (e.target.checked) playChime(700, 0.15);
                  }}
                />
                Enable "Hey Companion"
              </label>
            ) : (
              <span style={{ fontSize: '11px', color: 'red' }}>Speech recognition not supported</span>
            )}

            {!isListening && recognitionSupported && (
              <button 
                className="icon-btn-sm" 
                onClick={startActiveListening} 
                style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Tap to speak"
              >
                <Mic size={14} />
              </button>
            )}
          </div>

          {/* Text-based manual fallback */}
          <div style={{ padding: '0 16px 12px 16px' }}>
            <form onSubmit={handleManualSubmit} className="voice-manual-input">
              <input 
                type="text" 
                placeholder="Or type a question..." 
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
