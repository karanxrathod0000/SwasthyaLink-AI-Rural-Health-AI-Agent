import React, { useState, useEffect } from 'react';
import { 
  Bed as BedIcon, 
  UserCheck, 
  UserMinus, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Building,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Bed, PatientRegistration, Facility } from '../types';

interface BedsTabProps {
  facilities: Facility[];
  beds: Bed[];
  patients: PatientRegistration[];
  onAdmitPatient: (bedId: string, patientId: string, reason: string, expectedDays: number) => Promise<void>;
  onDischargePatient: (bedId: string) => Promise<void>;
  bedForecast: any[];
}

export default function BedsTab({
  facilities,
  beds,
  patients,
  onAdmitPatient,
  onDischargePatient,
  bedForecast
}: BedsTabProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'SC-1');
  
  // Admit Form States
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [admitReason, setAdmitReason] = useState('Severe respiratory distress monitoring');
  const [expectedStay, setExpectedStay] = useState(3);
  const [isAdmitting, setIsAdmitting] = useState(false);
  const [isDischarging, setIsDischarging] = useState<Record<string, boolean>>({});

  const facilityBeds = beds.filter(b => b.facilityId === selectedFacilityId);
  const totalBeds = facilityBeds.length;
  const occupiedBeds = facilityBeds.filter(b => b.status === 'occupied').length;
  const availableBeds = facilityBeds.filter(b => b.status === 'available').length;
  const cleaningBeds = facilityBeds.filter(b => b.status === 'cleaning').length;
  
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Unadmitted patients for admission dropdown
  const unadmittedPatients = patients.filter(p => p.facilityId === selectedFacilityId && p.status !== 'admitted' && p.status !== 'completed');

  const handleAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedBedId) {
      alert('Please select both a patient and an available bed.');
      return;
    }
    setIsAdmitting(true);
    try {
      await onAdmitPatient(selectedBedId, selectedPatientId, admitReason, expectedStay);
      setSelectedPatientId('');
      setSelectedBedId('');
      setAdmitReason('Severe respiratory distress monitoring');
      alert('Patient successfully admitted and bed status updated.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdmitting(false);
    }
  };

  const handleDischarge = async (bedId: string) => {
    setIsDischarging(prev => ({ ...prev, [bedId]: true }));
    try {
      await onDischargePatient(bedId);
      alert('Patient discharged. Bed has been placed in cleaning status.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDischarging(prev => ({ ...prev, [bedId]: false }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <BedIcon className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Referral Bed Management</h1>
            <p className="text-xs text-slate-500 font-mono">Real-time occupancy grids, cleaning status cycles, and AI occupancy predictions</p>
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

      {/* BED STATS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Total Ward Beds</span>
          <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">{totalBeds}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Total beds mapped in regional registry</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Beds Occupied</span>
          <span className="text-2xl font-extrabold text-rose-600 font-sans tracking-tight mt-1">{occupiedBeds}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Patients undergoing active inpatient care</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Beds Available</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-sans tracking-tight mt-1">{availableBeds}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Ready for immediate emergency admission</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Occupancy Rate</span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">{occupancyRate}%</span>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${occupancyRate > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Capacity alarm threshold: 85%</p>
        </div>
      </div>

      {/* CORE GRID: BED VISUALIZATION AND ADMIT FORM */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* BED VISUALIZATION LAYOUT */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Ward Bed Layout</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Real-time status updates from cleanings and maintenance</p>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-3 text-[9px] font-mono font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Occupied
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Cleaning
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Maintenance
                </span>
              </div>
            </div>

            {facilityBeds.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-mono text-xs">No referral beds configured for this facility.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {facilityBeds.map(bed => {
                  let statusBg = 'bg-slate-50 border-slate-200 hover:border-slate-300';
                  let statusColor = 'text-slate-400';
                  
                  if (bed.status === 'available') {
                    statusBg = 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50';
                    statusColor = 'text-emerald-600';
                  } else if (bed.status === 'occupied') {
                    statusBg = 'bg-rose-50/50 border-rose-200 hover:border-rose-300 hover:bg-rose-50';
                    statusColor = 'text-rose-600';
                  } else if (bed.status === 'cleaning') {
                    statusBg = 'bg-amber-50/50 border-amber-200 hover:border-amber-300 hover:bg-amber-50 animate-alert-pulse';
                    statusColor = 'text-amber-600';
                  }

                  return (
                    <div 
                      key={bed.id} 
                      className={`border p-4.5 rounded-xl transition flex flex-col justify-between min-h-36 ${statusBg}`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-xs text-slate-900">Bed {bed.bedNumber}</span>
                          <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border uppercase text-slate-400">
                            {bed.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase font-mono mb-2">
                          <span className={`w-1.5 h-1.5 rounded-full bg-current ${statusColor}`}></span>
                          <span className={statusColor}>{bed.status}</span>
                        </div>
                      </div>

                      {bed.status === 'occupied' && (
                        <div className="space-y-2 mt-2">
                          <div className="p-1.5 bg-white/70 border border-slate-100 rounded text-[10px] font-mono text-slate-600">
                            <p className="font-bold truncate text-slate-800">Pat: {bed.occupiedBy || 'Anonymous'}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">Est discharge: {bed.expectedDischarge ? new Date(bed.expectedDischarge).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <button
                            onClick={() => handleDischarge(bed.id)}
                            disabled={isDischarging[bed.id]}
                            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold text-[10px] py-1 rounded flex items-center justify-center gap-1 cursor-pointer transition"
                          >
                            <UserMinus className="w-3 h-3" />
                            <span>{isDischarging[bed.id] ? 'Discharging...' : 'Discharge'}</span>
                          </button>
                        </div>
                      )}

                      {bed.status === 'cleaning' && (
                        <div className="p-2 bg-amber-100/50 border border-amber-200 text-amber-700 text-[10px] font-semibold text-center rounded flex items-center justify-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Sanitizing Bed...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-xl mt-6 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Uptime monitored via Central Node Registry</span>
            <span>Update interval: 10s</span>
          </div>
        </div>

        {/* RIGHT COLUMN: ADMIT FORM & FORECAST */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* ADMISSION FORM */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <UserCheck className="w-4.5 h-4.5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Record Patient Admission</h3>
            </div>
            
            <form onSubmit={handleAdmit} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose registered patient --</option>
                  {unadmittedPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.age}y {p.gender}) - {p.department} ({p.triagePriority})</option>
                  ))}
                </select>
                {unadmittedPatients.length === 0 && (
                  <p className="text-[10px] text-slate-400 mt-1 italic font-mono">No registered outpatients available for admission. Register them first.</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Available Bed</label>
                <select
                  required
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">-- Choose empty bed --</option>
                  {facilityBeds.filter(b => b.status === 'available').map(b => (
                    <option key={b.id} value={b.id}>Bed {b.bedNumber} ({b.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admission Diagnosis / Note</label>
                <textarea
                  rows={3}
                  required
                  value={admitReason}
                  onChange={(e) => setAdmitReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Primary clinical rationale for hospital stay..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Stay Duration (Days)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={expectedStay}
                  onChange={(e) => setExpectedStay(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAdmitting || unadmittedPatients.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
              >
                {isAdmitting ? 'Recording...' : 'Register Inpatient Admission'}
              </button>
            </form>
          </div>

          {/* AI BED OCCUPANCY FORECAST */}
          <div className="bg-white border border-indigo-200 rounded-2xl shadow-xs overflow-hidden border-l-4 border-l-indigo-600">
            <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Bed Availability Forecast</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-normal">
                Gemini processes admissions records and expected lengths of stay to forecast open beds.
              </p>
            </div>

            <div className="p-5 space-y-3.5 text-xs font-mono">
              <div className="space-y-3">
                {bedForecast && bedForecast.slice(0, 4).map((bf, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700 font-semibold">{new Date(bf.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-700 font-extrabold">{bf.predictedAvailable} Free Beds</span>
                      <span className="text-[9px] text-slate-400 font-normal">(Occupancy: {Math.round(bf.occupancyRate)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-indigo-50/50 rounded-xl mt-2 text-slate-600 font-sans leading-normal text-[11px] flex gap-2">
                <AlertTriangle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Peak Occupancy Advisory:</strong> High demand expected on Wednesday due to local antenatal clinics. Keep 2 maternity beds reserved.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
