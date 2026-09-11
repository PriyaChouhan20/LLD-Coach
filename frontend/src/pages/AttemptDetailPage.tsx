import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Attempt, Submission } from '../types';
import { fetchAttempt } from '../services/api';
import { ScoreGauge } from '../components/evaluation/ScoreGauge';
import { CategoryBreakdown } from '../components/evaluation/CategoryBreakdown';
import { IssueList } from '../components/evaluation/IssueList';
import { ArrowLeft, RotateCcw, Code2 } from 'lucide-react';

export const AttemptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [versionIdx, setVersionIdx] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    fetchAttempt(id)
      .then(data => {
        setAttempt(data);
        if (data.submissions && data.submissions.length > 0) {
          setVersionIdx(data.submissions.length - 1);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load attempt details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-900 rounded animate-pulse" />
        <div className="h-64 bg-slate-900/60 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4 max-w-md mx-auto">
        <p className="text-rose-300 text-sm">{error || 'Attempt not found.'}</p>
        <Link to="/history" className="inline-flex items-center gap-2 text-xs text-sky-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to History
        </Link>
      </div>
    );
  }

  const submission: Submission | undefined = attempt.submissions[versionIdx];
  const evaluation = submission?.evaluationResult;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{attempt.problemTitle}</h1>
            <p className="text-xs text-slate-400">
              Attempt ID: <span className="font-mono">{attempt.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {attempt.submissions.length > 1 && (
            <select
              value={versionIdx}
              onChange={e => setVersionIdx(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800 focus:outline-none"
            >
              {attempt.submissions.map((s, i) => (
                <option key={s.id} value={i}>
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
            <span>Practice Again</span>
          </Link>
        </div>
      </div>

      {/* Evaluation Results if available */}
      {evaluation ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-5 flex flex-col">
              <ScoreGauge
                score={evaluation.overallScore}
                verdict={evaluation.verdict}
                evaluatedBy={evaluation.evaluatedBy}
              />
            </div>
            <div className="md:col-span-7 flex flex-col justify-between">
              <CategoryBreakdown scores={evaluation.categoryScores} />
            </div>
          </div>

          <IssueList
            strengths={evaluation.strengths}
            issues={evaluation.issues}
            suggestions={evaluation.suggestions}
            recommendedNextStep={evaluation.recommendedNextStep}
          />
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
          No evaluation available for this draft yet.
        </div>
      )}

      {/* Code / Design Snapshot */}
      {submission && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            Candidate Design Content (Version #{submission.version})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-300">1. Design Explanation</h4>
              <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {submission.content.designExplanation}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-300">2. Classes & Responsibilities</h4>
              <pre className="text-xs text-slate-300 code-editor-area whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {submission.content.classDesign}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-300">3. Code / Pseudocode</h4>
              <pre className="text-xs text-slate-300 code-editor-area whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {submission.content.codeSnippet}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-300">4. Trade-offs & Assumptions</h4>
              <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {submission.content.tradeoffs}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
