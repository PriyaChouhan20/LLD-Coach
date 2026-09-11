import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { IssueItem } from '../../types';

interface IssueListProps {
  strengths: string[];
  issues: IssueItem[];
  suggestions: string[];
  recommendedNextStep: string;
}

export const IssueList: React.FC<IssueListProps> = ({
  strengths,
  issues,
  suggestions,
  recommendedNextStep,
}) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'SUGGESTION':
      default:
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recommended Next Step Box */}
      {recommendedNextStep && (
        <div className="rounded-2xl p-5 bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-500/30 flex items-start gap-4 shadow-lg shadow-sky-500/5">
          <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-sky-200 uppercase tracking-wide flex items-center gap-2">
              Recommended Next Improvement
            </h4>
            <p className="text-sm text-slate-200 mt-1 font-medium leading-relaxed">
              {recommendedNextStep}
            </p>
          </div>
        </div>
      )}

      {/* Strengths Section */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Identified Strengths ({strengths.length})
        </h3>
        <ul className="space-y-2.5">
          {strengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Issues & Flaws Section */}
      {issues.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" />
            Areas for Refactoring & Critical Issues ({issues.length})
          </h3>
          <div className="space-y-3">
            {issues.map((iss, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-100">{iss.title}</span>
                  <div className="flex items-center gap-2">
                    {iss.locationHint && (
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                        {iss.locationHint}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider border ${getSeverityBadge(iss.severity)}`}>
                      {iss.severity}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{iss.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Suggestions */}
      {suggestions.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4" />
            Actionable Next Steps ({suggestions.length})
          </h3>
          <ul className="space-y-2.5">
            {suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
