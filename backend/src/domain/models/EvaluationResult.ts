export type EvaluatorMode = 'HYBRID' | 'DETERMINISTIC_ONLY' | 'AI_ONLY' | 'FALLBACK';

export type Verdict = 'EXCELLENT' | 'GOOD_PROGRESS' | 'NEEDS_REVISION' | 'INCOMPLETE';

export interface CategoryScores {
  solidPrinciples: number;          // 0 - 25 or 0 - 100
  classDesignAndAbstraction: number; // 0 - 25 or 0 - 100
  extensibilityAndPatterns: number;  // 0 - 25 or 0 - 100
  edgeCasesAndTradeoffs: number;     // 0 - 25 or 0 - 100
}

export interface IssueItem {
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  category: 'SOLID' | 'CLASS_DESIGN' | 'COUPLING' | 'EDGE_CASE' | 'SYNTAX' | 'STRUCTURE';
  title: string;
  description: string;
  locationHint?: string;
}

export interface DeterministicFindings {
  passedStructuralChecks: boolean;
  sectionWordCounts: Record<string, number>;
  identifiedEntities: string[];
  missingCoreEntities: string[];
  detectedPatterns: string[];
  warnings: string[];
}

export interface EvaluationResult {
  id: string;
  submissionId: string;
  overallScore: number;             // 0 - 100
  verdict: Verdict;
  categoryScores: CategoryScores;
  strengths: string[];
  issues: IssueItem[];
  suggestions: string[];
  recommendedNextStep: string;
  evaluatedBy: EvaluatorMode;
  deterministicFindings?: DeterministicFindings;
  rawAiFeedback?: string;
  evaluatedAt: Date;
}
