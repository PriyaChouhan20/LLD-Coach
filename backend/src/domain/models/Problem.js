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
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export const DifficultyLevels = Object.freeze({
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
});
