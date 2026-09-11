import { Router } from 'express';
import { ProblemController } from '../controllers/ProblemController.js';
import { ProblemService } from '../services/ProblemService.js';
import { ProblemRepository } from '../repositories/ProblemRepository.js';

export function createProblemRouter(problemRepo?: ProblemRepository): Router {
  const router = Router();
  const repo = problemRepo || new ProblemRepository();
  const service = new ProblemService(repo);
  const controller = new ProblemController(service);

  router.get('/', controller.getAll);
  router.get('/:slug', controller.getBySlug);

  return router;
}
