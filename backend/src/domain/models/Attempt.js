/**
 * @typedef {'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'ABANDONED'} AttemptStatus
 * 
 * @typedef {Object} Attempt
 * @property {string} id
 * @property {string} problemId
 * @property {string} [problemSlug]
 * @property {string} [problemTitle]
 * @property {string} userId
 * @property {AttemptStatus} status
 * @property {{ designExplanation: string, classDesign: string, codeSnippet: string, tradeoffs: string }} [currentDraft]
 * @property {number} [latestScore]
 * @property {string} [latestVerdict]
 * @property {import('./Submission.js').Submission[]} submissions
 * @property {Date} startedAt
 * @property {Date} updatedAt
 */

export const AttemptStatuses = Object.freeze({
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  EVALUATED: 'EVALUATED',
  ABANDONED: 'ABANDONED',
});
