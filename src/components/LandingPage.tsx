import { Link } from 'react-router-dom';
import { Activity, Shield, TrendingUp, MapPin, Users, Stethoscope, FlaskConical, BedDouble, ChevronRight, HeartPulse, Globe2, Zap, Lock, Sparkles, CheckCircle, ArrowRight, Play, Server, Clock } from 'lucide-react';

const features = [
  { icon: HeartPulse, title: 'AI-Powered Triage', description: 'Gemini-driven symptom assessment for ASHA workers. Real-time severity scoring and dispatch coordination.', color: '#DC2626', bg: '#FEF2F2' },
  { icon: Activity, title: 'Live Inventory Monitoring', description: 'Medicine stock tracking with automatic early-warning alerts and AI demand forecasts across all PHCs/CHCs.', color: '#D97706', bg: '#FFFBEB' },
  { icon: BedDouble, title: 'Bed Availability Ledger', description: 'Real-time bed occupancy tracking. Predictive bed demand forecasting prevents capacity crises before they occur.', color: '#0D9488', bg: '#F0FDFA' },
  { icon: Stethoscope, title: 'Geo-Fenced Doctor Attendance', description: 'Attendance tracking with leave management, AI coverage forecasting, and automatic replacement shortage flagging.', color: '#1A5C9E', bg: '#EFF6FF' },
  { icon: FlaskConical, title: 'Diagnostic Lab Audits', description: 'Lab sample lifecycle management, test availability audits, and diagnostic equipment status monitoring.', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: TrendingUp, title: 'Epidemiological Analytics', description: 'Footfall trends, seasonal disease mapping, and AI-driven regional resource redistribution recommendations.', color: '#0891B2', bg: '#ECFEFF' },
  { icon: MapPin, title: 'Regional Resource Locator', description: 'District-wide map of all SubCenters, PHCs, and CHCs with live status and ambulance geo-routing.', color: '#16A34A', bg: '#F0FDF4' },
  { icon: Shield, title: 'Admin Control Tower', description: 'Underperforming rural facilities flagged automatically. Approve critical supply redistributions with one click.', color: '#BE185D', bg: '#FDF2F8' },
];

const stats = [
  { value: '11', label: 'Integrated Modules' },
  { value: '3', label: 'Role Tailored Views' },
  { value: 'AI', label: 'Gemini 2.5 Engine' },
  { value: '100%', label: 'Offline Resilience' },
];

const whyReasons = [
  {
    icon: Server,
    title: "Zero-Latency Offline Resilience",
    desc: "Built specifically for low-connectivity rural health centers. Work seamlessly during internet outages with automatic background sync.",
    color: "#0D9488"
  },
  {
    icon: Sparkles,
    title: "Autonomous Clinical AI Co-Pilot",
    desc: "Google Gemini translates complex symptoms into instant RED/YELLOW/GREEN emergency triage protocols and first-aid instructions.",
    color: "#3B82F6"
  },
  {
    icon: Clock,
    title: "Predictive Resource Allocation",
    desc: "Our AI forecasts epidemic surges 30 days in advance, automatically reordering antibiotics and re-routing ambulances before shortages hit.",
    color: "#8B5CF6"
  }
];

