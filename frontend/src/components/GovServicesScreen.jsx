import { useState } from 'react';
import { Landmark, Search, FileText, Clock, MapPin, CheckSquare, ArrowRight, X } from 'lucide-react';
import './GovServicesScreen.css';

export default function GovServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'tangedco',
      title: 'TANGEDCO மின்சாரக் கட்டணம் (EB Bill Payment & New Service)',
      category: 'மின்சார வாரியம் (TANGEDCO Power Grid)',
      fee: '₹0 Service Fee (Free e-Sevai)',
      hours: '24/7 Digital e-Sevai Portal',
      location: 'TANGEDCO Section Office / Online Portal',
      docs: ['EB Consumer Number (10 Digit)', 'Aadhaar Card', 'Property Document / Rent Agreement'],
      guide: 'Instant TANGEDCO electricity bill payment, tariff calculation, or new meter service application.'
    },
    {
      id: 'cmwssb',
      title: 'CMWSSB குடிநீர் & கழிவுநீர் இணைப்பு (Water & Sewerage Tax)',
      category: 'குடிநீர் வாரியம் (CMWSSB & TWAD Board)',
      fee: '₹150 Application Fee',
      hours: 'Mon-Sat 09:00 AM - 05:00 PM',
      location: 'CMWSSB Depot Office / Corporation Hub',
      docs: ['Property Tax Receipt (Annual)', 'Aadhaar Card', 'Site Plan Sketch'],
      guide: 'Apply for new water supply connection, metro water tanker booking, or pay water tax online.'
    },
    {
      id: 'patta',
      title: 'பட்டா / சிட்டா மாற்றம் (Patta & Chitta Transfer)',
      category: 'வருவாய்த்துறை (TN Revenue & Land Records)',
      fee: '₹60 Govt Processing Fee',
      hours: 'Mon-Fri 10:00 AM - 05:00 PM',
      location: 'Taluk Office / TN e-Sevai Center',
      docs: ['Registered Sale Deed Document', 'Encumbrance Certificate (EC)', 'Identity Proof'],
      guide: 'Transfer land Patta/Chitta online via Tamil Nadu e-Services Revenue department.'
    },
    {
      id: 'cmda',
      title: 'CMDA கட்டட அனுமதி (Building Plan Approval)',
      category: 'நகர்ப்புற வளர்ச்சி (CMDA & DTCP)',
      fee: '₹2,500 Plan Verification',
      hours: 'Mon-Fri 10:00 AM - 04:00 PM',
      location: 'CMDA Office, Egmore, Chennai / DTCP Regional',
      docs: ['Architect Structural Drawing PDF', 'Patta Copy', 'Structural Stability Cert'],
      guide: 'Submit residential or commercial building blueprints for automated AI CMDA zoning clearance.'
    },
    {
      id: 'esevai',
      title: 'பிறப்பு / இறப்பு சான்றிதழ் (Birth & Death Certificate)',
      category: 'GCC & TN e-Sevai Portal',
      fee: '₹0 (Free Digital Download)',
      hours: '24/7 Online Portal',
      location: 'Greater Chennai Corporation / Municipality',
      docs: ['Hospital Registration Reference Number', 'Parent / Deceased Aadhaar Number'],
      guide: 'Download official digital Birth or Death certificates with QR code verification.'
    }
  ];

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="gov-container">
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
          தமிழ்நாடு அரசு இ-சேவை மையம் (TN e-Sevai & Gov Services)
        </h2>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
          Access TANGEDCO, CMWSSB, GCC, CMDA, and TN Land Revenue certificates instantly.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="gov-search-bar">
        <Search size={20} color="#94a3b8" />
        <input
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: 15,
            padding: '8px 12px'
          }}
          placeholder="Search TANGEDCO EB, CMWSSB water tax, Patta/Chitta, CMDA, GCC..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CARDS GRID */}
      <div className="gov-cards-grid">
        {filtered.map((service) => (
          <div key={service.id} className="gov-card" onClick={() => setSelectedService(service)}>
            <div>
              <span style={{ fontSize: 11, color: '#fb8c00', fontWeight: 700, textTransform: 'uppercase' }}>
                {service.category}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{service.title}</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>{service.guide}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fdd835' }}>{service.fee}</span>
              <button
                style={{
                  background: 'var(--gradient-fire)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                சரிபார்ப்பு பட்டியல் (Checklist) <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SERVICE DETAILS MODAL */}
      {selectedService && (
        <div className="gov-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="gov-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 11, color: '#fb8c00', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedService.category}
                </span>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{selectedService.title}</h3>
              </div>
              <button
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setSelectedService(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <strong style={{ color: '#fdd835' }}>கட்டணம் (Fee):</strong> {selectedService.fee}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <Clock size={18} color="#fb8c00" /> <strong>நேரம் (Hours):</strong> {selectedService.hours}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <MapPin size={18} color="#ef4444" /> <strong>அலுவலகம் (Office):</strong> {selectedService.location}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#ffffff' }}>
                தேவையான ஆவணங்கள் (Required Documents):
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none' }}>
                {selectedService.docs.map((doc, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                    <CheckSquare size={16} color="#10b981" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            <button
              style={{
                background: 'var(--gradient-fire)',
                border: 'none',
                color: 'white',
                padding: '14px 24px',
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(229, 57, 53, 0.5)'
              }}
              onClick={() => {
                alert(`TN e-Sevai online process initiated for ${selectedService.title}!`);
                setSelectedService(null);
              }}
            >
              இ-சேவை ஆன்லைன் விண்ணப்பம் துவங்கு (Apply Now)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
