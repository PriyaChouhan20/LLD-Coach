import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Attempt } from '../types';
import { fetchHistory } from '../services/api';
import {
  History,
  ArrowRight,
  Sparkles,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle2,
  Code2,
  BookOpen
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load attempt history');
        setLoading(false);
      });
  }, []);

  const getVerdictPill = (score?: number, verdict?: string) => {
    if (score === undefined || !verdict) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
          In Progress
        </span>
      );
    }
    if (score >= 80) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <Award className="w-3 h-3" />
          {score} Pts • Mastered
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {score} Pts • Solid
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {score} Pts • Needs Revision
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-sky-400" />
            Attempt History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your iterative Low-Level Design practice progress and past evaluations
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors self-start"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Browse Problems</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-28 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No attempts recorded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Choose an LLD problem from our catalog, draft your classes and trade-offs, and submit for instant feedback!
          </p>
          <Link
            to="/problems/parking-lot"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
          >
            <span>Start First Practice Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(att => {
            const hasSubmissions = att.submissions && att.submissions.length > 0;
            return (
              <div
                key={att.id}
                className="glass-card-hover rounded-2xl p-5 border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-white">
                      {att.problemTitle || 'LLD Practice Attempt'}
                    </h3>
                    {getVerdictPill(att.latestScore, att.latestVerdict)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(att.startedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>{att.submissions?.length || 0} Submissions</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasSubmissions ? (
                    <Link
                      to={`/results/${att.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>View Feedback</span>
                    </Link>
                  ) : null}

                  <Link
                    to={`/practice/${att.problemSlug || 'parking-lot'}${hasSubmissions ? '?new=true' : ''}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md shadow-sky-500/10 transition-all"
                  >
                    <span>{hasSubmissions ? 'Try Again' : 'Continue Draft'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
