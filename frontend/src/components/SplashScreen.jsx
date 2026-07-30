import { useState, useEffect } from 'react';
import { Building2, Sparkles } from 'lucide-react';
import './SplashScreen.css';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onFinish && onFinish(), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-glow">
          <Building2 className="splash-logo-icon" />
        </div>

        <span
          style={{
            fontSize: 12,
            background: 'rgba(253, 216, 53, 0.2)',
            color: '#fdd835',
            padding: '4px 14px',
            borderRadius: 99,
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: 8
          }}
        >
          தமிழ்நாடு அரசு - TN SMART CITY OS
        </span>

        <h1 className="splash-title">URBAN COMPANION</h1>
        <p className="splash-tagline">தமிழ்நாடு AI நகர்ப்புற சேவை • Building Smarter Cities</p>

        {/* Animated Skyline Graphic representing Tamil Nadu landmarks */}
        <div className="skyline-svg-container">
          <svg viewBox="0 0 400 120" width="100%" height="100%">
            {/* Buildings / Tower Architecture */}
            <rect className="skyline-building" x="10" y="40" width="35" height="80" rx="3" />
            {/* Gopuram / Highrise silhouette */}
            <polygon points="72.5,10 50,40 95,40" fill="rgba(251, 140, 0, 0.25)" stroke="#fb8c00" strokeWidth="1.5" />
            <rect className="skyline-building" x="50" y="40" width="45" height="80" rx="4" />
            
            <rect className="skyline-building" x="100" y="55" width="30" height="65" rx="3" />
            <rect className="skyline-building" x="135" y="15" width="50" height="105" rx="5" />
            <rect className="skyline-building" x="190" y="30" width="40" height="90" rx="4" />
            
            {/* Chennai Central Clocktower style pillar */}
            <rect className="skyline-building" x="240" y="20" width="28" height="100" rx="3" />
            <polygon points="254,5 238,20 270,20" fill="rgba(229, 57, 53, 0.4)" stroke="#e53935" strokeWidth="1.5" />

            <rect className="skyline-building" x="275" y="35" width="48" height="85" rx="5" />
            <rect className="skyline-building" x="328" y="45" width="35" height="75" rx="3" />

            {/* Glowing Windows */}
            <circle className="skyline-window" cx="72" cy="55" r="2.5" />
            <circle className="skyline-window" cx="160" cy="35" r="3" />
            <circle className="skyline-window" cx="254" cy="40" r="3" />
            <circle className="skyline-window" cx="300" cy="50" r="3" />
          </svg>
        </div>

        <div className="splash-progress-bar-track">
          <div className="splash-progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
