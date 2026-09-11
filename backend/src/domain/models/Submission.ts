import { EvaluationResult } from './EvaluationResult.js';

export interface SubmissionContent {
  designExplanation: string;
  classDesign: string;
  codeSnippet: string;
  tradeoffs: string;
}

export type EvaluationStatus = 'PENDING' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface Submission {
  id: string;
  attemptId: string;
  problemId: string;
  version: number;
  content: SubmissionContent;
  evaluationStatus: EvaluationStatus;
  evaluationResult?: EvaluationResult;
  errorMessage?: string;
  submittedAt: Date;
}
