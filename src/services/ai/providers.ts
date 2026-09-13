import type { AIProvider, ArbiterFinding, DeepSeekFinding } from '../../core/legalguard.types';

/**
 * Адаптеры провайдеров. Здесь намеренно нет фиктивных ответов.
 * Реальный сетевой вызов будет подключён отдельным слоем после настройки
 * способа доступа к конкретной модели.
 */

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';

  isConfigured(): boolean {
    return Boolean(import.meta.env.VITE_DEEPSEEK_API_KEY);
  }

  async analyze(_documentText: string): Promise<DeepSeekFinding[]> {
    if (!this.isConfigured()) {
      throw new Error('DeepSeek не настроен: отсутствует VITE_DEEPSEEK_API_KEY.');
    }

    throw new Error('Адаптер DeepSeek создан, но сетевой вызов ещё не реализован.');
  }
}

export class ChatGPTProvider implements AIProvider {
  name = 'ChatGPT';

  isConfigured(): boolean {
    return Boolean(import.meta.env.VITE_CHATGPT_API_KEY);
  }

  async arbitrate(_findings: DeepSeekFinding[], _documentText: string): Promise<ArbiterFinding[]> {
    if (!this.isConfigured()) {
      throw new Error('ChatGPT не настроен: отсутствует VITE_CHATGPT_API_KEY.');
    }

    throw new Error('Адаптер ChatGPT создан, но сетевой вызов ещё не реализован.');
  }
}

export const providers = {
  deepSeek: new DeepSeekProvider(),
  chatGPT: new ChatGPTProvider(),
};
