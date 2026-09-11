export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface EvaluationCriterion {
  category: 'SOLID_PRINCIPLES' | 'CLASS_DESIGN' | 'EXTENSIBILITY' | 'EDGE_CASES';
  name: string;
  weight: number; // 0 - 100 percentage
  description: string;
  guidelines: string[];
}

export interface EvaluationRubric {
  totalPoints: number;
  criteria: EvaluationCriterion[];
  passingScore: number;
}

export interface StarterTemplate {
  designExplanation: string;
  classDesign: string;
  codeSnippet: string;
  tradeoffs: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: DifficultyLevel;
  summary: string;
  description: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  coreEntities: string[];
  sampleUseCases: string[];
  evaluationRubric: EvaluationRubric;
  starterTemplate: StarterTemplate;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
