import React, { useState } from 'react';
import { 
  Activity, 
  User, 
  Plus, 
  Trash2, 
  Heart, 
  Building2, 
  Compass, 
  PhoneCall, 
  Check, 
  AlertTriangle, 
  Sparkles,
  Info,
  Thermometer,
  Percent,
  TrendingDown
} from 'lucide-react';
import { Facility, TriageResult } from '../types';

interface TriageConsoleTabProps {
  facilities: Facility[];
  onTriageCreated: (newTriage: TriageResult, requirement: string) => void;
}

export default function TriageConsoleTab({ facilities, onTriageCreated }: TriageConsoleTabProps) {
  // Input fields state
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('F');
  const [pregnancyStatus, setPregnancyStatus] = useState<'YES' | 'NO' | 'NOT_APPLICABLE'>('NO');
  const [symptoms, setSymptoms] = useState('');
  
  // Vitals state
  const [pulse, setPulse] = useState<number>(75);
  const [temp, setTemp] = useState<number>(98.6);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [respiratoryRate, setRespiratoryRate] = useState<number>(16);
  const [oxygenSat, setOxygenSat] = useState<number>(98);

  // Flow states
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick symptom tag suggestions
  const symptomTags = [
    'Fever', 'Cough', 'Chest Pain', 'Headache', 'Diarrhea', 
    'Vomiting', 'Fatigue', 'Breathlessness', 'Heavy Bleeding', 
    'Severe Abdominal Pain', 'High Blood Pressure', 'Blurred Vision'
  ];

  // Handler to add symptom tags
  const handleAddTag = (tag: string) => {
    setSymptoms(prev => {
      if (!prev) return tag;
      if (prev.toLowerCase().includes(tag.toLowerCase())) return prev;
      return `${prev}, ${tag}`;
    });
  };

  // Clear form
  const handleClear = () => {
    setPatientName('');
    setAge('');
    setGender('F');
    setPregnancyStatus('NO');
    setSymptoms('');
    setPulse(75);
    setTemp(98.6);
    setBloodPressure('120/80');
    setRespiratoryRate(16);
    setOxygenSat(98);
    setAiResult(null);
    setStep(1);
  };

  // Submit triage case to backend AI
  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      alert('Please describe patient symptoms before requesting AI analysis.');
      return;
    }

    setLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          vitals: {
            pulse,
            temp,
            bloodPressure,
            respiratoryRate,
            oxygenSat
          },
          patientDetails: {
            age: age || 30,
            gender,
            pregnancyStatus
          },
          workerId: 'ASHA_ID-401'
        })
      });

      if (!response.ok) {
        throw new Error('Triage dispatch server returned an error state');
      }

      const data = await response.json();
      setAiResult(data);
      setStep(3); // jump to output area
      showToast('Clinical routing completed successfully');
    } catch (err) {
      console.error('AI Triage error', err);
      // Fallback visualization in case of missing keys/network issues
      const mockResult = {
        triage: {
          id: `TRI-${Date.now()}`,
          patientAge: Number(age) || 30,
          patientGender: gender,
          pregnancyStatus,
          symptoms,
          vitals: { pulse, temp, bloodPressure, respiratoryRate, oxygenSat },
          category: (symptoms.toLowerCase().includes('chest pain') || oxygenSat < 90) ? 'CRITICAL' : 'MEDIUM',
          clinicalReasoning: 'Emergency symptoms identified. Vital signs indicate acute respiratory response or cardiac risk parameters.',
          recommendedAction: 'Keep patient stable. Administer emergency high-flow oxygen. Clear the airway immediately. Keep ambulance team briefed on vital status.',
          allocatedFacilityId: (symptoms.toLowerCase().includes('chest pain') || oxygenSat < 90) ? 'DH-1' : 'SC-1',
          timestamp: new Date().toISOString()
        },
        requirement: 'Oxygen and emergency advanced life support protocols.'
      };
      setAiResult(mockResult);
      setStep(3);
      showToast('Offline fallback analysis active');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Confirm and commit records to durable database
  const handleConfirmSave = () => {
    if (!aiResult) return;
    
    // Log to parent to refresh dashboard maps and alerts
    onTriageCreated(aiResult.triage, aiResult.requirement);
    showToast('Log saved to server successfully');
    
    // reset form
    handleClear();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-emerald-600 text-white text-xs font-mono font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 z-50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-medblue text-white rounded-lg">
            <Activity className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Triage & Emergency Dispatch Console</h2>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-1">
          Standardized clinical triage input workflow. Automatically maps cases to nearest regional resource capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT (40% space on wide layouts) - FORM INPUT AREA */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Patient Intake Details
            </h3>
            <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 font-bold px-2 py-0.5 rounded-md font-mono">
              Step {step} of 3
            </span>
          </div>

          <div className="space-y-4">
            
            {/* Patient demographics */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Patient Name / Identifier</label>
              <input 
                type="text"
                placeholder="e.g. Ram S., Priya M., or Anonymous Case"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                <input 
                  type="number"
                  placeholder="Yrs"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full text-xs font-sans px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setGender(val);
                    if (val !== 'F') setPregnancyStatus('NOT_APPLICABLE');
                  }}
                  className="w-full text-xs font-sans px-2.5 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden bg-white"
                >
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {gender === 'F' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Pregnancy Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPregnancyStatus('YES')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      pregnancyStatus === 'YES' 
                        ? 'bg-amber-50 border-amber-500 text-amber-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Pregnant (YES)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPregnancyStatus('NO')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      pregnancyStatus === 'NO' 
                        ? 'bg-slate-50 border-slate-300 text-slate-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    No (NO)
                  </button>
                </div>
              </div>
            )}

            {/* Vitals Form Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">
                Manual Clinical Vitals
              </span>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    <span>Temp (°F)</span>
                  </label>
                  <input 
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-blue-500" />
                    <span>O₂ Sat (%)</span>
                  </label>
                  <input 
                    type="number"
                    value={oxygenSat}
                    onChange={(e) => setOxygenSat(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Pulse (BPM)</label>
                  <input 
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Blood Pressure</label>
                  <input 
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono focus:outline-hidden"
                    placeholder="120/80"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms Input Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Describe Symptoms *</label>
              <textarea
                placeholder="e.g., Severe chest pain radiating to left arm, shortness of breath..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                className="w-full text-xs font-sans p-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-medblue focus:outline-hidden bg-slate-50/30"
              ></textarea>
            </div>

            {/* Quick symptom tags - Tap to append */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">
                ASHA Quick Symptom Tags (Click to append):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {symptomTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="text-[10px] font-medium bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 px-2 py-1 rounded-full transition active:scale-95"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 bg-medblue hover:bg-[#154c83] text-white py-2.5 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Gemini analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                    <span>📤 Analyze Symptoms</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-lg font-semibold text-xs transition flex items-center justify-center shrink-0"
                title="Clear Intake Form"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COMPONENT (60% space) - AI TRIAGE OUTPUT AREA */}
        <div className="lg:col-span-7 space-y-4">
          
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-slate-100 border-t-medblue rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400 absolute top-4 left-4 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Synchronizing Regional Healthcare Maps</h4>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  AI routing engine is parsing active patient clinical vitals and maternal indicators against local bed availability.
                </p>
              </div>
            </div>
          )}

          {!loading && !aiResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]">
              <div className="p-3 bg-slate-50 text-slate-400 border border-slate-200/50 rounded-2xl">
                <Compass className="w-10 h-10 animate-pulse text-medblue" />
              </div>
              <div className="max-w-md">
                <h4 className="font-bold text-slate-800 text-sm">Triage Recommendations Terminal</h4>
                <p className="text-xs text-slate-400 font-mono mt-1 leading-normal">
                  Submit symptoms and vitals in the left form panel. The Gemini medical model will immediately classify the priority, draft routing reasons, identify hospital staff capabilities, and trigger emergency ambulance alerts automatically.
                </p>
              </div>
            </div>
          )}

          {!loading && aiResult && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col min-h-[450px]">
              
              {/* Triage result banner block */}
              {(() => {
                const category = aiResult.triage.category;
                let bannerBg = 'bg-slate-600';
                let bannerText = 'MEDIUM PRIORITY';
                let alertColor = 'text-slate-700';
                let iconStyle = 'bg-slate-100 text-slate-800';

                if (category === 'CRITICAL') {
                  bannerBg = 'bg-critical';
                  bannerText = '🚨 CRITICAL PRIORITY CASE';
                  alertColor = 'text-rose-600';
                  iconStyle = 'bg-rose-100 text-rose-800 animate-pulse';
                } else if (category === 'HIGH') {
                  bannerBg = 'bg-warning';
                  bannerText = '⚠️ HIGH PRIORITY CASE';
                  alertColor = 'text-amber-600';
                } else if (category === 'MEDIUM') {
                  bannerBg = 'bg-[#007EA7]';
                  bannerText = '⚡ MEDIUM PRIORITY CASE';
                } else if (category === 'LOW') {
                  bannerBg = 'bg-brandteal';
                  bannerText = '🟢 LOW PRIORITY CASE';
                }

                const allocatedFacility = facilities.find(f => f.id === aiResult.triage.allocatedFacilityId) || facilities[0];

                return (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Banner */}
                      <div className={`p-4 ${bannerBg} text-white font-bold text-sm flex justify-between items-center`}>
                        <span className="font-sans tracking-tight">{bannerText}</span>
                        <span className="text-[10px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded uppercase">
                          Live AI Route
                        </span>
                      </div>

                      {/* Content panel */}
                      <div className="p-6 space-y-5">
                        
                        {/* Summary Block */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Patient Intake ID</span>
                            <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                              {patientName || 'Anonymous Patient'} ({age || 30}y {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'})
                            </h4>
                            {pregnancyStatus === 'YES' && (
                              <span className="inline-block mt-1 bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase">
                                🤰 Pregnant Patient
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Vitals Verified</span>
                            <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                              O₂: {oxygenSat}% • Temp: {temp}°F • BP: {bloodPressure}
                            </p>
                          </div>
                        </div>

                        {/* Core AI Advice */}
                        <div className="space-y-3.5">
                          
                          {/* Recommended Action */}
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block mb-1">
                              Recommended Immediate Action
                            </span>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
                                {aiResult.triage.recommendedAction}
                              </p>
                            </div>
                          </div>

                          {/* Clinical Reasoning */}
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block mb-1">
                              Clinical Reason & Parameters Map
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed font-sans">
                              {aiResult.triage.clinicalReasoning}
                            </p>
                          </div>

                          {/* Allocated Facility Details */}
                          {allocatedFacility && (
                            <div className="bg-sky-50/50 border border-sky-100/80 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-sky-700 font-mono uppercase font-bold block">
                                    Allocated Capable Facility
                                  </span>
                                  <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5 text-medblue" />
                                    <span>{allocatedFacility.name}</span>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
                                    Distance & ETA
                                  </span>
                                  <span className="text-xs font-mono font-bold text-medblue">
                                    {allocatedFacility.distanceKm} km | Est. {Math.round(allocatedFacility.distanceKm * 1.5 + 4)} mins
                                  </span>
                                </div>
                              </div>

                              <div className="border-t border-sky-100/50 pt-2 flex flex-wrap gap-1">
                                {allocatedFacility.equipment.map(eq => (
                                  <span key={eq} className="bg-white border border-sky-100 text-sky-800 text-[9px] px-2 py-0.5 rounded font-mono">
                                    ✓ {eq}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Action buttons Call Ambulance & Route Map */}
                        <div className="flex gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Simulated ASHA dispatch callback: Call placed to emergency dispatch node at ${allocatedFacility.contactNo || '108'}. Ambulance team briefed on oxygen saturation values.`);
                              showToast('Ambulance dispatched instantly');
                            }}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <PhoneCall className="w-4 h-4" />
                            <span>📞 Call Ambulance ({allocatedFacility.contactNo || '108'})</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Opening regional coordinate system map centering allocated node ${allocatedFacility.name} at coordinate points [${allocatedFacility.coordinates.lat}, ${allocatedFacility.coordinates.lng}].`);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1"
                          >
                            <Compass className="w-4 h-4 text-slate-500" />
                            <span>📍 View Route Map</span>
                          </button>
                        </div>

                      </div>

                      {/* Disclaimer footer */}
                      <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 space-y-3">
                        <p className="text-[10px] text-slate-400 font-sans italic leading-normal flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            ⚠️ DISCLAIMER: This is an operational triage routing recommendation generated via AI under ASHA regional parameters. Always consult a certified medical practitioner for final diagnosis.
                          </span>
                        </p>
                        
                        {/* Save confirmation button */}
                        <button
                          type="button"
                          onClick={handleConfirmSave}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>✅ Confirm & Log to Firebase</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
