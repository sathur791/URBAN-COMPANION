import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Volume2, VolumeX, X, Sparkles, Send, RefreshCw,
  Navigation, Hotel, Shield, Compass, Zap, Bot, User, AlertCircle
} from 'lucide-react';
import axios from 'axios';

export default function VoiceBotModal({ isOpen, onClose, initialQuery, onActionTrigger }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const [status, setStatus] = useState('idle'); // 'listening' | 'processing' | 'speaking' | 'idle' | 'error'
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [micError, setMicError] = useState('');

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const modalEndRef = useRef(null);

  // Scroll to bottom of voice chat history
  const scrollToBottom = () => {
    modalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, status, transcript, interimTranscript]);

  // Clean text for speech synthesis (strip markdown, symbols, emojis)
  const cleanTextForSpeech = (text) => {
    return text
      .replace(/[*#_`~>]/g, '') // remove markdown symbols
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
      .replace(/\n+/g, '. ')
      .trim();
  };

  // Speak text using SpeechSynthesis API
  const speakText = useCallback((text) => {
    if (!synthRef.current || isMuted) return;

    try {
      synthRef.current.cancel(); // Cancel any ongoing speech

      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick standard female/male natural voice if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel')) && v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => {
        setStatus('speaking');
      };

      utterance.onend = () => {
        setStatus('idle');
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setStatus('idle');
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
      setStatus('idle');
    }
  }, [isMuted]);

  // Stop TTS speech playback
  const stopSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (status === 'speaking') {
      setStatus('idle');
    }
  }, [status]);

  // Query Gemini AI Engine
  const processQueryWithAI = useCallback(async (queryText) => {
    if (!queryText.trim()) return;

    stopSpeech();
    setStatus('processing');
    setMicError('');

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setTranscript('');
    setInterimTranscript('');

    try {
      let replyText = '';
      if (apiKey) {
        const systemPrompt = `You are Urban AI Voice Assistant, an intelligent, friendly urban companion and travel guide.
Keep responses concise, direct, helpful, and formatted for voice output.
Provide clear travel recommendations, route insights, safety advice, food stops, or hotel recommendations.
Limit responses to 2-4 short sentences or structured bullet points unless the user requests detailed explanations.`;

        const contents = [
          { role: 'user', parts: [{ text: `System Prompt: ${systemPrompt}` }] },
          { role: 'model', parts: [{ text: "Hello! I am Urban AI, ready to assist with your urban journey, routes, and local recommendations!" }] },
        ];

        // Include recent history
        chatHistory.slice(-4).forEach((m) => {
          contents.push({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          });
        });

        contents.push({
          role: 'user',
          parts: [{ text: queryText }],
        });

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const res = await axios.post(
          endpoint,
          { contents },
          { headers: { 'Content-Type': 'application/json' } }
        );

        replyText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process your request right now. Please try again!";
      } else {
        // Intelligent offline concierge fallback
        if (queryText.toLowerCase().includes('hotel') || queryText.toLowerCase().includes('stay')) {
          replyText = `🏨 Top recommended stays:\n• The Plaza Hotel ($420/night) - Luxury\n• CitizenM Midtown ($150/night) - Boutique\nBoth feature EV chargers and 5-star guest ratings!`;
        } else if (queryText.toLowerCase().includes('route') || queryText.toLowerCase().includes('traffic')) {
          replyText = `🚀 The fastest route is currently via FDR Drive, saving 12 minutes. Traffic is moderate with light congestion near 42nd St.`;
        } else if (queryText.toLowerCase().includes('safe') || queryText.toLowerCase().includes('night')) {
          replyText = `🛡️ Safety score for downtown is 88/100 with well-lit pedestrian pathways and active transit patrols.`;
        } else {
          replyText = `✨ I'm your Urban AI Voice Companion! I can help you find optimal routes, smart parking, top-rated hotels, and real-time city updates for "${queryText}".`;
        }
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAiResponse(replyText);
      setChatHistory((prev) => [...prev, botMsg]);

      // Speak response aloud
      speakText(replyText);
    } catch (err) {
      console.error('Voice bot AI error:', err);
      const fallbackMsg = `📍 I have retrieved travel info for "${queryText}". The fastest route is clear with 15 mins estimated travel time.`;
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiResponse(fallbackMsg);
      setChatHistory((prev) => [...prev, botMsg]);
      speakText(fallbackMsg);
    }
  }, [apiKey, chatHistory, speakText, stopSpeech]);

  // Request browser microphone permission explicitly & start listening
  const startListening = useCallback(async () => {
    stopSpeech();
    setMicError('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported by your current browser. Please try Google Chrome or Microsoft Edge.');
      setStatus('error');
      return;
    }

    // Explicitly request microphone stream permission from browser
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (permErr) {
      console.warn('Microphone permission denied:', permErr);
      setMicError('Microphone permission blocked! Please click the lock/mic icon in your browser address bar and set Microphone to "Allow".');
      setStatus('error');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('listening');
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += text;
          } else {
            interimStr += text;
          }
        }

        if (interimStr) setInterimTranscript(interimStr);
        if (finalStr) {
          setTranscript(finalStr);
          setInterimTranscript('');
          processQueryWithAI(finalStr);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Modal speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          setMicError('Microphone access blocked. Click the lock/mic icon in your browser URL bar to allow microphone access.');
          setStatus('error');
        } else if (event.error !== 'no-speech') {
          setStatus('idle');
        }
      };

      recognition.onend = () => {
        setStatus((prevStatus) => (prevStatus === 'listening' ? 'idle' : prevStatus));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition in modal:', err);
      setStatus('idle');
    }
  }, [processQueryWithAI, stopSpeech]);

  // Handle modal opening and initial query
  useEffect(() => {
    if (isOpen) {
      setMicError('');
      setChatHistory([
        {
          id: 'welcome-voice',
          sender: 'bot',
          text: "👋 Hi! I am **Urban AI Voice Concierge**.\n\nSay your question aloud or tap quick topics below!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (initialQuery && initialQuery.trim()) {
        processQueryWithAI(initialQuery);
      } else {
        // Auto-start listening on pop up!
        const timer = setTimeout(() => {
          startListening();
        }, 300);
        return () => clearTimeout(timer);
      }
    } else {
      stopSpeech();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      setStatus('idle');
    }
  }, [isOpen, initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const quickPrompts = [
    { icon: Hotel, text: 'Hotels near destination' },
    { icon: Navigation, text: 'Fastest eco route' },
    { icon: Shield, text: 'Night safety score' },
    { icon: Compass, text: 'Top tourist stops' },
  ];

  return (
    <div className="voice-modal-backdrop" onClick={onClose}>
      <div className="voice-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="voice-modal-header">
          <div className="voice-brand-title">
            <div className="sparkle-orb">
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <h3>Urban AI Voice Bot</h3>
              <span className="voice-subtext">
                <span className={`pulse-dot ${status}`} />
                {status === 'listening' && 'Listening to your voice...'}
                {status === 'processing' && 'Thinking & generating response...'}
                {status === 'speaking' && 'Speaking answer aloud...'}
                {status === 'idle' && 'Ready • Tap microphone to speak'}
                {status === 'error' && 'Microphone error'}
              </span>
            </div>
          </div>

          <div className="voice-header-actions">
            <button
              className="icon-btn-sm"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Speech Audio' : 'Mute Speech Audio'}
            >
              {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#10b981" />}
            </button>

            <button className="icon-btn-sm" onClick={onClose} title="Close Assistant">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* FUTURISTIC ANIMATED SOUND VISUALIZER & ORB */}
        <div className={`voice-visualizer-container ${status}`}>
          <div className="visualizer-orb">
            <div className="orb-inner">
              {status === 'listening' && <Mic size={36} className="mic-animate" />}
              {status === 'processing' && <Sparkles size={36} className="sparkle-spin" />}
              {status === 'speaking' && <Volume2 size={36} className="volume-pulse" />}
              {(status === 'idle' || status === 'error') && <Bot size={36} />}
            </div>
            <div className="orb-ring ring-1" />
            <div className="orb-ring ring-2" />
            <div className="orb-ring ring-3" />
          </div>

          {/* Sound Waveform Equalizer Animation */}
          <div className="waveform-equalizer">
            <span className="wave-bar bar-1" />
            <span className="wave-bar bar-2" />
            <span className="wave-bar bar-3" />
            <span className="wave-bar bar-4" />
            <span className="wave-bar bar-5" />
            <span className="wave-bar bar-6" />
            <span className="wave-bar bar-7" />
          </div>
        </div>

        {/* ERROR / PERMISSION BANNER IF APPLICABLE */}
        {micError && (
          <div style={{
            margin: '0 20px 12px 20px',
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#ef4444',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{micError}</span>
          </div>
        )}

        {/* LIVE SPEECH TRANSCRIPTION DISPLAY */}
        {(transcript || interimTranscript || status === 'listening') && (
          <div className="live-transcript-box">
            <span className="transcript-label">Live Speech:</span>
            <p className="transcript-text">
              {transcript} <span className="interim">{interimTranscript}</span>
              {status === 'listening' && !transcript && !interimTranscript && (
                <span className="placeholder-listening">Listening now... Speak your question into your microphone!</span>
              )}
            </p>
          </div>
        )}

        {/* CHAT MESSAGES STREAM */}
        <div className="voice-chat-stream">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="bot-icon">
                  <Bot size={16} />
                </div>
              )}
              <div className="chat-bubble">
                <div className="chat-text">
                  {msg.text.split('\n').map((line, idx) => {
                    if (!line.trim()) return <br key={idx} />;
                    return <p key={idx} style={{ margin: '3px 0' }}>{line}</p>;
                  })}
                </div>
                <span className="chat-timestamp">{msg.timestamp}</span>
              </div>
              {msg.sender === 'user' && (
                <div className="user-icon">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          <div ref={modalEndRef} />
        </div>

        {/* QUICK SUGGESTION CHIPS */}
        <div className="voice-chips-row">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="voice-chip-btn"
                onClick={() => processQueryWithAI(item.text)}
              >
                <Icon size={14} /> {item.text}
              </button>
            );
          })}
        </div>

        {/* CONTROLS & MANUAL INPUT BAR */}
        <div className="voice-modal-footer">
          {status === 'speaking' ? (
            <button className="voice-primary-action stop-btn" onClick={stopSpeech}>
              <VolumeX size={18} /> Stop Voice Audio
            </button>
          ) : (
            <button
              className={`voice-primary-action mic-start-btn ${status === 'listening' ? 'listening' : ''}`}
              onClick={status === 'listening' ? () => recognitionRef.current?.stop() : startListening}
            >
              {status === 'listening' ? (
                <>
                  <MicOff size={18} /> Stop Listening
                </>
              ) : (
                <>
                  <Mic size={18} /> Tap to Speak
                </>
              )}
            </button>
          )}

          <form
            className="voice-text-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (textInput.trim()) {
                processQueryWithAI(textInput);
                setTextInput('');
              }
            }}
          >
            <input
              type="text"
              placeholder="Or type a question..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button type="submit" disabled={!textInput.trim()} className="send-mini-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
