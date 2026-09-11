import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProblemBySlug } from '../services/api';
import { Problem } from '../types';
import {
  ArrowLeft,
  Code2,
  Layers,
  Sparkles,
  Shield,
  ArrowRight,
  ListChecks,
  Cpu,
  BookOpen
} from 'lucide-react';

export const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchProblemBySlug(slug)
      .then(data => {
        setProblem(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load problem');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-900 rounded-lg animate-pulse" />
        <div className="h-64 bg-slate-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4">
        <p className="text-rose-300 text-sm">{error || 'Problem not found.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-sky-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Problems</span>
        </Link>

        <Link
          to={`/practice/${problem.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Code2 className="w-4 h-4" />
          <span>Start Practice</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {problem.difficulty}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            100 Points Rubric
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          {problem.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {problem.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {problem.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Requirements & Core Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Functional Requirements (2 cols) */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-sky-400" />
            Functional Requirements
          </h2>
          <ul className="space-y-3">
            {problem.functionalRequirements?.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Domain Entities (1 col) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Expected Core Entities
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your class design should model or abstract the following domain components:
          </p>
          <div className="flex flex-wrap gap-2">
            {problem.coreEntities?.map((entity, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs font-semibold"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Non-Functional Requirements & Sample Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Non-Functional Requirements & Design Goals
          </h2>
          <ul className="space-y-2.5">
            {problem.nonFunctionalRequirements?.map((nfr, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{nfr}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Sample Scenarios & Interactions
          </h2>
          <ul className="space-y-2.5">
            {problem.sampleUseCases?.map((useCase, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evaluation Rubric Details */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              Evaluation Rubric & Grading Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your submission is graded against 4 core criteria totaling 100 points (Passing score: {problem.evaluationRubric?.passingScore} pts).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problem.evaluationRubric?.criteria?.map((crit, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">{crit.name}</span>
                <span className="text-xs font-bold text-sky-400 font-mono">{crit.weight}%</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{crit.description}</p>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Key Focus:</p>
                <ul className="space-y-1">
                  {crit.guidelines?.map((g, gi) => (
                    <li key={gi} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-slate-900 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Ready to design {problem.title}?</h3>
          <p className="text-xs text-slate-400 mt-1">Practice structuring classes, pseudocode, and concurrency trade-offs.</p>
        </div>
        <Link
          to={`/practice/${problem.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all shrink-0"
        >
          <Code2 className="w-4 h-4" />
          <span>Launch Practice Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
