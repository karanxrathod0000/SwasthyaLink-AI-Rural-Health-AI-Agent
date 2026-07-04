import { Users, BedDouble, FileText, AlertOctagon } from 'lucide-react';
import { Facility, AttendanceLog, LogAnomaly } from '../types';

interface DashboardStatsProps {
  facilities: Facility[];
  logs: AttendanceLog[];
  anomalies: LogAnomaly[];
  triageCount: number;
}

export default function DashboardStats({ facilities, logs, anomalies, triageCount }: DashboardStatsProps) {
  // Calculate total beds vs occupied beds
  const beds = facilities.reduce(
    (acc, f) => {
      acc.total += f.bedCapacity.total;
      acc.occupied += f.bedCapacity.occupied;
      return acc;
    },
    { total: 0, occupied: 0 }
  );

  // Active workers count (unique active workerIds from logs in the last 24h)
  const activeWorkers = new Set(logs.map(l => l.workerId)).size;

  // Pending unresolved anomalies
  const pendingAnomalies = anomalies.filter(a => !a.resolved).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: Active ASHAs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Active Workers (ASHAs)</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 font-sans">{activeWorkers}</h3>
          <p className="text-xs text-emerald-600 font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Geofence Verified
          </p>
        </div>
        <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* CARD 2: Beds Occupied */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Regional Bed Capacity</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 font-sans">
            {beds.occupied} <span className="text-sm text-slate-400 font-normal">/ {beds.total}</span>
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {beds.total - beds.occupied} Referral Beds Available
          </p>
        </div>
        <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
          <BedDouble className="w-6 h-6" />
        </div>
      </div>

      {/* CARD 3: Triage Decisions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Clinical Triages Run</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 font-sans">{triageCount}</h3>
          <p className="text-xs text-emerald-600 font-mono mt-1">
            AI Guidance Active
          </p>
        </div>
        <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      {/* CARD 4: Anomalies */}
      <div className={`border rounded-xl p-5 shadow-sm transition duration-200 flex items-start justify-between ${
        pendingAnomalies > 0 
          ? 'bg-amber-50/50 border-amber-200 text-amber-900' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div>
          <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Auditing Anomalies</p>
          <h3 className="text-3xl font-bold mt-2 font-sans">{pendingAnomalies}</h3>
          <p className="text-xs font-mono mt-1 text-amber-600">
            {pendingAnomalies > 0 ? 'Log Discrepancies Found' : 'All Worker Logs Audited'}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${pendingAnomalies > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
          <AlertOctagon className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
