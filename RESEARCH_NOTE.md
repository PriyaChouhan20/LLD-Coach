# 🔬 Research Note: LLD Evaluation Approach

This document explains the research, product direction, and evaluation approach used in **LLD Coach**.

---

## 1. Why LLD Evaluation Is Difficult

Evaluating Low-Level Design (LLD) is challenging because there is no single correct design for many problems.

Unlike algorithmic coding problems, where automated tests can often determine whether an output is correct, an LLD problem can have multiple valid object-oriented designs.

A good evaluation therefore needs to consider not only whether the required behavior is covered, but also how responsibilities, abstractions, dependencies, and trade-offs are handled.

### Common Problems in LLD Solutions

1. **Too much responsibility in one class**
   - Business rules, data management, and coordination may be placed in a single large class.

2. **Poor separation of responsibilities**
   - Components may not have clear boundaries or well-defined responsibilities.

3. **Unnecessary design patterns**
   - Patterns may be added without a real requirement, making the design more complex.

4. **Missing edge cases**
   - Invalid inputs, boundary conditions, failure cases, and concurrency considerations may be overlooked.

5. **Poor domain modeling**
   - Important real-world entities and their responsibilities may not be represented clearly.

---

## 2. Existing Approaches and Key Gaps

Candidates preparing for LLD interviews commonly use several approaches.

### 2.1 Static Tutorials, Blogs, and Videos

**Strengths**
- Good for learning LLD concepts.
- Useful for understanding design patterns and example solutions.

**Gaps**
- Mostly passive learning.
- They provide limited personalized feedback on a candidate's own design.

### 2.2 Coding Practice Platforms

**Strengths**
- Strong automated evaluation for algorithmic and coding problems.
- Immediate pass/fail feedback.

**Gaps**
- LLD design quality is harder to evaluate using only traditional test cases.
- Concepts such as responsibility distribution, abstraction, coupling, and extensibility require more qualitative analysis.

### 2.3 Peer or Mock Interviews

**Strengths**
- Allow discussion and follow-up questions.
- Human interviewers can explain design trade-offs.

**Gaps**
- Depend on interviewer availability.
- Feedback can vary between reviewers.
- Repeated practice is less convenient.

### 2.4 General AI Assistants

**Strengths**
- Can review designs and suggest improvements.
- Can provide explanations and alternative approaches.

**Gaps**
- Without a fixed problem, rubric, and structured submission format, feedback can become inconsistent or generic.

---

## 3. Product Direction

LLD Coach is designed around a repeated practice loop:

**Choose Problem → Design → Submit → Get Feedback → Review → Try Again**

The MVP focuses on:

- A small curated set of LLD problems.
- Clear problem requirements and context.
- A structured four-section submission workspace.
- Hybrid evaluation using deterministic checks and AI-based qualitative feedback.
- Fallback evaluation when the AI provider is unavailable.
- Attempt history and retry support.

The goal is to help learners practice the complete LLD process rather than only read example solutions.

---

## 4. Meaningful Submission Evidence

A useful LLD submission should provide enough evidence to understand the candidate's design decisions.

LLD Coach uses four structured sections:

1. **Design Explanation**
   - Explains the overall approach and how the system components interact.

2. **Classes & Responsibilities**
   - Describes core classes, responsibilities, relationships, interfaces, attributes, and methods.

3. **Code / Pseudocode**
   - Provides concrete implementation or pseudocode for important classes and business logic.

4. **Trade-offs & Assumptions**
   - Explains assumptions, edge cases, alternative decisions, and relevant design trade-offs.

This format was chosen because it captures important LLD reasoning without requiring the MVP to build a complex UML editor.

It also provides consistent evidence that can be evaluated by both deterministic rules and an AI evaluator.

---

## 5. Evaluation Rubric

LLD Coach uses a 100-point evaluation model divided into four categories.

| Category | Points | What is evaluated |
|---|---:|---|
| SOLID Principles | 25 | Responsibility separation, extensibility, and interface quality |
| Class Design & Abstraction | 25 | Core entities, relationships, responsibilities, and abstractions |
| Extensibility & Patterns | 25 | Ability to extend the design and use of patterns where appropriate |
| Edge Cases & Trade-offs | 25 | Boundary conditions, failure cases, assumptions, and concurrency trade-offs |

The rubric is intended to provide more useful feedback than a simple pass/fail result.

---

## 6. Deterministic vs AI Evaluation

Not every part of LLD evaluation requires AI.

### Deterministic evaluation is useful for:

- Required submission sections.
- Minimum content requirements.
- Basic structural completeness.
- Identifying expected core entities.

These checks are predictable and repeatable.

### AI evaluation is useful for:

- Quality of class responsibilities.
- Abstraction and encapsulation.
- SOLID-related design decisions.
- Coupling and cohesion.
- Extensibility.
- Appropriate use of design patterns.
- Design trade-offs.
- Suggestions for improvement.

These areas are more subjective and may have multiple valid solutions.

Therefore, LLD Coach uses a **hybrid evaluation approach** rather than relying entirely on either rules or AI.

---

## 7. Hybrid Evaluation Flow

The evaluation pipeline follows this flow:

```text
Candidate Submission
        |
        v
Deterministic Evaluator
        |
        |-- Structural failure --> Return deterministic feedback
        |
        v
AI Evaluator
        |
        |-- Success --> Return AI + deterministic findings
        |
        |-- Failure/Timeout
        v
Fallback Evaluator
        |
        v
Final Evaluation Result