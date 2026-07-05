import React, { useState } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  UserPlus
} from 'lucide-react';
import { Doctor, DoctorAttendance, LeaveRequest, Facility } from '../types';

interface DoctorsTabProps {
  facilities: Facility[];
  doctors: Doctor[];
  attendance: DoctorAttendance[];
  leaves: LeaveRequest[];
  onMarkAttendance: (doctorId: string, status: DoctorAttendance['status'], notes?: string) => Promise<void>;
  onSubmitLeave: (doctorId: string, fromDate: string, toDate: string, reason: string) => Promise<void>;
  attendanceForecast: any[];
}

export default function DoctorsTab({
  facilities,
  doctors,
  attendance,
  leaves,
  onMarkAttendance,
  onSubmitLeave,
  attendanceForecast
}: DoctorsTabProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'SC-1');
  
  // Attendance Form States
  const [attDocId, setAttDocId] = useState('');
  const [attStatus, setAttStatus] = useState<DoctorAttendance['status']>('present');
  const [attNotes, setAttNotes] = useState('Starting routine shift');
  const [isSubmittingAtt, setIsSubmittingAtt] = useState(false);

  // Leave Form States
  const [leaveDocId, setLeaveDocId] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('Annual medical training program');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const facilityDoctors = doctors.filter(d => d.facilityId === selectedFacilityId);
  const facilityAttendance = attendance.filter(a => a.facilityId === selectedFacilityId);
  const facilityLeaves = leaves.filter(l => l.facilityId === selectedFacilityId);

  // Compute metrics
  const totalDoctorsCount = facilityDoctors.length;
  const presentCount = facilityDoctors.filter(doc => {
    const record = facilityAttendance.find(a => a.doctorId === doc.id);
    return record?.status === 'present';
  }).length;
  const onLeaveCount = facilityDoctors.filter(doc => {
    const record = facilityAttendance.find(a => a.doctorId === doc.id);
    return record?.status === 'on_leave';
  }).length;
  const totalConsultations = facilityAttendance.reduce((acc, a) => acc + (a.patientsSeen || 0), 0);

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attDocId) {
      alert('Please select a doctor.');
      return;
    }
    setIsSubmittingAtt(true);
    try {
      await onMarkAttendance(attDocId, attStatus, attNotes);
      setAttDocId('');
      setAttNotes('Starting routine shift');
      alert('Doctor attendance successfully updated.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingAtt(false);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDocId || !leaveFrom || !leaveTo) {
      alert('Please fill out all fields.');
      return;
    }
    setIsSubmittingLeave(true);
    try {
      await onSubmitLeave(leaveDocId, leaveFrom, leaveTo, leaveReason);
      setLeaveDocId('');
      setLeaveFrom('');
      setLeaveTo('');
      setLeaveReason('Annual medical training program');
      alert('Leave request successfully logged and approved.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingLeave(false);
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doctor Attendance & Specialist Gaps</h1>
            <p className="text-xs text-slate-500 font-mono">Shift check-ins, leave planners, and AI doctor availability forecasts</p>
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
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Total Appointed Doctors</span>
          <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight mt-1">{totalDoctorsCount}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Physicians allocated to this center</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Present Today</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-sans tracking-tight mt-1">{presentCount}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Doctors active on the floor</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">On Approved Leave</span>
          <span className="text-2xl font-extrabold text-amber-500 font-sans tracking-tight mt-1">{onLeaveCount}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Active leaves logged in ledger</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Total Consultations</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">{totalConsultations}</span>
            <span className="text-[9px] text-slate-400 font-mono">patients seen</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">Consolidated patient loads seen today</p>
        </div>
      </div>

      {/* CORE GRID: STATUS BOARD & CONTROLS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* TODAY'S ATTENDANCE STATUS BOARD */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Daily Shift Roster Status</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Real-time attendance logs and consult workloads</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Physician Profile</th>
                    <th className="p-4">Department / Specialty</th>
                    <th className="p-4">Shift Attendance Status</th>
                    <th className="p-4">Timestamps</th>
                    <th className="p-4 text-right">Consultations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facilityDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-mono">
                        No doctors mapped to this facility.
                      </td>
                    </tr>
                  ) : (
                    facilityDoctors.map(doc => {
                      const att = facilityAttendance.find(a => a.doctorId === doc.id);
                      
                      let statusBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                      let statusLabel = 'Absent';
                      if (att) {
                        if (att.status === 'present') {
                          statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          statusLabel = 'Present';
                        } else if (att.status === 'on_leave') {
                          statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                          statusLabel = 'On Leave';
                        } else if (att.status === 'half_day') {
                          statusBadge = 'bg-sky-100 text-sky-800 border-sky-200';
                          statusLabel = 'Half Day';
                        }
                      }

                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-indigo-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                              {doc.name.replace('Dr. ', '').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{doc.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Reg ID: {doc.id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-700 capitalize">{doc.department}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.specialization}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${statusBadge}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-500">
                            {att && att.checkIn ? (
                              <div className="leading-tight">
                                <p>In: {new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {att.checkOut && <p>Out: {new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                              </div>
                            ) : (
                              '--:--'
                            )}
                          </td>
                          <td className="p-4 text-right font-bold text-slate-800 font-mono">
                            {att ? att.patientsSeen : 0} Patients
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
            Attendance ledger entries audit checked • Tamper-proof logs active
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION FORMS & AI FORECAST */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* MARK ATTENDANCE */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <UserCheck className="w-4.5 h-4.5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Log Shift Attendance</h3>
            </div>
            
            <form onSubmit={handleAttendanceSubmit} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Doctor</label>
                <select
                  required
                  value={attDocId}
                  onChange={(e) => setAttDocId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">-- Choose physician --</option>
                  {facilityDoctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Status</label>
                  <select
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-semibold"
                  >
                    <option value="present">✅ Present</option>
                    <option value="absent">❌ Absent</option>
                    <option value="half_day">🟡 Half Day</option>
                    <option value="on_leave">🟠 On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-in Notes</label>
                  <input
                    type="text"
                    value={attNotes}
                    onChange={(e) => setAttNotes(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAtt || facilityDoctors.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
              >
                {isSubmittingAtt ? 'Recording...' : 'Update Roster Check-in'}
              </button>
            </form>
          </div>

          {/* LEAVE PLANNER */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Roster Leave Request</h3>
            </div>
            
            <form onSubmit={handleLeaveSubmit} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Doctor</label>
                <select
                  required
                  value={leaveDocId}
                  onChange={(e) => setLeaveDocId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">-- Choose physician --</option>
                  {facilityDoctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  rows={2}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Describe context of unavailability..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLeave || facilityDoctors.length === 0}
                className="w-full bg-slate-800 hover:bg-slate-950 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
              >
                {isSubmittingLeave ? 'Submitting...' : 'Register Leave & Auto-Approve'}
              </button>
            </form>
          </div>

          {/* AI ATTENDANCE GAP FORECAST CARD */}
          <div className="bg-white border border-indigo-200 rounded-2xl shadow-xs overflow-hidden border-l-4 border-l-indigo-600">
            <div className="p-5 border-b border-slate-100 bg-indigo-50/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Attendance Gap Predictions</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-normal">
                Gemini reviews approved leaves and historical weekend absences to warn of upcoming specialty staffing gaps.
              </p>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="space-y-3">
                {attendanceForecast && attendanceForecast.slice(0, 3).map((f, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 font-sans">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                      <span>{new Date(f.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      <span className={`px-1.5 py-0.5 rounded border uppercase text-[8px] ${
                        f.gapSeverity === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600'
                      }`}>{f.gapSeverity} GAP risk</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">Present: {f.presentDoctors} / {totalDoctorsCount} expected</p>
                    <p className="text-[10px] text-slate-500 leading-normal">{f.gapMessage}</p>
                    {f.recommendation && (
                      <p className="text-[10px] text-indigo-700 font-semibold leading-normal">⚡ Rec: {f.recommendation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
