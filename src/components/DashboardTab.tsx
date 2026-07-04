import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  Building2, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  MapPin, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  AlertOctagon, 
  RefreshCw,
  Search,
  BellRing
} from 'lucide-react';
import { Facility, TriageResult, EmergencyAlert, AttendanceLog } from '../types';

interface DashboardTabProps {
  facilities: Facility[];
  alerts: EmergencyAlert[];
  triageRecords: TriageResult[];
  logs: AttendanceLog[];
  setActiveTab: (tab: string) => void;
  onUpdateAlertStatus: (id: string, status: EmergencyAlert['status']) => void;
  triggerEmergencyAlert: () => void;
  openNewPatientIntake: () => void;
}

export default function DashboardTab({
  facilities,
  alerts,
  triageRecords,
  logs,
  setActiveTab,
  onUpdateAlertStatus,
  triggerEmergencyAlert,
  openNewPatientIntake
}: DashboardTabProps) {
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  // Compute stats
  const totalPatientsCount = triageRecords.length + 32; // base offset for mock reality
  const activeAshas = 12;
  const criticalAlertsCount = alerts.filter(a => a.category === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const totalFacilities = facilities.length;

  // Filter alerts for the timeline / lists
  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');

  // Combine logs and alerts into a unified real-time timeline stream
  const getTimelineItems = () => {
    const items = [];

    // Push critical alerts
    alerts.forEach(a => {
      items.push({
        id: a.id,
        timestamp: new Date(a.timestamp),
        type: 'ALERT',
        category: a.category,
        title: `${a.category} ALERT: ${a.patientBrief}`,
        desc: `Nearest capable facility: ${facilities.find(f => f.id === a.nearestFacilityId)?.name || 'Matching Hospital'} • Dispatch status: ${a.status}`,
        isCritical: a.category === 'CRITICAL',
        status: a.status
      });
    });

    // Push activity logs
    logs.forEach(l => {
      items.push({
        id: l.id,
        timestamp: new Date(l.timestamp),
        type: 'LOG',
        category: 'INFO',
        title: `${l.workerName} (${l.workerId}) checked in`,
        desc: `Verified geofence at ${l.locationNode}. Note: ${l.notes || 'Routine village patient evaluation rounds.'}`,
        isCritical: false,
        status: l.status
      });
    });

    // Sort by newest first
    return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const timelineItems = getTimelineItems();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER STATEMENT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Mission Control</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time rural emergency dispatch & facility resource ledger</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Bhadrak Hub: Connected & Audited</span>
        </div>
      </div>

      {/* ROW 1: 4-COLUMN KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Total Patients Today</span>
            <div className="p-2 bg-slate-50 text-medblue rounded-lg group-hover:bg-slate-100 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight block">
              {totalPatientsCount}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-600 font-sans">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ +5% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Active ASHA Workers</span>
            <div className="p-2 bg-slate-50 text-brandteal rounded-lg group-hover:bg-slate-100 transition">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight block">
              {activeAshas}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-slate-400">
              <span>91% Regional presence</span>
            </div>
          </div>
        </div>

        {/* KPI 3: CRITICAL ALERTS CARD WITH RED LEFT BORDER AND PULSE ANIMATION */}
        <div className={`bg-white border border-slate-200 border-l-4 border-l-critical p-6 rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group ${
          criticalAlertsCount > 0 ? 'animate-alert-pulse' : ''
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Critical Alerts</span>
            <div className={`p-2 rounded-lg transition ${
              criticalAlertsCount > 0 ? 'bg-red-50 text-critical' : 'bg-slate-50 text-slate-500'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className={`text-3xl font-extrabold font-sans tracking-tight block ${
              criticalAlertsCount > 0 ? 'text-critical' : 'text-slate-900'
            }`}>
              {criticalAlertsCount}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-rose-600">
              {criticalAlertsCount > 0 ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-critical animate-ping"></span>
                  ASAP Response required
                </span>
              ) : (
                <span className="text-slate-400 font-mono">No critical cases pending</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Available Facilities</span>
            <div className="p-2 bg-slate-50 text-amber-600 rounded-lg group-hover:bg-slate-100 transition">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight block">
              {totalFacilities}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-slate-400">
              <span>Connected & operational</span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: TAP-OPTIMIZED LARGE QUICK ACTION BAR */}
      <div className="bg-slate-100/70 border border-slate-200 p-4.5 rounded-2xl">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-3">
          Instant Tap Actions (ASHA-optimized)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <button 
            onClick={openNewPatientIntake}
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-medblue hover:bg-[#154c83] text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            <span>+ New Patient Intake</span>
          </button>

          <button 
            onClick={() => setActiveTab('triage')}
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-50 shadow-xs transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
          >
            <Activity className="w-5 h-5 text-medblue shrink-0" />
            <span>📋 Start Triage Session</span>
          </button>

          <button 
            onClick={() => setActiveTab('patients')}
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-50 shadow-xs transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
          >
            <MapPin className="w-5 h-5 text-brandteal shrink-0" />
            <span>📍 Verify Check-in</span>
          </button>

          <button 
            onClick={triggerEmergencyAlert}
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white border-2 border-critical text-critical hover:bg-red-50 rounded-xl font-bold text-sm shadow-xs transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
          >
            <AlertOctagon className="w-5 h-5 shrink-0 animate-bounce" />
            <span>🚨 Send Emergency Alert</span>
          </button>

        </div>
      </div>

      {/* ROW 3: TWO-COLUMN SPLIT (50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: RECENT TRIAGE CASES TABLE */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Patient Triage Ledger</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Live clinical decisions & automated routing recommendations</p>
              </div>
              <button 
                onClick={() => setActiveTab('triage')}
                className="text-xs font-bold text-medblue hover:underline flex items-center gap-1"
              >
                <span>Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Patient Profile</th>
                    <th className="p-4">Triage Category</th>
                    <th className="p-4">Recommended Facility</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {triageRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-xs text-slate-400 font-mono">
                        No triage cases submitted yet. Launch Triage Console above.
                      </td>
                    </tr>
                  ) : (
                    triageRecords.slice(0, 5).map(record => {
                      // Style categories
                      let badgeStyle = 'bg-slate-100 text-slate-700';
                      let rowStyle = '';
                      if (record.category === 'CRITICAL') {
                        badgeStyle = 'bg-rose-100 text-rose-800 border border-rose-200';
                        rowStyle = 'bg-rose-50/10';
                      } else if (record.category === 'HIGH') {
                        badgeStyle = 'bg-amber-100 text-amber-800 border border-amber-200';
                        rowStyle = 'bg-amber-50/10';
                      } else if (record.category === 'MEDIUM') {
                        badgeStyle = 'bg-sky-100 text-sky-800';
                      } else if (record.category === 'LOW') {
                        badgeStyle = 'bg-emerald-100 text-emerald-800';
                      }

                      const matchedFac = facilities.find(f => f.id === record.allocatedFacilityId);

                      return (
                        <tr key={record.id} className={`hover:bg-slate-50/70 transition text-xs ${rowStyle}`}>
                          <td className="p-4 font-sans">
                            <p className="font-bold text-slate-800">
                              {record.patientAge}y {record.patientGender === 'M' ? 'Male' : record.patientGender === 'F' ? 'Female' : 'Other'}
                            </p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{record.symptoms}</p>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeStyle}`}>
                              {record.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-600">
                            {matchedFac ? matchedFac.name : 'SubCenter Base'}
                          </td>
                          <td className="p-4 text-right">
                            {record.category === 'CRITICAL' || record.category === 'HIGH' ? (
                              <span className="inline-flex items-center justify-center p-1 bg-rose-50 rounded-full text-critical" title="Emergency Dispatch Spawned">
                                <ShieldAlert className="w-4 h-4 animate-pulse" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center p-1 bg-emerald-50 rounded-full text-emerald-600" title="Operational verification done">
                                <CheckCircle className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-mono">
              Database logs synchronized • Local storage fallbacks active
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCE AVAILABILITY LIST */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Resource Availability & Beds</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Real-time occupancy metrics for regional healthcare nodes</p>
              </div>
              <button 
                onClick={() => setActiveTab('resources')}
                className="text-xs font-bold text-medblue hover:underline flex items-center gap-1"
              >
                <span>All Facilities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {facilities.slice(0, 4).map(facility => {
                const occupancyRate = facility.bedCapacity.total > 0 
                  ? (facility.bedCapacity.occupied / facility.bedCapacity.total) * 100 
                  : 0;
                
                let barColor = 'bg-medblue';
                let statusLabel = 'Operational';
                let statusDot = 'bg-emerald-500';

                if (facility.status === 'CRITICAL_LOAD') {
                  barColor = 'bg-rose-500';
                  statusLabel = 'Critical Load';
                  statusDot = 'bg-rose-500 animate-pulse';
                } else if (facility.status === 'LIMITED_SERVICE') {
                  barColor = 'bg-amber-500';
                  statusLabel = 'Limited Services';
                  statusDot = 'bg-amber-500';
                }

                return (
                  <div key={facility.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-xs transition">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-800">{facility.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">({facility.distanceKm}km away)</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                          <span>{statusLabel}</span>
                          <span>•</span>
                          <span className="text-slate-500">Beds: {facility.bedCapacity.total - facility.bedCapacity.occupied} Available</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-3xs">
                        {facility.bedCapacity.total - facility.bedCapacity.occupied}/{facility.bedCapacity.total} Free
                      </span>
                    </div>

                    {/* Occupancy bar indicator */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-500`} 
                        style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Critical facilities verified</span>
            <span>Update interval: 10s</span>
          </div>
        </div>

      </div>

      {/* ROW 4: FULL-WIDTH ACTIVITY TIMELINE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Operation Feed & Real-time Logs</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Automated timestamp auditing of worker check-ins and emergency dispatches</p>
        </div>

        <div className="p-5 max-h-96 overflow-y-auto space-y-4">
          {timelineItems.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400 font-mono">No actions registered in active timeline</p>
          ) : (
            timelineItems.map((item, index) => {
              const dateString = item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              
              if (item.type === 'ALERT') {
                const isUnresolved = item.status !== 'RESOLVED';
                return (
                  <div 
                    key={`t-${item.id}-${index}`}
                    className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                      item.isCritical && isUnresolved
                        ? 'bg-rose-50/50 border-rose-200 text-slate-900' 
                        : 'bg-slate-50/50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      item.isCritical ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold ${item.isCritical ? 'text-rose-800' : 'text-slate-800'}`}>
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">{dateString}</span>
                          <span className="text-[9px] bg-rose-100 border border-rose-200 text-rose-800 font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase">
                            ALERT
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                      
                      {isUnresolved && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <button 
                            onClick={() => onUpdateAlertStatus(item.id, 'DISPATCHED')}
                            className="bg-medblue text-white hover:bg-medblue/90 px-3 py-1 rounded-md text-[10px] font-bold"
                          >
                            Dispatch Ambulance
                          </button>
                          <button 
                            onClick={() => onUpdateAlertStatus(item.id, 'RESOLVED')}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 rounded-md text-[10px] font-bold"
                          >
                            Mark Handled
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div 
                    key={`t-${item.id}-${index}`}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-800 flex items-start gap-3 hover:border-slate-200 transition-all"
                  >
                    <div className="p-1.5 bg-sky-100 text-sky-800 rounded-lg shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-800">{item.title}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">{dateString}</span>
                          <span className="text-[9px] bg-sky-50 text-sky-700 border border-sky-100 font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase">
                            LOG
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>

    </div>
  );
}
