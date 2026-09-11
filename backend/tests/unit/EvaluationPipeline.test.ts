import { describe, it, expect } from 'vitest';
import { EvaluationPipeline } from '../../src/evaluators/EvaluationPipeline.js';
import { SEED_PROBLEMS } from '../../src/data/seed/problems.seed.js';
import { Submission } from '../../src/domain/models/Submission.js';

describe('EvaluationPipeline', () => {
  const vendingProblem = SEED_PROBLEMS[1];

  it('should fall back gracefully to deterministic result when submission is empty', async () => {
    const pipeline = new EvaluationPipeline({ aiProviderType: 'mock' });
    const emptySub: Submission = {
      id: 'sub_empty',
      attemptId: 'att_1',
      problemId: vendingProblem.id,
      version: 1,
      content: { designExplanation: '', classDesign: '', codeSnippet: '', tradeoffs: '' },
      evaluationStatus: 'PENDING',
      submittedAt: new Date(),
    };

    const result = await pipeline.evaluate(vendingProblem, emptySub);
    expect(result.verdict).toBe('INCOMPLETE');
    expect(result.evaluatedBy).toBe('DETERMINISTIC_ONLY');
  });

  it('should execute hybrid AI evaluation with mock provider when submission is valid', async () => {
    const pipeline = new EvaluationPipeline({ aiProviderType: 'mock' });
    const validSub: Submission = {
      id: 'sub_valid',
      attemptId: 'att_1',
      problemId: vendingProblem.id,
      version: 1,
      content: {
        designExplanation: 'Design uses the State Pattern to represent discrete stages: IdleState, HasMoneyState, DispensingState, SoldOutState.',
        classDesign: 'VendingMachine contains Inventory, Coin slot, and delegates actions to current State object.',
        codeSnippet: `public interface State {
  void insertCoin(VendingMachine m, Coin c);
  void selectItem(VendingMachine m, String code);
  void dispense(VendingMachine m);
}`,
        tradeoffs: 'Eliminates switch statements using State Pattern. Edge case: refund when coin mechanism jams.',
      },
      evaluationStatus: 'PENDING',
      submittedAt: new Date(),
    };

    const result = await pipeline.evaluate(vendingProblem, validSub);
    expect(result.evaluatedBy).toBe('HYBRID');
    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.categoryScores.solidPrinciples).toBeGreaterThan(0);
  });

  it('should safely fall back to FallbackEvaluator when AI evaluation fails or times out', async () => {
    const pipeline = new EvaluationPipeline({ aiProviderType: 'mock' });
    // Simulate AI failure/rejection
    (pipeline as any).aiEvaluator = {
      evaluate: async () => {
        throw new Error('LLM Service Unavailable / Request Timeout (Simulated)');
      },
    };

    const validSub: Submission = {
      id: 'sub_fallback_test',
      attemptId: 'att_fallback',
      problemId: vendingProblem.id,
      version: 1,
      content: {
        designExplanation: 'Design uses the State Pattern to represent discrete stages.',
        classDesign: 'VendingMachine contains Inventory, Coin slot, and delegates actions to current State object.',
        codeSnippet: `public interface State {
  void insertCoin(VendingMachine m, Coin c);
  void selectItem(VendingMachine m, String code);
  void dispense(VendingMachine m);
}`,
        tradeoffs: 'Eliminates switch statements using State Pattern. Edge case: refund when coin mechanism jams.',
      },
      evaluationStatus: 'PENDING',
      submittedAt: new Date(),
    };

    const result = await pipeline.evaluate(vendingProblem, validSub);
    expect(result).toBeDefined();
    expect(result.evaluatedBy).toBe('FALLBACK');
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.verdict).toBeDefined();
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.categoryScores).toHaveProperty('solidPrinciples');
  });
});

