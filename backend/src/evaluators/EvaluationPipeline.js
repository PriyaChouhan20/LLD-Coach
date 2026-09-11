import { DeterministicEvaluator } from './deterministic/DeterministicEvaluator.js';
import { AIEvaluator } from './ai/AIEvaluator.js';
import { FallbackEvaluator } from './fallback/FallbackEvaluator.js';
import { GeminiProvider } from './ai/providers/GeminiProvider.js';
import { OpenAIProvider } from './ai/providers/OpenAIProvider.js';
import { MockProvider } from './ai/providers/MockProvider.js';

export class EvaluationPipeline {
  constructor(options = {}) {
    this.name = 'EvaluationPipeline';
    this.deterministicEvaluator = new DeterministicEvaluator();
    this.fallbackEvaluator = new FallbackEvaluator();
    this.timeoutMs = options.timeoutMs ?? 12000;
    this.deterministicOnly = options.deterministicOnly ?? false;
    this.aiEvaluator = null;

    // Initialize provider based on configuration
    const provider = this.resolveLLMProvider(options.aiProviderType);
    if (provider && provider.isAvailable()) {
      this.aiEvaluator = new AIEvaluator(provider);
    }
  }

  async evaluate(problem, submission) {
    // Step 1: Run Deterministic Evaluator
    const detResult = await this.deterministicEvaluator.evaluate(problem, submission);

    // If deterministic evaluation detected that the submission is incomplete/empty or has critical structural failure
    if (!detResult.deterministicFindings?.passedStructuralChecks || this.deterministicOnly) {
      return detResult;
    }

    // Step 2: Run AI Evaluation with Fallback
    if (this.aiEvaluator) {
      try {
        const aiResultPromise = this.aiEvaluator.evaluate(problem, submission);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI Evaluation timed out after ' + this.timeoutMs + 'ms')), this.timeoutMs)
        );

        const aiResult = await Promise.race([aiResultPromise, timeoutPromise]);

        // Synthesize Hybrid result: Merge deterministic findings into AI result
        return {
          ...aiResult,
          evaluatedBy: 'HYBRID',
          deterministicFindings: detResult.deterministicFindings,
          // If deterministic found missing entities, merge into issues if not already present
          issues: this.mergeIssues(aiResult.issues, detResult.issues),
        };
      } catch (aiError) {
        console.warn(`[EvaluationPipeline] AI evaluation failed or timed out (${aiError.message}). Using FallbackEvaluator.`);
      }
    }

    // Step 3: Fallback Evaluator if AI is unavailable or failed
    const fallbackResult = await this.fallbackEvaluator.evaluate(problem, submission);
    return fallbackResult;
  }

  resolveLLMProvider(preference) {
    const selected = preference || process.env.AI_PROVIDER || 'auto';

    if (selected === 'mock') {
      return new MockProvider();
    }

    if (selected === 'openai') {
      return new OpenAIProvider();
    }

    if (selected === 'gemini') {
      return new GeminiProvider();
    }

    // Auto resolution: Gemini first, then OpenAI, then Mock
    const gemini = new GeminiProvider();
    if (gemini.isAvailable()) return gemini;

    const openai = new OpenAIProvider();
    if (openai.isAvailable()) return openai;

    console.info('[EvaluationPipeline] No external LLM API key detected. Using MockProvider as fallback.');
    return new MockProvider();
  }

  mergeIssues(aiIssues, detIssues) {
    const combined = [...aiIssues];
    for (const det of detIssues) {
      const exists = combined.some(i => i.title.toLowerCase() === det.title.toLowerCase() || i.category === det.category);
      if (!exists && det.severity === 'CRITICAL') {
        combined.push(det);
      }
    }
    return combined;
  }
}
