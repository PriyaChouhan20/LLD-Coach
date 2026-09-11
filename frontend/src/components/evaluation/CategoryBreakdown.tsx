import React from 'react';
import { CategoryScores } from '../../types';
import { Layers, ShieldCheck, Cpu, AlertCircle } from 'lucide-react';

interface CategoryBreakdownProps {
  scores: CategoryScores;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ scores }) => {
  const categories = [
    {
      id: 'solid',
      name: 'SOLID Principles Adherence',
      score: scores.solidPrinciples,
      max: 25,
      description: 'Single Responsibility, Open/Closed extensions, and interface segregation.',
      icon: ShieldCheck,
      color: 'bg-emerald-500',
    },
    {
      id: 'classes',
      name: 'Class Design & Abstraction',
      score: scores.classDesignAndAbstraction,
      max: 25,
      description: 'Entity completeness, inheritance/composition, and clear responsibilities.',
      icon: Layers,
      color: 'bg-sky-500',
    },
    {
      id: 'patterns',
      name: 'Extensibility & Patterns',
      score: scores.extensibilityAndPatterns,
      max: 25,
      description: 'Strategy, Factory, State, or Observer design patterns without over-engineering.',
      icon: Cpu,
      color: 'bg-indigo-500',
    },
    {
      id: 'edge_cases',
      name: 'Edge Cases & Trade-offs',
      score: scores.edgeCasesAndTradeoffs,
      max: 25,
      description: 'Concurrency safety, capacity limits, validation, and architectural trade-offs.',
      icon: AlertCircle,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Layers className="w-4 h-4 text-sky-400" />
        Category-wise Evaluation Breakdown
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          const percentage = Math.min(100, Math.round((cat.score / cat.max) * 100));
          return (
            <div key={cat.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-200">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    {cat.score} <span className="text-slate-500 font-normal">/ {cat.max}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{cat.description}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
