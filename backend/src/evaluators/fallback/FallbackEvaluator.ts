import { IEvaluator } from '../interfaces/IEvaluator.js';
import { Problem } from '../../domain/models/Problem.js';
import { Submission } from '../../domain/models/Submission.js';
import { EvaluationResult, IssueItem } from '../../domain/models/EvaluationResult.js';
import { DeterministicEvaluator } from '../deterministic/DeterministicEvaluator.js';

export class FallbackEvaluator implements IEvaluator {
  public readonly name = 'FallbackEvaluator';
  private deterministicEvaluator: DeterministicEvaluator;

  constructor() {
    this.deterministicEvaluator = new DeterministicEvaluator();
  }

  public async evaluate(problem: Problem, submission: Submission): Promise<EvaluationResult> {
    const detResult = await this.deterministicEvaluator.evaluate(problem, submission);
    const content = submission.content;
    const combined = `${content.designExplanation} ${content.classDesign} ${content.codeSnippet} ${content.tradeoffs}`.toLowerCase();

    const issues: IssueItem[] = [...detResult.issues];
    const strengths: string[] = [...detResult.strengths];
    const suggestions: string[] = [...detResult.suggestions];

    // Heuristics for SOLID Principles
    const mentionsInterface = /interface\s+|abstract\s+class|implements\s+|abstract\s+/i.test(content.codeSnippet + content.classDesign);
    const mentionsFactoryOrStrategy = /factory|strategy|state|observer|repository/i.test(combined);
    const mentionsDependencyInjection = /inject|constructor\s*\(.*(service|strategy|repository|manager)/i.test(content.codeSnippet);

    let solidScore = detResult.categoryScores.solidPrinciples;
    if (mentionsInterface) {
      solidScore = Math.min(25, solidScore + 5);
      strengths.push('Effective use of interface and abstract abstractions to support Open/Closed Principle.');
    } else {
      issues.push({
        severity: 'SUGGESTION',
        category: 'SOLID',
        title: 'Interface-Based Abstraction',
        description: 'Consider introducing interfaces or abstract base classes to decouple callers from concrete implementations.',
        locationHint: 'Section: Classes & Responsibilities',
      });
      suggestions.push('Define explicit contracts/interfaces (e.g. IStrategy, IRepository) for external behaviors.');
    }

    if (mentionsDependencyInjection) {
      strengths.push('Employed dependency injection in constructor signatures to enforce Inversion of Control.');
    }

    // Heuristics for Concurrency & Edge Cases
    const mentionsConcurrency = /thread|mutex|lock|atomic|race condition|concurrent|synchronized/i.test(combined);
    let edgeCasesScore = detResult.categoryScores.edgeCasesAndTradeoffs;
    if (mentionsConcurrency) {
      edgeCasesScore = Math.min(25, edgeCasesScore + 6);
      strengths.push('Addressed thread-safety and concurrency controls in the design trade-offs.');
    } else {
      issues.push({
        severity: 'WARNING',
        category: 'EDGE_CASE',
        title: 'Concurrency Handling Unspecified',
        description: 'Multi-user systems encounter race conditions during concurrent write operations.',
        locationHint: 'Section: Trade-offs & Assumptions',
      });
      suggestions.push('Specify synchronization or locking mechanisms (e.g. read/write locks, optimistic locking).');
    }

    const classDesignScore = detResult.categoryScores.classDesignAndAbstraction;
    const extensibilityScore = Math.min(25, detResult.categoryScores.extensibilityAndPatterns + (mentionsFactoryOrStrategy ? 4 : 0));

    const overallScore = Math.min(100, solidScore + classDesignScore + extensibilityScore + edgeCasesScore);
    const verdict = overallScore >= 80 ? 'EXCELLENT' : overallScore >= 60 ? 'GOOD_PROGRESS' : 'NEEDS_REVISION';

    return {
      id: `eval_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submissionId: submission.id,
      overallScore,
      verdict,
      categoryScores: {
        solidPrinciples: solidScore,
        classDesignAndAbstraction: classDesignScore,
        extensibilityAndPatterns: extensibilityScore,
        edgeCasesAndTradeoffs: edgeCasesScore,
      },
      strengths: Array.from(new Set(strengths)),
      issues,
      suggestions: Array.from(new Set(suggestions)),
      recommendedNextStep: detResult.recommendedNextStep || 'Refine interface boundaries and document edge case handling.',
      evaluatedBy: 'FALLBACK',
      deterministicFindings: detResult.deterministicFindings,
      evaluatedAt: new Date(),
    };
  }
}
