export class ProblemController {
  constructor(problemService) {
    this.problemService = problemService;
  }

  getAll = async (req, res, next) => {
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

  getBySlug = async (req, res, next) => {
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
