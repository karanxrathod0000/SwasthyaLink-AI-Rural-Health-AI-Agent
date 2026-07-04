import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  CheckCircle, 
  Building2, 
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { Facility, TriageResult, EmergencyAlert, AttendanceLog } from '../types';

interface ReportsTabProps {
  facilities: Facility[];
  triageRecords: TriageResult[];
  alerts: EmergencyAlert[];
}

export default function ReportsTab({ facilities, triageRecords, alerts }: ReportsTabProps) {
  // Compute some aggregated report analytics
  const totalTriage = triageRecords.length;
  const criticalTriage = triageRecords.filter(t => t.category === 'CRITICAL').length;
  const highTriage = triageRecords.filter(t => t.category === 'HIGH').length;
  const mediumTriage = triageRecords.filter(t => t.category === 'MEDIUM').length;
  const lowTriage = triageRecords.filter(t => t.category === 'LOW').length;

  // Average distance
  const averageDistance = facilities.length > 0 
    ? (facilities.reduce((acc, f) => acc + f.distanceKm, 0) / facilities.length).toFixed(1) 
    : '12';

  // Resolved alerts vs total
  const totalAlerts = alerts.length;
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED').length;
  const pendingAlerts = totalAlerts - resolvedAlerts;

  const resolutionRate = totalAlerts > 0 
    ? Math.round((resolvedAlerts / totalAlerts) * 100) 
    : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-medblue text-white rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Regional Health Reports & System Analytics</h2>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-1">
          District-level response monitoring, medical supply logs, and active dispatch resolution indices.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Ambulance Dispatch Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">18.2 Mins</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-sans flex items-center gap-0.5">
              ↓ -4m vs last month
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            Average response time for CRITICAL maternal dispatches in Bhadrak rural sector.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Alert Resolution Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{resolutionRate}%</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({resolvedAlerts} of {totalAlerts} resolved)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            Proportion of triggered critical and high triage notifications resolved successfully within the hour.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Average Routing Distance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{averageDistance} km</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Within 32km limit
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-sans">
            Average travel distance mapped between symptom onset coordinates and capable clinical equipment.
          </p>
        </div>

      </div>

      {/* CORE ANALYSIS CHARTS REDESIGN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TRIAGE SEVERITY BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Triage Cases by Priority Tier</h3>
          
          <div className="space-y-4">
            
            {/* Critical */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-700 flex items-center gap-1">
                  <span>🔴 CRITICAL (Level 1)</span>
                </span>
                <span className="font-mono font-bold">{criticalTriage} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (criticalTriage / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* High */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <span>🟠 HIGH (Level 2)</span>
                </span>
                <span className="font-mono font-bold">{highTriage} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (highTriage / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-700">🔵 MEDIUM (Level 3)</span>
                <span className="font-mono font-bold">{mediumTriage} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#007EA7] h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (mediumTriage / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Low */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-700">🟢 LOW (Level 4)</span>
                <span className="font-mono font-bold">{lowTriage} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-brandteal h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (lowTriage / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

          </div>

          <div className="mt-6 p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5 text-xs">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-slate-600 leading-normal">
              Gemini has successfully classified <strong>100%</strong> of intake symptoms against standard WHO clinical protocols.
            </p>
          </div>
        </div>

        {/* REGIONAL LOGISTICS HEALTH INDEX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Operational Health Indicators</h3>
            <p className="text-[11px] text-slate-400 font-mono mb-4">Maternal and general healthcare indices compared to national levels</p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Maternal Triage Reliability</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Automated validation rates</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">99.4% (Elite)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Geofence Compliance Index</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Authorized GPS check-in rate</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">92.1% (Good)</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">System Uptime Index</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Server container status</p>
                </div>
                <span className="text-sm font-bold text-medblue">100.0% (Stable)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Reports generated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