const roles = [
  { role: 'Admin', icon: Shield, desc: 'Full district oversight, redistribution approvals, epidemiological heatmaps, and performance monitoring.', color: '#1A5C9E' },
  { role: 'PHC-Staff', icon: Users, desc: 'Inventory management, patient OPD queue registration, bed occupancy, and lab sample processing.', color: '#0D9488' },
  { role: 'ASHA-Worker', icon: HeartPulse, desc: 'Field symptom triage, emergency ambulance dispatch, patient referral, and geo-fenced check-in.', color: '#DC2626' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      
      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #0D9488, #1A5C9E)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(13,148,136,0.3)' }}>
              <HeartPulse size={22} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.5px' }}>SwasthyaLink <span style={{ color: '#2DD4BF' }}>AI</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
              Sign In
            </Link>
            <Link to="/signup" style={{ background: 'linear-gradient(135deg, #0D9488, #1A5C9E)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '9px 22px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(13,148,136,0.25)' }}>
              Get Started <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center', position: 'relative' }}>
        {/* Glow Background */}
        <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 700, height: 350, background: 'radial-gradient(ellipse at center, rgba(13,148,136,0.18), rgba(26,92,158,0.12), transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.35)', borderRadius: 100, padding: '6px 18px', marginBottom: 28, fontSize: 13, color: '#2DD4BF', fontWeight: 600 }}>
          <Sparkles size={14} className="animate-pulse" />
          Powered by Autonomous Google Gemini AI
        </div>

        <h1 style={{ fontSize: 'clamp(42px, 6.5vw, 76px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2.5px', marginBottom: 24, background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          India’s First Autonomous AI Agent for Rural Healthcare
        </h1>

        <p style={{ fontSize: 20, color: '#94A3B8', maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.6, fontWeight: 400 }}>
          Bridge the clinical gap across PHCs and ASHA networks. Eliminate medicine stock-outs, automate triage severity scoring, and coordinate emergency ambulances in real time.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
          <Link to="/signup" style={{ background: 'linear-gradient(135deg, #0D9488, #1A5C9E)', color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: 14, fontWeight: 700, fontSize: 17, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 35px rgba(13,148,136,0.35)', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            Launch Dashboard <ArrowRight size={18} />
          </Link>
          <Link to="/login" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#F8FAFC', textDecoration: 'none', padding: '16px 36px', borderRadius: 14, fontWeight: 600, fontSize: 17, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}>
            Explore Live Demo
          </Link>
        </div>

        {/* ── INTERACTIVE VISUAL PREVIEW CARD ── */}
        <div style={{ maxWidth: 960, margin: '0 auto', background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', textAlign: 'left', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginLeft: 8 }}>AI Triage & Emergency Console (Live Preview)</span>
            </div>
            <span style={{ fontSize: 12, background: 'rgba(16,185,129,0.15)', color: '#34D399', padding: '4px 12px', borderRadius: 100, fontWeight: 700 }}>● All Systems Online</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', background: 'rgba(239,68,68,0.15)', padding: '3px 10px', borderRadius: 100 }}>RED FLAG ALERT</span>
                <span style={{ fontSize: 12, color: '#64748B' }}>Just Now</span>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Patient: Ramesh Kumar (45, M)</h4>
              <p style={{ fontSize: 13, color: '#CBD5E1', marginBottom: 12 }}>Severe chest pain radiating to left jaw, SPO2 88%, pulse 115.</p>
              <div style={{ fontSize: 12, color: '#34D399', background: 'rgba(16,185,129,0.1)', padding: '8px 12px', borderRadius: 10, borderLeft: '3px solid #10B981', fontWeight: 600 }}>
                🤖 Gemini AI: Immediate ECG & sublingual Aspirin. Dispatched Ambulance DL-01-A-992.
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#2DD4BF', background: 'rgba(13,148,136,0.15)', padding: '3px 10px', borderRadius: 100 }}>AI STOCK FORECAST</span>
                <span style={{ fontSize: 12, color: '#64748B' }}>PHC Sonipat</span>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Amoxicillin 500mg Depot</h4>
              <p style={{ fontSize: 13, color: '#CBD5E1', marginBottom: 12 }}>Current Stock: 1,450 units. Expected 30-day demand: 2,800 units.</p>
              <div style={{ fontSize: 12, color: '#38BDF8', background: 'rgba(56,189,248,0.1)', padding: '8px 12px', borderRadius: 10, borderLeft: '3px solid #38BDF8', fontWeight: 600 }}>
                ⚡ Auto-Reorder Triggered: 2,000 units dispatched from District Hub.
              </div>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: '1 1 150px', textAlign: 'center', padding: '0 24px', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontSize: 40, fontWeight: 900, background: 'linear-gradient(135deg, #2DD4BF, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SWASTHYALINK SECTION ── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 14 }}>Why SwasthyaLink AI?</h2>
            <p style={{ color: '#94A3B8', fontSize: 17, maxWidth: 650, margin: '0 auto' }}>
              Traditional hospital software fails in rural India. We engineered SwasthyaLink around the real-world constraints of Primary Health Centers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {whyReasons.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(15,23,42,0.6)', border: `1px solid ${item.color}30`, borderRadius: 20, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${item.color}15`, border: `1px solid ${item.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <item.icon size={24} color={item.color} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Everything You Need to Run a District Health Grid</h2>
          <p style={{ color: '#64748B', fontSize: 16 }}>11 deeply integrated modules operating as a single unified intelligence loop.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 24px', transition: 'all 0.25s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = f.color + '60'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#fff' }}>{f.title}</h3>
              <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Tailored Workspaces for Every Role</h2>
            <p style={{ color: '#64748B', fontSize: 16 }}>Role-based access ensures health workers see exactly what they need with zero clutter.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {roles.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${r.color}35`, borderRadius: 22, padding: '34px 28px' }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: `${r.color}15`, border: `1px solid ${r.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <r.icon size={26} color={r.color} />
                </div>
                <div style={{ display: 'inline-block', background: `${r.color}18`, border: `1px solid ${r.color}35`, borderRadius: 100, padding: '4px 14px', fontSize: 12, fontWeight: 700, color: r.color, marginBottom: 14, fontFamily: '"JetBrains Mono", monospace' }}>{r.role}</div>
                <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY BANNER ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.18), rgba(26,92,158,0.18))', border: '1px solid rgba(13,148,136,0.35)', borderRadius: 24, padding: '44px 48px', display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={32} color="#2DD4BF" />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8, color: '#fff' }}>Enterprise Security & Dual-Layer Authentication</h3>
            <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7 }}>Featuring dual-layer JWT token persistence (HttpOnly cookies + Bearer headers) for 100% serverless cloud stability. All AI operations run securely on backend containers — API keys never leak to client browsers.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Dual JWT Auth', 'bcrypt 10-Round', 'Strict RBAC', 'Cloud Ready'].map(tag => (
              <span key={tag} style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#2DD4BF' }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 100px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>Ready to transform rural healthcare?</h2>
        <p style={{ color: '#64748B', fontSize: 18, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Join the autonomous AI grid designed for India's last-mile health workers and district medical officers.</p>
        <Link to="/signup" style={{ background: 'linear-gradient(135deg, #0D9488, #1A5C9E)', color: '#fff', textDecoration: 'none', padding: '18px 52px', borderRadius: 16, fontWeight: 700, fontSize: 18, display: 'inline-flex', alignItems: 'center', gap: 12, boxShadow: '0 15px 45px rgba(13,148,136,0.4)' }}>
          <Globe2 size={22} />
          Launch SwasthyaLink — Free
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '36px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <HeartPulse size={18} color="#0D9488" />
          <span style={{ fontWeight: 700, color: '#64748B' }}>SwasthyaLink AI Grid</span>
        </div>
        <p>Engineered for rural healthcare resilience across India. Built with Google Gemini 2.5.</p>
      </footer>
    </div>
  );
}
