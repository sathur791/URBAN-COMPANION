import { useState } from 'react';
import { ShieldAlert, CheckCircle2, Car, Info } from 'lucide-react';
import './NotificationCentre.css';

export default function NotificationCentre() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'வடகிழக்கு பருவமழை எச்சரிக்கை (Monsoon Alert)',
      desc: 'Heavy coastal rainfall warning for Chennai, Kanchipuram & Tiruvallur. 108 Emergency teams ready.',
      time: '15 mins ago',
      unread: true,
      icon: ShieldAlert,
      color: '#ef4444'
    },
    {
      id: 2,
      type: 'complaint',
      title: 'GCC புகார் GCC-8980 தீர்வாக்கப்பட்டது',
      desc: 'Greater Chennai Corporation resolved waterlogging issue near Anna Salai Thousand Lights junction.',
      time: '1 hour ago',
      unread: true,
      icon: CheckCircle2,
      color: '#10b981'
    },
    {
      id: 3,
      type: 'traffic',
      title: 'MTC Bus Route Diversion (T. Nagar)',
      desc: 'Metropolitan Transport Corporation buses rerouted via Usman Road Flyover due to civic improvement work.',
      time: '2 hours ago',
      unread: false,
      icon: Car,
      color: '#fb8c00'
    },
    {
      id: 4,
      type: 'system',
      title: 'TANGEDCO மின் பராமரிப்பு அறிவிப்பு',
      desc: 'Scheduled TANGEDCO substation maintenance completed in Adyar & Velachery. Full power restored.',
      time: '1 day ago',
      unread: false,
      icon: Info,
      color: '#fdd835'
    }
  ]);

  const filteredNotifs = notifications.filter(
    (n) => filter === 'all' || (filter === 'unread' && n.unread) || n.type === filter
  );

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="notif-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
            தமிழ்நாடு அறிவிப்புகள் மையம (TN Notification Centre)
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
            Real-time monsoon warnings, MTC bus updates, and GCC ticket resolutions.
          </p>
        </div>

        <button
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={markAllRead}
        >
          அனைத்தும் படித்ததாகக் குறி (Mark All Read)
        </button>
      </div>

      {/* FILTER CHIPS */}
      <div className="notif-filter-row">
        <button className={`notif-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          அனைத்து அறிவிப்புகளும் (All)
        </button>
        <button className={`notif-filter-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
          படிக்காதவை (Unread)
        </button>
        <button className={`notif-filter-btn ${filter === 'urgent' ? 'active' : ''}`} onClick={() => setFilter('urgent')}>
          அவசர எச்சரிக்கை (SOS Alerts)
        </button>
        <button className={`notif-filter-btn ${filter === 'complaint' ? 'active' : ''}`} onClick={() => setFilter('complaint')}>
          GCC புகார்கள் (GCC Updates)
        </button>
      </div>

      {/* NOTIFICATION TIMELINE CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredNotifs.map((notif) => {
          const Icon = notif.icon;
          return (
            <div key={notif.id} className={`notif-card ${notif.unread ? 'unread' : ''}`}>
              <div className="notif-icon-box" style={{ background: `${notif.color}20`, color: notif.color }}>
                <Icon size={20} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{notif.title}</h4>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{notif.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
