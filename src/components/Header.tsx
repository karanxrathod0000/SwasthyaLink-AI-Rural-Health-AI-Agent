import { Heart, Activity, AlertTriangle, UserCheck } from 'lucide-react';

interface HeaderProps {
  criticalAlertCount: number;
  anomalyCount: number;
}

export default function Header({ criticalAlertCount, anomalyCount }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg shadow-inner flex items-center justify-center animate-pulse">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">SwasthyaLink AI</h1>
              <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-500/30">
                Enterprise Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Rural Healthcare Dispatch & Log Auditing Terminal</p>
          </div>
        </div>

        {/* Right: Operational Status Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-300">MCP Nodes: Connected</span>
          </div>

          {anomalyCount > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-md border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{anomalyCount} Auditing Anomalies</span>
            </div>
          )}

          {criticalAlertCount > 0 ? (
            <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-md border border-rose-500/30 animate-pulse font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{criticalAlertCount} CRITICAL CASE ALERTS</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-md text-slate-400">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Alert Queue: Clear</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
