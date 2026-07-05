import React, { useState } from 'react';
import { Sparkles, Activity, Package, Bed, ArrowRight, CheckCircle2, X, Play, ShieldCheck, HeartPulse } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDemoData?: () => void;
}

export default function WelcomeModal({ isOpen, onClose, onLoadDemoData }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'AI-Powered Clinical Triage',
      subtitle: 'Instant diagnostic decision support for ASHA workers & PHC staff.',
      description: 'Enter patient symptoms and vitals in local terminology or English. SwasthyaLink’s Gemini AI engine immediately calculates emergency risk scores, red-flag warnings, and triage priorities.',
      icon: <Activity className="w-10 h-10 text-emerald-500 animate-pulse" />,
      badge: 'Module 1 of 11',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30'
    },
    {
      title: 'Predictive Inventory & Stock AI',
      subtitle: 'Never run out of essential medicines during seasonal outbreaks.',
      description: 'Our AI analyzes local disease trends and patient footfall to forecast medicine consumption 30 days in advance, automating reorders before critical stockouts happen.',
      icon: <Package className="w-10 h-10 text-blue-500" />,
      badge: 'Module 5 of 11',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30'
    },
    {
      title: 'Real-Time PHC Bed & Patient Queue',
      subtitle: 'Seamless rural health infrastructure coordination.',
      description: 'Track bed occupancy across regional primary health centers, manage inpatient admissions, and optimize ambulance patient redistribution during emergencies.',
      icon: <Bed className="w-10 h-10 text-purple-500" />,
      badge: 'Module 3 of 11',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30'
    }
  ];

  const handleFinish = () => {
    localStorage.setItem('swasthya_has_seen_welcome', 'true');
    onClose();
  };

  const handleDemo = () => {
    localStorage.setItem('swasthya_has_seen_welcome', 'true');
    if (onLoadDemoData) onLoadDemoData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden bg-slate-900 border shadow-2xl border-slate-800 rounded-2xl">
        
        {/* Header gradient banner */}
        <div className="relative px-6 py-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
          <button 
            onClick={handleFinish}
            className="absolute p-2 transition-colors rounded-full top-4 right-4 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-6 h-6 text-emerald-200 animate-bounce" />
            </div>
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/20 rounded-full">
              Welcome Onboarding
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome to SwasthyaLink AI 🌾🏥
          </h2>
          <p className="mt-1 text-sm text-emerald-100 max-w-lg">
            The next-generation autonomous AI agent designed to bridge rural health care gaps across India's PHCs and ASHA networks.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-400">
              {steps[step].badge}
            </span>
          </div>

          {/* Feature Card */}
          <div className={`p-6 transition-all duration-300 border rounded-2xl bg-gradient-to-br ${steps[step].color}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-900/80 border border-slate-700/50 rounded-xl shadow-inner shrink-0">
                {steps[step].icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white md:text-xl">
                  {steps[step].title}
                </h3>
                <p className="text-sm font-medium text-emerald-400 mt-0.5">
                  {steps[step].subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {steps[step].description}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips Box */}
          <div className="flex items-center gap-3 p-3 mt-6 border rounded-xl bg-slate-950/60 border-slate-800/80 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Pro Tip:</strong> All 11 operational modules are interconnected. Patient triage automatically updates bed occupancy and pharmacy inventory!
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse items-center justify-between gap-4 mt-8 sm:flex-row">
            <button
              onClick={handleFinish}
              className="w-full px-5 py-2.5 text-sm font-medium transition-colors rounded-xl text-slate-400 hover:text-white sm:w-auto hover:bg-slate-800/60"
            >
              Skip & Go to Dashboard
            </button>

            <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
              <button
                onClick={handleDemo}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl hover:from-teal-500 hover:to-blue-500 shadow-lg shadow-teal-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Explore Demo Mode</span>
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(prev => prev + 1)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                >
                  <span>Next Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
