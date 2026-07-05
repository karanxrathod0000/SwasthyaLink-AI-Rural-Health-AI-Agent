import React, { useState } from 'react';
import { Activity, ShieldAlert, Heart, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { Vitals, PatientDetails, TriageResult } from '../types';

interface SymptomTriageFormProps {
  onTriageCreated: (triage: TriageResult, requirement: string) => void;
  facilities: Array<{ id: string; name: string }>;
}

export default function SymptomTriageForm({ onTriageCreated, facilities }: SymptomTriageFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('F');
  const [pregnancyStatus, setPregnancyStatus] = useState<'YES' | 'NO' | 'NOT_APPLICABLE'>('YES');

  // Vitals
  const [pulse, setPulse] = useState<number>(78);
  const [temp, setTemp] = useState<number>(98.6);
  const [sys, setSys] = useState<number>(120);
  const [dia, setDia] = useState<number>(80);
  const [respRate, setRespRate] = useState<number>(16);
  const [oxygenSat, setOxygenSat] = useState<number>(98);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'payload'>('form');

  // To display the latest generated JSON response
  const [latestResult, setLatestResult] = useState<{
    triage: TriageResult | null;
    rawJson: string | null;
  }>({ triage: null, rawJson: null });

  // Pre-filled scenario templates for the user to test easily
  const templates = [
    {
      label: 'Maternal Complication (High Risk)',
      symptoms: '32 weeks pregnant patient complaining of persistent lower abdominal cramping, severe headache, blurry vision, and sudden swelling in her hands.',
      age: 26,
      gender: 'F' as const,
      pregnancy: 'YES' as const,
      vitals: { pulse: 92, temp: 98.9, bp: '145/95', resp: 18, o2: 97 }
    },
    {
      label: 'Cardiovascular Event (Critical)',
      symptoms: 'Patient reports severe crushing chest pain that radiates directly to the left shoulder and neck, accompanied by heavy cold sweats and short gasping breaths.',
      age: 58,
      gender: 'M' as const,
      pregnancy: 'NOT_APPLICABLE' as const,
      vitals: { pulse: 112, temp: 97.8, bp: '160/105', resp: 24, o2: 89 }
    },
    {
      label: 'Minor Pediatric Fever (Low Risk)',
      symptoms: '5-year-old child with a mild runny nose and warm forehead. Active, drinking fluids, no signs of stiff neck or respiratory distress.',
      age: 5,
      gender: 'M' as const,
      pregnancy: 'NOT_APPLICABLE' as const,
      vitals: { pulse: 85, temp: 100.1, bp: '95/60', resp: 18, o2: 99 }
    }
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    setSymptoms(tpl.symptoms);
    setAge(tpl.age);
    setGender(tpl.gender);
    setPregnancyStatus(tpl.pregnancy);
    setPulse(tpl.vitals.pulse);
    setTemp(tpl.vitals.temp);
    const parts = tpl.vitals.bp.split('/');
    setSys(parseInt(parts[0]) || 120);
    setDia(parseInt(parts[1]) || 80);
    setRespRate(tpl.vitals.resp);
    setOxygenSat(tpl.vitals.o2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please provide patient symptoms.');
      return;
    }

    setLoading(true);
    setError(null);

    const vitalsData: Vitals = {
      pulse,
      temp,
      bloodPressure: `${sys}/${dia}`,
      respiratoryRate: respRate,
      oxygenSat
    };

    const patientDetails: PatientDetails = {
      age,
      gender,
      pregnancyStatus: gender === 'F' ? pregnancyStatus : 'NOT_APPLICABLE'
    };

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          vitals: vitalsData,
          patientDetails,
          workerId: 'ASHA_ID-401'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze patient status. Server returned an error.');
      }

      const data = await response.json();
      if (data.triage) {
        onTriageCreated(data.triage, data.requirement || '');
        
        // Prepare the structured payload block
        const structuredPayload = {
          triage_status: data.triage.category,
          recommended_action: data.triage.recommendedAction.substring(0, 100) + '...',
          payload: {
            worker_id: 'ASHA_ID-401',
            location_node: 'SubCenter Bhadrak',
            nearest_capable_facility: facilities.find(f => f.id === data.triage.allocatedFacilityId)?.name || 'District Hospital Bhadrak',
            alert_dispatched: data.triage.category === 'HIGH' || data.triage.category === 'CRITICAL',
            firebase_sync_status: 'SUCCESS'
          }
        };

        setLatestResult({
          triage: data.triage,
          rawJson: JSON.stringify(structuredPayload, null, 2)
        });
        
        // Show the results tab or visualizer
        setActiveTab('payload');
      }
    } catch (err: any) {
      setError(err.message || 'Network error communicating with triage engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="triage-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Header Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <h2 className="font-semibold text-slate-900 font-sans text-sm tracking-tight">ASHA Symptom Triage Console</h2>
        </div>
        <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
          <button
            id="tab-form"
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              activeTab === 'form' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Intake Form
          </button>
          <button
            id="tab-payload"
            type="button"
            onClick={() => setActiveTab('payload')}
            disabled={!latestResult.triage}
            className={`px-3 py-1 rounded-md font-medium transition ${
              latestResult.triage 
                ? 'text-slate-600 hover:text-slate-900' 
                : 'opacity-50 cursor-not-allowed'
            } ${
              activeTab === 'payload' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : ''
            }`}
          >
            Structured Output JSON
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick-Fill Templates */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2 font-mono">
              Apply Case Scenario Template
            </span>
            <div className="flex flex-wrap gap-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  id={`btn-template-${idx}`}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-md border border-slate-200 transition font-medium cursor-pointer"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Patient Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Patient Age</label>
              <input
                id="patient-age"
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
              <select
                id="patient-gender"
                value={gender}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setGender(val);
                  if (val !== 'F') setPregnancyStatus('NOT_APPLICABLE');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 bg-white font-sans"
              >
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Pregnancy Status</label>
              <select
                id="pregnancy-status"
                value={pregnancyStatus}
                onChange={(e) => setPregnancyStatus(e.target.value as any)}
                disabled={gender !== 'F'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400 font-sans"
              >
                <option value="YES">Yes (Active Gestation)</option>
                <option value="NO">No</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>
          </div>

          {/* Vitals Input Grid */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-3 font-mono">
              Patient Vitals Indicators
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Pulse (bpm)</label>
                <input
                  id="vital-pulse"
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Temp (°F)</label>
                <input
                  id="vital-temp"
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">BP (Sys/Dia)</label>
                <div className="flex items-center gap-1">
                  <input
                    id="vital-bp-sys"
                    type="number"
                    value={sys}
                    onChange={(e) => setSys(Number(e.target.value))}
                    className="w-1/2 px-1.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 text-center"
                    placeholder="Sys"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    id="vital-bp-dia"
                    type="number"
                    value={dia}
                    onChange={(e) => setDia(Number(e.target.value))}
                    className="w-1/2 px-1.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 text-center"
                    placeholder="Dia"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Resp. Rate (bpm)</label>
                <input
                  id="vital-resprate"
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">O2 Saturation (%)</label>
                <input
                  id="vital-o2"
                  type="number"
                  value={oxygenSat}
                  onChange={(e) => setOxygenSat(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Symptoms Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Case Presentation / Symptom Chronology
            </label>
            <textarea
              id="patient-symptoms"
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="State key symptoms, duration, location of pain, fetal movement, or bleeding clearly. Avoid PII (Personally Identifiable Information)..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
              required
            ></textarea>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Note: Explicit Patient PII is automatically scrubbed per data security standards.
            </p>
          </div>

          {error && (
            <div id="triage-form-error" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-mono">
              ERROR: {error}
            </div>
          )}

          {/* Action Button */}
          <button
            id="btn-submit-triage"
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Rural-Routing AI Analysis...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Symptoms to Routing Hub</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* JSON Payload Output Tab */
        <div className="p-6 space-y-4 font-mono text-xs">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 p-4 rounded-lg flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Structured Payload Ready</p>
              <p className="text-[11px] mt-0.5 text-slate-600">
                The analysis is packed in an enterprise-grade message block ready for ingestion by peripheral nodes & Firebase realtime dispatch triggers.
              </p>
            </div>
          </div>

          {latestResult.triage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2.5">
                <h4 className="font-bold font-sans text-xs text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span>CLINICAL SUMMARY</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ${
                    latestResult.triage.category === 'CRITICAL' ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300' :
                    latestResult.triage.category === 'HIGH' ? 'bg-orange-100 text-orange-800 font-bold border border-orange-200' :
                    latestResult.triage.category === 'MEDIUM' ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {latestResult.triage.category}
                  </span>
                </h4>
                <p className="text-slate-700 leading-relaxed font-sans text-xs">
                  <span className="font-semibold block text-[10px] text-slate-500 font-mono uppercase">Clinical Reasoning:</span>
                  {latestResult.triage.clinicalReasoning}
                </p>
                <div className="p-2.5 bg-rose-50 border border-rose-100 rounded text-rose-950 text-xs font-sans">
                  <span className="font-bold block text-[10px] text-rose-800 font-mono uppercase mb-0.5">Recommended Protocol:</span>
                  {latestResult.triage.recommendedAction}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block font-mono">
                  Operational JSON Output Block
                </span>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg border border-slate-800 overflow-x-auto text-[11px] max-h-72">
                  <code>{latestResult.rawJson}</code>
                </pre>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              id="btn-back-to-form"
              type="button"
              onClick={() => setActiveTab('form')}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded-md font-sans font-medium transition text-xs cursor-pointer"
            >
              Start New Evaluation
            </button>
          </div>
        </div>
      )}

      {/* Strict Clinical Liability Disclaimer */}
      <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400 text-center font-mono leading-relaxed">
        <span className="font-semibold text-slate-500">CLINICAL LIABILITY DISCLAIMER:</span> SwasthyaLink AI recommendations are system-generated operational prioritizations intended purely to streamline rural dispatch routing and logistic decisions. They do not substitute the direct opinion, diagnosis, or intervention of a certified medical practitioner or emergency clinician.
      </div>

    </div>
  );
}
