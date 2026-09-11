import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Attempt, Submission, EvaluationResult } from '../types';
import { fetchAttempt } from '../services/api';
import { ScoreGauge } from '../components/evaluation/ScoreGauge';
import { CategoryBreakdown } from '../components/evaluation/CategoryBreakdown';
import { IssueList } from '../components/evaluation/IssueList';
import {
  ArrowLeft,
  RotateCcw,
  Code2,
  Calendar
} from 'lucide-react';

export const ResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState<number>(0);

  useEffect(() => {
    if (!attemptId) return;
    fetchAttempt(attemptId)
      .then(data => {
        setAttempt(data);
        if (data.submissions && data.submissions.length > 0) {
          // Select latest submission
          setSelectedSubmissionIndex(data.submissions.length - 1);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load evaluation result');
        setLoading(false);
      });
  }, [attemptId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-900 rounded animate-pulse" />
        <div className="h-72 bg-slate-900/60 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4 max-w-md mx-auto">
        <p className="text-rose-300 text-sm">{error || 'Evaluation result not found.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-sky-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Problems
        </Link>
      </div>
    );
  }

  const currentSubmission: Submission | undefined = attempt.submissions[selectedSubmissionIndex];
  const evaluation: EvaluationResult | undefined = currentSubmission?.evaluationResult;

  if (!currentSubmission || !evaluation) {
    return (
      <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-4 max-w-md mx-auto">
        <p className="text-amber-300 text-sm">No evaluated submissions found for this attempt yet.</p>
        <Link
          to={`/practice/${attempt.problemSlug || 'parking-lot'}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
        >
          Submit Solution
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Navigation & Version Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to History"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {attempt.problemTitle || 'LLD Evaluation Result'}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date(currentSubmission.submittedAt).toLocaleString()}
              </span>
              <span>•</span>
              <span>Submission Version #{currentSubmission.version}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {attempt.submissions.length > 1 && (
            <select
              value={selectedSubmissionIndex}
              onChange={e => setSelectedSubmissionIndex(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800 focus:outline-none"
            >
              {attempt.submissions.map((s, idx) => (
                <option key={s.id} value={idx}>
                  Version #{s.version} ({s.evaluationResult?.overallScore || 0} pts)
                </option>
              ))}
            </select>
          )}

          <Link
            to={`/practice/${attempt.problemSlug || 'parking-lot'}?new=true`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again & Refine</span>
          </Link>
        </div>
      </div>

      {/* Top Score Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Score Gauge (5 cols) */}
        <div className="md:col-span-5 flex flex-col">
          <ScoreGauge
            score={evaluation.overallScore}
            verdict={evaluation.verdict}
            evaluatedBy={evaluation.evaluatedBy}
          />
        </div>

        {/* Category Breakdown (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <CategoryBreakdown scores={evaluation.categoryScores} />
        </div>
      </div>

      {/* Deterministic Insights Card (if present) */}
      {evaluation.deterministicFindings && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Domain Entity Detection:</span>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.deterministicFindings.identifiedEntities?.map((ent, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
                  ✓ {ent}
                </span>
              ))}
            </div>
          </div>
          {evaluation.deterministicFindings.detectedPatterns?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Detected Patterns:</span>
              <span className="font-semibold text-sky-400">
                {evaluation.deterministicFindings.detectedPatterns.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Deep Explainable Feedback (Strengths, Issues, Suggestions, Next Step) */}
      <IssueList
        strengths={evaluation.strengths}
        issues={evaluation.issues}
        suggestions={evaluation.suggestions}
        recommendedNextStep={evaluation.recommendedNextStep}
      />

      {/* Submitted Solution Snapshot (Accordion / Preview) */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-400" />
          Submitted Design Snapshot (Version #{currentSubmission.version})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-sky-300">1. Design Explanation</h4>
            <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {currentSubmission.content.designExplanation}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-sky-300">2. Classes & Responsibilities</h4>
            <pre className="text-xs text-slate-300 code-editor-area whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {currentSubmission.content.classDesign}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-sky-300">3. Code / Pseudocode</h4>
            <pre className="text-xs text-slate-300 code-editor-area whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {currentSubmission.content.codeSnippet}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-sky-300">4. Trade-offs & Assumptions</h4>
            <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {currentSubmission.content.tradeoffs}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
