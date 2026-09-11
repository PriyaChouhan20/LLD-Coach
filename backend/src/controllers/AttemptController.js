import { z } from 'zod';

export const startAttemptSchema = z.object({
  problemSlug: z.string().min(1),
  userId: z.string().optional().default('anonymous-learner'),
  forceNew: z.boolean().optional(),
});

export const saveDraftSchema = z.object({
  designExplanation: z.string().optional(),
  classDesign: z.string().optional(),
  codeSnippet: z.string().optional(),
  tradeoffs: z.string().optional(),
});

export const submitAttemptSchema = z.object({
  designExplanation: z.string().min(1, 'Design explanation is required'),
  classDesign: z.string().min(1, 'Class design is required'),
  codeSnippet: z.string().min(1, 'Code/pseudocode is required'),
  tradeoffs: z.string().min(1, 'Trade-offs section is required'),
});

export class AttemptController {
  constructor(attemptService) {
    this.attemptService = attemptService;
  }

  startOrGetAttempt = async (req, res, next) => {
    try {
      const { problemSlug, userId, forceNew } = req.body;
      const attempt = await this.attemptService.getOrCreateAttempt(problemSlug, userId, Boolean(forceNew));
      res.json({
        success: true,
        data: attempt,
      });
    } catch (err) {
      next(err);
    }
  };

  getAttemptById = async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const attempt = await this.attemptService.getAttemptById(id);
      if (!attempt) {
        return res.status(404).json({
          success: false,
          error: `Attempt with id "${id}" not found.`,
        });
      }
      res.json({
        success: true,
        data: attempt,
      });
    } catch (err) {
      next(err);
    }
  };

  saveDraft = async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const updated = await this.attemptService.saveDraft(id, req.body);
      res.json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  };

  submitAttempt = async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const result = await this.attemptService.submitAttempt(id, req.body);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getUserHistory = async (req, res, next) => {
    try {
      const userId = req.query.userId || 'anonymous-learner';
      const history = await this.attemptService.getUserHistory(userId);
      res.json({
        success: true,
        count: history.length,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  };
}
