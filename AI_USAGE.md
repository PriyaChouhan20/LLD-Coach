# AI Usage & Evaluation Architecture

This document explains how AI was used in LLD Coach and how AI-based evaluation fits into the application.

---

## 1. Role of AI

LLD problems can have multiple valid solutions. Two learners may use different classes, abstractions, or design patterns and still produce good designs.

Because of this, simple rule-based checks are not enough to evaluate the complete quality of an LLD solution.

LLD Coach uses AI for qualitative feedback, while deterministic checks handle predictable structural validation.

The AI evaluates areas such as:

- SOLID principles
- Class responsibilities
- Abstraction
- Coupling and cohesion
- Extensibility
- Design patterns
- Edge cases
- Design trade-offs

The goal is to provide useful and explainable feedback instead of only giving a score.

---

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
        | AI unavailable / timeout / failure
        v
Fallback Evaluator
        |
        v
Final Evaluation