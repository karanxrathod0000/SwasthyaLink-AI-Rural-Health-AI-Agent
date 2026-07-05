import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setEmail('admin@test.com');
    setPassword('test123456');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '"Inter", sans-serif' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(13,148,136,0.12), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #1A5C9E, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(13,148,136,0.3)' }}>
              <HeartPulse size={28} color="#fff" />
            </div>
            <span style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>SwasthyaLink <span style={{ color: '#0D9488' }}>AI</span></span>
          </Link>
          <p style={{ color: '#64748B', marginTop: 8, fontSize: 14 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          {/* 🔬 DEMO NOTE */}
          <div style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(16,185,129,0.15))', border: '1px solid rgba(13,148,136,0.4)', borderRadius: 12, padding: '16px', marginBottom: 22, textAlign: 'center' }}>
            <p style={{ color: '#5EEAD4', fontSize: 13, fontWeight: 700, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', justify: 'center', gap: 6 }}>
              <span>🔬</span> Demo Mode — Build with AI Hackathon
            </p>
            <p style={{ color: '#94A3B8', fontSize: 12, margin: '0 0 14px 0', lineHeight: '1.4' }}>
              Authentication is bypassed for immediate judge evaluation. All 11 modules and AI agents are pre-configured.
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ background: '#0D9488', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(13,148,136,0.3)', transition: 'transform 0.15s' }}
            >
              🚀 Launch Instant Demo (No Login Required)
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#FCA5A5', fontSize: 14 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px 12px 40px', color: '#F8FAFC', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#0D9488')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px 12px 40px', color: '#F8FAFC', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#0D9488')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? 'rgba(13,148,136,0.5)' : 'linear-gradient(135deg, #1A5C9E, #0D9488)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.2s' }}>
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: 14, marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#0D9488', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>

        {/* Demo credentials hint */}
        <div style={{ textAlign: 'center', marginTop: 20, padding: '12px 16px', background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: 10 }}>
          <p style={{ color: '#475569', fontSize: 12, margin: '0 0 6px' }}>Demo account</p>
          <p style={{ color: '#64748B', fontSize: 12, fontFamily: '"JetBrains Mono", monospace', margin: '0 0 8px' }}>
            admin@test.com &nbsp;/&nbsp; test123456
          </p>
          <button
            onClick={fillDemo}
            style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 6, padding: '4px 14px', color: '#0D9488', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            Auto-fill credentials
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: '#334155', fontSize: 13, textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
