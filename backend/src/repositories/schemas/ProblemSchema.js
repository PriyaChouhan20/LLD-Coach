import mongoose, { Schema } from 'mongoose';

const EvaluationCriterionSchema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  description: { type: String, required: true },
  guidelines: [{ type: String }],
}, { _id: false });

const EvaluationRubricSchema = new Schema({
  totalPoints: { type: Number, required: true, default: 100 },
  criteria: [EvaluationCriterionSchema],
  passingScore: { type: Number, required: true, default: 60 },
}, { _id: false });

const StarterTemplateSchema = new Schema({
  designExplanation: { type: String, default: '' },
  classDesign: { type: String, default: '' },
  codeSnippet: { type: String, default: '' },
  tradeoffs: { type: String, default: '' },
}, { _id: false });

export const ProblemMongooseSchema = new Schema({
  _id: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  functionalRequirements: [{ type: String, required: true }],
  nonFunctionalRequirements: [{ type: String }],
  coreEntities: [{ type: String, required: true }],
  sampleUseCases: [{ type: String }],
  evaluationRubric: { type: EvaluationRubricSchema, required: true },
  starterTemplate: { type: StarterTemplateSchema, required: true },
  tags: [{ type: String }],
}, {
  _id: false,
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

export const ProblemModel = mongoose.models.Problem || mongoose.model('Problem', ProblemMongooseSchema);
