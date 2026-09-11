import { Submission } from './Submission.js';

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'ABANDONED';

export interface Attempt {
  id: string;
  problemId: string;
  problemSlug?: string;
  problemTitle?: string;
  userId: string;
  status: AttemptStatus;
  currentDraft?: {
    designExplanation: string;
    classDesign: string;
    codeSnippet: string;
    tradeoffs: string;
  };
  latestScore?: number;
  latestVerdict?: string;
  submissions: Submission[];
  startedAt: Date;
  updatedAt: Date;
}
