import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, AuthUser } from '../context/AuthContext';
import { HeartPulse, User, Mail, Lock, Shield, Users, AlertCircle, Loader2, ChevronDown } from 'lucide-react';

const ROLES: { value: AuthUser['role']; label: string; desc: string; icon: any; color: string }[] = [
  { value: 'Admin', label: 'Admin', desc: 'District-level oversight and control', icon: Shield, color: '#1A5C9E' },
  { value: 'PHC-Staff', label: 'PHC Staff', desc: 'Health centre operations management', icon: Users, color: '#0D9488' },
  { value: 'ASHA-Worker', label: 'ASHA Worker', desc: 'Field triage and patient coordination', icon: HeartPulse, color: '#DC2626' },
];

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${focused ? '#0D9488' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10,
  padding: '12px 14px 12px 40px',
  color: '#F8FAFC',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
});

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<AuthUser['role']>('PHC-Staff');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/select-service');
    }
  };

  const selectedRole = ROLES.find(r => r.value === role)!;

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '"Inter", sans-serif' }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(26,92,158,0.12), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #1A5C9E, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(13,148,136,0.3)' }}>
              <HeartPulse size={26} color="#fff" />
            </div>
            <span style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>SwasthyaLink <span style={{ color: '#0D9488' }}>AI</span></span>
          </Link>
          <p style={{ color: '#64748B', marginTop: 8, fontSize: 14 }}>Create your account</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#FCA5A5', fontSize: 14 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Priya Sharma"
                  style={inputStyle(focused === 'name')}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  style={inputStyle(focused === 'email')}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Your Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    style={{ background: role === r.value ? `${r.color}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${role === r.value ? r.color + '60' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                    <r.icon size={18} color={role === r.value ? r.color : '#475569'} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: role === r.value ? r.color : '#64748B' }}>{r.label}</span>
                  </button>
                ))}
              </div>
              <p style={{ color: '#475569', fontSize: 12, marginTop: 6 }}>{selectedRole.desc}</p>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  style={inputStyle(focused === 'password')}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: 'block', color: '#94A3B8', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#475569" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  style={inputStyle(focused === 'confirm')}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? 'rgba(13,148,136,0.5)' : 'linear-gradient(135deg, #1A5C9E, #0D9488)', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: 14, marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0D9488', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 10 }}>
          <Link to="/" style={{ color: '#334155', fontSize: 13, textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
