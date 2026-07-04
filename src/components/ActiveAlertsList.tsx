import { AlertTriangle, Clock, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';
import { EmergencyAlert, Facility } from '../types';

interface ActiveAlertsListProps {
  alerts: EmergencyAlert[];
  facilities: Facility[];
  onUpdateStatus: (id: string, status: EmergencyAlert['status']) => void;
}

export default function ActiveAlertsList({ alerts, facilities, onUpdateStatus }: ActiveAlertsListProps) {
  const getFacilityName = (id: string) => {
    return facilities.find(f => f.id === id)?.name || 'Nearest Available Hospital';
  };

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');

  return (
    <div id="alerts-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h2 className="font-semibold text-slate-900 font-sans text-sm tracking-tight">Active Dispatches & Urgent Alerts</h2>
        </div>
        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
          {activeAlerts.length} Active
        </span>
      </div>

      <div className="p-5 flex-1 overflow-y-auto max-h-[460px] space-y-3.5">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-75 mb-3" />
            <p className="text-xs font-mono">All operational dispatches resolved</p>
            <p className="text-[11px] text-slate-400 mt-1">Alert queue is fully clear.</p>
          </div>
        ) : (
          activeAlerts.map(alert => {
            const isCritical = alert.category === 'CRITICAL';
            
            return (
              <div 
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`border rounded-lg p-4 transition duration-200 ${
                  isCritical 
                    ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300' 
                    : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                }`}
              >
                {/* Alert Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono ${
                      isCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {alert.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {alert.id.split('-')[1] || alert.id}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Patient Brief */}
                <p className="text-xs font-semibold text-slate-900 mt-2.5 font-sans leading-relaxed">
                  {alert.patientBrief}
                </p>

                {/* Worker and Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[11px] text-slate-600 font-mono border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Reporter:</span>
                    <span className="font-semibold text-slate-700">{alert.workerId}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alert.locationNode}</span>
                  </div>
                </div>

                {/* Allocated Facility Link */}
                <div className="mt-2.5 bg-white/80 border border-slate-100 rounded p-2 text-[11px] flex items-center justify-between">
                  <div className="font-mono">
                    <span className="text-slate-400 block text-[9px] uppercase">Allocated Route</span>
                    <span className="font-semibold text-slate-800">{getFacilityName(alert.nearestFacilityId)}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-mono">
                    Ref Facility
                  </span>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-end gap-2 mt-3.5 pt-2 border-t border-slate-100/60">
                  {alert.status === 'PENDING' && (
                    <button
                      id={`btn-ack-${alert.id}`}
                      onClick={() => onUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                      className="bg-slate-800 hover:bg-slate-950 text-white text-[11px] px-2.5 py-1.5 rounded font-medium transition cursor-pointer"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  {alert.status === 'ACKNOWLEDGED' && (
                    <button
                      id={`btn-dispatch-${alert.id}`}
                      onClick={() => onUpdateStatus(alert.id, 'DISPATCHED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1.5 rounded font-medium transition cursor-pointer"
                    >
                      Dispatch Vehicle / Support
                    </button>
                  )}
                  {alert.status === 'DISPATCHED' && (
                    <button
                      id={`btn-resolve-${alert.id}`}
                      onClick={() => onUpdateStatus(alert.id, 'RESOLVED')}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] px-2.5 py-1.5 rounded font-medium transition cursor-pointer"
                    >
                      Mark Resolved (Admitted)
                    </button>
                  )}
                  
                  {/* Badge showing status if acknowledged/dispatched */}
                  <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase px-2 py-1 bg-slate-100 rounded">
                    Status: {alert.status}
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
