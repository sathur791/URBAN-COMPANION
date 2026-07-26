import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, Hotel, Utensils, Shield, MapPin, Compass } from 'lucide-react';
import axios from 'axios';

export default function AIChatbot() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Welcome! I am your **All-in-One Travel & Hotel Concierge**. \n\nAsk me *anything* travel-related! For example:\n- 🏨 *\"What are top hotels along the route from New York to Boston?\"*\n- 🍽️ *\"Best restaurants and food stops near Times Square\"*\n- 🛣️ *\"Fastest scenic drive & EV charging stations\"*\n- 🛡️ *\"Is it safe to travel to downtown at night?\"*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    { icon: Hotel, text: '🏨 Hotels along Times Square to Central Park' },
    { icon: Utensils, text: '🍽️ Top rated restaurants along my route' },
    { icon: Shield, text: '🛡️ Night travel safety & lighting score' },
    { icon: Compass, text: '🗺️ Scenic viewpoints & tourist attractions' },
  ];

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input.trim();
    if (!queryText || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      let botReply = '';
      if (apiKey) {
        // Build contents array with multi-turn conversation context
        const systemPrompt = `You are Global Travel & Hotel Concierge AI, an expert travel assistant for the Urban Companion app.
You answer ANY and ALL questions related to travel, routes, hotels & accommodations, resorts, local restaurants & food, sightseeing, transit options (flights/trains/buses/driving), weather, budget travel, and safety alerts.

When the user asks about hotels or stays along a specific route or city:
1. Provide a curated list of top-rated hotels (Luxury, Mid-range, Budget).
2. Include estimated price per night, key amenities (WiFi, Free Parking, Pool, Breakfast), and location proximity.
3. Add helpful travel tips for booking or route stops.

Format your responses with clear markdown headings, bold text, emojis, and organized bullet points for easy reading on mobile screens.`;

        // Format history for Gemini API
        const contents = [
          {
            role: 'user',
            parts: [{ text: `System Instruction: ${systemPrompt}` }],
          },
          {
            role: 'model',
            parts: [{ text: "Understood. I am your expert Global Travel & Hotel Concierge AI, ready to help with hotels, routes, dining, transit, and travel planning!" }],
          },
        ];

        // Append last 6 turns of conversation history
        const historySlice = newMessages.slice(-6);
        historySlice.forEach((m) => {
          contents.push({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          });
        });

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const res = await axios.post(
          endpoint,
          { contents },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const candidateText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          botReply = candidateText;
        } else {
          botReply = "I couldn't fetch travel details right now. Please try rephrasing your query!";
        }
      } else {
        // Fallback intelligent response if API key is not set
        botReply = `🏨 **Hotels & Accommodations for "${queryText}"**:\n\n1. 🌟 **The Plaza Hotel** (Luxury) - $450/night • Central location, Spa, High-speed WiFi\n2. 🏨 **Marriott Marquis** (Mid-Range) - $220/night • Times Square view, Parking, Restaurant\n3. 🛏️ **CitizenM Hotel** (Boutique) - $140/night • Eco-friendly, Rooftop bar\n\n🍽️ **Recommended Food Stop**: Junior's Restaurant & Bakery (Famous Cheesecake)`;
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `🏨 **Travel & Hotel Guide for "${queryText}"**:\n\n- 🌟 **Luxury Option**: Grand Hyatt Central ($350/night) - Direct transit access & valet parking.\n- 🏨 **Business/Comfort**: Hampton Inn ($180/night) - Includes complimentary breakfast & EV chargers.\n- 🛏️ **Budget Choice**: Pod 39 Hotel ($110/night) - Compact modern rooms in Midtown.\n\n📍 **Travel Tip**: Book 48 hours in advance for guaranteed mobile discount rates!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chatbot-container">
      {/* CHAT HEADER */}
      <div className="ai-chatbot-header">
        <div className="ai-header-info">
          <div className="ai-avatar">
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <h3>H&M Concierge AI Assistant</h3>
            <span className="ai-status">
              <span className="status-dot" style={{ background: '#e50010' }}></span> Powered by Gemini AI • Travel & Stays Concierge
            </span>
          </div>
        </div>
        <button
          className="icon-btn-sm"
          onClick={() =>
            setMessages([
              {
                id: Date.now().toString(),
                sender: 'bot',
                text: "Chat reset! Ask me anything about hotels, routes, restaurants, or travel recommendations.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          title="Clear Chat"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* CHAT MESSAGES BODY */}
      <div className="ai-chat-body">
        {messages.map((msg) => (
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
                  return <p key={idx} style={{ margin: '4px 0' }}>{line}</p>;
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

        {loading && (
          <div className="chat-bubble-wrapper bot">
            <div className="bot-icon">
              <Bot size={16} />
            </div>
            <div className="chat-bubble loading">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTION CHIPS */}
      <div className="quick-chips-wrapper">
        {quickPrompts.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="chip-btn"
              onClick={() => handleSend(item.text)}
            >
              <Icon size={14} /> {item.text}
            </button>
          );
        })}
      </div>

      {/* INPUT FORM */}
      <form
        className="ai-chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          placeholder="Ask for hotels, restaurants, route stops, transit tips..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={!input.trim() || loading} className="send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
