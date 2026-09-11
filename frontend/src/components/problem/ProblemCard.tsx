import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Problem } from '../../types';

interface ProblemCardProps {
  problem: Problem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-slate-800/80 bg-slate-900/40 relative overflow-hidden group">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            100 Pts Rubric
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
          {problem.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {problem.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {problem.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
              <Tag className="w-2.5 h-2.5 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <Link
          to={`/problems/${problem.slug}`}
          className="text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
        >
          View Details
        </Link>
        <Link
          to={`/practice/${problem.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all"
        >
          <span>Practice Now</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
