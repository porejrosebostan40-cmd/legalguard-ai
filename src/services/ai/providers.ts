import type {
  ArbiterFinding,
  ChatGPTArbiter,
  DeepSeekAnalyzer,
  DeepSeekFinding,
} from '../../core/legalguard.types';

/**
 * Провайдеры не получают секреты в браузере.
 * Они обращаются к серверному шлюзу приложения.
 * Адрес шлюза задаётся VITE_AI_GATEWAY_URL и не является секретом.
 */

const gatewayUrl = (): string =>
  (import.meta.env.VITE_AI_GATEWAY_URL as string | undefined)?.replace(/\/$/, '') || '/api/ai';

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${gatewayUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`AI-шлюз вернул HTTP ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function requireArray<T>(value: unknown, field: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`AI-шлюз вернул некорректное поле ${field}.`);
  }
  return value as T[];
}

export class DeepSeekProvider implements DeepSeekAnalyzer {
  name = 'DeepSeek';

  isConfigured(): boolean {
    return Boolean(import.meta.env.VITE_AI_GATEWAY_URL) || typeof window !== 'undefined';
  }

  async analyze(documentText: string): Promise<DeepSeekFinding[]> {
    const result = await post<{ findings: unknown }>('/deepseek/analyze', {
      documentText,
    });
    return requireArray<DeepSeekFinding>(result.findings, 'findings');
  }
}

export class ChatGPTProvider implements ChatGPTArbiter {
  name = 'ChatGPT';

  isConfigured(): boolean {
    return Boolean(import.meta.env.VITE_AI_GATEWAY_URL) || typeof window !== 'undefined';
  }

  async arbitrate(findings: DeepSeekFinding[], documentText: string): Promise<ArbiterFinding[]> {
    const result = await post<{ findings: unknown }>('/chatgpt/arbitrate', {
      findings,
      documentText,
    });
    return requireArray<ArbiterFinding>(result.findings, 'findings');
  }
}

export const providers = {
  deepSeek: new DeepSeekProvider(),
  chatGPT: new ChatGPTProvider(),
};
