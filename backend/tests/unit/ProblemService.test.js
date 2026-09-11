import { describe, it, expect, beforeEach } from 'vitest';
import { ProblemService } from '../../src/services/ProblemService.js';
import { ProblemRepository } from '../../src/repositories/ProblemRepository.js';

describe('ProblemService', () => {
  let repo;
  let service;

  beforeEach(() => {
    repo = new ProblemRepository();
    service = new ProblemService(repo);
  });

  it('should auto-seed and return all 4 problems', async () => {
    const problems = await service.getAllProblems();
    expect(problems.length).toBe(4);
    const slugs = problems.map(p => p.slug);
    expect(slugs).toContain('parking-lot');
    expect(slugs).toContain('vending-machine');
    expect(slugs).toContain('elevator-system');
    expect(slugs).toContain('library-management');
  });

  it('should fetch a single problem by slug', async () => {
    const problem = await service.getProblemBySlug('elevator-system');
    expect(problem).not.toBeNull();
    expect(problem?.title).toContain('Elevator');
    expect(problem?.difficulty).toBe('HARD');
    expect(problem?.coreEntities.length).toBeGreaterThan(3);
  });
});
