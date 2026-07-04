import React from 'react';
import { Settings, Shield, HardDrive, RefreshCw, KeyRound, Wifi } from 'lucide-react';

export default function SettingsTab() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-medblue text-white rounded-lg">
            <Settings className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration & Profile Settings</h2>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-1">
          Adjust offline persistence models, set default GPS coordinates, and manage cloud synchronization rules.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-3xs">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <span>Storage & Sync Caching</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-normal">
            Configure how the system behaves in low-bandwidth or disconnected conditions. By default, SwasthyaLink preserves clinical triage inputs inside local storage caches before uploading to Firebase.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-800 font-sans block">Offline Mode Behavior</span>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                Cache triage files locally, then sync when network signal exceeds 15kb/s.
              </p>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                ENABLED
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-800 font-sans block">Database Sync Interval</span>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                Auto-push clinical files to central servers every 60 seconds.
              </p>
              <span className="inline-block bg-sky-100 text-sky-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                60 SECONDS
              </span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Administrative Profile</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Assigned Hub Base</label>
              <input 
                type="text" 
                value="Bhadrak SubCenter Base Node" 
                disabled 
                className="w-full text-xs font-sans px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Assigned Worker Coordinates</label>
              <input 
                type="text" 
                value="21.054° N, 86.495° E" 
                disabled 
                className="w-full text-xs font-sans px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-emerald-500 animate-pulse" />
            <div className="leading-none">
              <p className="text-xs font-bold text-slate-800">Server Status: Active</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Connected to regional node bhadrak-central-3000</p>
            </div>
          </div>
          <button 
            onClick={() => {
              alert('Full operational synchronization triggered.');
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Manual System Sync</span>
          </button>
        </div>

      </div>

    </div>
  );
}
