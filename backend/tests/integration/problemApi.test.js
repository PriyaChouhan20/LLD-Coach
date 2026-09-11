import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { ProblemRepository } from '../../src/repositories/ProblemRepository.js';
import { runSeeder } from '../../src/data/seed/seedRunner.js';

describe('Problem API Integration Tests', () => {
  let app;
  let problemRepo;

  beforeAll(async () => {
    problemRepo = new ProblemRepository();
    await runSeeder(problemRepo);
    app = createApp({ problemRepo });
  });

  it('GET /api/health should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/problems should return 4 seeded problems', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(4);
    expect(res.body.data[0]).toHaveProperty('slug');
    expect(res.body.data[0]).toHaveProperty('evaluationRubric');
  });

  it('GET /api/problems/:slug should return a specific problem', async () => {
    const res = await request(app).get('/api/problems/parking-lot');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('parking-lot');
    expect(res.body.data.functionalRequirements.length).toBeGreaterThan(0);
  });

  it('GET /api/problems/non-existent-slug should return 404', async () => {
    const res = await request(app).get('/api/problems/non-existent-slug');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
