import { Request, Response, NextFunction } from 'express';
import { ProblemService } from '../services/ProblemService.js';

export class ProblemController {
  constructor(private problemService: ProblemService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const problems = await this.problemService.getAllProblems();
      res.json({
        success: true,
        count: problems.length,
        data: problems,
      });
    } catch (err) {
      next(err);
    }
  };

  public getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = String(req.params.slug);
      const problem = await this.problemService.getProblemBySlug(slug);
      if (!problem) {
        return res.status(404).json({
          success: false,
          error: `Problem with slug "${slug}" not found.`,
        });
      }
      res.json({
        success: true,
        data: problem,
      });
    } catch (err) {
      next(err);
    }
  };
}
