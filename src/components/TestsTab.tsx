import React, { useState } from 'react';
import { 
  Activity, 
  FlaskConical, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { DiagnosticTest, LabSample, PatientRegistration, Facility } from '../types';

interface TestsTabProps {
  facilities: Facility[];
  tests: DiagnosticTest[];
  samples: LabSample[];
  patients: PatientRegistration[];
  onCollectSample: (patientId: string, testId: string) => Promise<void>;
  onUpdateSampleStatus: (sampleId: string, status: LabSample['status'], result?: string) => Promise<void>;
  onToggleEquipment: (testId: string, equipmentStatus: DiagnosticTest['equipmentStatus']) => Promise<void>;
  routingRecommendations: any[];
}

export default function TestsTab({
  facilities,
  tests,
  samples,
  patients,
  onCollectSample,
  onUpdateSampleStatus,
  onToggleEquipment,
  routingRecommendations
}: TestsTabProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'SC-1');
  
  // Sample collection States
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);

  // Sample status update States
  const [updatingSampleId, setUpdatingSampleId] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<LabSample['status']>('processing');
  const [tempResult, setTempResult] = useState('Hemoglobin 12.4 g/dL (Normal)');

  const facilityTests = tests.filter(t => t.facilityId === selectedFacilityId);
  const facilitySamples = samples.filter(s => s.facilityId === selectedFacilityId);
  const activePatients = patients.filter(p => p.facilityId === selectedFacilityId && p.status !== 'completed');

  // Compute metrics
  const totalTests = facilityTests.length;
  const availableTests = facilityTests.filter(t => t.availability === 'available').length;
  const pendingSamples = facilitySamples.filter(s => s.status === 'collected' || s.status === 'processing').length;
  const downEquipmentCount = facilityTests.filter(t => t.equipmentStatus !== 'operational').length;

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedTestId) {
      alert('Please select both a patient and a diagnostic test.');
      return;
    }
    setIsCollecting(true);
    try {
      await onCollectSample(selectedPatientId, selectedTestId);
      setSelectedPatientId('');
      setSelectedTestId('');
      alert('Lab sample vial successfully registered in system.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCollecting(false);
    }
  };

  const handleStatusUpdateSave = async (sampleId: string) => {
    setUpdatingSampleId(null);
    try {
      await onUpdateSampleStatus(sampleId, tempStatus, tempResult);
      alert('Lab result ledger updated successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const startStatusUpdate = (sample: LabSample) => {
    setUpdatingSampleId(sample.id);
    setTempStatus(sample.status);
    setTempResult(sample.result || '');
  };

  const handleToggleEquipment = async (testId: string, currentStatus: DiagnosticTest['equipmentStatus']) => {
    const nextStatus = currentStatus === 'operational' ? 'down' : 'operational';
    try {
      await onToggleEquipment(testId, nextStatus);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <FlaskConical className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Test Availability & Lab Auditing</h1>
            <p className="text-xs text-slate-500 font-mono">Sample logs, equipment uptime checks, and AI-driven backup diagnostic routing</p>
          </div>
        </div>
        
        {/* Facility Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 font-mono">FACILITY:</span>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-3xs cursor-pointer"
          >
            {facilities.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Total Diagnostic Offerings</span>
          <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">{totalTests}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Tests mapped in regional facility catalog</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Tests Fully Available</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-sans tracking-tight mt-1">{availableTests}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Active tests ready with valid reagents</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Pending Samples</span>
          <span className="text-2xl font-extrabold text-indigo-600 font-sans tracking-tight mt-1">{pendingSamples}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Vials collected awaiting lab processing</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Equipment Down</span>
          <span className={`text-2xl font-extrabold font-sans tracking-tight mt-1 ${downEquipmentCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{downEquipmentCount}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Analyzers flagged with hardware faults</p>
        </div>
      </div>

      {/* CORE GRID: CATALOG AND DETAILS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* DIAGNOSTIC CATALOG & EQUIPMENT STATUS */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Facility Test Catalog</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Toggle hardware status to simulate diagnostic instrument breakdowns</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Test Name</th>
                    <th className="p-4">Turnaround Time</th>
                    <th className="p-4">Uptime Status</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facilityTests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-mono">
                        No diagnostic tests mapped to this facility.
                      </td>
                    </tr>
                  ) : (
                    facilityTests.map(test => {
                      let eqBadge = '';
                      if (test.equipmentStatus === 'operational') {
                        eqBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      } else if (test.equipmentStatus === 'down') {
                        eqBadge = 'bg-rose-50 text-rose-700 border-rose-200 animate-alert-pulse';
                      } else {
                        eqBadge = 'bg-slate-50 text-slate-500 border-slate-200';
                      }

                      return (
                        <tr key={test.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-bold text-slate-900">{test.name}</td>
                          <td className="p-4 font-mono text-slate-500">{test.turnaroundTime}</td>
                          <td className="p-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${eqBadge}`}>
                              {test.equipmentStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              test.availability === 'available' ? 'text-emerald-700 bg-emerald-50' : 
                              test.availability === 'limited' ? 'text-amber-700 bg-amber-50' : 
                              'text-rose-700 bg-rose-50'
                            }`}>
                              {test.availability}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleEquipment(test.id, test.equipmentStatus)}
                              className={`text-[10px] font-bold border px-2 py-1 rounded shadow-3xs cursor-pointer ${
                                test.equipmentStatus === 'operational' 
                                  ? 'text-rose-600 bg-white border-rose-200 hover:bg-rose-50' 
                                  : 'text-emerald-600 bg-white border-emerald-200 hover:bg-emerald-50'
                              }`}
                            >
                              {test.equipmentStatus === 'operational' ? 'Trigger Down' : 'Fix Equipment'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center font-mono text-[10px] text-slate-400">
            Internal equipment sensors connected • Hardware ledgers synced
          </div>
        </div>

        {/* RIGHT COLUMN: SAMPLE LOGGER & AI BACKUP ROUTING */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* SAMPLE COLLECTION */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <FlaskConical className="w-4.5 h-4.5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Register Lab Sample</h3>
            </div>
            
            <form onSubmit={handleCollect} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose patient --</option>
                  {activePatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.age}y {p.gender})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Diagnostic Test Required</label>
                <select
                  required
                  value={selectedTestId}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose test --</option>
                  {facilityTests.filter(t => t.availability !== 'unavailable').map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.availability === 'limited' ? '⚠️ Limited Reagents' : 'Available'})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isCollecting || activePatients.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
              >
                {isCollecting ? 'Registering...' : 'Register Collected Sample'}
              </button>
            </form>
          </div>

          {/* AI DIAGNOSTIC BACKUP ROUTER */}
          <div className="bg-white border border-indigo-200 rounded-2xl shadow-xs overflow-hidden border-l-4 border-l-indigo-600">
            <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Backup Routing (Equipment Down)</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-normal">
                If local analyzers are broken, Gemini calculates the nearest alternate facility with open capacity.
              </p>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              {downEquipmentCount === 0 ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center font-semibold">
                  ✓ All regional equipment is operational.
                </div>
              ) : (
                <div className="space-y-3 font-sans">
                  {routingRecommendations && routingRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-rose-600">
                        <span>BROKEN: {rec.testName}</span>
                        <span>{rec.distanceKm} km away</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">Route to: {rec.recommendedFacilityName}</p>
                      <p className="text-[10px] text-slate-500 leading-normal">{rec.routingInstruction}</p>
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                        <span>Uptime: {rec.destUptime}</span>
                        <span>Beds: {rec.destBedsAvailable} free</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* SAMPLE TRACKING LEDGER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <ClipboardList className="w-4.5 h-4.5 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Lab Sample Tracking Logs</h3>
        </div>

        <div className="p-5 max-h-72 overflow-y-auto">
          {facilitySamples.length === 0 ? (
            <p className="text-center py-6 text-slate-400 font-mono text-xs">No lab samples registered today.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilitySamples.map(sample => {
                const isEditing = updatingSampleId === sample.id;
                let statusColor = 'text-slate-500 bg-slate-50';
                
                if (sample.status === 'collected') statusColor = 'text-blue-600 bg-blue-50';
                if (sample.status === 'processing') statusColor = 'text-amber-600 bg-amber-50 animate-pulse';
                if (sample.status === 'completed') statusColor = 'text-emerald-600 bg-emerald-50';
                if (sample.status === 'failed') statusColor = 'text-rose-600 bg-rose-50';

                return (
                  <div 
                    key={sample.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between text-xs space-y-3 hover:shadow-2xs transition"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 truncate">{sample.patientName}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${statusColor}`}>
                          {sample.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Test: <strong>{sample.testName}</strong></p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {sample.id} • Registered: {new Date(sample.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      {sample.result && !isEditing && (
                        <p className="text-[11px] text-indigo-700 bg-indigo-50/50 border border-indigo-100 rounded p-1.5 mt-2 italic font-mono">
                          Result: {sample.result}
                        </p>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-2 font-mono text-[10px]">
                        <div>
                          <label className="block text-slate-500 mb-0.5">Status</label>
                          <select
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value as any)}
                            className="w-full bg-white border border-slate-300 rounded p-1 text-slate-900"
                          >
                            <option value="collected">Collected</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-0.5">Test Result</label>
                          <input
                            type="text"
                            value={tempResult}
                            onChange={(e) => setTempResult(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded p-1 text-slate-900"
                          />
                        </div>
                        <div className="flex justify-end gap-1 font-sans">
                          <button
                            onClick={() => setUpdatingSampleId(null)}
                            className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleStatusUpdateSave(sample.id)}
                            className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startStatusUpdate(sample)}
                        className="w-full bg-white border border-slate-200 text-slate-800 hover:border-slate-300 py-1 rounded text-[10px] font-bold text-center shadow-3xs cursor-pointer"
                      >
                        Update Lab Result
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
