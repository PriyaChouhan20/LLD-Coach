import { Problem } from '../domain/models/Problem.js';
import { ProblemRepository } from '../repositories/ProblemRepository.js';
import { runSeeder } from '../data/seed/seedRunner.js';

export class ProblemService {
  constructor(private problemRepository: ProblemRepository) {}

  public async getAllProblems(): Promise<Problem[]> {
    let problems = await this.problemRepository.findAll();
    if (problems.length === 0) {
      await runSeeder(this.problemRepository);
      problems = await this.problemRepository.findAll();
    }
    return problems;
  }

  public async getProblemBySlug(slug: string): Promise<Problem | null> {
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

  public async getProblemById(id: string): Promise<Problem | null> {
    return this.problemRepository.findById(id);
  }
}
