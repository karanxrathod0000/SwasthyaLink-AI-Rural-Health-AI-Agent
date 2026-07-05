import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, MessageSquare, PhoneCall, ShieldAlert, Activity, Package, Bed, Users, FileText, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReopenTour?: () => void;
}

export default function HelpModal({ isOpen, onClose, onReopenTour }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'faqs' | 'modules' | 'support'>('faqs');

  if (!isOpen) return null;

  const faqs = [
    {
      q: "How does the AI Symptom Triage work without doctors nearby?",
      a: "SwasthyaLink integrates Google Gemini AI trained on emergency clinical protocols. ASHA workers input vital signs and symptoms in local dialects; the AI immediately generates a risk severity score (RED/YELLOW/GREEN) and specific first-aid instructions while alerting the nearest PHC."
    },
    {
      q: "What happens if there is an internet disconnection in a rural PHC?",
      a: "The dashboard caches operational data locally in your browser session. Once connectivity is restored, attendance logs, triage records, and medicine reorders automatically synchronize with the central district health server."
    },
    {
      q: "How does Predictive Inventory forecast stockouts?",
      a: "By combining regional epidemiological surveillance (e.g., seasonal malaria or dengue spikes) with real-time consumption rates, our 30-day AI forecasting algorithm predicts stock depletion before critical thresholds are breached."
    },
    {
      q: "Can PHC staff re-assign beds or redistribute ambulances?",
      a: "Yes! In Module 3 (Bed Management) and Module 10 (Ambulance Routing), coordinators can view regional occupancy and route incoming emergency cases to facilities with available ventilators and ICU beds."
    }
  ];

  const modules = [
    { name: "1. AI Symptom Triage", desc: "Instant clinical severity risk scoring and decision support.", icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { name: "2. Patient Queue & Records", desc: "Digital token registration and OPD patient flow management.", icon: <Users className="w-4 h-4 text-blue-400" /> },
    { name: "3. PHC Bed Management", desc: "Live ward occupancy, admissions, and 7-day bed forecasting.", icon: <Bed className="w-4 h-4 text-purple-400" /> },
    { name: "4. Doctor Attendance & Leaves", desc: "Geo-fenced check-ins and automated leave replacement alerts.", icon: <CheckCircle2 className="w-4 h-4 text-teal-400" /> },
    { name: "5. Inventory & Pharmacy", desc: "Medicine stock levels, expiry tracking, and automated AI reorder.", icon: <Package className="w-4 h-4 text-amber-400" /> },
    { name: "6. Diagnostic & Lab Audits", desc: "Equipment status, sample collection, and automated test recommendation.", icon: <FileText className="w-4 h-4 text-rose-400" /> },
    { name: "7. Emergency SOS & Alerts", desc: "District-wide red alert broadcasts for epidemics or accidents.", icon: <ShieldAlert className="w-4 h-4 text-red-500" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl overflow-hidden bg-slate-900 border shadow-2xl border-slate-800 rounded-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">SwasthyaLink Help & Support</h3>
              <p className="text-xs text-slate-400">Documentation, AI Guides, and Technical Assistance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 transition-colors rounded-lg hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b bg-slate-900/60 border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'faqs' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'modules' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Module Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'support' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact & Support</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="p-4 border rounded-xl bg-slate-950/50 border-slate-800/80">
                  <h4 className="text-sm font-semibold text-white flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0">Q:</span>
                    <span>{f.q}</span>
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 pl-6 border-l border-slate-800">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.map((m, i) => (
                <div key={i} className="p-3.5 border rounded-xl bg-slate-950/40 border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors">
                  <div className="p-2 bg-slate-900 rounded-lg shrink-0 mt-0.5 border border-slate-800">
                    {m.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-200">{m.name}</h5>
                    <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-4">
              <div className="p-5 border rounded-2xl bg-gradient-to-br from-emerald-950/30 to-teal-950/20 border-emerald-500/20">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                  <span>24/7 District Health Command Desk</span>
                </h4>
                <p className="mt-1 text-xs text-slate-300">
                  For immediate escalation of epidemic outbreaks, ambulance dispatch failures, or system emergencies.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Emergency Helpline</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">+91 1800-233-SWASTHYA</p>
                  </div>
                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Technical AI Support</span>
                    <p className="text-sm font-bold text-blue-400 mt-0.5">support@swasthyalink.ai</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-t border-slate-800/80">
          {onReopenTour ? (
            <button
              onClick={() => { onClose(); onReopenTour(); }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              🚀 Reopen Onboarding Welcome Tour
            </button>
          ) : <div />}
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white transition-all bg-slate-800 rounded-xl hover:bg-slate-700"
          >
            Close Help
          </button>
        </div>

      </div>
    </div>
  );
}
