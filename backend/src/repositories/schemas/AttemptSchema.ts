import mongoose, { Schema, Document } from 'mongoose';
import { Attempt } from '../../domain/models/Attempt.js';

export interface AttemptDocument extends Omit<Attempt, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const SubmissionContentSchema = new Schema({
  designExplanation: { type: String, default: '' },
  classDesign: { type: String, default: '' },
  codeSnippet: { type: String, default: '' },
  tradeoffs: { type: String, default: '' },
}, { _id: false });

const IssueItemSchema = new Schema({
  severity: { type: String, enum: ['CRITICAL', 'WARNING', 'SUGGESTION'], required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  locationHint: { type: String },
}, { _id: false });

const EvaluationResultSchema = new Schema({
  id: { type: String, required: true },
  submissionId: { type: String, required: true },
  overallScore: { type: Number, required: true },
  verdict: { type: String, required: true },
  categoryScores: {
    solidPrinciples: { type: Number, required: true },
    classDesignAndAbstraction: { type: Number, required: true },
    extensibilityAndPatterns: { type: Number, required: true },
    edgeCasesAndTradeoffs: { type: Number, required: true },
  },
  strengths: [{ type: String }],
  issues: [IssueItemSchema],
  suggestions: [{ type: String }],
  recommendedNextStep: { type: String },
  evaluatedBy: { type: String, required: true },
  deterministicFindings: { type: Schema.Types.Mixed },
  rawAiFeedback: { type: String },
  evaluatedAt: { type: Date, default: Date.now },
}, { _id: false });

const SubmissionSchema = new Schema({
  id: { type: String, required: true },
  attemptId: { type: String, required: true },
  problemId: { type: String, required: true },
  version: { type: Number, required: true, default: 1 },
  content: { type: SubmissionContentSchema, required: true },
  evaluationStatus: { type: String, enum: ['PENDING', 'EVALUATING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  evaluationResult: { type: EvaluationResultSchema },
  errorMessage: { type: String },
  submittedAt: { type: Date, default: Date.now },
}, { _id: false });

export const AttemptMongooseSchema = new Schema({
  _id: { type: String, required: true },
  problemId: { type: String, required: true, index: true },
  problemSlug: { type: String },
  problemTitle: { type: String },
  userId: { type: String, required: true, default: 'anonymous-learner', index: true },
  status: { type: String, enum: ['IN_PROGRESS', 'SUBMITTED', 'EVALUATED', 'ABANDONED'], default: 'IN_PROGRESS' },
  currentDraft: { type: SubmissionContentSchema },
  latestScore: { type: Number },
  latestVerdict: { type: String },
  submissions: [SubmissionSchema],
  startedAt: { type: Date, default: Date.now },
}, {
  _id: false,
  timestamps: true,
  toJSON: {
    transform: (_, ret: any) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

export const AttemptModel = mongoose.models.Attempt || mongoose.model<AttemptDocument>('Attempt', AttemptMongooseSchema);
