/**
 * @typedef {Object} EvaluatorContext
 * @property {import('../models/Problem.js').Problem} problem
 * @property {import('../models/Submission.js').Submission} submission
 * 
 * @typedef {Object} EvaluationPayload
 * @property {number} score
 * @property {'EXCELLENT' | 'GOOD_PROGRESS' | 'NEEDS_REVISION' | 'INCOMPLETE'} verdict
 * @property {Object} categoryScores
 * @property {number} categoryScores.solidPrinciples
 * @property {number} categoryScores.classDesignAndAbstraction
 * @property {number} categoryScores.extensibilityAndPatterns
 * @property {number} categoryScores.edgeCasesAndTradeoffs
 * @property {string[]} strengths
 * @property {Array<{
 *   severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION',
 *   category: 'SOLID' | 'CLASS_DESIGN' | 'COUPLING' | 'EDGE_CASE' | 'SYNTAX' | 'STRUCTURE',
 *   title: string,
 *   description: string,
 *   locationHint?: string
 * }>} issues
 * @property {string[]} suggestions
 * @property {string} recommendedNextStep
 */

export {};
