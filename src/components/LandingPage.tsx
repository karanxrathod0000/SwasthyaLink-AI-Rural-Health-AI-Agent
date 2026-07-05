import { Link } from 'react-router-dom';
import { Activity, Shield, TrendingUp, MapPin, Users, Stethoscope, FlaskConical, BedDouble, ChevronRight, HeartPulse, Globe2, Zap, Lock } from 'lucide-react';

const features = [
  { icon: HeartPulse, title: 'AI-Powered Triage', description: 'Gemini-driven symptom assessment for ASHA workers. Real-time severity scoring and dispatch coordination.', color: '#DC2626', bg: '#FEF2F2' },
  { icon: Activity, title: 'Live Inventory Monitoring', description: 'Medicine stock tracking with automatic early-warning alerts and AI demand forecasts across all PHCs/CHCs.', color: '#D97706', bg: '#FFFBEB' },
  { icon: BedDouble, title: 'Bed Availability', description: 'Real-time bed occupancy ledger. Predictive bed demand forecasting prevents capacity crises before they occur.', color: '#0D9488', bg: '#F0FDFA' },
  { icon: Stethoscope, title: 'Doctor Attendance', description: 'Attendance tracking with leave management, AI coverage forecasting, and automatic shortage flagging.', color: '#1A5C9E', bg: '#EFF6FF' },
  { icon: FlaskConical, title: 'Diagnostic Tests', description: 'Lab sample lifecycle management, test availability audits, and equipment status monitoring.', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: TrendingUp, title: 'Analytics & Forecasting', description: 'Footfall trends, seasonal disease mapping, and AI-driven resource redistribution recommendations.', color: '#0891B2', bg: '#ECFEFF' },
  { icon: MapPin, title: 'Resource Locator', description: 'District-wide map of all SubCenters, PHCs, and CHCs with live status and geo-routing to nearest resources.', color: '#16A34A', bg: '#F0FDF4' },
  { icon: Shield, title: 'Admin Control Tower', description: 'Underperforming facilities flagged automatically. Approve supply redistributions with one click.', color: '#BE185D', bg: '#FDF2F8' },
];

const stats = [
  { value: '11', label: 'Operational Modules' },
  { value: '3', label: 'User Roles' },
  { value: 'AI', label: 'Gemini-Powered' },
  { value: '∞', label: 'Facilities Supported' },
];

const roles = [
  { role: 'Admin', icon: Shield, desc: 'Full district oversight, redistribution approvals, and performance monitoring.', color: '#1A5C9E' },
  { role: 'PHC-Staff', icon: Users, desc: 'Inventory management, patient registration, bed & doctor operations.', color: '#0D9488' },
  { role: 'ASHA-Worker', icon: HeartPulse, desc: 'Field triage, emergency dispatch, patient referral, and geofence check-in.', color: '#DC2626' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', fontFamily: '"Inter", sans-serif' }}>
      
      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1A5C9E, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartPulse size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>SwasthyaLink <span style={{ color: '#0D9488' }}>AI</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              Login
            </Link>
            <Link to="/signup" style={{ background: 'linear-gradient(135deg, #1A5C9E, #0D9488)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, padding: '8px 20px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse at center, rgba(13,148,136,0.15), transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: '#0D9488', fontWeight: 600 }}>
          <Zap size={13} />
          Powered by Google Gemini AI
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24, background: 'linear-gradient(135deg, #F8FAFC 40%, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Rural Healthcare,<br />Reimagined with AI
        </h1>

        <p style={{ fontSize: 20, color: '#94A3B8', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.7 }}>
          SwasthyaLink AI is an enterprise-grade platform that brings real-time intelligence to PHCs and CHCs — eliminating stock-outs, managing patient footfall, and ensuring no centre goes under-resourced.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{ background: 'linear-gradient(135deg, #1A5C9E, #0D9488)', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(13,148,136,0.3)' }}>
            Get Started Free <ChevronRight size={18} />
          </Link>
          <Link to="/login" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#F8FAFC', textDecoration: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 600, fontSize: 16 }}>
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 48 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: '1 1 140px', textAlign: 'center', padding: '0 32px', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: 42, fontWeight: 800, background: 'linear-gradient(135deg, #0D9488, #1A5C9E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 20 }}>The Problem We Solve</h2>
          <p style={{ fontSize: 18, color: '#94A3B8', lineHeight: 1.8 }}>
            PHCs and CHCs face recurring operational gaps — <span style={{ color: '#F8FAFC', fontWeight: 600 }}>medicine stock-outs</span>, <span style={{ color: '#F8FAFC', fontWeight: 600 }}>unmanaged patient footfall</span>, <span style={{ color: '#F8FAFC', fontWeight: 600 }}>bed unavailability</span>, and <span style={{ color: '#F8FAFC', fontWeight: 600 }}>unpredictable doctor attendance</span> — all tracked manually with zero real-time visibility, leading to chronic shortages and under-resourced facilities failing rural patients.
          </p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>Everything You Need to Run a District</h2>
          <p style={{ color: '#64748B', fontSize: 16 }}>11 deeply integrated modules, one unified platform.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 24px', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = f.color + '50'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>Built for Every Role</h2>
            <p style={{ color: '#64748B', fontSize: 16 }}>Role-based access ensures each user sees exactly what they need.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {roles.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.color}30`, borderRadius: 20, padding: '32px 28px' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}15`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <r.icon size={26} color={r.color} />
                </div>
                <div style={{ display: 'inline-block', background: `${r.color}15`, border: `1px solid ${r.color}30`, borderRadius: 100, padding: '3px 12px', fontSize: 12, fontWeight: 700, color: r.color, marginBottom: 12, fontFamily: '"JetBrains Mono", monospace' }}>{r.role}</div>
                <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY BANNER ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(26,92,158,0.15), rgba(13,148,136,0.15))', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 20, padding: '40px 48px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={30} color="#0D9488" />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Enterprise-Grade Security</h3>
            <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7 }}>JWT-based sessions, bcrypt password hashing, HttpOnly cookies, and role-based access control. All AI operations run server-side — your Gemini API key never reaches the browser.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['JWT Sessions', 'bcrypt Hashing', 'RBAC', 'HttpOnly Cookies'].map(tag => (
              <span key={tag} style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 100, padding: '4px 14px', fontSize: 12, fontWeight: 600, color: '#0D9488' }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 96px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>Ready to transform rural healthcare?</h2>
        <p style={{ color: '#64748B', fontSize: 18, marginBottom: 40 }}>Join the platform designed for India's last-mile health workers.</p>
        <Link to="/signup" style={{ background: 'linear-gradient(135deg, #1A5C9E, #0D9488)', color: '#fff', textDecoration: 'none', padding: '16px 48px', borderRadius: 14, fontWeight: 700, fontSize: 18, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 40px rgba(13,148,136,0.35)' }}>
          <Globe2 size={20} />
          Get Started — It's Free
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '32px 24px', textAlign: 'center', color: '#334155', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <HeartPulse size={16} color="#0D9488" />
          <span style={{ fontWeight: 600, color: '#475569' }}>SwasthyaLink AI</span>
        </div>
        <p>Built for rural healthcare workers across India. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}
