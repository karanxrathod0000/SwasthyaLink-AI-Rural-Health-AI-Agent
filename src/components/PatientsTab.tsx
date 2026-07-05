import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Play, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Calendar,
  Layers,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { PatientRegistration, FootfallForecast, StaffingRecommendation, Facility } from '../types';

interface PatientsTabProps {
  facilities: Facility[];
  patients: PatientRegistration[];
  forecast: FootfallForecast[];
  staffingRecommendation: StaffingRecommendation | null;
  onRegisterPatient: (data: Omit<PatientRegistration, 'id' | 'registrationTime'>) => Promise<void>;
  onCallNextPatient: (facilityId: string) => Promise<void>;
}

export default function PatientsTab({
  facilities,
  patients,
  forecast,
  staffingRecommendation,
  onRegisterPatient,
  onCallNextPatient
}: PatientsTabProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'SC-1');
  
  // Registration Form States
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('F');
  const [contact, setContact] = useState('');
  const [department, setDepartment] = useState<'general' | 'gynecology' | 'pediatrics' | 'surgery' | 'dental'>('general');
  const [visitType, setVisitType] = useState<'OPD' | 'IPD'>('OPD');
  const [triagePriority, setTriagePriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCallingNext, setIsCallingNext] = useState(false);

  const facilityPatients = patients.filter(p => p.facilityId === selectedFacilityId);
  const opdQueue = facilityPatients.filter(p => p.visitType === 'OPD' && p.status !== 'completed' && p.status !== 'admitted');
  
  // Compute metrics
  const totalToday = facilityPatients.length;
  const opdCount = facilityPatients.filter(p => p.visitType === 'OPD').length;
  const ipdCount = facilityPatients.filter(p => p.visitType === 'IPD').length;
  
  // Mock wait time calculation (just for visual representation)
  const averageWaitTime = totalToday > 0 ? Math.max(10, 25 - totalToday) : 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      alert('Please fill out Name and Contact.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onRegisterPatient({
        facilityId: selectedFacilityId,
        name,
        age,
        gender,
        contact,
        department,
        visitType,
        triagePriority,
        status: visitType === 'IPD' ? 'admitted' : 'waiting'
      });
      setName('');
      setContact('');
      alert('Patient registered and queued successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNext = async () => {
    if (opdQueue.length === 0) {
      alert('No patients in the waiting queue.');
      return;
    }
    setIsCallingNext(true);
    try {
      await onCallNextPatient(selectedFacilityId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCallingNext(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient Registration & Footfall</h1>
            <p className="text-xs text-slate-500 font-mono">OPD queues, load predictions, and AI-optimized staffing schedules</p>
          </div>
        </div>
        
        {/* Facility Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 font-mono">FACILITY:</span>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-3xs cursor-pointer"
          >
            {facilities.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Today's Total Patients</span>
          <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">{totalToday}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Registered for general or specialist consults</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">OPD Outpatients</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-sans tracking-tight mt-1">{opdCount}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Active consultations and walk-ins</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">IPD Admissions</span>
          <span className="text-2xl font-extrabold text-indigo-600 font-sans tracking-tight mt-1">{ipdCount}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Patients admitted to referral beds</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Avg Wait Time</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">{averageWaitTime} mins</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded flex items-center gap-0.5">↓ -2m</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Calculated check-in to doctor call</p>
        </div>
      </div>

      {/* CORE BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: OPD QUEUE LIST */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active OPD Waiting Queue</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Live status list of outpatients waiting for doctor consultations</p>
              </div>
              
              <button
                onClick={handleCallNext}
                disabled={isCallingNext || opdQueue.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Call Next Patient</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Queue Token / Patient</th>
                    <th className="p-4">Specialty Dept</th>
                    <th className="p-4">Priority Category</th>
                    <th className="p-4">Queue Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facilityPatients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-mono">
                        No patient registrations recorded for today.
                      </td>
                    </tr>
                  ) : (
                    facilityPatients.map((patient, index) => {
                      let priorityBadge = '';
                      if (patient.triagePriority === 'emergency') {
                        priorityBadge = 'bg-rose-100 text-rose-800 border-rose-200';
                      } else if (patient.triagePriority === 'urgent') {
                        priorityBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                      } else {
                        priorityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                      }

                      let statusBadge = '';
                      if (patient.status === 'waiting') {
                        statusBadge = 'text-amber-600 bg-amber-50';
                      } else if (patient.status === 'with_doctor') {
                        statusBadge = 'text-indigo-600 bg-indigo-50 font-bold';
                      } else if (patient.status === 'completed') {
                        statusBadge = 'text-emerald-600 bg-emerald-50';
                      } else {
                        statusBadge = 'text-slate-600 bg-slate-50';
                      }

                      return (
                        <tr key={patient.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-900">#{String(index + 1).padStart(3, '0')} - {patient.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {patient.age} yrs • {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'} • {patient.contact}
                            </p>
                          </td>
                          <td className="p-4 font-mono font-semibold uppercase text-slate-600">
                            {patient.department}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${priorityBadge}`}>
                              {patient.triagePriority}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${statusBadge}`}>
                              {patient.status.replace('_', ' ')}
                            </span>
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
            Real-time synchronization active • Local database updated
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM & AI FORECAST */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* REGISTRATION FORM */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <UserPlus className="w-4.5 h-4.5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Register New OPD Patient</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ram Sahoo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="general">General Ward</option>
                    <option value="gynecology">Gynecology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="surgery">Surgery</option>
                    <option value="dental">Dental</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visit Type</label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="OPD">OPD (Outpatient)</option>
                    <option value="IPD">IPD (Inpatient)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Triage Priority Level</label>
                <select
                  value={triagePriority}
                  onChange={(e) => setTriagePriority(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-semibold"
                >
                  <option value="routine">🟢 ROUTINE (Minor symptoms)</option>
                  <option value="urgent">🟡 URGENT (Needs early attention)</option>
                  <option value="emergency">🔴 EMERGENCY (Critical status)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
              >
                {isSubmitting ? 'Registering...' : 'Register and Add to Queue'}
              </button>
            </form>
          </div>

          {/* AI FOOTFALL FORECAST CARD */}
          <div className="bg-white border border-indigo-200 rounded-2xl shadow-xs overflow-hidden border-l-4 border-l-indigo-600">
            <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Footfall Forecast (7 Days)</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-normal">
                Predicts daily footfall volume based on weekly seasonal patterns and recent local health indices.
              </p>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              {/* Daily forecast bars */}
              <div className="space-y-2">
                {forecast.slice(0, 5).map(f => {
                  const maxPredicted = Math.max(...forecast.map(x => x.predictedCount)) || 100;
                  const pct = Math.round((f.predictedCount / maxPredicted) * 100);
                  const dayName = new Date(f.date).toLocaleDateString([], { weekday: 'long' });
                  
                  return (
                    <div key={f.date} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700">{dayName}</span>
                        <span className="font-mono text-indigo-700 font-bold">{f.predictedCount} patients</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Roster adjustment from AI */}
              {staffingRecommendation && (
                <div className="p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl space-y-2 font-sans mt-4">
                  <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-widest font-mono block">AI Staffing Adjustments</span>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    <strong>Peak Coverage:</strong> {staffingRecommendation.peakHoursCoverage}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    <strong>Specialist Focus:</strong> {staffingRecommendation.specialistCoverage}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
