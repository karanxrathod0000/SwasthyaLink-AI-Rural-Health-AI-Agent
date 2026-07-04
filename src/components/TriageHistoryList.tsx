import { FileText, Clock, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TriageResult, Facility } from '../types';

interface TriageHistoryListProps {
  triageRecords: TriageResult[];
  facilities: Facility[];
}

export default function TriageHistoryList({ triageRecords, facilities }: TriageHistoryListProps) {
  const getFacilityName = (id: string) => {
    return facilities.find(f => f.id === id)?.name || 'Local SubCenter';
  };

  return (
    <div id="triage-history-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-900 font-sans text-sm tracking-tight">Clinical Evaluation Log History</h2>
        </div>
        <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
          {triageRecords.length} Cases
        </span>
      </div>

      <div className="p-5 flex-1 overflow-y-auto max-h-[460px] space-y-4">
        {triageRecords.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400 font-mono">No clinical logs evaluated yet.</p>
        ) : (
          triageRecords.map(record => {
            const isHighOrCritical = record.category === 'HIGH' || record.category === 'CRITICAL';

            let pillColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            if (record.category === 'MEDIUM') pillColor = 'bg-amber-50 text-amber-800 border-amber-200';
            if (record.category === 'HIGH') pillColor = 'bg-orange-50 text-orange-800 border-orange-200';
            if (record.category === 'CRITICAL') pillColor = 'bg-rose-50 text-rose-800 border-rose-200';

            return (
              <div 
                key={record.id}
                id={`triage-card-${record.id}`}
                className="border border-slate-100 hover:border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-white transition duration-150 space-y-3"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pillColor}`}>
                      {record.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Patient: {record.patientAge}y/s {record.patientGender}
                    </span>
                    {record.pregnancyStatus === 'YES' && (
                      <span className="bg-rose-100 text-rose-800 text-[9px] px-1.5 py-0.5 rounded font-bold font-mono">
                        PREGNANT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Symptoms & Vitals Summary */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                    "{record.symptoms}"
                  </p>
                  
                  {/* Small vital strip */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 font-mono pt-1">
                    <span>BP: <strong className="text-slate-700">{record.vitals.bloodPressure}</strong></span>
                    <span>Pulse: <strong className="text-slate-700">{record.vitals.pulse} bpm</strong></span>
                    <span>Temp: <strong className="text-slate-700">{record.vitals.temp}°F</strong></span>
                    <span>O2: <strong className={`text-slate-700 ${record.vitals.oxygenSat < 92 ? 'text-rose-600 font-bold' : ''}`}>{record.vitals.oxygenSat}%</strong></span>
                    <span>Resp: <strong className="text-slate-700">{record.vitals.respiratoryRate} bpm</strong></span>
                  </div>
                </div>

                {/* Clinical Reasoning Details */}
                <div className="p-2.5 bg-white border border-slate-100 rounded text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-500 text-[10px] font-mono block uppercase">AI Clinical Reasoning</span>
                  {record.clinicalReasoning}
                </div>

                {/* Routed / Allocated facility */}
                <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-100 pt-2 bg-slate-100/30 p-2 rounded">
                  <span className="text-slate-400">Routed Node Target:</span>
                  <span className="font-bold text-slate-800">{getFacilityName(record.allocatedFacilityId)}</span>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
