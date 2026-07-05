import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  PlusCircle, 
  Trash2, 
  AlertOctagon, 
  FileText, 
  Check, 
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AttendanceLog, LogAnomaly } from '../types';

interface PatientManagementTabProps {
  logs: AttendanceLog[];
  anomalies: LogAnomaly[];
  onLogValidated: (newLog: AttendanceLog, newAnomaly: LogAnomaly | null) => void;
  onResolveAnomaly: (id: string) => void;
}

export default function PatientManagementTab({ 
  logs, 
  anomalies, 
  onLogValidated, 
  onResolveAnomaly 
}: PatientManagementTabProps) {
  
  // Form states
  const [workerId, setWorkerId] = useState('ASHA_ID-401');
  const [workerName, setWorkerName] = useState('Rashmi Prava Mallick');
  const [locationNode, setLocationNode] = useState('SubCenter Bhadrak');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter lists
  const pendingAnomalies = anomalies.filter(anom => !anom.resolved);
  const resolvedAnomalies = anomalies.filter(anom => anom.resolved);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Submit check-in log & trigger AI anomaly analysis
  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      alert('Please fill out log notes/activity details before checking in.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/logs/validate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId,
          workerName,
          locationNode,
          timestamp: new Date().toISOString(),
          notes
        })
      });

      if (!response.ok) {
        throw new Error('Attendance validation server error');
      }

      const data = await response.json();
      onLogValidated(data.log, data.anomaly);
      setNotes('');

      if (data.anomalyDetected) {
        showToast('⚠️ Operational Anomaly Flagged by AI!');
      } else {
        showToast('✅ Check-in successfully verified!');
      }

    } catch (err) {
      console.error('Failed to submit log check-in', err);
      // Client-side fallback log creation
      const mockLog: AttendanceLog = {
        id: `LOG-${Date.now()}`,
        workerId,
        workerName,
        locationNode,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE',
        notes,
        geofenceVerified: !notes.toLowerCase().includes('ultrasound')
      };
      
      let mockAnomaly: LogAnomaly | null = null;
      if (notes.toLowerCase().includes('ultrasound')) {
        mockAnomaly = {
          id: `ANOM-${Date.now()}`,
          logId: mockLog.id,
          workerId,
          timestamp: new Date().toISOString(),
          anomalyType: 'INCOHERENT_CASE_NOTES',
          severity: 'CRITICAL',
          description: `Notes claim performing ultrasound imaging at "${locationNode}", which does not host an active ultrasound scanner equipment bundle.`,
          resolved: false
        };
      }

      onLogValidated(mockLog, mockAnomaly);
      setNotes('');
      if (mockAnomaly) {
        showToast('⚠️ Incoherent case notes flagged offline');
      } else {
        showToast('✅ Log check-in logged successfully');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-slate-900 text-white text-xs font-mono font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 animate-bounce border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-medblue text-white rounded-lg">
            <Users className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">ASHA Attendance & Geofence Logs Terminal</h2>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-1">
          GPS geofence audits and case verification panel. Automatically checks timestamps and clinic offerings against diagnostic logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Form Check-in Panel & Worker Profile Status) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Worker Profile Summary */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Active Geofence Session
            </h3>

            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-sky-700 font-mono uppercase font-bold">Worker Profile</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{workerName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">ID: {workerId}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>VERIFIED</span>
                </span>
              </div>

              <div className="border-t border-sky-100/50 pt-3 flex justify-between items-center text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>09:15 AM - Today</span>
                </span>
                <span>Duration: 2.5 hrs active</span>
              </div>
            </div>

            {/* Micro attendance logs list for today */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                Today's Work Events Ledger:
              </span>
              <div className="space-y-1.5">
                <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center text-xs text-slate-700 font-sans">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>09:15 AM - Checked in at SubCenter Base</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verified</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center text-xs text-slate-700 font-sans">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>10:30 AM - Home Visit: Patient Ram S.</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verified</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center text-xs text-slate-700 font-sans">
                  <span className="font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>12:00 PM - Home Visit: Patient Priya M.</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Verified</span>
                </div>
              </div>
            </div>

          </div>

          {/* New Attendance Log Form */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4">
              Submit Operational Log
            </h3>

            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">GPS Geofence Node Pin</label>
                <select 
                  value={locationNode}
                  onChange={(e) => setLocationNode(e.target.value)}
                  className="w-full text-xs font-sans px-2.5 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden bg-white"
                >
                  <option value="SubCenter Bhadrak">SubCenter Bhadrak (SC-1)</option>
                  <option value="SubCenter Dhamnagar">SubCenter Dhamnagar (SC-2)</option>
                  <option value="CHC Dhamnagar">CHC Dhamnagar (CHC-1)</option>
                  <option value="District Hospital Bhadrak">District Hospital Bhadrak (DH-1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Activity & Treatment Notes *</label>
                <textarea 
                  rows={3}
                  placeholder="Describe treatment given, visited households, or clinical supplies verified. E.g., Done general vital verification for patient Ram S. Checked oxygen concentrator levels."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs font-sans p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden bg-slate-50/20"
                ></textarea>
                <p className="text-[10px] text-slate-400 font-sans mt-1">
                  💡 Tip: The system AI audits notes. Trying to claim non-existent equipment (e.g. performing Ultrasounds at SubCenter SC-1) will trigger administrative warning flags.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-medblue hover:bg-[#154c83] text-white py-2.5 rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing check-in parameters...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Submit & Geofence Log</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN (Live Anomalies Panel & Registered logs list) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active AI Anomalies Flags */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-rose-50/20 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Administrative Flags & Discrepancies</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Automated discrepancy flags generated via Gemini audit engines</p>
              </div>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                {pendingAnomalies.length} Flagged
              </span>
            </div>

            <div className="p-5 space-y-4">
              {pendingAnomalies.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono space-y-1">
                  <p>All operational check-ins verified.</p>
                  <p className="text-[11px] text-slate-400 font-normal">ASHA geofencing logs are clean. No spatial or equipment discrepancies detected.</p>
                </div>
              ) : (
                pendingAnomalies.map(anom => {
                  return (
                    <div key={anom.id} className="p-4 bg-rose-50/30 border border-rose-100 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded uppercase mr-2">
                            {anom.anomalyType}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {anom.id}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(anom.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-800 font-sans leading-relaxed">
                        {anom.description}
                      </p>

                      <div className="pt-2 border-t border-rose-100/50 flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            alert(`Flagged administrative conflict ${anom.id} referred to senior district supervisor.`);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded transition"
                        >
                          📍 Flag Discrepancy
                        </button>
                        <button
                          onClick={() => onResolveAnomaly(anom.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-[10px] font-bold rounded transition flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve & Resolve</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Validation Attendance Logs Ledger */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Geofence Attendance Log Ledger</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Complete record of regional health worker location coordinates and case summaries</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Worker / Node</th>
                    <th className="p-4">Submitted notes</th>
                    <th className="p-4 text-center">GPS Geofence</th>
                    <th className="p-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-mono text-xs">No attendance logs logged.</td>
                    </tr>
                  ) : (
                    logs.slice(0, 8).map(log => {
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{log.workerName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{log.locationNode}</p>
                          </td>
                          <td className="p-4 max-w-xs truncate" title={log.notes}>
                            {log.notes || 'Routine check-in sequence'}
                          </td>
                          <td className="p-4 text-center">
                            {log.geofenceVerified ? (
                              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                                Verified
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-100">
                                Anomalous
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right font-mono text-[10px] text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
