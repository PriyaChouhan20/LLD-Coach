export class OpenAIProvider {
  constructor(apiKey, model = 'gpt-4o-mini', baseUrl = 'https://api.openai.com/v1') {
    this.name = 'OpenAIProvider';
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || model;
    this.baseUrl = process.env.OPENAI_BASE_URL || baseUrl;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateCompletion(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured.');
    }

    const messages = [];
    if (options.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const payload = {
      model: this.model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 2500,
    };

    if (options.responseFormat === 'json') {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Received empty completion from OpenAI API.');
    }
    return content;
  }
}
