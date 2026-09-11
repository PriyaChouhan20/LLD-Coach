/**
 * @typedef {'EASY' | 'MEDIUM' | 'HARD'} DifficultyLevel
 * 
 * @typedef {Object} EvaluationCriterion
 * @property {'SOLID_PRINCIPLES' | 'CLASS_DESIGN' | 'EXTENSIBILITY' | 'EDGE_CASES'} category
 * @property {string} name
 * @property {number} weight
 * @property {string} description
 * @property {string[]} guidelines
 * 
 * @typedef {Object} EvaluationRubric
 * @property {number} totalPoints
 * @property {EvaluationCriterion[]} criteria
 * @property {number} passingScore
 * 
 * @typedef {Object} StarterTemplate
 * @property {string} designExplanation
 * @property {string} classDesign
 * @property {string} codeSnippet
 * @property {string} tradeoffs
 * 
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {DifficultyLevel} difficulty
 * @property {string} summary
 * @property {string} description
 * @property {string[]} functionalRequirements
 * @property {string[]} nonFunctionalRequirements
 * @property {string[]} coreEntities
 * @property {string[]} sampleUseCases
 * @property {EvaluationRubric} evaluationRubric
 * @property {StarterTemplate} starterTemplate
 * @property {string[]} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 * 
 * @typedef {Object} SubmissionContent
 * @property {string} designExplanation
 * @property {string} classDesign
 * @property {string} codeSnippet
 * @property {string} tradeoffs
 * 
 * @typedef {'PENDING' | 'EVALUATING' | 'COMPLETED' | 'FAILED'} EvaluationStatus
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
 * @property {string} evaluatedAt
 * 
 * @typedef {Object} Submission
 * @property {string} id
 * @property {string} attemptId
 * @property {string} problemId
 * @property {number} version
 * @property {SubmissionContent} content
 * @property {EvaluationStatus} evaluationStatus
 * @property {EvaluationResult} [evaluationResult]
 * @property {string} [errorMessage]
 * @property {string} submittedAt
 * 
 * @typedef {Object} Attempt
 * @property {string} id
 * @property {string} problemId
 * @property {string} [problemSlug]
 * @property {string} [problemTitle]
 * @property {string} userId
 * @property {'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'ABANDONED'} status
 * @property {SubmissionContent} [currentDraft]
 * @property {number} [latestScore]
 * @property {string} [latestVerdict]
 * @property {Submission[]} submissions
 * @property {string} startedAt
 * @property {string} updatedAt
 */

export const DifficultyLevels = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};
