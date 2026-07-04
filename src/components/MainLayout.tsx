import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Activity, 
  Building2, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  ChevronDown, 
  ChevronRight, 
  ShieldAlert, 
  LogOut, 
  Heart, 
  Keyboard,
  X,
  FileText,
  AlertOctagon
} from 'lucide-react';
import { EmergencyAlert, Facility, TriageResult } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alerts: EmergencyAlert[];
  facilities: Facility[];
  triageRecords: TriageResult[];
  onUpdateAlertStatus: (id: string, status: EmergencyAlert['status']) => void;
}

export default function MainLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  alerts, 
  facilities,
  triageRecords,
  onUpdateAlertStatus 
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Critical alerts unread count
  const unreadAlerts = alerts.filter(a => a.status === 'PENDING' || a.status === 'ACKNOWLEDGED');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter facilities, triage cases, or workers in Search
  const filteredSearchItems = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const matchedFacilities = facilities
      .filter(f => f.name.toLowerCase().includes(query) || f.type.toLowerCase().includes(query))
      .map(f => ({ type: 'Facility', name: f.name, desc: `${f.type} • ${f.distanceKm} km away`, id: f.id, tab: 'resources' }));

    const matchedTriage = triageRecords
      .filter(t => t.symptoms.toLowerCase().includes(query) || t.category.toLowerCase().includes(query))
      .map(t => ({ type: 'Patient Triage', name: `Patient Case (${t.patientAge}y ${t.patientGender})`, desc: t.symptoms, id: t.id, tab: 'triage' }));

    const matchedAlerts = alerts
      .filter(a => a.patientBrief.toLowerCase().includes(query) || a.category.toLowerCase().includes(query))
      .map(a => ({ type: 'Urgent Dispatch', name: a.patientBrief, desc: `Priority: ${a.category} • Status: ${a.status}`, id: a.id, tab: 'dashboard' }));

    return [...matchedFacilities, ...matchedTriage, ...matchedAlerts].slice(0, 5);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'triage', label: 'Triage Console', icon: Activity, isPriority: true },
    { id: 'resources', label: 'Resource Locator', icon: Building2 },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. FIXED TOP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs h-16 flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Toggle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition md:block hidden"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="p-1.5 bg-medblue text-white rounded-lg flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5" fill="currentColor" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 leading-none block">SwasthyaLink AI</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">Rural Health Coordination</span>
              </div>
            </div>
          </div>

          {/* Search Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button 
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-sm rounded-lg transition"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search patients, facilities, logs...</span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
                <Keyboard className="w-3 h-3" />
                <span>⌘K</span>
              </div>
            </button>
          </div>

          {/* Action Tools / Notifications / Profile */}
          <div className="flex items-center gap-3">
            
            {/* Mobile Search Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileOpen(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition relative"
                title="Alert System Queue"
              >
                <Bell className="w-5 h-5" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-critical text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {/* Bell dropdown panel */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-bold font-mono tracking-tight text-slate-800">Unresolved Dispatch Queue</span>
                    <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full uppercase">
                      Real-time
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {unreadAlerts.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 font-mono">No active urgent alerts</p>
                    ) : (
                      unreadAlerts.slice(0, 5).map(alert => (
                        <div 
                          key={alert.id}
                          onClick={() => {
                            setActiveTab('dashboard');
                            setNotificationOpen(false);
                          }}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition ${
                            alert.category === 'CRITICAL' ? 'bg-rose-50/20' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              alert.category === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {alert.category}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-sans line-clamp-2">
                            {alert.patientBrief}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                        setActiveTab('dashboard');
                        setNotificationOpen(false);
                      }}
                      className="text-[11px] font-medium text-medblue hover:underline"
                    >
                      View All Dispatch Statuses
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-medblue font-bold text-xs flex items-center justify-center border border-slate-300">
                  A-1
                </div>
                <div className="text-left hidden lg:block leading-none">
                  <p className="text-xs font-bold text-slate-800">ASHA_ID-401</p>
                  <p className="text-[10px] text-slate-400 font-mono">Bhadrak Hub</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Profile dropdown panel */}
              {profileOpen && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Active Health Worker</p>
                    <p className="text-sm font-bold text-slate-800">Rashmi Prava Mallick</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: ASHA_ID-401</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setActiveTab('settings'); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile & Settings</span>
                    </button>
                    <button 
                      onClick={() => { setProfileOpen(false); alert('Profile logs validated.'); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Assigned Patients</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button 
                      onClick={() => alert('Secure signout is simulated for development purposes.')}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* 2. BODY GRID */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        } md:flex hidden`}>
          
          <div className="py-4 flex-1 flex flex-col justify-between">
            {/* Nav items */}
            <div className="space-y-1.5 px-3">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition relative group ${
                      isActive 
                        ? 'bg-medblue text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-105 transition'
                    }`} />
                    {!sidebarCollapsed && (
                      <span className="font-sans text-left flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.isPriority && (
                      <span className="bg-rose-100 text-rose-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md animate-pulse">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ASHA Info box when sidebar is fully open */}
            {!sidebarCollapsed && (
              <div className="px-4 mx-3 mb-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Device Connectivity</span>
                </div>
                <p className="text-[11px] font-mono text-slate-600 leading-normal">
                  District Server online.<br />Geofencing & AI auditing enabled for village tasks.
                </p>
              </div>
            )}
          </div>

          {/* Footer of Sidebar */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            {!sidebarCollapsed ? (
              <p className="text-[10px] text-slate-400 font-mono uppercase">V4.8 Active Network</p>
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 mx-auto"></span>
            )}
          </div>
        </aside>

        {/* MAIN PAGE CONTAINER WITH INTERNAL SCROLLING */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {children}
        </main>

      </div>

      {/* MOBILE BOTTOM NAVIGATION DRAW */}
      <div className="md:hidden border-t border-slate-200 bg-white grid grid-cols-4 h-16 shrink-0 sticky bottom-0 z-40 shadow-lg text-center font-sans">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
            activeTab === 'dashboard' ? 'text-medblue' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('triage')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium relative ${
            activeTab === 'triage' ? 'text-medblue' : 'text-slate-500'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-500" />
          <span className="text-rose-600 font-semibold">Triage</span>
          <span className="absolute top-2 right-6 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
        </button>
        <button 
          onClick={() => setActiveTab('resources')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
            activeTab === 'resources' ? 'text-medblue' : 'text-slate-500'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Facilities</span>
        </button>
        <button 
          onClick={() => setActiveTab('patients')}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
            activeTab === 'patients' ? 'text-medblue' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patients</span>
        </button>
      </div>

      {/* 3. CMD+K GLOBAL SEARCH MODAL OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-900/65 flex items-center justify-center z-50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Type keyword (e.g., Bhadrak, pregnant, chest pain...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-hidden text-sm text-slate-900 focus:ring-0 placeholder-slate-400"
                autoFocus
              />
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto">
              {!searchQuery.trim() ? (
                <div className="text-center py-6 text-slate-400 text-xs font-mono space-y-1">
                  <p>Global Search Terminal</p>
                  <p className="text-[11px] text-slate-400 font-normal">Start typing to audit files, facilities, clinical records, or worker checklists instantly.</p>
                </div>
              ) : filteredSearchItems().length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400 font-mono">No matching records found.</p>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono mb-2">Search results:</span>
                  {filteredSearchItems().map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTab(item.tab);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 border border-slate-100 rounded-lg transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider mr-2">
                          {item.type}
                        </span>
                        <span className="font-bold text-xs text-slate-800 font-sans group-hover:text-medblue">{item.name}</span>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Press <kbd className="font-bold">ESC</kbd> to close</span>
              <span>Matched against active database</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
