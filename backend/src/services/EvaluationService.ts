import { EvaluationPipeline, EvaluationPipelineOptions } from '../evaluators/EvaluationPipeline.js';
import { Problem } from '../domain/models/Problem.js';
import { Submission } from '../domain/models/Submission.js';
import { EvaluationResult } from '../domain/models/EvaluationResult.js';

export class EvaluationService {
  private pipeline: EvaluationPipeline;

  constructor(options?: EvaluationPipelineOptions) {
    this.pipeline = new EvaluationPipeline(options);
  }

  public async evaluateSubmission(problem: Problem, submission: Submission): Promise<EvaluationResult> {
    return this.pipeline.evaluate(problem, submission);
  }
}
