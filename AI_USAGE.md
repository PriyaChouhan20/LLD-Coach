# AI Usage & Evaluation Architecture

This document explains how AI was used during the development of LLD Coach and how AI-based evaluation fits into the application.

## 1. Role of AI

LLD problems can have multiple valid solutions. Two learners may use different classes, abstractions, or design patterns and still produce good designs.

Because of this, simple rule-based checks are not enough to evaluate the complete quality of an LLD solution.

LLD Coach uses AI for qualitative feedback, while deterministic checks handle predictable structural validation.

The AI evaluator focuses on areas such as:

- SOLID principles
- Class responsibilities
- Abstraction
- Coupling and cohesion
- Extensibility
- Design patterns
- Edge cases
- Design trade-offs

The goal is to provide useful and explainable feedback instead of only giving a score.

## 2. Hybrid Evaluation

The evaluation flow is:

```text
Learner Submission
        |
        v
Deterministic Evaluator
        |
        | structurally valid
        v
AI Evaluator
        |
        | unavailable / timeout / failure
        v
Fallback Evaluator
        |
        v
Final Evaluation
```

The deterministic evaluator handles predictable structural checks, while the AI evaluator is used for qualitative design feedback.

If the AI evaluator is unavailable or fails, the fallback evaluator provides basic feedback.

## 3. Meaningful AI-Assisted Decisions

### Decision 1 — Use Hybrid Evaluation Instead of AI-Only Evaluation

AI was considered useful for evaluating subjective LLD qualities such as design clarity, responsibilities, extensibility, and trade-offs.

However, relying only on AI could make evaluation less predictable.

Therefore, the platform combines deterministic validation with AI-based qualitative feedback.

This provides a balance between predictable checks and flexible design evaluation.

### Decision 2 — Use Structured Learner Submissions

AI-assisted analysis suggested that completely free-form answers would make evaluation difficult to structure consistently.

Therefore, the learner submission is divided into four sections:

1. Design Explanation
2. Classes & Responsibilities
3. Code / Pseudocode
4. Trade-offs & Edge Cases

This gives the evaluator consistent evidence while still allowing learners to describe different valid designs.

### Decision 3 — Do Not Require an Exact Reference Solution

AI-assisted analysis highlighted that LLD problems can have multiple valid class structures.

Therefore, LLD Coach does not compare a learner's design against one exact reference implementation.

Instead, evaluation focuses on principles such as responsibilities, coupling, cohesion, extensibility, SOLID principles, and trade-offs.

### Decision 4 — Save the Submission Before Evaluation

AI-assisted design review identified that external AI evaluation can fail because of API errors, timeouts, or unavailable providers.

Therefore, the platform saves the learner's submission before starting evaluation.

The attempt can then be marked as Evaluating, Completed, or Failed without losing the learner's work.

### Decision 5 — Keep the Architecture Simple

AI suggestions included more advanced architectures such as queues, microservices, and asynchronous workers.

For this MVP, these were intentionally not added because they would increase complexity without being necessary for the core learner journey.

The project uses a simple modular monolith so that the main LLD practice and evaluation flow remains easy to understand and extend.

## 4. AI Evaluation Output

The AI evaluator is designed to produce explainable feedback including:

- Overall score
- Verdict
- Category scores
- Strengths
- Issues
- Suggestions
- Recommended next improvement

The feedback is intended to explain why a design received a particular evaluation rather than only returning a numeric score.

## 5. AI Failure Handling

AI evaluation is treated as an optional evaluation layer rather than the only source of truth.

If the configured AI provider is unavailable, times out, or returns an error, the application can use the fallback evaluator.

This prevents an external AI dependency from completely blocking the learner's practice workflow.

## 6. Human Judgement

AI was used as a development and design-assistance tool, not as a replacement for engineering judgement.

Final implementation decisions were based on the assignment scope, simplicity, reliability, and the learner's core workflow.

The goal was to use AI where it provided meaningful value while avoiding unnecessary complexity.