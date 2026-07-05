import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  Check, 
  AlertTriangle,
  Building,
  CheckCircle,
  XCircle,
  ChevronRight,
  HelpCircle,
  Truck,
  ArrowRight,
  ClipboardList,
  AlertOctagon
} from 'lucide-react';
import { Facility, LogAnomaly, RedistributionRecommendation, FacilityPerformance } from '../types';

interface AdminTabProps {
  facilities: Facility[];
  anomalies: LogAnomaly[];
  redistributions: RedistributionRecommendation[];
  performance: FacilityPerformance[];
  onResolveAnomaly: (anomalyId: string) => Promise<void>;
  onTriggerRedistribute: (redistributeId: string) => Promise<void>;
}

export default function AdminTab({
  facilities,
  anomalies,
  redistributions,
  performance,
  onResolveAnomaly,
  onTriggerRedistribute
}: AdminTabProps) {
  const [resolvingAnomalyId, setResolvingAnomalyId] = useState<string | null>(null);
  const [transferringId, setTransferringId] = useState<string | null>(null);

  const activeAnomalies = anomalies.filter(a => !a.resolved);
  
  const handleResolveAnomaly = async (id: string) => {
    setResolvingAnomalyId(id);
    try {
      await onResolveAnomaly(id);
      alert('Anomaly marked resolved and verified.');
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingAnomalyId(null);
    }
  };

  const handleRedistribute = async (id: string) => {
    setTransferringId(id);
    try {
      await onTriggerRedistribute(id);
      alert('🚚 Supply redistribution request successfully dispatched!');
    } catch (err) {
      console.error(err);
    } finally {
      setTransferringId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-rose-600 text-white rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">District Administration & Oversight</h1>
            <p className="text-xs text-slate-500 font-mono">Resource redistribution optimizer, auditing logs, and facility performance grades</p>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">District Health Index</span>
          <span className="text-2xl font-extrabold text-slate-900 font-sans mt-1">82%</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Aggregated regional performance score</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Active Audit Anomalies</span>
          <span className={`text-2xl font-extrabold font-sans mt-1 ${activeAnomalies.length > 0 ? 'text-amber-500' : 'text-slate-900'}`}>{activeAnomalies.length}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Pending worker visit logs check</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Optimizations Open</span>
          <span className="text-2xl font-extrabold text-indigo-600 font-sans mt-1">{redistributions.length}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Supplies transfer proposals available</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Gaps Intervention Flags</span>
          <span className="text-2xl font-extrabold text-rose-600 font-sans mt-1">
            {performance.filter(p => p.status === 'CRITICAL_GAPS' || p.status === 'NEEDS_IMPROVEMENT').length}
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Facilities flagged under-resourced</p>
        </div>
      </div>

      {/* CORE GRID: REDISTRIBUTION AND PERFORMANCE SCORING */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* RESOURCE REDISTRIBUTION RECS */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-indigo-50/20 border-l-4 border-l-indigo-600">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Resource Redistribution Recommendations</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-relaxed">
                Gemini identifies stock surpluses in under-utilized centers and creates transfer suggestions to cover critical gaps.
              </p>
            </div>

            <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto divide-y divide-slate-100">
              {redistributions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-mono text-xs">
                  No active redistribution proposals. Regional reserves are balanced.
                </div>
              ) : (
                redistributions.map((rec, idx) => (
                  <div key={rec.id} className={`py-4 first:pt-0 last:pb-0 text-xs font-sans ${idx > 0 ? 'border-t border-slate-100' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase font-mono ${
                        rec.urgency === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200 animate-alert-pulse' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {rec.urgency} URGENCY
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {rec.id}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 leading-normal">
                      Transfer <strong>{rec.quantity} {rec.unit} of {rec.medicineName}</strong>
                    </p>

                    <div className="flex items-center gap-3 my-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px]">
                      <div className="flex-1">
                        <p className="text-slate-400 font-mono text-[9px] uppercase">From Source</p>
                        <p className="font-bold text-slate-700 truncate">{rec.fromFacilityName}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-slate-400 font-mono text-[9px] uppercase">To Destination</p>
                        <p className="font-bold text-slate-700 truncate">{rec.toFacilityName}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed italic bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-100/50">
                      <strong>AI Reason:</strong> {rec.reason}
                    </p>

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleRedistribute(rec.id)}
                        disabled={transferringId === rec.id}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{transferringId === rec.id ? 'Dispatching...' : 'Approve Transfer'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center font-mono text-[10px] text-slate-400">
            Redistributions computed using district consumption rates
          </div>
        </div>

        {/* PERFORMANCE SCORING & ALERT FLAGS */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Facility Performance & Intervention Flags</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Automated assessment scoring and operational gap flags</p>
            </div>

            <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto">
              {performance.map(p => {
                let statusBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                let cardBorder = 'border-slate-100';
                
                if (p.status === 'EXCELLENT') {
                  statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                } else if (p.status === 'GOOD') {
                  statusBadge = 'bg-sky-100 text-sky-800 border-sky-200';
                } else if (p.status === 'NEEDS_IMPROVEMENT') {
                  statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                  cardBorder = 'border-amber-200 bg-amber-50/5';
                } else if (p.status === 'CRITICAL_GAPS') {
                  statusBadge = 'bg-rose-100 text-rose-800 border-rose-200 animate-alert-pulse';
                  cardBorder = 'border-rose-200 bg-rose-50/5';
                }

                return (
                  <div 
                    key={p.facilityId} 
                    className={`border p-4 rounded-xl space-y-3 transition hover:shadow-2xs ${cardBorder}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{p.facilityName}</h4>
                        <p className="text-[9px] text-slate-400 font-mono">ID: {p.facilityId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{p.score}% score</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${statusBadge}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono">
                      <div className="p-1 bg-white border border-slate-100 rounded">
                        <p className="text-slate-400">Wait Time</p>
                        <p className="font-bold text-slate-700">{p.waitTimeRating}</p>
                      </div>
                      <div className="p-1 bg-white border border-slate-100 rounded">
                        <p className="text-slate-400">Med Stock</p>
                        <p className="font-bold text-slate-700">{p.stockRating}</p>
                      </div>
                      <div className="p-1 bg-white border border-slate-100 rounded">
                        <p className="text-slate-400">Doctors</p>
                        <p className="font-bold text-slate-700">{p.attendanceRating}</p>
                      </div>
                      <div className="p-1 bg-white border border-slate-100 rounded">
                        <p className="text-slate-400">Bed Cap</p>
                        <p className="font-bold text-slate-700">{p.bedRating}</p>
                      </div>
                    </div>

                    {/* Recommendations List */}
                    {p.recommendations.length > 0 && (
                      <div className="p-2.5 bg-white border border-slate-100 rounded-lg text-[10px] text-slate-600 space-y-1">
                        <p className="font-bold text-indigo-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Intervention Recommendations:</span>
                        </p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {p.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center font-mono text-[10px] text-slate-400">
            Performance scoring checks updated hourly
          </div>
        </div>

      </div>

      {/* ACTIVE AUDIT ANOMALIES FEED */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-slate-700" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">ASHA Work Logs - Unresolved Audit Anomalies</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Unresolved check-in log and diagnostic equipment discrepancies</p>
          </div>
        </div>

        <div className="p-5 max-h-80 overflow-y-auto divide-y divide-slate-100">
          {activeAnomalies.length === 0 ? (
            <div className="text-center py-8 text-emerald-600 font-semibold text-xs flex flex-col items-center gap-1">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <span>All worker logs clear. No active anomalies flagged.</span>
            </div>
          ) : (
            activeAnomalies.map(anom => (
              <div key={anom.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs font-sans">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase font-mono ${
                      anom.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {anom.severity} Severity
                    </span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border">
                      {anom.anomalyType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(anom.timestamp).toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">Worker ID: {anom.workerId} (Log Ref: {anom.logId})</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{anom.description}</p>
                </div>

                <button
                  onClick={() => handleResolveAnomaly(anom.id)}
                  disabled={resolvingAnomalyId === anom.id}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition shrink-0 self-end sm:self-center"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{resolvingAnomalyId === anom.id ? 'Resolving...' : 'Resolve Audit Anomaly'}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
