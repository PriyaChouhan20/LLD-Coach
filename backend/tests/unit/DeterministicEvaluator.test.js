import { describe, it, expect } from 'vitest';
import { DeterministicEvaluator } from '../../src/evaluators/deterministic/DeterministicEvaluator.js';
import { SEED_PROBLEMS } from '../../src/data/seed/problems.seed.js';

describe('DeterministicEvaluator', () => {
  const evaluator = new DeterministicEvaluator();
  const parkingLotProblem = SEED_PROBLEMS[0];

  it('should flag incomplete submissions with critical issues', async () => {
    const emptySubmission = {
      id: 'sub_test_empty',
      attemptId: 'att_test',
      problemId: parkingLotProblem.id,
      version: 1,
      content: {
        designExplanation: '',
        classDesign: '',
        codeSnippet: '',
        tradeoffs: '',
      },
      evaluationStatus: 'PENDING',
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(parkingLotProblem, emptySubmission);

    expect(result.verdict).toBe('INCOMPLETE');
    expect(result.deterministicFindings?.passedStructuralChecks).toBe(false);
    expect(result.issues.length).toBeGreaterThanOrEqual(3);
    const criticals = result.issues.filter(i => i.severity === 'CRITICAL');
    expect(criticals.length).toBeGreaterThanOrEqual(3);
  });

  it('should identify core entities and design patterns in well-formed submissions', async () => {
    const goodSubmission = {
      id: 'sub_test_good',
      attemptId: 'att_test',
      problemId: parkingLotProblem.id,
      version: 1,
      content: {
        designExplanation: 'This is an object oriented multi-level parking lot system using Strategy Pattern for spot assignment and Observer Pattern for real time floor display boards.',
        classDesign: 'Classes include ParkingLot, ParkingFloor, ParkingSpot, Vehicle, ParkingTicket, Gate, and SpotAssignmentStrategy with clear responsibilities.',
        codeSnippet: `public interface SpotAssignmentStrategy {
  ParkingSpot findSpot(ParkingLot lot, Vehicle vehicle);
}
public class ParkingLot {
  private List<ParkingFloor> floors;
  public synchronized ParkingTicket parkVehicle(Vehicle v) { return new ParkingTicket(); }
}`,
        tradeoffs: 'Used synchronized methods to prevent race condition concurrency issues during peak gate entries. Applied Strategy pattern for extensibility.',
      },
      evaluationStatus: 'PENDING',
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(parkingLotProblem, goodSubmission);

    expect(result.deterministicFindings?.passedStructuralChecks).toBe(true);
    expect(result.deterministicFindings?.identifiedEntities.length).toBeGreaterThan(3);
    expect(result.deterministicFindings?.detectedPatterns).toContain('Strategy');
    expect(result.overallScore).toBeGreaterThanOrEqual(50);
  });
});
