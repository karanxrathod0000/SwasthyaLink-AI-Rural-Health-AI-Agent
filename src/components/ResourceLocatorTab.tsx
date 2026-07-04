import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Compass, 
  SlidersHorizontal,
  Info,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { Facility } from '../types';

interface ResourceLocatorTabProps {
  facilities: Facility[];
  onUpdateOccupancy: (id: string, occupied: number, status?: Facility['status']) => void;
}

export default function ResourceLocatorTab({ facilities, onUpdateOccupancy }: ResourceLocatorTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SubCenter' | 'CHC' | 'DistrictHospital'>('ALL');
  const [equipmentFilter, setEquipmentFilter] = useState<'ALL' | 'Ultrasound' | 'Oxygen' | 'Cardiac'>('ALL');

  // Edit bed capacity states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempOccupied, setTempOccupied] = useState<number>(0);
  const [tempStatus, setTempStatus] = useState<Facility['status']>('FULL_OPERATIONAL');

  // Filter facilities
  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.contactNo.includes(searchQuery);
    const matchesType = typeFilter === 'ALL' || f.type === typeFilter;
    
    let matchesEquip = true;
    if (equipmentFilter === 'Ultrasound') {
      matchesEquip = f.equipment.includes('Ultrasound') || f.equipment.some(e => e.toLowerCase().includes('ultra'));
    } else if (equipmentFilter === 'Oxygen') {
      matchesEquip = f.equipment.includes('High-Flow Oxygen') || f.equipment.some(e => e.toLowerCase().includes('oxygen'));
    } else if (equipmentFilter === 'Cardiac') {
      matchesEquip = f.equipment.includes('Cardiac Monitor') || f.equipment.some(e => e.toLowerCase().includes('cardiac') || e.toLowerCase().includes('icu'));
    }

    return matchesSearch && matchesType && matchesEquip;
  });

  const handleStartEdit = (f: Facility) => {
    setEditingId(f.id);
    setTempOccupied(f.bedCapacity.occupied);
    setTempStatus(f.status);
  };

  const handleSaveEdit = (id: string, total: number) => {
    if (tempOccupied < 0 || tempOccupied > total) {
      alert(`Occupied beds must be between 0 and total capacity of ${total}`);
      return;
    }
    onUpdateOccupancy(id, tempOccupied, tempStatus);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER STATEMENT */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-medblue text-white rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Regional Facility Resource Locator</h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Showing facilities within 50km radius of Bhadrak Hub. Real-time medical supply, staff, and oxygen availability checklists.
          </p>
        </div>
        
        <button 
          onClick={() => {
            alert('Opening external GPS coordinator overlay to ping active regional beds.');
          }}
          className="bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition"
        >
          <Compass className="w-4 h-4 text-medblue" />
          <span>📌 Use My Location</span>
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text"
              placeholder="Search facility name or contact number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-sans pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden"
            />
          </div>

          {/* Type filters */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0 overflow-x-auto">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                typeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('SubCenter')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                typeFilter === 'SubCenter' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              SubCenters
            </button>
            <button
              onClick={() => setTypeFilter('CHC')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                typeFilter === 'CHC' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              CHCs
            </button>
            <button
              onClick={() => setTypeFilter('DistrictHospital')}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                typeFilter === 'DistrictHospital' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dist. Hospitals
            </button>
          </div>

        </div>

        {/* Specialized equipment filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Equipment Filter:</span>
          </span>
          <button
            onClick={() => setEquipmentFilter('ALL')}
            className={`px-2.5 py-1 text-[10px] font-bold border rounded-full transition ${
              equipmentFilter === 'ALL' ? 'bg-medblue text-white border-medblue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setEquipmentFilter('Ultrasound')}
            className={`px-2.5 py-1 text-[10px] font-bold border rounded-full transition ${
              equipmentFilter === 'Ultrasound' ? 'bg-medblue text-white border-medblue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Ultrasound Scanner
          </button>
          <button
            onClick={() => setEquipmentFilter('Oxygen')}
            className={`px-2.5 py-1 text-[10px] font-bold border rounded-full transition ${
              equipmentFilter === 'Oxygen' ? 'bg-medblue text-white border-medblue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            High-Flow Oxygen Block
          </button>
          <button
            onClick={() => setEquipmentFilter('Cardiac')}
            className={`px-2.5 py-1 text-[10px] font-bold border rounded-full transition ${
              equipmentFilter === 'Cardiac' ? 'bg-medblue text-white border-medblue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Cardiac ICU Suite
          </button>
        </div>

      </div>

      {/* FACILITIES LISTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 p-12 text-center rounded-2xl">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-mono">No healthcare nodes match your filter queries.</p>
          </div>
        ) : (
          filteredFacilities.map(facility => {
            const availableBeds = facility.bedCapacity.total - facility.bedCapacity.occupied;
            const occupancyRate = (facility.bedCapacity.occupied / facility.bedCapacity.total) * 100;
            const isEditing = editingId === facility.id;

            // Status Badge Styles
            let statusDot = 'bg-emerald-500';
            let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-100';
            let statusText = 'Fully Operational';

            if (facility.status === 'CRITICAL_LOAD') {
              statusDot = 'bg-rose-500 animate-pulse';
              statusBadge = 'bg-rose-50 text-rose-800 border-rose-100';
              statusText = 'Critical Load';
            } else if (facility.status === 'LIMITED_SERVICE') {
              statusDot = 'bg-amber-500';
              statusBadge = 'bg-amber-50 text-amber-800 border-amber-100';
              statusText = 'Limited Services';
            }

            return (
              <div 
                key={facility.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                {/* Visual Type Indicator */}
                <div className="p-5 border-b border-slate-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase">
                        {facility.type === 'DistrictHospital' ? 'District Hospital' : facility.type === 'CHC' ? 'Community Health Center' : 'SubCenter Base'}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1.5">{facility.name}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-medblue flex items-center gap-1 bg-sky-50 px-2 py-1 rounded">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{facility.distanceKm}km</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full flex items-center gap-1.5 ${statusBadge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                      <span>{statusText}</span>
                    </span>
                  </div>
                </div>

                {/* Beds and Resources checklist section */}
                <div className="p-5 flex-1 bg-slate-50/50 space-y-4 border-b border-slate-100">
                  {/* Bed ledger */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500">Beds Occupancy</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {facility.bedCapacity.occupied} / {facility.bedCapacity.total} Occupied
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          facility.status === 'CRITICAL_LOAD' ? 'bg-rose-500' : 'bg-medblue'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{availableBeds} beds available</span>
                      <span>{Math.round(occupancyRate)}% full</span>
                    </div>
                  </div>

                  {/* Staff capabilities */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Specialized Staff:</span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {facility.specializedStaff.join(', ') || 'General Nursing & Midwifery (GNM) only'}
                    </p>
                  </div>

                  {/* Equipment checklist */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Available Tech/Equipment:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {facility.equipment.map(eq => (
                        <span key={eq} className="bg-white border border-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded font-mono font-medium">
                          ✓ {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Operations Actions & edits */}
                <div className="p-4 bg-white flex flex-col gap-2">
                  {isEditing ? (
                    <div className="space-y-3.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Set Occupied Beds:</label>
                        <input 
                          type="number"
                          value={tempOccupied}
                          onChange={(e) => setTempOccupied(Number(e.target.value))}
                          className="w-full text-xs font-mono px-2 py-1 bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">Status Class:</label>
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value as Facility['status'])}
                          className="w-full text-xs bg-white border border-slate-200 px-2 py-1 rounded"
                        >
                          <option value="FULL_OPERATIONAL">Full Operational</option>
                          <option value="LIMITED_SERVICE">Limited Service</option>
                          <option value="CRITICAL_LOAD">Critical Load</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(facility.id, facility.bedCapacity.total)}
                          className="flex-1 bg-medblue text-white hover:bg-medblue/90 py-1 rounded text-[10px] font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <a 
                        href={`tel:${facility.contactNo}`}
                        className="text-xs font-semibold text-slate-700 hover:text-medblue flex items-center gap-1.5 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{facility.contactNo}</span>
                      </a>
                      
                      <button
                        onClick={() => handleStartEdit(facility)}
                        className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition"
                      >
                        Edit Bed Capacity
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
