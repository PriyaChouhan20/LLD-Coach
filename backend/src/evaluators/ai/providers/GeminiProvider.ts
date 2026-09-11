import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLMProvider, LLMCompletionOptions } from '../../interfaces/ILLMProvider.js';

export class GeminiProvider implements ILLMProvider {
  public readonly name = 'GeminiProvider';
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || modelName;
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  public async generateCompletion(prompt: string, options?: LLMCompletionOptions): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini API key is not configured.');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        maxOutputTokens: options?.maxTokens ?? 2500,
        responseMimeType: options?.responseFormat === 'json' ? 'application/json' : 'text/plain',
      },
      systemInstruction: options?.systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) {
      throw new Error('Received empty response from Gemini API.');
    }
    return text;
  }
}
