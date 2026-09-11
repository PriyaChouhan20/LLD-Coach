import { Router } from 'express';
import { AttemptController, startAttemptSchema, saveDraftSchema, submitAttemptSchema } from '../controllers/AttemptController.js';
import { AttemptService } from '../services/AttemptService.js';
import { AttemptRepository } from '../repositories/AttemptRepository.js';
import { ProblemRepository } from '../repositories/ProblemRepository.js';
import { EvaluationService } from '../services/EvaluationService.js';
import { validateBody } from '../middlewares/validateRequest.js';

export function createAttemptRouter(attemptRepo, problemRepo, evaluationService) {
  const router = Router();
  const aRepo = attemptRepo || new AttemptRepository();
  const pRepo = problemRepo || new ProblemRepository();
  const eService = evaluationService || new EvaluationService();
  const aService = new AttemptService(aRepo, pRepo, eService);
  const controller = new AttemptController(aService);

  router.post('/start', validateBody(startAttemptSchema), controller.startOrGetAttempt);
  router.get('/history', controller.getUserHistory);
  router.get('/:id', controller.getAttemptById);
  router.put('/:id/draft', validateBody(saveDraftSchema), controller.saveDraft);
  router.post('/:id/submit', validateBody(submitAttemptSchema), controller.submitAttempt);

  return router;
}
