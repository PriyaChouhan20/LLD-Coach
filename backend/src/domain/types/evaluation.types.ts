import { Problem } from '../models/Problem.js';
import { Submission } from '../models/Submission.js';
import { EvaluationResult } from '../models/EvaluationResult.js';

export interface EvaluatorContext {
  problem: Problem;
  submission: Submission;
}

export interface EvaluationPayload {
  score: number;
  verdict: 'EXCELLENT' | 'GOOD_PROGRESS' | 'NEEDS_REVISION' | 'INCOMPLETE';
  categoryScores: {
    solidPrinciples: number;
    classDesignAndAbstraction: number;
    extensibilityAndPatterns: number;
    edgeCasesAndTradeoffs: number;
  };
  strengths: string[];
  issues: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
    category: 'SOLID' | 'CLASS_DESIGN' | 'COUPLING' | 'EDGE_CASE' | 'SYNTAX' | 'STRUCTURE';
    title: string;
    description: string;
    locationHint?: string;
  }>;
  suggestions: string[];
  recommendedNextStep: string;
}
