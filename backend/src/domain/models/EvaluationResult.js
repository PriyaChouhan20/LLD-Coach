/**
 * @typedef {'HYBRID' | 'DETERMINISTIC_ONLY' | 'AI_ONLY' | 'FALLBACK'} EvaluatorMode
 * @typedef {'EXCELLENT' | 'GOOD_PROGRESS' | 'NEEDS_REVISION' | 'INCOMPLETE'} Verdict
 * 
 * @typedef {Object} CategoryScores
 * @property {number} solidPrinciples
 * @property {number} classDesignAndAbstraction
 * @property {number} extensibilityAndPatterns
 * @property {number} edgeCasesAndTradeoffs
 * 
 * @typedef {Object} IssueItem
 * @property {'CRITICAL' | 'WARNING' | 'SUGGESTION'} severity
 * @property {'SOLID' | 'CLASS_DESIGN' | 'COUPLING' | 'EDGE_CASE' | 'SYNTAX' | 'STRUCTURE'} category
 * @property {string} title
 * @property {string} description
 * @property {string} [locationHint]
 * 
 * @typedef {Object} DeterministicFindings
 * @property {boolean} passedStructuralChecks
 * @property {Record<string, number>} sectionWordCounts
 * @property {string[]} identifiedEntities
 * @property {string[]} missingCoreEntities
 * @property {string[]} detectedPatterns
 * @property {string[]} warnings
 * 
 * @typedef {Object} EvaluationResult
 * @property {string} id
 * @property {string} submissionId
 * @property {number} overallScore
 * @property {Verdict} verdict
 * @property {CategoryScores} categoryScores
 * @property {string[]} strengths
 * @property {IssueItem[]} issues
 * @property {string[]} suggestions
 * @property {string} recommendedNextStep
 * @property {EvaluatorMode} evaluatedBy
 * @property {DeterministicFindings} [deterministicFindings]
 * @property {string} [rawAiFeedback]
 * @property {Date} evaluatedAt
 */

export const EvaluatorModes = Object.freeze({
  HYBRID: 'HYBRID',
  DETERMINISTIC_ONLY: 'DETERMINISTIC_ONLY',
  AI_ONLY: 'AI_ONLY',
  FALLBACK: 'FALLBACK',
});

export const Verdicts = Object.freeze({
  EXCELLENT: 'EXCELLENT',
  GOOD_PROGRESS: 'GOOD_PROGRESS',
  NEEDS_REVISION: 'NEEDS_REVISION',
  INCOMPLETE: 'INCOMPLETE',
});
