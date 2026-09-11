import { Problem } from '../../domain/models/Problem.js';
import { Submission } from '../../domain/models/Submission.js';
import { EvaluationResult } from '../../domain/models/EvaluationResult.js';

export interface IEvaluator {
  readonly name: string;
  evaluate(problem: Problem, submission: Submission): Promise<EvaluationResult>;
}
