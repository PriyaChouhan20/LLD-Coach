import { EvaluationPipeline } from '../evaluators/EvaluationPipeline.js';

export class EvaluationService {
  constructor(options) {
    this.pipeline = new EvaluationPipeline(options);
  }

  async evaluateSubmission(problem, submission) {
    return this.pipeline.evaluate(problem, submission);
  }
}
