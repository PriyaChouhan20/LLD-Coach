# Design Note: LLD Coach

This document explains the MVP architecture, domain model, evaluation approach, and important design decisions behind LLD Coach.

---

## 1. MVP Overview

LLD Coach is a small practice platform that helps learners repeatedly practice Low-Level Design.

The main learner journey is:

**Choose Problem → Start Attempt → Design Solution → Save Draft → Submit → Get Feedback → Review → Try Again**

The MVP includes:

- A small set of LLD problems
- Problem requirements and context
- A structured practice workspace
- Draft saving
- Solution submission
- Deterministic and AI-based evaluation
- Explainable feedback
- Attempt history
- Try Again functionality

The project intentionally uses a simple modular monolith because the assignment focuses on LLD and product behaviour rather than large-scale infrastructure.

---

## 2. Architecture

The application uses a simple layered architecture:

```text
React Frontend
      |
      | HTTP REST API
      v
Express Routes / Controllers
      |
      v
Services
      |
      +--------------------+
      |                    |
      v                    v
Attempt / Problem      Evaluation Pipeline
Services                    |
                            +--> Deterministic Evaluator
                            |
                            +--> AI Evaluator
                            |       |
                            |       v
                            |    Gemini Provider
                            |
                            +--> Fallback Evaluator
      |
      v
Mongoose Models
      |
      v
MongoDB