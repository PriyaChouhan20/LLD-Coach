import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Problem, Attempt, SubmissionContent } from '../types';
import { fetchProblemBySlug, startOrGetAttempt, saveDraft, submitAttempt } from '../services/api';
import { EvaluatingModal } from '../components/evaluation/EvaluatingModal';
import {
  ArrowLeft,
  Save,
  Send,
  RotateCcw,
  Layers,
  Code2,
  AlertCircle,
  CheckCircle2,
  Info,
  ListChecks,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const forceNew = searchParams.get('new') === 'true';
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active section tab in editor
  const [activeTab, setActiveTab] = useState<'explanation' | 'classes' | 'code' | 'tradeoffs'>('explanation');
  const [activeReferenceTab, setActiveReferenceTab] = useState<'requirements' | 'entities' | 'rubric'>('requirements');

  // Editor content state
  const [content, setContent] = useState<SubmissionContent>({
    designExplanation: '',
    classDesign: '',
    codeSnippet: '',
    tradeoffs: '',
  });

  const [savingDraft, setSavingDraft] = useState<boolean>(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    Promise.all([fetchProblemBySlug(slug), startOrGetAttempt(slug, 'anonymous-learner', forceNew)])
      .then(([probData, attData]) => {
        setProblem(probData);
        setAttempt(attData);

        // Populate content from draft or starter template
        if (attData.currentDraft) {
          setContent({
            designExplanation: attData.currentDraft.designExplanation || probData.starterTemplate.designExplanation,
            classDesign: attData.currentDraft.classDesign || probData.starterTemplate.classDesign,
            codeSnippet: attData.currentDraft.codeSnippet || probData.starterTemplate.codeSnippet,
            tradeoffs: attData.currentDraft.tradeoffs || probData.starterTemplate.tradeoffs,
          });
        } else {
          setContent({ ...probData.starterTemplate });
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to initialize practice workspace');
        setLoading(false);
      });
  }, [slug, forceNew]);

  const handleSaveDraft = async () => {
    if (!attempt) return;
    setSavingDraft(true);
    setDraftSavedMessage(null);
    try {
      await saveDraft(attempt.id, content);
      setDraftSavedMessage('Draft saved successfully');
      setTimeout(() => setDraftSavedMessage(null), 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save draft');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleResetTemplate = () => {
    if (!problem) return;
    if (window.confirm('Reset all sections back to the original starter template?')) {
      setContent({ ...problem.starterTemplate });
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    setSubmitError(null);

    // Basic client sanity check
    if (!content.designExplanation.trim() || !content.classDesign.trim() || !content.codeSnippet.trim() || !content.tradeoffs.trim()) {
      setSubmitError('Please provide content in all 4 design sections before submitting.');
      return;
    }

    setIsEvaluating(true);

    try {
      await submitAttempt(attempt.id, content);
      // Brief pause to showcase the smooth evaluation animation
      setTimeout(() => {
        setIsEvaluating(false);
        navigate(`/results/${attempt.id}`);
      }, 1000);
    } catch (err: any) {
      setIsEvaluating(false);
      setSubmitError(err.message || 'Evaluation request failed. Please try again.');
    }
  };

  const countWords = (str: string) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-slate-900 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px] bg-slate-900/60 rounded-2xl animate-pulse" />
          <div className="h-[600px] bg-slate-900/60 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !problem || !attempt) {
    return (
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4 max-w-md mx-auto">
        <p className="text-rose-300 text-sm">{error || 'Unable to open practice session.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-sky-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <EvaluatingModal isOpen={isEvaluating} />

      {/* Top Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to={`/problems/${problem.slug}`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Back to Problem Details"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">{problem.title}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {problem.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400">Current Attempt • Structured OOD Workspace</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {draftSavedMessage && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {draftSavedMessage}
            </span>
          )}

          <button
            type="button"
            onClick={handleResetTemplate}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
            title="Reset to Starter Template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isEvaluating}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Requirements & Reference Drawer (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[740px]">
          {/* Reference Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1">
            <button
              onClick={() => setActiveReferenceTab('requirements')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeReferenceTab === 'requirements'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>Requirements</span>
            </button>

            <button
              onClick={() => setActiveReferenceTab('entities')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeReferenceTab === 'entities'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Core Entities</span>
            </button>

            <button
              onClick={() => setActiveReferenceTab('rubric')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeReferenceTab === 'rubric'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Rubric (100)</span>
            </button>
          </div>

          {/* Reference Content Area (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed">
            {activeReferenceTab === 'requirements' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2 text-sky-400">
                    Functional Requirements
                  </h4>
                  <ul className="space-y-2.5 text-slate-300">
                    {problem.functionalRequirements?.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2 text-emerald-400">
                    Non-Functional & Design Goals
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    {problem.nonFunctionalRequirements?.map((nfr, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{nfr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeReferenceTab === 'entities' && (
              <div className="space-y-4">
                <p className="text-slate-400">
                  Make sure your class design encompasses or models these required entities:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {problem.coreEntities?.map((entity, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="font-mono font-semibold text-slate-200">{entity}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Required Domain Entity</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeReferenceTab === 'rubric' && (
              <div className="space-y-4">
                <p className="text-slate-400">
                  Your design will be evaluated on a 100-point scale across 4 categories:
                </p>
                <div className="space-y-3">
                  {problem.evaluationRubric?.criteria?.map((crit, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{crit.name}</span>
                        <span className="font-mono font-bold text-sky-400">{crit.weight}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{crit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: 4-part Structured Practice Editor (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[740px]">
          {/* Editor Tabs Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('explanation')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'explanation'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>1. Explanation</span>
              <span className="text-[10px] text-slate-500 font-mono">({countWords(content.designExplanation)}w)</span>
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'classes'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Classes</span>
              <span className="text-[10px] text-slate-500 font-mono">({countWords(content.classDesign)}w)</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'code'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>3. Code</span>
              <span className="text-[10px] text-slate-500 font-mono">({countWords(content.codeSnippet)}w)</span>
            </button>

            <button
              onClick={() => setActiveTab('tradeoffs')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'tradeoffs'
                  ? 'bg-slate-800 text-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>4. Trade-offs</span>
              <span className="text-[10px] text-slate-500 font-mono">({countWords(content.tradeoffs)}w)</span>
            </button>
          </div>

          {/* Tab Subtitle / Guidance */}
          <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {activeTab === 'explanation' && '💡 Describe your high-level architecture, design patterns used, and overall system flow.'}
              {activeTab === 'classes' && '💡 List domain classes, interfaces, attributes, methods, and relationship cardinalities.'}
              {activeTab === 'code' && '💡 Write core class implementations, state transitions, and design pattern interfaces (Java/TS/C++/Python/Pseudocode).'}
              {activeTab === 'tradeoffs' && '💡 Discuss concurrency handling, thread safety, edge cases, scalability limits, and assumptions.'}
            </span>
          </div>

          {/* Editor Textarea */}
          <div className="flex-1 p-4 bg-slate-950/60 relative flex flex-col">
            {activeTab === 'explanation' && (
              <textarea
                value={content.designExplanation}
                onChange={e => setContent({ ...content, designExplanation: e.target.value })}
                placeholder="Explain your high-level architecture and design patterns..."
                className="w-full h-full bg-transparent text-slate-100 text-xs sm:text-sm font-sans focus:outline-none resize-none leading-relaxed p-2"
                spellCheck={false}
              />
            )}

            {activeTab === 'classes' && (
              <textarea
                value={content.classDesign}
                onChange={e => setContent({ ...content, classDesign: e.target.value })}
                placeholder="Detail classes, attributes, methods, and design interfaces..."
                className="w-full h-full bg-transparent text-slate-100 text-xs sm:text-sm code-editor-area focus:outline-none resize-none leading-relaxed p-2"
                spellCheck={false}
              />
            )}

            {activeTab === 'code' && (
              <textarea
                value={content.codeSnippet}
                onChange={e => setContent({ ...content, codeSnippet: e.target.value })}
                placeholder="Write core classes, method signatures, and pattern code..."
                className="w-full h-full bg-transparent text-slate-100 text-xs sm:text-sm code-editor-area focus:outline-none resize-none leading-relaxed p-2"
                spellCheck={false}
              />
            )}

            {activeTab === 'tradeoffs' && (
              <textarea
                value={content.tradeoffs}
                onChange={e => setContent({ ...content, tradeoffs: e.target.value })}
                placeholder="Detail concurrency trade-offs, race conditions, and edge cases..."
                className="w-full h-full bg-transparent text-slate-100 text-xs sm:text-sm font-sans focus:outline-none resize-none leading-relaxed p-2"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
