import React from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const ScoreGauge = ({ score, verdict, evaluatedBy }) => {
  const getVerdictDetails = (v) => {
    switch (v) {
      case 'EXCELLENT':
        return {
          label: 'Mastered / Excellent',
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          icon: Award,
        };
      case 'GOOD_PROGRESS':
        return {
          label: 'Solid Progress',
          textColor: 'text-sky-400',
          bgColor: 'bg-sky-500/10 border-sky-500/20',
          icon: CheckCircle2,
        };
      case 'NEEDS_REVISION':
        return {
          label: 'Needs Revision',
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          icon: AlertTriangle,
        };
      case 'INCOMPLETE':
      default:
        return {
          label: 'Incomplete Submission',
          textColor: 'text-rose-400',
          bgColor: 'bg-rose-500/10 border-rose-500/20',
          icon: XCircle,
        };
    }
  };

  const { label, textColor, bgColor, icon: VerdictIcon } = getVerdictDetails(verdict);

  const getEvaluatorBadge = (mode) => {
    switch (mode) {
      case 'HYBRID':
        return { text: 'Hybrid (AI + Deterministic)', icon: Sparkles, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'AI_ONLY':
        return { text: 'AI Semantic Evaluator', icon: Sparkles, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      case 'FALLBACK':
        return { text: 'Resilient Heuristic Fallback', icon: ShieldCheck, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'DETERMINISTIC_ONLY':
      default:
        return { text: 'Deterministic Structural Check', icon: ShieldCheck, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const evalBadge = getEvaluatorBadge(evaluatedBy);
  const EvalBadgeIcon = evalBadge.icon;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${evalBadge.color}`}>
        <EvalBadgeIcon className="w-3 h-3" />
        <span>{evalBadge.text}</span>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center my-4">
        {/* SVG Circle Progress */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className={score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-sky-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500'}
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * Math.min(score, 100)) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
          <span className="text-[11px] text-slate-400 font-medium -mt-1">/ 100 PTS</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${bgColor} ${textColor} mb-1`}>
        <VerdictIcon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">Based on standard LLD assessment rubrics</p>
    </div>
  );
};
