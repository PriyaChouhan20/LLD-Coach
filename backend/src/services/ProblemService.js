import { runSeeder } from '../data/seed/seedRunner.js';

export class ProblemService {
  constructor(problemRepository) {
    this.problemRepository = problemRepository;
  }

  async getAllProblems() {
    let problems = await this.problemRepository.findAll();
    if (problems.length === 0) {
      await runSeeder(this.problemRepository);
      problems = await this.problemRepository.findAll();
    }
    return problems;
  }

  async getProblemBySlug(slug) {
    const problem = await this.problemRepository.findBySlug(slug);
    if (!problem) {
      // If empty, auto-seed and try once more
      const count = await this.problemRepository.count();
      if (count === 0) {
        await runSeeder(this.problemRepository);
        return this.problemRepository.findBySlug(slug);
      }
    }
    return problem;
  }

  async getProblemById(id) {
    return this.problemRepository.findById(id);
  }
}
