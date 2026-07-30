import { Trophy, Gift, Star, Award, Zap, ArrowRight } from 'lucide-react';
import './RewardsScreen.css';

export default function RewardsScreen() {
  const storeItems = [
    { title: 'MTC Monthly Bus Pass Discount', points: 800, desc: '₹500 subsidy on Tamil Nadu MTC bus pass', icon: Gift },
    { title: 'CMRL Metro Travel Card Top-Up', points: 500, desc: '₹200 instant Metro card recharge', icon: Trophy },
    { title: 'TANGEDCO Green Energy Credit', points: 600, desc: '₹300 discount on monthly TNEB bill', icon: Zap },
    { title: 'GCC Civic Champion Certificate', points: 1500, desc: 'Official digital badge & Mayor commendation', icon: Award }
  ];

  return (
    <div className="rewards-container">
      {/* POINTS CARD */}
      <div className="rewards-points-card">
        <div>
          <span style={{ fontSize: 12, color: '#fdd835', fontWeight: 700, textTransform: 'uppercase' }}>
            தமிழ்நாடு குடிமகன் புள்ளி இருப்பு (TN Karma Points)
          </span>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', marginTop: 4 }}>
            1,850 <span style={{ fontSize: 18, color: '#fdd835' }}>Points</span>
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Earn points by reporting verified potholes, taking MTC buses, and eco commuting.
          </p>
        </div>

        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            background: 'var(--gradient-fire)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 24px rgba(229,57,53,0.5)'
          }}
        >
          <Trophy size={36} />
        </div>
      </div>

      {/* REWARDS STORE GRID */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#ffffff' }}>
          தமிழ்நாடு சலுகை வவுச்சர்கள் (TN Redeemable Vouchers)
        </h3>

        <div className="rewards-grid">
          {storeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="reward-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'rgba(251, 140, 0, 0.2)',
                      color: '#fb8c00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>{item.title}</h4>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fdd835' }}>
                      {item.points} Points
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: '#94a3b8' }}>{item.desc}</p>

                <button
                  style={{
                    background: 'var(--gradient-fire)',
                    border: 'none',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                  onClick={() => alert(`Redeemed ${item.title} for ${item.points} points!`)}
                >
                  வவுச்சரைப் பெறு (Redeem Voucher) <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
