import React, { useState, useEffect } from 'react';
import { fetchProblems } from '../services/api';
import { ProblemCard } from '../components/problem/ProblemCard';
import { Layers, Sparkles, ShieldCheck, Cpu, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  useEffect(() => {
    fetchProblems()
      .then(data => {
        setProblems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load problems');
        setLoading(false);
      });
  }, []);

  const filteredProblems = problems.filter(p => {
    if (filterDifficulty === 'ALL') return true;
    return p.difficulty === filterDifficulty;
  });

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Object-Oriented Design Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Master Low-Level Design with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Explainable AI Feedback</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Choose classic engineering interview problems, structure your classes & design patterns, and receive instant, category-wise explainable feedback evaluating SOLID principles, coupling, and concurrency edge cases.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/practice/parking-lot"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all"
            >
              <Code2 className="w-4 h-4" />
              <span>Start Parking Lot Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-colors"
            >
              <span>View Past Attempts</span>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Deterministic Checks</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Structural requirements, completeness & core domain entities.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">AI-Assisted Evaluation</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Deep review of SOLID, coupling, patterns & concurrency edge cases.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Explainable Rubrics</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Categorical scoring, strengths, flaws, and actionable next steps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Catalog Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core LLD Problem Catalog</h2>
            <p className="text-xs text-slate-400 mt-1">Select a design challenge to explore requirements, rubrics, and start practicing</p>
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterDifficulty === diff
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
