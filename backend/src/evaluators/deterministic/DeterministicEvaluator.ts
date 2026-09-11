import { IEvaluator } from '../interfaces/IEvaluator.js';
import { Problem } from '../../domain/models/Problem.js';
import { Submission } from '../../domain/models/Submission.js';
import { EvaluationResult, IssueItem, DeterministicFindings } from '../../domain/models/EvaluationResult.js';

export class DeterministicEvaluator implements IEvaluator {
  public readonly name = 'DeterministicEvaluator';

  private readonly knownPatterns = [
    'Strategy', 'Factory', 'Abstract Factory', 'Singleton', 'Observer',
    'State', 'Command', 'Decorator', 'Adapter', 'Facade', 'Builder', 'Chain of Responsibility'
  ];

  public async evaluate(problem: Problem, submission: Submission): Promise<EvaluationResult> {
    const { designExplanation, classDesign, codeSnippet, tradeoffs } = submission.content;

    const issues: IssueItem[] = [];
    const strengths: string[] = [];
    const suggestions: string[] = [];

    // 1. Calculate word counts per section
    const wordCounts = {
      designExplanation: this.countWords(designExplanation),
      classDesign: this.countWords(classDesign),
      codeSnippet: this.countWords(codeSnippet),
      tradeoffs: this.countWords(tradeoffs),
    };

    const totalWords = Object.values(wordCounts).reduce((a, b) => a + b, 0);

    // 2. Section presence and minimal completeness validation
    if (wordCounts.designExplanation < 6) {
      issues.push({
        severity: 'CRITICAL',
        category: 'STRUCTURE',
        title: 'Design Explanation Too Brief',
        description: 'Your design explanation lacks sufficient detail regarding the architectural overview or design decisions.',
        locationHint: 'Section: Design Explanation',
      });
    } else {
      strengths.push('Provided an introductory design overview explaining the architecture.');
    }

    if (wordCounts.classDesign < 6) {
      issues.push({
        severity: 'CRITICAL',
        category: 'CLASS_DESIGN',
        title: 'Incomplete Class Specifications',
        description: 'Classes and responsibilities are not clearly enumerated with attributes and methods.',
        locationHint: 'Section: Classes & Responsibilities',
      });
    } else {
      strengths.push('Outlined structural classes with explicit methods or properties.');
    }

    if (wordCounts.codeSnippet < 8) {
      issues.push({
        severity: 'CRITICAL',
        category: 'STRUCTURE',
        title: 'Insufficient Code or Pseudocode',
        description: 'Your implementation does not have enough code/pseudocode to demonstrate logic flow and class interactions.',
        locationHint: 'Section: Code / Pseudocode',
      });
    }

    if (wordCounts.tradeoffs < 5) {
      issues.push({
        severity: 'WARNING',
        category: 'EDGE_CASE',
        title: 'Trade-offs & Assumptions Missing',
        description: 'Discussing concurrency, scalability constraints, and design trade-offs is crucial for LLD interviews.',
        locationHint: 'Section: Trade-offs & Assumptions',
      });
    } else {
      strengths.push('Addressed trade-offs and design constraints.');
    }

    // 3. Core Entity Detection
    const combinedContent = `${designExplanation} ${classDesign} ${codeSnippet} ${tradeoffs}`.toLowerCase();
    const identifiedEntities: string[] = [];
    const missingCoreEntities: string[] = [];

    for (const entity of problem.coreEntities) {
      const normalizedEntity = entity.toLowerCase().replace(/\s+/g, '');
      const regex = new RegExp(`\\b${entity.toLowerCase()}\\b|${normalizedEntity}`, 'i');
      if (regex.test(combinedContent)) {
        identifiedEntities.push(entity);
      } else {
        missingCoreEntities.push(entity);
      }
    }

    if (identifiedEntities.length > 0) {
      strengths.push(`Identified key domain entities: ${identifiedEntities.join(', ')}.`);
    }

    if (missingCoreEntities.length > 0) {
      issues.push({
        severity: 'WARNING',
        category: 'CLASS_DESIGN',
        title: 'Missing Key Problem Entities',
        description: `Consider introducing or detailing: ${missingCoreEntities.join(', ')} to fulfill full problem requirements.`,
        locationHint: 'Section: Classes & Responsibilities',
      });
      suggestions.push(`Add domain abstractions for ${missingCoreEntities.join(', ')}.`);
    }

    // 4. Pattern Detection
    const detectedPatterns: string[] = [];
    for (const pattern of this.knownPatterns) {
      if (new RegExp(`\\b${pattern}\\b`, 'i').test(combinedContent)) {
        detectedPatterns.push(pattern);
      }
    }

    if (detectedPatterns.length > 0) {
      strengths.push(`Applied recognized design pattern(s): ${detectedPatterns.join(', ')}.`);
    } else {
      suggestions.push('Consider if behavioral patterns (e.g., Strategy, State, Observer) would improve extensibility.');
    }

    // 5. Compute scores
    const entityCoverageRatio = problem.coreEntities.length > 0 
      ? identifiedEntities.length / problem.coreEntities.length 
      : 1;

    let solidScore = Math.min(25, Math.round(5 + (wordCounts.classDesign > 30 ? 10 : 5) + (detectedPatterns.length > 0 ? 10 : 5)));
    let classDesignScore = Math.min(25, Math.round(entityCoverageRatio * 20 + (wordCounts.classDesign > 25 ? 5 : 0)));
    let extensibilityScore = Math.min(25, Math.round((detectedPatterns.length > 0 ? 15 : 5) + (wordCounts.codeSnippet > 40 ? 10 : 5)));
    let edgeCasesScore = Math.min(25, Math.round((wordCounts.tradeoffs > 15 ? 15 : 5) + (issues.filter(i => i.severity === 'CRITICAL').length === 0 ? 10 : 0)));

    const passedStructuralChecks = issues.filter(i => i.severity === 'CRITICAL').length === 0 && totalWords >= 20;
    const overallScore = Math.max(10, Math.min(100, solidScore + classDesignScore + extensibilityScore + edgeCasesScore));

    let verdict: EvaluationResult['verdict'] = 'NEEDS_REVISION';
    if (overallScore >= 80) verdict = 'EXCELLENT';
    else if (overallScore >= 60) verdict = 'GOOD_PROGRESS';
    else if (!passedStructuralChecks) verdict = 'INCOMPLETE';

    const deterministicFindings: DeterministicFindings = {
      passedStructuralChecks,
      sectionWordCounts: wordCounts,
      identifiedEntities,
      missingCoreEntities,
      detectedPatterns,
      warnings: issues.filter(i => i.severity === 'WARNING').map(i => i.title),
    };

    return {
      id: `eval_det_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submissionId: submission.id,
      overallScore,
      verdict,
      categoryScores: {
        solidPrinciples: solidScore,
        classDesignAndAbstraction: classDesignScore,
        extensibilityAndPatterns: extensibilityScore,
        edgeCasesAndTradeoffs: edgeCasesScore,
      },
      strengths: strengths.length > 0 ? strengths : ['Submitted design structure adheres to the provided submission template.'],
      issues,
      suggestions: suggestions.length > 0 ? suggestions : ['Detail class methods, signatures, and concurrency edge cases.'],
      recommendedNextStep: missingCoreEntities.length > 0 
        ? `Refine class model to encompass missing core entities: ${missingCoreEntities.join(', ')}.`
        : 'Refine interfaces to adhere to Open-Closed Principle and specify concurrency safety.',
      evaluatedBy: 'DETERMINISTIC_ONLY',
      deterministicFindings,
      evaluatedAt: new Date(),
    };
  }

  private countWords(text: string | undefined): number {
    if (!text || typeof text !== 'string') return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }
}
