import React, { useState } from 'react';
import { Building, MapPin, Users, HeartHandshake, Phone, Percent, Shield, Activity } from 'lucide-react';
import { Facility } from '../types';

interface FacilityInventoryProps {
  facilities: Facility[];
  onUpdateOccupancy: (id: string, occupied: number, status?: Facility['status']) => void;
}

export default function FacilityInventory({ facilities, onUpdateOccupancy }: FacilityInventoryProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [tempOccupied, setTempOccupied] = useState<number>(0);
  const [tempStatus, setTempStatus] = useState<Facility['status']>('FULL_OPERATIONAL');

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);

  const startEdit = (facility: Facility) => {
    setSelectedFacilityId(facility.id);
    setTempOccupied(facility.bedCapacity.occupied);
    setTempStatus(facility.status);
  };

  const handleSave = () => {
    if (selectedFacilityId) {
      onUpdateOccupancy(selectedFacilityId, tempOccupied, tempStatus);
      setSelectedFacilityId(null);
    }
  };

  return (
    <div id="facility-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-slate-700" />
          <h2 className="font-semibold text-slate-900 font-sans text-sm tracking-tight">Regional Facilities & Equipment Ledger</h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Connected to Regional DB
        </span>
      </div>

      <div className="p-5 flex-1 overflow-y-auto max-h-[460px] space-y-4">
        {facilities.map(facility => {
          const occupancyPercentage = Math.round((facility.bedCapacity.occupied / facility.bedCapacity.total) * 100) || 0;
          
          let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
          if (facility.status === 'LIMITED_SERVICE') statusColor = 'text-amber-600 bg-amber-50 border-amber-100';
          if (facility.status === 'CRITICAL_LOAD') statusColor = 'text-rose-600 bg-rose-50 border-rose-100';

          return (
            <div 
              key={facility.id}
              id={`facility-${facility.id}`}
              className="border border-slate-100 hover:border-slate-200 p-4 rounded-lg bg-slate-50/50 transition duration-150 space-y-3"
            >
              {/* Facility Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">[{facility.type}]</span>
                    <h3 className="font-bold text-sm text-slate-900 font-sans leading-tight">
                      {facility.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Distance: {facility.distanceKm} km
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusColor}`}>
                  {facility.status.replace('_', ' ')}
                </span>
              </div>

              {/* Bed Occupancy Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                  <span>Referral Beds Occupied</span>
                  <span>{facility.bedCapacity.occupied} / {facility.bedCapacity.total} ({occupancyPercentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      occupancyPercentage > 90 ? 'bg-rose-500' :
                      occupancyPercentage > 60 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyPercentage)}%` }}
                  ></div>
                </div>
              </div>

              {/* Active Equipment & Specialties tags */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider">Operational Equipment</span>
                <div className="flex flex-wrap gap-1">
                  {facility.equipment.map((eq, i) => (
                    <span 
                      key={i} 
                      className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${
                        eq.includes('Ultrasound') || eq.includes('ICU') || eq.includes('Oxygen')
                          ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Staff Details */}
              <div className="text-[11px] font-mono text-slate-600 bg-white border border-slate-100 rounded p-2 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-400">Personnel:</span>
                  <span className="text-slate-800 font-sans truncate">{facility.specializedStaff.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50 text-[10px]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{facility.contactNo}</span>
                  </span>
                  <span>Doctors: <strong className="text-slate-800">{facility.activeDoctors}</strong></span>
                </div>
              </div>

              {/* Inline Bed Configuration Action */}
              <div className="flex justify-end pt-1">
                {selectedFacilityId === facility.id ? (
                  <div className="bg-slate-100 p-2.5 rounded-md border border-slate-200 w-full space-y-2 font-mono text-xs">
                    <p className="font-bold text-slate-700">Update Capacity & Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Occupied Beds</label>
                        <input 
                          type="number"
                          min="0"
                          max={facility.bedCapacity.total}
                          value={tempOccupied}
                          onChange={(e) => setTempOccupied(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-900 text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Facility Load</label>
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value as Facility['status'])}
                          className="w-full bg-white border border-slate-300 rounded px-1 py-1 text-slate-900"
                        >
                          <option value="FULL_OPERATIONAL">Full Operational</option>
                          <option value="LIMITED_SERVICE">Limited Service</option>
                          <option value="CRITICAL_LOAD">Critical Load</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5">
                      <button 
                        type="button"
                        onClick={() => setSelectedFacilityId(null)}
                        className="bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300 font-sans cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={handleSave}
                        className="bg-slate-800 text-white px-2 py-1 rounded hover:bg-slate-950 font-sans cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    id={`btn-manage-facility-${facility.id}`}
                    type="button"
                    onClick={() => startEdit(facility)}
                    className="text-[10px] font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border border-indigo-200 px-2 py-1 rounded bg-white shadow-xs cursor-pointer"
                  >
                    Configure Occupancy
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
