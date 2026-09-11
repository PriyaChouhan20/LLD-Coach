export interface LLMCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  responseFormat?: 'json' | 'text';
}

export interface ILLMProvider {
  readonly name: string;
  isAvailable(): boolean;
  generateCompletion(prompt: string, options?: LLMCompletionOptions): Promise<string>;
}
