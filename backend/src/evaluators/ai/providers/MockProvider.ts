import { ILLMProvider, LLMCompletionOptions } from '../../interfaces/ILLMProvider.js';

export class MockProvider implements ILLMProvider {
  public readonly name = 'MockProvider';

  public isAvailable(): boolean {
    return true;
  }

  public async generateCompletion(prompt: string, _options?: LLMCompletionOptions): Promise<string> {
    // Generates simulated rich JSON feedback for offline testing or development
    const isParkingLot = /parking/i.test(prompt);
    const isVending = /vending/i.test(prompt);
    const isElevator = /elevator/i.test(prompt);

    let specificStrengths = ['Well-structured class breakdown with clear method signatures.'];
    let specificIssues = [
      {
        severity: 'WARNING',
        category: 'SOLID',
        title: 'Open/Closed Principle Consideration',
        description: 'New strategies or requirements might require modifying existing core classes instead of extending abstractions via interfaces.',
        locationHint: 'Section: Classes & Responsibilities',
      }
    ];
    let specificSuggestions = ['Introduce an interface for strategy injection to decouple concrete implementations.'];
    let nextStep = 'Decouple pricing/dispatch strategies into dedicated Strategy pattern interfaces.';

    if (isParkingLot) {
      specificStrengths.push('Demonstrates solid entity representation for ParkingSpot, Vehicle, and Ticket.');
      specificIssues.push({
        severity: 'SUGGESTION',
        category: 'EDGE_CASE',
        title: 'Concurrency during Peak Hour Spot Allocation',
        description: 'Concurrent vehicle entries might cause double-booking of the same spot without mutex locking or atomic reservation.',
        locationHint: 'Section: Trade-offs & Assumptions',
      });
      specificSuggestions.push('Add an allocation strategy interface (e.g. NearestFirstStrategy, BestFitStrategy).');
      nextStep = 'Implement thread-safe spot assignment and support dynamic pricing strategies.';
    } else if (isVending) {
      specificStrengths.push('Clear state encapsulation for selection and inventory checking.');
      specificIssues.push({
        severity: 'WARNING',
        category: 'CLASS_DESIGN',
        title: 'State Transition Coupling',
        description: 'Ensure states delegate transitions through the State Pattern rather than nested if-else statements.',
        locationHint: 'Section: Code / Pseudocode',
      });
      specificSuggestions.push('Use a dedicated State interface (IdleState, HasMoneyState, DispensingState, SoldOutState).');
      nextStep = 'Encapsulate machine states into dedicated State pattern classes to simplify transaction rollbacks.';
    } else if (isElevator) {
      specificStrengths.push('Good separation between ElevatorCar, ElevatorController, and Request queues.');
      specificIssues.push({
        severity: 'WARNING',
        category: 'EDGE_CASE',
        title: 'Starvation Handling in High Traffic',
        description: 'Direction-based scheduling (SCAN/LOOK algorithm) should prevent calls in opposite directions from starving indefinitely.',
        locationHint: 'Section: Trade-offs & Assumptions',
      });
      specificSuggestions.push('Implement a priority queue or Look-ahead dispatcher to balance floor servicing.');
      nextStep = 'Formulate the dispatch algorithm interface (SCAN/LOOK) and detail emergency stop states.';
    }

    const mockResponse = {
      score: 84,
      verdict: 'EXCELLENT',
      categoryScores: {
        solidPrinciples: 22,
        classDesignAndAbstraction: 22,
        extensibilityAndPatterns: 20,
        edgeCasesAndTradeoffs: 20,
      },
      strengths: [
        'Clean separation of concerns adhering to Single Responsibility Principle.',
        ...specificStrengths,
        'Thoughtful consideration of data flows and core abstractions.',
      ],
      issues: specificIssues,
      suggestions: [
        ...specificSuggestions,
        'Document thread-safety guarantees and transaction recovery mechanisms.',
      ],
      recommendedNextStep: nextStep,
    };

    return JSON.stringify(mockResponse, null, 2);
  }
}
