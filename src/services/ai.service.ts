// src/services/ai.service.ts
export class AIService {
  // === ЗАГЛУШКИ ДЛЯ АПЕЛЛЯЦИЙ И КАССАЦИЙ ===
  
  // ChatGPT: анализ процессуальных ошибок
  private chatGPTResponses = [
    "Выявлены нарушения ст. 389.15 УПК РФ: суд первой инстанции не учел доказательства, представленные защитой.",
    "Приговор подлежит отмене по п. 1 ч. 1 ст. 389.15 УПК РФ: несоответствие выводов суда фактическим обстоятельствам.",
    "Нарушены требования ст. 307 УПК РФ: в приговоре отсутствует оценка доказательств со стороны защиты.",
    "Суд нарушил ст. 389.13 УПК РФ, не предоставив стороне защиты возможность ознакомиться с материалами дела.",
    "Имеется нарушение принципа состязательности (ст. 15 УПК РФ): ходатайства защиты оставлены без рассмотрения."
  ];

  // GigaChat: шаблоны жалоб
  private gigaChatResponses = [
    `В АПЕЛЛЯЦИОННУЮ ИНСТАНЦИЮ
[Наименование суда]
От: [ФИО осужденного/защитника]
Адрес: [адрес]

АПЕЛЛЯЦИОННАЯ ЖАЛОБА
на приговор [наименование суда] от [дата]

[Описание процессуальных нарушений]

На основании изложенного, руководствуясь ст. 389.1-389.3 УПК РФ,

ПРОШУ:
1. Отменить приговор [наименование суда] от [дата].
2. Назначить новое судебное разбирательство.

Приложения:
1. Копия приговора
2. Доказательства

[Дата] [Подпись]`,

    `В КАССАЦИОННУЮ ИНСТАНЦИЮ
[Наименование суда]
От: [ФИО осужденного/защитника]

КАССАЦИОННАЯ ЖАЛОБА
на апелляционное определение [наименование суда] от [дата]

[Перечень существенных нарушений норм УПК РФ]

На основании ст. 401.1-401.4 УПК РФ,

ПРОШУ:
1. Отменить апелляционное определение [наименование суда] от [дата].
2. Направить дело на новое рассмотрение.

[Дата] [Подпись]`
  ];

  // DeepSeek: поиск практики
  private deepSeekResponses = [
    "Постановление Пленума ВС РФ №19 от 27.11.2012 'О применении норм Уголовно-процессуального кодекса'...",
    "Определение Конституционного Суда РФ №1234-О от 15.05.2020 о праве на апелляционное обжалование...",
    "Апелляционное определение Московского городского суда по делу №33-12345/2023...",
    "Кассационное определение Верховного Суда РФ по делу №78-КГ23-123-К1...",
    "Обзор судебной практики по вопросам назначения наказания (утв. Президиумом ВС РФ 15.12.2021)..."
  ];

  // === ОСНОВНЫЕ МЕТОДЫ ===

  /**
   * ChatGPT: анализ приговора на процессуальные ошибки
   * @param verdictText - текст приговора или процессуального документа
   */
  async analyzeVerdict(verdictText: string): Promise<string> {
    await this.delay(800);
    
    const randomResponse = this.chatGPTResponses[
      Math.floor(Math.random() * this.chatGPTResponses.length)
    ];
    
    // Простой анализ текста
    const containsUPC = verdictText.includes("УПК") || verdictText.includes("ст.");
    const length = verdictText.length;
    
    return `[Анализ ChatGPT]\n\nАнализируемый документ: ${length} символов\nСодержит ссылки на УПК: ${containsUPC ? 'да' : 'нет'}\n\nВыявленные нарушения:\n1. ${randomResponse}\n2. Нарушение права на защиту (ст. 16 УПК РФ)\n3. Неполное исследование доказательств\n\nРекомендации:\n- Указать на нарушения в мотивировочной части жалобы\n- Приложить соответствующие доказательства\n- Сослаться на аналогичную практику`;
  }

  /**
   * GigaChat: составление жалобы на основе анализа
   * @param analysis - результат анализа от ChatGPT
   * @param caseInfo - информация по делу (номер, суд, дата)
   */
  async draftAppeal(analysis: string, caseInfo: {
    caseNumber: string;
    courtName: string;
    verdictDate: string;
    clientName: string;
  }): Promise<string> {
    await this.delay(1000);
    
    const template = this.gigaChatResponses[
      Math.floor(Math.random() * this.gigaChatResponses.length)
    ];
    
    // Заменяем заглушки в шаблоне
    let result = template
      .replace(/\[Наименование суда\]/g, caseInfo.courtName)
      .replace(/\[дата\]/g, caseInfo.verdictDate)
      .replace(/\[ФИО осужденного\/защитника\]/g, caseInfo.clientName);
    
    return `[Составление жалобы GigaChat]\n\nДело №${caseInfo.caseNumber}\n\n${result}\n\nОсновано на анализе:\n${analysis.substring(0, 200)}...`;
  }

  /**
   * DeepSeek: поиск судебной практики и статей
   * @param query - запрос (например, "нарушение ст. 389.15 УПК")
   * @param caseType - тип дела ("апелляция" | "кассация")
   */
  async searchPractice(query: string, caseType: 'апелляция' | 'кассация' = 'апелляция'): Promise<string> {
    await this.delay(900);
    
    const randomResponse = this.deepSeekResponses[
      Math.floor(Math.random() * this.deepSeekResponses.length)
    ];
    
    const upcArticles = caseType === 'апелляция' 
      ? "ст. 389.1-389.3, 389.15, 389.16, 389.17 УПК РФ"
      : "ст. 401.1-401.4, 401.11, 401.12 УПК РФ";
    
    return `[Поиск практики DeepSeek]\n\nЗапрос: "${query}"\nТип жалобы: ${caseType}\n\nРелевантные нормы:\n${upcArticles}\n\nСудебная практика:\n1. ${randomResponse}\n2. Определение ВС РФ по делу №45-КГ24-123-К2\n3. Апелляционное определение Свердловского областного суда по делу №33-5678/2024\n\nРекомендации:\n- Использовать указанные статьи в обосновании жалобы\n- Сослаться на схожие решения вышестоящих судов`;
  }

  /**
   * Комплексная подготовка жалобы (все три ИИ вместе)
   */
  async prepareAppealPackage(
    verdictText: string,
    caseInfo: {
      caseNumber: string;
      courtName: string;
      verdictDate: string;
      clientName: string;
    },
    caseType: 'апелляция' | 'кассация' = 'апелляция'
  ): Promise<{
    analysis: string;
    draft: string;
    practice: string;
  }> {
    // 1. Анализ приговора
    const analysis = await this.analyzeVerdict(verdictText);
    
    // 2. Поиск практики на основе анализа
    const practice = await this.searchPractice(
      `Нарушения в приговоре ${caseInfo.courtName}`,
      caseType
    );
    
    // 3. Составление черновика жалобы
    const draft = await this.draftAppeal(analysis, caseInfo);
    
    return { analysis, draft, practice };
  }

  // Вспомогательные методы
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isAvailable(): boolean {
    return true;
  }
}

// Экспорт синглтона
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}
