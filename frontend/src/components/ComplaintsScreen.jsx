import { useState } from 'react';
import { Upload, Camera, Image, Mic, Sparkles, CheckCircle2, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import './ComplaintsScreen.css';

export default function ComplaintsScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [complaintsList, setComplaintsList] = useState([
    {
      id: 'GCC-9042',
      category: 'மழைநீர் தேக்கம் (Waterlogging & Drainage)',
      location: 'Anna Salai near Thousand Lights, Chennai',
      severity: 'Critical',
      status: 'Dispatched',
      date: 'Today, 10:14 AM'
    },
    {
      id: 'GCC-8980',
      category: 'TANGEDCO மின் தடை (Power Outage)',
      location: 'RS Puram, Coimbatore',
      severity: 'Medium',
      status: 'Resolved',
      date: 'Yesterday, 04:30 PM'
    }
  ]);

  const handleSimulatedUpload = (fileObj) => {
    setSelectedFile(fileObj || { name: 'road_damage_tn.jpg' });
    setAnalyzing(true);
    setAiResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setAiResult({
        category: 'GCC Road Damage & Pothole (அண்ணா சாலை)',
        severity: 'Critical',
        confidence: '97.2%',
        suggestedDepartment: 'Greater Chennai Corporation (GCC) - Zone 9',
        priorityScore: '9.2 / 10'
      });
    }, 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulatedUpload({ name: e.target.files[0].name });
    }
  };

  const handleSubmitComplaint = () => {
    if (!aiResult) return;

    const newCmp = {
      id: `GCC-${Math.floor(1000 + Math.random() * 9000)}`,
      category: aiResult.category,
      location: 'T. Nagar, Chennai (GPS Auto-Pin)',
      severity: aiResult.severity,
      status: 'Submitted',
      date: 'Just now'
    };

    setComplaintsList([newCmp, ...complaintsList]);
    setSelectedFile(null);
    setAiResult(null);
    alert('புகார் வெற்றிகரமாக GCC / TANGEDCO அதிகாரிகளுக்கு அனுப்பப்பட்டது! (Complaint Submitted Successfully)');
  };

  return (
    <div className="complaint-container">
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
          புகார் பதிவு போர்ட்டல் (Civic Incident Portal)
        </h2>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
          Upload media to trigger Grok AI computer vision analysis & dispatch to GCC / TN Local Bodies.
        </p>
      </div>

      {/* 1. DRAG & DROP UPLOAD AREA */}
      <div
        className="upload-dropzone"
        onClick={() => document.getElementById('file-input-id').click()}
      >
        <input
          type="file"
          id="file-input-id"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />

        {analyzing && <div className="ai-scan-laser" />}

        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'var(--gradient-fire)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(229,57,53,0.5)'
          }}
        >
          <Upload size={32} />
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700 }}>
          {selectedFile ? selectedFile.name : 'புகார் படங்களை பதிவேற்றவும் (Upload Incident Photo)'}
        </h3>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
          Supports Potholes, Waterlogging, TANGEDCO Power Cut, Garbage, Sewage Overflow
        </p>

        {/* Action Buttons */}
        <div className="upload-action-buttons" onClick={(e) => e.stopPropagation()}>
          <button
            className="upload-btn"
            onClick={() => handleSimulatedUpload({ name: 'camera_capture_tn.jpg' })}
          >
            <Camera size={16} /> கேமரா (Camera)
          </button>

          <button
            className="upload-btn"
            onClick={() => handleSimulatedUpload({ name: 'gallery_tn.png' })}
          >
            <Image size={16} /> கேலரி (Gallery)
          </button>

          <button
            className="upload-btn"
            onClick={() => handleSimulatedUpload({ name: 'voice_complaint_tn.mp3' })}
          >
            <Mic size={16} /> குரல் புகார் (Voice)
          </button>
        </div>
      </div>

      {/* 2. AI ANALYSIS RESULTS CARD */}
      {analyzing && (
        <div className="ai-analysis-card" style={{ textAlign: 'center', padding: 36 }}>
          <Sparkles size={36} color="#fb8c00" className="pulse-dot" style={{ margin: '0 auto' }} />
          <h4 style={{ fontSize: 18, fontWeight: 800, marginTop: 12 }}>
            AI Scanning Image & Routing to GCC / TANGEDCO...
          </h4>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            AI image vision model calculating severity index and TN district department.
          </p>
        </div>
      )}

      {aiResult && !analyzing && (
        <div className="ai-analysis-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={22} color="#fdd835" />
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>AI பார்வை பகுப்பாய்வு முடிவு (Scan Result)</h3>
            </div>
            <span
              className="severity-pill"
              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}
            >
              <AlertTriangle size={14} /> Severity: {aiResult.severity}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Detected Issue</span>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{aiResult.category}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>AI Confidence</span>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>{aiResult.confidence}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Routing Authority</span>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{aiResult.suggestedDepartment}</div>
            </div>
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
              marginTop: 12,
              boxShadow: '0 6px 20px rgba(229, 57, 53, 0.5)'
            }}
            onClick={handleSubmitComplaint}
          >
            புகாரை உடனடியாக அதிகாரிகளுக்கு அனுப்பு (Submit Ticket)
          </button>
        </div>
      )}

      {/* 3. RECENT COMPLAINTS TIMELINE & STATUS */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>எனது புகார்கள் (My Reported Complaints)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {complaintsList.map((cmp) => (
            <div
              key={cmp.id}
              style={{
                background: 'rgba(18, 20, 31, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 20,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: 12, color: '#fb8c00', fontWeight: 700 }}>{cmp.id}</span>
                  <h4 style={{ fontSize: 16, fontWeight: 800 }}>{cmp.category}</h4>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>{cmp.location} • {cmp.date}</p>
                </div>
                <span
                  style={{
                    background: cmp.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 140, 0, 0.2)',
                    color: cmp.status === 'Resolved' ? '#10b981' : '#fb8c00',
                    padding: '4px 12px',
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  {cmp.status}
                </span>
              </div>

              {/* Step Timeline */}
              <div className="timeline-tracker">
                <div className="timeline-step completed">
                  <div className="timeline-dot"><CheckCircle2 size={16} /></div>
                  <span style={{ fontSize: 10, color: '#ffffff' }}>Submitted</span>
                </div>
                <div className="timeline-step completed">
                  <div className="timeline-dot"><ShieldCheck size={16} /></div>
                  <span style={{ fontSize: 10, color: '#ffffff' }}>AI Verified</span>
                </div>
                <div className={`timeline-step ${cmp.status !== 'Submitted' ? 'completed' : ''}`}>
                  <div className="timeline-dot"><Clock size={16} /></div>
                  <span style={{ fontSize: 10 }}>Field Assigned</span>
                </div>
                <div className={`timeline-step ${cmp.status === 'Resolved' ? 'completed' : ''}`}>
                  <div className="timeline-dot"><CheckCircle2 size={16} /></div>
                  <span style={{ fontSize: 10 }}>Resolved</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
