import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Activity, 
  FileText, 
  Filter, 
  CheckCircle, 
  ShieldAlert, 
  ChevronRight,
  Heart,
  PlusCircle
} from 'lucide-react';
import { TriageResult, Facility } from '../types';

interface PatientsDirectoryTabProps {
  triageRecords: TriageResult[];
  facilities: Facility[];
  setActiveTab: (tab: string) => void;
  openNewPatientIntake: () => void;
}

export default function PatientsDirectoryTab({ 
  triageRecords, 
  facilities, 
  setActiveTab,
  openNewPatientIntake 
}: PatientsDirectoryTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [maternalFilter, setMaternalFilter] = useState<'ALL' | 'PREGNANT'>('ALL');

  // Filter list
  const filteredPatients = triageRecords.filter(t => {
    const matchesSearch = t.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.allocatedFacilityId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMaternal = maternalFilter === 'ALL' || t.pregnancyStatus === 'YES';

    return matchesSearch && matchesMaternal;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER STATEMENT */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-medblue text-white rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Directory & Clinical Ledger</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Electronic health card listings. Search, filter maternal cases, and audit individual triage outcomes.
          </p>
        </div>

        <button 
          onClick={openNewPatientIntake}
          className="bg-medblue hover:bg-medblue/90 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Patient Intake</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input 
            type="text"
            placeholder="Search patient records, symptoms, or allocated facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-sans pl-9 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0 overflow-x-auto">
          <button
            onClick={() => setMaternalFilter('ALL')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
              maternalFilter === 'ALL' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Patients
          </button>
          <button
            onClick={() => setMaternalFilter('PREGNANT')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
              maternalFilter === 'PREGNANT' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🤰 Maternal Cases
          </button>
        </div>
      </div>

      {/* PATIENTS TABLE GRID */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Patient Profile</th>
                <th className="p-4">Clinical Symptoms & Presentation</th>
                <th className="p-4">Vitals Summary</th>
                <th className="p-4">Triage Priority</th>
                <th className="p-4">Allocated Facility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-slate-400 font-mono">
                    No matching patient records found. Start a triage session to register clinical logs.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => {
                  let badgeStyle = 'bg-slate-100 text-slate-700';
                  if (patient.category === 'CRITICAL') {
                    badgeStyle = 'bg-rose-100 text-rose-800 border border-rose-200';
                  } else if (patient.category === 'HIGH') {
                    badgeStyle = 'bg-amber-100 text-amber-800 border border-amber-200';
                  } else if (patient.category === 'MEDIUM') {
                    badgeStyle = 'bg-sky-100 text-sky-800';
                  } else if (patient.category === 'LOW') {
                    badgeStyle = 'bg-emerald-100 text-emerald-800';
                  }

                  const matchedFacility = facilities.find(f => f.id === patient.allocatedFacilityId);

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-800">
                            {patient.patientAge}y {patient.patientGender === 'M' ? 'Male' : patient.patientGender === 'F' ? 'Female' : 'Other'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {patient.id}</p>
                        </div>
                      </td>
                      
                      <td className="p-4 max-w-sm">
                        <div className="space-y-1">
                          <p className="font-sans text-slate-700 line-clamp-2">{patient.symptoms}</p>
                          {patient.pregnancyStatus === 'YES' && (
                            <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                              🤰 PREGNANT
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                        O₂: {patient.vitals.oxygenSat}% • Temp: {patient.vitals.temp}°F <br />
                        BP: {patient.vitals.bloodPressure} • HR: {patient.vitals.pulse}
                      </td>

                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeStyle}`}>
                          {patient.category}
                        </span>
                      </td>

                      <td className="p-4 font-sans font-medium text-slate-700">
                        {matchedFacility ? matchedFacility.name : 'SubCenter Base'}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            alert(`Showing clinical case brief for ${patient.id}:\n\nSymptoms: "${patient.symptoms}"\n\nClinical Recommendation: "${patient.recommendedAction}"\n\nClinical Reasoning: "${patient.clinicalReasoning}"`);
                          }}
                          className="text-xs font-bold text-medblue hover:underline flex items-center justify-end gap-1"
                        >
                          <span>Case File</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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

    </div>
  );
}
