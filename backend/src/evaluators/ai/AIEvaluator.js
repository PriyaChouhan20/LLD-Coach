import { buildEvaluationPrompt, SYSTEM_EVALUATION_INSTRUCTION } from './prompts/evaluationPrompt.js';

export class AIEvaluator {
  constructor(provider) {
    this.name = 'AIEvaluator';
    this.provider = provider;
  }

  async evaluate(problem, submission) {
    if (!this.provider.isAvailable()) {
      throw new Error(`LLM provider ${this.provider.name} is not available or unconfigured.`);
    }

    const prompt = buildEvaluationPrompt(problem, submission);
    const rawResponse = await this.provider.generateCompletion(prompt, {
      systemInstruction: SYSTEM_EVALUATION_INSTRUCTION,
      responseFormat: 'json',
      temperature: 0.2,
      maxTokens: 3000,
    });

    const parsed = this.parseAndValidateResponse(rawResponse);

    return {
      id: `eval_ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submissionId: submission.id,
      overallScore: parsed.score,
      verdict: parsed.verdict,
      categoryScores: parsed.categoryScores,
      strengths: parsed.strengths,
      issues: parsed.issues,
      suggestions: parsed.suggestions,
      recommendedNextStep: parsed.recommendedNextStep,
      evaluatedBy: 'AI_ONLY',
      rawAiFeedback: rawResponse,
      evaluatedAt: new Date(),
    };
  }

  parseAndValidateResponse(rawJson) {
    try {
      // Clean markdown code blocks if present
      let clean = rawJson.trim();
      if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      const data = JSON.parse(clean);

      // Validate and clamp numbers
      const solid = Math.min(25, Math.max(0, Number(data.categoryScores?.solidPrinciples ?? 15)));
      const classDesign = Math.min(25, Math.max(0, Number(data.categoryScores?.classDesignAndAbstraction ?? 15)));
      const extensibility = Math.min(25, Math.max(0, Number(data.categoryScores?.extensibilityAndPatterns ?? 15)));
      const edgeCases = Math.min(25, Math.max(0, Number(data.categoryScores?.edgeCasesAndTradeoffs ?? 15)));

      const computedScore = solid + classDesign + extensibility + edgeCases;
      const score = Math.min(100, Math.max(0, Number(data.score ?? computedScore)));

      let verdict = data.verdict;
      if (!['EXCELLENT', 'GOOD_PROGRESS', 'NEEDS_REVISION', 'INCOMPLETE'].includes(verdict)) {
        verdict = score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD_PROGRESS' : 'NEEDS_REVISION';
      }

      return {
        score,
        verdict,
        categoryScores: {
          solidPrinciples: solid,
          classDesignAndAbstraction: classDesign,
          extensibilityAndPatterns: extensibility,
          edgeCasesAndTradeoffs: edgeCases,
        },
        strengths: Array.isArray(data.strengths) && data.strengths.length > 0
          ? data.strengths
          : ['Well-organized design structure.'],
        issues: Array.isArray(data.issues)
          ? data.issues.map((iss) => ({
              severity: ['CRITICAL', 'WARNING', 'SUGGESTION'].includes(iss.severity) ? iss.severity : 'SUGGESTION',
              category: ['SOLID', 'CLASS_DESIGN', 'COUPLING', 'EDGE_CASE', 'SYNTAX', 'STRUCTURE'].includes(iss.category) ? iss.category : 'CLASS_DESIGN',
              title: String(iss.title || 'Design Observation'),
              description: String(iss.description || ''),
              locationHint: iss.locationHint ? String(iss.locationHint) : undefined,
            }))
          : [],
        suggestions: Array.isArray(data.suggestions) && data.suggestions.length > 0
          ? data.suggestions
          : ['Continue refining class interfaces and boundary isolation.'],
        recommendedNextStep: String(data.recommendedNextStep || 'Focus on decoupling concrete dependencies with interfaces.'),
      };
    } catch (err) {
      throw new Error(`Failed to parse AI evaluation JSON: ${err.message}`);
    }
  }
}
