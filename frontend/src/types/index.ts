export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface EvaluationCriterion {
  category: 'SOLID_PRINCIPLES' | 'CLASS_DESIGN' | 'EXTENSIBILITY' | 'EDGE_CASES';
  name: string;
  weight: number;
  description: string;
  guidelines: string[];
}

export interface EvaluationRubric {
  totalPoints: number;
  criteria: EvaluationCriterion[];
  passingScore: number;
}

export interface StarterTemplate {
  designExplanation: string;
  classDesign: string;
  codeSnippet: string;
  tradeoffs: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: DifficultyLevel;
  summary: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  coreEntities: string[];
  sampleUseCases: string[];
  evaluationRubric: EvaluationRubric;
  starterTemplate: StarterTemplate;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionContent {
  designExplanation: string;
  classDesign: string;
  codeSnippet: string;
  tradeoffs: string;
}

export type EvaluationStatus = 'PENDING' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
export type EvaluatorMode = 'HYBRID' | 'DETERMINISTIC_ONLY' | 'AI_ONLY' | 'FALLBACK';
export type Verdict = 'EXCELLENT' | 'GOOD_PROGRESS' | 'NEEDS_REVISION' | 'INCOMPLETE';

export interface CategoryScores {
  solidPrinciples: number;
  classDesignAndAbstraction: number;
  extensibilityAndPatterns: number;
  edgeCasesAndTradeoffs: number;
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
  overallScore: number;
  verdict: Verdict;
  categoryScores: CategoryScores;
  strengths: string[];
  issues: IssueItem[];
  suggestions: string[];
  recommendedNextStep: string;
  evaluatedBy: EvaluatorMode;
  deterministicFindings?: DeterministicFindings;
  rawAiFeedback?: string;
  evaluatedAt: string;
}

export interface Submission {
  id: string;
  attemptId: string;
  problemId: string;
  version: number;
  content: SubmissionContent;
  evaluationStatus: EvaluationStatus;
  evaluationResult?: EvaluationResult;
  errorMessage?: string;
  submittedAt: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  problemSlug?: string;
  problemTitle?: string;
  userId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'ABANDONED';
  currentDraft?: SubmissionContent;
  latestScore?: number;
  latestVerdict?: string;
  submissions: Submission[];
  startedAt: string;
  updatedAt: string;
}
