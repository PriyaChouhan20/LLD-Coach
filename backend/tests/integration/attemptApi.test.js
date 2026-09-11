import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { ProblemRepository } from '../../src/repositories/ProblemRepository.js';
import { AttemptRepository } from '../../src/repositories/AttemptRepository.js';
import { EvaluationService } from '../../src/services/EvaluationService.js';
import { runSeeder } from '../../src/data/seed/seedRunner.js';

describe('Attempt & Submission API Integration Tests', () => {
  let app;
  let attemptRepo;
  let problemRepo;

  beforeAll(async () => {
    problemRepo = new ProblemRepository();
    attemptRepo = new AttemptRepository();
    const evaluationService = new EvaluationService({ aiProviderType: 'mock' });
    await runSeeder(problemRepo);
    app = createApp({ problemRepo, attemptRepo, evaluationService });
  });

  it('POST /api/attempts/start should create or retrieve an attempt initialized with starter template', async () => {
    const res = await request(app)
      .post('/api/attempts/start')
      .send({ problemSlug: 'parking-lot', userId: 'tester-1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.status).toBe('IN_PROGRESS');
    expect(res.body.data.currentDraft).toHaveProperty('designExplanation');
  });

  it('PUT /api/attempts/:id/draft should save progress draft', async () => {
    const startRes = await request(app)
      .post('/api/attempts/start')
      .send({ problemSlug: 'vending-machine', userId: 'tester-1' });

    const attemptId = startRes.body.data.id;

    const draftRes = await request(app)
      .put(`/api/attempts/${attemptId}/draft`)
      .send({
        designExplanation: 'My draft explanation of State Pattern...',
      });

    expect(draftRes.status).toBe(200);
    expect(draftRes.body.data.currentDraft.designExplanation).toBe('My draft explanation of State Pattern...');
  });

  it('POST /api/attempts/:id/submit should evaluate submission and return explainable feedback', async () => {
    const startRes = await request(app)
      .post('/api/attempts/start')
      .send({ problemSlug: 'parking-lot', userId: 'tester-1' });

    const attemptId = startRes.body.data.id;

    const submitRes = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .send({
        designExplanation: 'Modular multi-floor parking lot system using Strategy Pattern for spot assignment and Observer Pattern for display boards.',
        classDesign: 'Classes include ParkingLot, ParkingFloor, ParkingSpot, CompactSpot, LargeSpot, ElectricSpot, Vehicle, Ticket, EntryGate, ExitGate, SpotAssignmentStrategy.',
        codeSnippet: `public interface SpotAssignmentStrategy {
  ParkingSpot findSpot(ParkingLot lot, Vehicle vehicle);
}
public class NearestSpotStrategy implements SpotAssignmentStrategy {
  public ParkingSpot findSpot(ParkingLot lot, Vehicle vehicle) {
    return lot.getAvailableSpot(vehicle.getType());
  }
}`,
        tradeoffs: 'Used synchronized spot allocation blocks to guarantee thread safety during concurrent gate arrivals.',
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.success).toBe(true);
    const { attempt, evaluationResult } = submitRes.body.data;
    expect(attempt.status).toBe('EVALUATED');
    expect(evaluationResult.overallScore).toBeGreaterThan(50);
    expect(evaluationResult.strengths.length).toBeGreaterThan(0);
    expect(evaluationResult.categoryScores).toHaveProperty('solidPrinciples');
  });

  it('GET /api/attempts/history should list user attempts', async () => {
    const res = await request(app)
      .get('/api/attempts/history?userId=tester-1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0]).toHaveProperty('submissions');
  });

  it('POST /api/attempts/start with forceNew: true should create a distinct new attempt and preserve history', async () => {
    const res1 = await request(app)
      .post('/api/attempts/start')
      .send({ problemSlug: 'parking-lot', userId: 'tester-force-new' });

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    const attempt1Id = res1.body.data.id;

    const res2 = await request(app)
      .post('/api/attempts/start')
      .send({ problemSlug: 'parking-lot', userId: 'tester-force-new', forceNew: true });

    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
    const attempt2Id = res2.body.data.id;

    expect(attempt2Id).not.toBe(attempt1Id);

    const historyRes = await request(app)
      .get('/api/attempts/history?userId=tester-force-new');

    expect(historyRes.status).toBe(200);
    expect(historyRes.body.success).toBe(true);
    expect(historyRes.body.count).toBe(2);
    const ids = historyRes.body.data.map((a) => a.id);
    expect(ids).toContain(attempt1Id);
    expect(ids).toContain(attempt2Id);
  });
});
