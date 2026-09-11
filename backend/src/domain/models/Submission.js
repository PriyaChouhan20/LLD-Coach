/**
 * @typedef {Object} SubmissionContent
 * @property {string} designExplanation
 * @property {string} classDesign
 * @property {string} codeSnippet
 * @property {string} tradeoffs
 * 
 * @typedef {'PENDING' | 'EVALUATING' | 'COMPLETED' | 'FAILED'} EvaluationStatus
 * 
 * @typedef {Object} Submission
 * @property {string} id
 * @property {string} attemptId
 * @property {string} problemId
 * @property {number} version
 * @property {SubmissionContent} content
 * @property {EvaluationStatus} evaluationStatus
 * @property {import('./EvaluationResult.js').EvaluationResult} [evaluationResult]
 * @property {string} [errorMessage]
 * @property {Date} submittedAt
 */

export const EvaluationStatuses = Object.freeze({
  PENDING: 'PENDING',
  EVALUATING: 'EVALUATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});
