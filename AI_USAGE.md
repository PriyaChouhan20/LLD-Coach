# 🤖 AI Usage & Evaluation Architecture

This document explains how AI evaluation is designed and used in **LLD Coach**.

---

## 1. Role of AI Evaluation

In Low-Level Design (LLD), there are multiple ways to structure classes, methods, and patterns. Because of this, traditional automated tests cannot judge overall design quality.

**LLD Coach** uses an **AI-based LLD evaluator** to review candidate submissions across 4 key design areas:
1. **SOLID Principles**: Checks for Single Responsibility, Open/Closed extensions, and clean interfaces.
2. **Class Design & Abstraction**: Checks for clear entity modeling, encapsulation, and reasonable class responsibilities.
3. **Extensibility & Design Patterns**: Checks for appropriate use of design patterns (such as Strategy, Factory, or State) without over-engineering.
4. **Edge Cases & Concurrency**: Checks whether error cases, boundary limits, and concurrency trade-offs are considered.

---

## 2. Pluggable Provider Architecture (Adapter Pattern)

To avoid depending on a single AI service, the project uses the Adapter Pattern with a common interface:

```typescript
export interface ILLMProvider {
  generateCompletion(prompt: string, options?: LLMCompletionOptions): Promise<string>;
}
```

The interface separates our evaluation logic from a specific AI provider, so we can use Gemini, OpenAI, or MockProvider without changing the evaluator.

### Implemented Providers:
1. **`GeminiProvider`**: Uses the `@google/generative-ai` SDK to connect to Google Gemini.
2. **`OpenAIProvider`**: Connects to the OpenAI chat completions API.
3. **`MockProvider`**: Generates simulated evaluation feedback for offline development and automated testing.

### Provider Resolution:
- If `AI_PROVIDER` is set (`gemini`, `openai`, or `mock`), that specific provider is used.
- If set to `auto` (default), the backend checks for `GEMINI_API_KEY`, then `OPENAI_API_KEY`, and falls back to `MockProvider` if no keys are found.

---

## 3. Structured JSON Output

The AI is instructed to return structured JSON so the application can reliably parse and display the feedback in the UI. The response includes:
- **`score`**: Overall score (0 to 100).
- **`categoryScores`**: Scores for SOLID, Class Design, Extensibility, and Edge Cases (up to 25 points each).
- **`strengths`**: Specific positive aspects of the design.
- **`issues`**: Concrete problems or flaws found in the design, with severity levels and location hints.
- **`suggestions`**: Actionable refactoring recommendations.
- **`recommendedNextStep`**: The single highest-priority improvement for the next attempt.

---

## 4. Evaluation Handling & Fallback

AI calls have a timeout and the response is validated before being used. If the AI call fails or returns invalid data, the system uses the `FallbackEvaluator` to provide basic feedback.

---

## 5. Security

API keys are stored on the backend and are not exposed to the frontend.
