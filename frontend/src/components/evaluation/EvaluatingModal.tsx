import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface EvaluatingModalProps {
  isOpen: boolean;
}

export const EvaluatingModal: React.FC<EvaluatingModalProps> = ({ isOpen }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: 'Deterministic Analysis', desc: 'Validating mandatory sections and core problem entities...', icon: ShieldCheck },
    { title: 'SOLID Architecture Review', desc: 'Evaluating Single Responsibility & Open/Closed compliance...', icon: Layers },
    { title: 'Design Pattern & Coupling Heuristics', desc: 'Checking interface segregation, cohesion, and scalability...', icon: Cpu },
    { title: 'Synthesizing Explainable Feedback', desc: 'Compiling category scores, issues, and targeted suggestions...', icon: Sparkles },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const current = steps[stepIndex];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-sky-500/30 p-6 shadow-2xl shadow-sky-500/20 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Orbit spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-indigo-500/20 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-md">
            <StepIcon className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Evaluating Your LLD Solution
        </h3>
        <p className="text-xs text-sky-400 font-semibold mb-3">
          {current.title}
        </p>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
          {current.desc}
        </p>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === stepIndex
                  ? 'w-6 bg-sky-400'
                  : idx < stepIndex
                  ? 'w-2 bg-sky-600'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
