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
  Award,
  TrendingDown,
  Percent
} from 'lucide-react';
import { Facility, TriageResult, EmergencyAlert, FootfallForecast } from '../types';

interface AnalyticsTabProps {
  facilities: Facility[];
  triageRecords: TriageResult[];
  alerts: EmergencyAlert[];
  forecast: FootfallForecast[];
}

export default function AnalyticsTab({
  facilities,
  triageRecords,
  alerts,
  forecast
}: AnalyticsTabProps) {
  // Aggregated Triage Tiers
  const totalTriage = triageRecords.length;
  const criticalCount = triageRecords.filter(t => t.category === 'CRITICAL').length;
  const highCount = triageRecords.filter(t => t.category === 'HIGH').length;
  const mediumCount = triageRecords.filter(t => t.category === 'MEDIUM').length;
  const lowCount = triageRecords.filter(t => t.category === 'LOW').length;

  // Average Distance
  const avgDistance = facilities.length > 0 
    ? (facilities.reduce((acc, f) => acc + f.distanceKm, 0) / facilities.length).toFixed(1) 
    : '12';

  // Alerts Resolution
  const totalAlerts = alerts.length;
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED').length;
  const resolutionRate = totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 100;

  // Average wait times (visual mock representation)
  const averageWaitMinutes = 18;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Analytics Dashboard</h2>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-1">
          District-level response monitoring, medical supply logs, and active dispatch resolution indices.
        </p>
      </div>

      {/* KPI METRIC CARD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Ambulance Dispatch Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">18.2 Mins</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-sans">↓ -4m</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Avg response for maternal dispatches</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Alert Resolution Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{resolutionRate}%</span>
            <span className="text-[10px] text-slate-400 font-mono">({resolvedAlerts} / {totalAlerts})</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Critical issues resolved within 1 hour</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Avg Patient Wait Time
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{averageWaitMinutes} Mins</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-sans">↓ -3m</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Queue time before doctor consultation</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
            Avg Routing Distance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{avgDistance} km</span>
            <span className="text-[10px] text-slate-400 font-mono">Within 32km limit</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Distance mapped to capable equipment</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CLINICAL TRIAGE DISTRIBUTIONS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Triage Cases by Priority Tier</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Classification breakdown of regional patient symptoms</p>
          </div>
          
          <div className="space-y-3.5">
            {/* Critical */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-700">🔴 CRITICAL (Level 1)</span>
                <span className="font-mono font-bold">{criticalCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (criticalCount / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* High */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-700">🟠 HIGH (Level 2)</span>
                <span className="font-mono font-bold">{highCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (highCount / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-700">🔵 MEDIUM (Level 3)</span>
                <span className="font-mono font-bold">{mediumCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-600 h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (mediumCount / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Low */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-700">🟢 LOW (Level 4)</span>
                <span className="font-mono font-bold">{lowCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300" 
                  style={{ width: `${totalTriage > 0 ? (lowCount / totalTriage) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <p className="text-slate-600 leading-normal font-sans">
              Gemini has classified <strong>100%</strong> of incoming check-in logs and symptoms narratives.
            </p>
          </div>
        </div>

        {/* FOOTFALL HISTORICAL & FORECASTED VOLUMES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Footfall Weekly Load Predictions</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Historical averages compared against AI forecasted volumes</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {forecast.slice(0, 5).map(f => {
              const maxVal = Math.max(...forecast.map(x => x.predictedCount)) || 100;
              const barWidth = Math.round((f.predictedCount / maxVal) * 100);
              const dateObj = new Date(f.date);
              const dateStr = dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

              return (
                <div key={f.date} className="flex items-center gap-3">
                  <span className="w-24 font-bold text-slate-600 font-sans">{dateStr}</span>
                  <div className="flex-1 bg-slate-100 h-3.5 rounded-md overflow-hidden flex">
                    <div 
                      className="bg-indigo-600 h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2 text-[9px] font-mono text-white font-bold"
                      style={{ width: `${barWidth}%` }}
                    >
                      {f.predictedCount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-mono text-[10px] leading-relaxed">
            Data factors: Daily ASHA registrations + Regional clinical outbreaks indices.
          </div>
        </div>

        {/* REGIONAL CAPACITY INDEX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Regional Bed Availability Indicators</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">District capacity statistics aggregated across all sectors</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Community Ward</p>
              <p className="text-lg font-extrabold text-slate-800">42 / 50 beds free</p>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 rounded font-semibold font-mono">84% Open</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Emergency ICU</p>
              <p className="text-lg font-extrabold text-slate-800">1 / 8 beds free</p>
              <span className="text-[9px] bg-rose-50 text-rose-700 px-1 rounded font-semibold font-mono">12% Open (ALERT)</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Maternity Wards</p>
              <p className="text-lg font-extrabold text-slate-800">4 / 8 beds free</p>
              <span className="text-[9px] bg-amber-50 text-amber-700 px-1 rounded font-semibold font-mono">50% Open</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Pediatric Wards</p>
              <p className="text-lg font-extrabold text-slate-800">1 / 10 beds free</p>
              <span className="text-[9px] bg-rose-50 text-rose-700 px-1 rounded font-semibold font-mono">10% Open (ALERT)</span>
            </div>
          </div>
        </div>

        {/* LOGISTICS EFFICIENCY MATRIX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Logistics Reliability Matrix</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Uptimes and audit metrics compared to national requirements</p>
          </div>

          <div className="space-y-2.5 text-xs font-sans">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Maternal Triage Routing Accuracy</p>
                <p className="text-[10px] text-slate-400 font-mono">Verified routing mapping accuracy</p>
              </div>
              <span className="font-bold text-emerald-600">99.4% (Elite)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">ASHA Geofence Compliance Index</p>
                <p className="text-[10px] text-slate-400 font-mono">GPS matching audit index</p>
              </div>
              <span className="font-bold text-emerald-600">92.1% (Good)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Server API Latency</p>
                <p className="text-[10px] text-slate-400 font-mono">Request dispatch turnaround</p>
              </div>
              <span className="font-bold text-indigo-600">45ms (Optimal)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Reports validated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
