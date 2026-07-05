import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Activity, Building2, ClipboardList, Package, Users,
  Bed, UserCheck, FlaskConical, BarChart3, ShieldAlert,
  ChevronRight, HeartPulse, Sparkles
} from 'lucide-react';

interface Service {
  id: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  roles?: string[]; // if set, only show to these roles
}

const SERVICES: Service[] = [
  {
    id: 'dashboard',
    label: 'Mission Control',
    description: 'District-wide overview, live alerts, and emergency dispatch coordination',
    icon: Home,
    color: '#1A5C9E',
    bg: '#EFF6FF',
  },
  {
    id: 'triage',
    label: 'Triage Console',
    description: 'AI-powered symptom assessment, patient severity scoring, and ASHA dispatch',
    icon: Activity,
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    description: 'Medicine stock tracking, early-warning alerts, and AI restock recommendations',
    icon: Package,
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    id: 'patients',
    label: 'Patient Management',
    description: 'OPD queue, patient registration, footfall forecasting, and staffing insights',
    icon: Users,
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    id: 'beds',
    label: 'Bed Management',
    description: 'Real-time bed occupancy ledger, admit/discharge workflows, and demand forecasting',
    icon: Bed,
    color: '#0D9488',
    bg: '#F0FDFA',
  },
  {
    id: 'doctors',
    label: 'Doctor Attendance',
    description: 'Doctor attendance tracking, leave management, and coverage forecasting',
    icon: UserCheck,
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    id: 'tests',
    label: 'Diagnostics & Lab',
    description: 'Test availability audit, sample lifecycle management, equipment monitoring',
    icon: FlaskConical,
    color: '#16A34A',
    bg: '#F0FDF4',
  },
  {
    id: 'resources',
    label: 'Resource Locator',
    description: 'District-wide map of facilities with live status and geo-routing',
    icon: Building2,
    color: '#BE185D',
    bg: '#FDF2F8',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Footfall trends, disease mapping, and AI-driven performance insights',
    icon: BarChart3,
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    id: 'workers',
    label: 'ASHA Workers',
    description: 'Field worker attendance logs, geofencing, and anomaly audit trail',
    icon: ClipboardList,
    color: '#0D9488',
    bg: '#F0FDFA',
  },
  {
    id: 'admin',
    label: 'Admin Control Tower',
    description: 'District redistribution approvals, facility performance flags, and AI scoring',
    icon: ShieldAlert,
    color: '#BE185D',
    bg: '#FDF2F8',
    roles: ['Admin'],
  },
];

export default function ServiceSelection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('dashboard');

  // Filter services by role
  const visibleServices = SERVICES.filter(s =>
    !s.roles || (user && s.roles.includes(user.role))
  );

  const handleDone = () => {
    navigate(`/dashboard?tab=${selected}`, { replace: true });
  };

  const selectedService = SERVICES.find(s => s.id === selected)!;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F172A',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1A5C9E, #0D9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HeartPulse size={18} color="#fff" />
          </div>
          <span style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 17 }}>
            SwasthyaLink <span style={{ color: '#0D9488' }}>AI</span>
          </span>
        </div>
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 100, padding: '6px 14px',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A5C9E, #0D9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 600, margin: 0 }}>{user.name}</p>
              <p style={{ color: '#64748B', fontSize: 11, margin: 0, fontFamily: '"JetBrains Mono", monospace' }}>{user.role}</p>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <div style={{ flex: 1, maxWidth: 960, margin: '0 auto', width: '100%', padding: '48px 24px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.25)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            fontSize: 12, color: '#0D9488', fontWeight: 600,
          }}>
            <Sparkles size={12} />
            Welcome, {user?.name?.split(' ')[0] || 'there'}
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 800, color: '#F8FAFC',
            letterSpacing: '-1px', marginBottom: 10,
          }}>
            Where would you like to start?
          </h1>
          <p style={{ color: '#64748B', fontSize: 15 }}>
            Select a module — you can switch tabs anytime from the sidebar.
          </p>
        </div>

        {/* Service grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 14,
          marginBottom: 40,
        }}>
          {visibleServices.map(service => {
            const Icon = service.icon;
            const isSelected = selected === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setSelected(service.id)}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${service.color}18, ${service.color}08)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isSelected ? service.color + '60' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 14,
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? `0 4px 24px ${service.color}20` : 'none',
                  position: 'relative',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = service.color + '40';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 18, height: 18, borderRadius: '50%',
                    background: service.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.2 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: service.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <Icon size={20} color={service.color} />
                </div>
                <p style={{
                  color: isSelected ? '#F8FAFC' : '#CBD5E1',
                  fontWeight: 700, fontSize: 14, marginBottom: 6,
                }}>
                  {service.label}
                </p>
                <p style={{
                  color: '#475569', fontSize: 12, lineHeight: 1.6, margin: 0,
                }}>
                  {service.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Bottom action bar */}
        <div style={{
          position: 'sticky', bottom: 24,
          background: 'rgba(15,23,42,0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: selectedService.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <selectedService.icon size={18} color={selectedService.color} />
            </div>
            <div>
              <p style={{ color: '#94A3B8', fontSize: 11, fontFamily: '"JetBrains Mono", monospace', margin: 0 }}>
                Selected module
              </p>
              <p style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 14, margin: 0 }}>
                {selectedService.label}
              </p>
            </div>
          </div>
          <button
            onClick={handleDone}
            style={{
              background: 'linear-gradient(135deg, #1A5C9E, #0D9488)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '11px 28px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(13,148,136,0.3)',
            }}
          >
            Open {selectedService.label}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
