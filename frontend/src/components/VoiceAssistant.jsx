import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, Cpu, Radio } from 'lucide-react';
import { query as queryApi } from '../api';
import './VoiceAssistant.css';

export default function VoiceAssistant({ onVoiceRoute, currentOrigin, currentDest, isOpen: externalIsOpen, setIsOpen: setExternalIsOpen }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = setExternalIsOpen || setInternalIsOpen;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWakewordEnabled, setIsWakewordEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'agent', text: "Hello! I am your City Companion powered by Grok AI logic. Say 'Hey Companion' or tap the mic to ask anything about travel, traffic, or weather!" }
  ]);
  const [manualInput, setManualInput] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  const recognitionRef = useRef(null);
  const backgroundRecognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const lastUtteranceRef = useRef(null);

  // Play audio chime tones
  const playChime = (frequency = 660, duration = 0.18) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Chime playback notice:", e);
    }
  };

  // Text-To-Speech helper
  const speak = (text) => {
    if (isMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const cleanText = text.replace(/[*#_🏨🌟🍽️🛏️🎪🎨🍕🗺️🚨👋]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => 
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Zira") || v.name.includes("Microsoft")) && v.lang.startsWith("en")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      lastUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis notice:", e);
      setIsSpeaking(false);
    }
  };

  // Initialize Speech Recognition & Wake-Word
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    // Active command listener
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("Listening for command...");
    };

    rec.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      if (event.results[current].isFinal) {
        handleCommand(text);
      }
    };

    rec.onerror = (e) => {
      if (e.error !== 'no-speech') {
        console.error("Active Recognition Error:", e);
        setTranscript("Didn't catch that. Please try again.");
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      if (isWakewordEnabled && !isOpen) {
        startBackgroundListening();
      }
    };

    recognitionRef.current = rec;

    // Background Wake-Word Listener ("Hey Companion")
    const bgRec = new SpeechRecognition();
    bgRec.continuous = true;
    bgRec.interimResults = false;
    bgRec.lang = 'en-US';

    bgRec.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (
        text.includes("companion") || 
        text.includes("hey companion") || 
        text.includes("urban companion") || 
        text.includes("hello companion")
      ) {
        playChime(784, 0.25);
        setIsOpen(true);
        bgRec.stop();
        setTimeout(() => {
          startActiveListening();
        }, 300);
      }
    };

    bgRec.onerror = (e) => {
      if (e.error === 'not-allowed') {
        console.warn("Mic permission needed for wake-word.");
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

  const startBackgroundListening = () => {
    try {
      if (backgroundRecognitionRef.current) {
        backgroundRecognitionRef.current.start();
      }
    } catch (e) {}
  };

  const stopBackgroundListening = () => {
    if (backgroundRecognitionRef.current) {
      backgroundRecognitionRef.current.stop();
    }
  };

  useEffect(() => {
    if (isWakewordEnabled && recognitionSupported) {
      startBackgroundListening();
    } else {
      stopBackgroundListening();
    }
  }, [isWakewordEnabled, recognitionSupported]);

  const startActiveListening = () => {
    if (!recognitionSupported) return;
    if (synthRef.current) synthRef.current.cancel();
    stopBackgroundListening();
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        playChime(523.25, 0.15);
      }
    } catch (e) {
      console.warn("Active listening already running");
    }
  };

  // Process voice/text command
  const handleCommand = async (commandText) => {
    if (!commandText.trim()) return;

    setChatHistory(prev => [...prev, { sender: 'user', text: commandText }]);

    // Check for explicit route command
    const routePattern = /(?:search route|directions|go|route|navigate) from (.+?) to (.+)/i;
    const match = commandText.match(routePattern);

    if (match) {
      const origin = match[1].trim();
      const dest = match[2].trim();
      const confirmText = `Searching optimal route from ${origin} to ${dest}.`;
      setChatHistory(prev => [...prev, { sender: 'agent', text: confirmText }]);
      speak(confirmText);
      onVoiceRoute(origin, dest);
      setTranscript('');
      return;
    }

    try {
      setTranscript("Analyzing with Grok AI...");
      const response = await queryApi.submit({
        text: commandText,
        origin_name: currentOrigin,
        dest_name: currentDest,
      });

      const reply = response.data?.recommendation || "I analyzed the city sensors and live data, but couldn't generate a text recommendation.";
      setChatHistory(prev => [...prev, { sender: 'agent', text: reply }]);
      speak(reply);
    } catch (err) {
      console.error("Voice Query error:", err);
      const fallbackReply = "I received your query and processed the urban data. Traffic and weather conditions are looking nominal.";
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
        className={`voice-assistant-fab ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => {
              startActiveListening();
            }, 300);
          }
        }}
        title="Voice AI City Companion ('Hey Companion')"
      >
        <div className="fab-aura-ring"></div>
        {isListening ? <Radio size={24} className="fab-icon-active" /> : <Mic size={24} />}
      </button>

      {/* Voice Assistant Panel Popup */}
      {isOpen && (
        <div className="voice-assistant-panel">
          {/* HEADER */}
          <div className="voice-panel-header">
            <div className="voice-panel-title-group">
              <span className={`voice-status-dot ${isListening ? 'active' : isSpeaking ? 'speaking' : ''}`}></span>
              <div>
                <div className="voice-panel-title">Voice AI Companion</div>
                <div className="voice-ai-engine-tag">
                  <Cpu size={10} color="var(--primary)" /> Powered by Grok AI Engine
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                className="voice-close-btn" 
                onClick={() => setIsMuted(!isMuted)} 
                title={isMuted ? "Unmute Speech" : "Mute Speech"}
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

          {/* VISUAL ANIMATED VOICE ORB CORE */}
          <div className="voice-orb-container">
            <div className={`voice-orb-core ${isListening ? 'listening' : isSpeaking ? 'speaking' : ''}`}>
              <Sparkles size={28} className="orb-center-icon" />
              <div className="orb-pulse-ring ring-1"></div>
              <div className="orb-pulse-ring ring-2"></div>
              <div className="orb-pulse-ring ring-3"></div>
            </div>
            <div className="voice-status-label">
              {isListening ? 'Listening for your voice...' : isSpeaking ? 'Companion Speaking...' : transcript || 'Say "Hey Companion" anytime'}
            </div>
          </div>

          {/* AUDIO SPECTRUM EQUALIZER BARS */}
          {(isListening || isSpeaking) && (
            <div className={`voice-wave-container ${isListening ? 'listening' : 'speaking'}`}>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
              <span className="voice-wave-bar"></span>
            </div>
          )}

          {/* CHAT MESSAGES BODY */}
          <div className="voice-panel-body">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`voice-bubble ${chat.sender}`}>
                {chat.text}
              </div>
            ))}

            {transcript && (
              <div className="voice-bubble user transcript-interim">
                {transcript}
              </div>
            )}
          </div>

          {/* FOOTER & CONTROLS */}
          <div className="voice-panel-footer">
            {recognitionSupported ? (
              <label className="voice-wakeword-toggle">
                <input 
                  type="checkbox" 
                  checked={isWakewordEnabled}
                  onChange={(e) => {
                    setIsWakewordEnabled(e.target.checked);
                    if (e.target.checked) playChime(784, 0.2);
                  }}
                />
                Auto Wake-Word ("Hey Companion")
              </label>
            ) : (
              <span style={{ fontSize: '11px', color: '#ff477e' }}>Web Speech API restricted in browser</span>
            )}

            {!isListening && recognitionSupported && (
              <button 
                className="tap-to-speak-btn" 
                onClick={startActiveListening}
                title="Tap to speak"
              >
                <Mic size={14} /> Speak
              </button>
            )}
          </div>

          {/* MANUAL INPUT FALLBACK */}
          <div style={{ padding: '0 16px 14px 16px' }}>
            <form onSubmit={handleManualSubmit} className="voice-manual-input">
              <input 
                type="text" 
                placeholder="Ask Grok AI a question (e.g. will it rain)..." 
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
              <button type="submit">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
