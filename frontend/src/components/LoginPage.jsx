import { useState } from 'react';
import { auth } from '../api';
import { Compass, User, Lock, Mail, ArrowRight, Zap } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await auth.signup({ username, email, password });
        const res = await auth.login(username, password);
        onLogin(res.data.access_token);
      } else {
        const res = await auth.login(username, password);
        onLogin(res.data.access_token);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const demoUser = `user_${Math.floor(1000 + Math.random() * 9000)}`;
      const demoPass = 'demo1234';
      try {
        await auth.signup({ username: demoUser, email: `${demoUser}@example.com`, password: demoPass });
      } catch {}
      const res = await auth.login(demoUser, demoPass);
      onLogin(res.data.access_token);
    } catch (err) {
      onLogin('guest_demo_token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-badge">
            <Compass size={32} />
          </div>
          <h1>Urban Companion</h1>
          <p className="subtitle">AI-Powered Multi-Modal Urban Travel Companion</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {isSignup && (
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            <span>{loading ? 'Authenticating...' : isSignup ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ margin: '16px 0 8px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDemoGuestLogin}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--primary)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Zap size={16} /> Quick Demo Access as Guest
          </button>
        </div>

        <p className="toggle-text">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button className="link-btn" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
