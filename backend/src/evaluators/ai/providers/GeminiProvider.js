import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider {
  constructor(apiKey, modelName = 'gemini-1.5-flash') {
    this.name = 'GeminiProvider';
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || modelName;
    this.client = null;
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateCompletion(prompt, options = {}) {
    if (!this.client) {
      throw new Error('Gemini API key is not configured.');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxTokens ?? 2500,
        responseMimeType: options.responseFormat === 'json' ? 'application/json' : 'text/plain',
      },
      systemInstruction: options.systemInstruction,
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
