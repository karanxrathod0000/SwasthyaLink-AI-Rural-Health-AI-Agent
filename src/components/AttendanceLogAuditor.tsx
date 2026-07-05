import React, { useState } from 'react';
import { UserCheck, ShieldAlert, AlertCircle, Sparkles, MapPin, RefreshCw, ClipboardList, CheckCircle } from 'lucide-react';
import { AttendanceLog, LogAnomaly } from '../types';
import { apiFetch } from '../utils/api';

interface AttendanceLogAuditorProps {
  logs: AttendanceLog[];
  anomalies: LogAnomaly[];
  onLogValidated: (log: AttendanceLog, anomaly: LogAnomaly | null) => void;
  onResolveAnomaly: (anomalyId: string) => void;
}

export default function AttendanceLogAuditor({ logs, anomalies, onLogValidated, onResolveAnomaly }: AttendanceLogAuditorProps) {
  const [workerId, setWorkerId] = useState('ASHA_ID-402');
  const [workerName, setWorkerName] = useState('Subhasini Sahu');
  const [locationNode, setLocationNode] = useState('SubCenter Dhamnagar');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    anomalyDetected: boolean;
    anomaly: LogAnomaly | null;
  } | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'submit' | 'history' | 'anomalies'>('submit');

  const sampleWorkers = [
    { id: 'ASHA_ID-401', name: 'Rashmi Prava Mallick', node: 'SubCenter Bhadrak' },
    { id: 'ASHA_ID-402', name: 'Subhasini Sahu', node: 'SubCenter Dhamnagar' },
    { id: 'ASHA_ID-403', name: 'Kalyani Jena', node: 'Community Health Center Dhamnagar' }
  ];

  const handleWorkerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = sampleWorkers.find(w => w.id === e.target.value);
    if (selected) {
      setWorkerId(selected.id);
      setWorkerName(selected.name);
      setLocationNode(selected.node);
    }
  };

  // Sample anomalies/logs the user can paste easily for demonstration
  const demoScenarios = [
    {
      label: 'Legitimate Check-in',
      notes: 'Conducted home visits at Dhamnagar ward 4. Provided prenatal vitamins to 2 expectant mothers. Checked infant weight. Stable.',
      node: 'SubCenter Dhamnagar'
    },
    {
      label: 'Location Anomaly (Fraud Check)',
      notes: 'Spent the shift conducting checkups at Bhadrak central market village (approx 15km north) and then returned to Subcenter Dhamnagar.',
      node: 'SubCenter Dhamnagar'
    },
    {
      label: 'Incoherent Equipment Notes',
      notes: 'Conducted urgent fetal scan using the state-of-the-art 3D MRI and Ultrasound scanner here at SubCenter Dhamnagar.',
      node: 'SubCenter Dhamnagar' // Dhamnagar subcenter only has basic gear, MRI/Ultrasound is only at DH-1 or CHC-1!
    }
  ];

  const applyScenario = (notesText: string, nodeText: string) => {
    setNotes(notesText);
    setLocationNode(nodeText);
    setValidationResult(null);
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setLoading(true);
    setValidationResult(null);

    try {
      const response = await apiFetch('/api/logs/validate', {
        method: 'POST',
        body: JSON.stringify({
          workerId,
          workerName,
          locationNode,
          timestamp: new Date().toISOString(),
          notes
        })
      });

      if (!response.ok) {
        throw new Error('Verification request timed out.');
      }

      const data = await response.json();
      if (data.success) {
        onLogValidated(data.log, data.anomaly);
        setValidationResult({
          anomalyDetected: data.anomalyDetected,
          anomaly: data.anomaly
        });
        setNotes(''); // Clear notes upon submission
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingAnomalies = anomalies.filter(a => !a.resolved);

  return (
    <div id="auditor-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Tabs / Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-900 font-sans text-sm tracking-tight">ASHA Geofence & Check-In Auditor</h2>
        </div>
        <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
          <button
            id="subtab-submit"
            type="button"
            onClick={() => setActiveSubTab('submit')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeSubTab === 'submit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Check-In Simulation
          </button>
          <button
            id="subtab-history"
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
              activeSubTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Logs
          </button>
          <button
            id="subtab-anomalies"
            type="button"
            onClick={() => setActiveSubTab('anomalies')}
            className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeSubTab === 'anomalies' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Anomalies</span>
            {pendingAnomalies.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1 rounded-full text-[9px] font-bold">
                {pendingAnomalies.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto max-h-[460px]">
        {activeSubTab === 'submit' && (
          <form onSubmit={handleCheckIn} className="space-y-4">
            {/* Quick scenarios for testing */}
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                Simulation Demo Scenarios (Select one to test Gemini auditing)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {demoScenarios.map((demo, idx) => (
                  <button
                    key={idx}
                    id={`btn-demo-log-${idx}`}
                    type="button"
                    onClick={() => applyScenario(demo.notes, demo.node)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] px-2.5 py-1 rounded border border-slate-200 transition font-medium cursor-pointer"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ASHA Worker</label>
                <select
                  id="worker-selector"
                  value={workerId}
                  onChange={handleWorkerSelect}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-sans text-slate-900 bg-white"
                >
                  {sampleWorkers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">GPS-Locked Geofence Node</label>
                <input
                  id="log-location"
                  type="text"
                  value={locationNode}
                  onChange={(e) => setLocationNode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-slate-50 font-mono"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Activity Logs / Diagnostic Summary</label>
              <textarea
                id="log-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write visit summaries here. To test Gemini's anomaly engine, select one of the templates above or describe traveling massive distances/using hospital machines in a rural sub-center."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
                required
              ></textarea>
            </div>

            {validationResult && (
              <div 
                id="audit-outcome"
                className={`p-3.5 border rounded-lg flex items-start gap-2 text-xs font-mono leading-relaxed ${
                  validationResult.anomalyDetected 
                    ? 'bg-amber-50 border-amber-300 text-amber-950' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                {validationResult.anomalyDetected ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold flex items-center gap-1.5">
                        <span>AUDIT ALERT: {validationResult.anomaly?.anomalyType} DETECTED</span>
                        <span className="bg-amber-500 text-slate-950 text-[9px] px-1 rounded">
                          {validationResult.anomaly?.severity}
                        </span>
                      </p>
                      <p className="text-[11px] mt-1 text-slate-600">
                        {validationResult.anomaly?.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">AUDIT CONFIRMED: Geofence Verified</p>
                      <p className="text-[11px] mt-1 text-slate-600">
                        Check-in records align flawlessly with physical coordinates and local supply protocols. Synced to database.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              id="btn-submit-log"
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-950 disabled:bg-slate-700 text-white py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing Check-in with Gemini Agent...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Submit Checked-In Activities Log</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Attendance Log History Subtab */}
        {activeSubTab === 'history' && (
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 font-mono">No logged entries</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="border border-slate-100 p-3 rounded-lg bg-slate-50 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-950 font-sans">{log.workerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">ID: {log.workerId}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold font-mono mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{log.locationNode}</span>
                    <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      log.geofenceVerified 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800 font-bold'
                    }`}>
                      {log.geofenceVerified ? 'GPS_OK' : 'DISCREPANCY'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-sans mt-2 leading-relaxed bg-white border border-slate-100 p-2 rounded">
                    {log.notes}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Flagged Anomalies List */}
        {activeSubTab === 'anomalies' && (
          <div className="space-y-3">
            {anomalies.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto opacity-75 mb-2" />
                <p className="text-xs font-mono">Clear: No auditing anomalies found</p>
              </div>
            ) : (
              anomalies.map(anomaly => (
                <div 
                  key={anomaly.id}
                  id={`anomaly-card-${anomaly.id}`}
                  className={`border p-3.5 rounded-lg text-xs font-mono space-y-2.5 ${
                    anomaly.resolved 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-65' 
                      : 'bg-amber-50/50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-bold tracking-wider text-[10px]">{anomaly.anomalyType}</span>
                      <span className="text-[9px] text-slate-400">Worker: {anomaly.workerId}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      anomaly.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-900'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-sans font-medium text-[11px] bg-white border border-slate-100 p-2 rounded">
                    {anomaly.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{new Date(anomaly.timestamp).toLocaleDateString()}</span>
                    {anomaly.resolved ? (
                      <span className="text-emerald-600 font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <button
                        id={`btn-resolve-anomaly-${anomaly.id}`}
                        onClick={() => onResolveAnomaly(anomaly.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 bg-white px-2 py-1 rounded cursor-pointer"
                      >
                        Acknowledge & Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
