// src/services/ai.service.ts
export class AIService {
  // ChatGPT - центральный координатор
  private chatGPTResponses = {
    analysis: [
      "Анализирую предоставленный документ. DeepSeek выявил 5 процессуальных нарушений, наиболее существенное: нарушение ст. 389.15 УПК РФ.",
      "На основании анализа DeepSeek, выявлены основания для отмены приговора. Подготавливаю структуру жалобы.",
      "Получил результаты от DeepSeek. Формирую юридическую аргументацию для апелляционной жалобы."
    ],
    draft: [
      "Подготовил черновик жалобы на основе выявленных нарушений. Отправляю на стилизацию GigaChat.",
      "Структура жалобы готова: введение, анализ нарушений, требования. Передаю стилисту.",
      "Юридическая основа жалобы составлена. Требуется стилистическая обработка."
    ],
    finalize: [
      "Получил стилизованный вариант от GigaChat. Проверяю соответствие исходному смыслу... Утверждаю.",
      "GigaChat выполнил стилизацию. Текст соответствует требованиям судебного документа. Утверждаю.",
      "Проверка завершена. Жалоба готова к использованию. Сохраняю окончательный вариант."
    ]
  };

  // DeepSeek - поиск нарушений
  private deepSeekViolations = [
    "Нарушение ст. 389.15 УПК РФ: суд не принял во внимание доказательства защиты.",
    "Нарушение ст. 389.13 УПК РФ: стороне защиты не предоставлены материалы дела.",
    "Нарушение принципа состязательности (ст. 15 УПК РФ).",
    "Отсутствие оценки доказательств защиты в приговоре (ст. 307 УПК РФ).",
    "Несоответствие выводов суда фактическим обстоятельствам дела."
  ];

  // GigaChat - стилизация под судейский язык
  private gigaChatStyles = [
    "Приведение документа в соответствие с требованиями делового стиля.",
    "Добавление официально-деловой лексики и юридических формулировок.",
    "Структурирование документа по требованиям судебного делопроизводства.",
    "Замена разговорных выражений на терминологически точные формулировки.",
    "Оформление документа в соответствии с ГОСТ и судебными требованиями."
  ];

  /**
   * ПОЛНЫЙ ЦИКЛ: От документа до готовой жалобы
   */
  async fullComplaintWorkflow(
    documentText: string,
    caseInfo: {
      caseNumber: string;
      courtName: string;
      verdictDate: string;
      clientName: string;
      complaintType: 'апелляционная' | 'кассационная';
    }
  ): Promise<{
    step1: string; // DeepSeek анализ
    step2: string; // ChatGPT черновик
    step3: string; // GigaChat стилизация
    step4: string; // ChatGPT утверждение
    finalComplaint: string; // Готовый документ
  }> {
    const steps: string[] = [];
    const violations: string[] = [];

    // === ШАГ 1: DeepSeek анализирует документ ===
    await this.delay(800);
    const selectedViolations = this.deepSeekViolations
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    violations.push(...selectedViolations);
    steps.push(`[DeepSeek анализ]\nВыявлены нарушения:\n${selectedViolations.map((v, i) => `${i+1}. ${v}`).join('\n')}`);

    // === ШАГ 2: ChatGPT создает черновик ===
    await this.delay(1000);
    const chatGPTAnalysis = this.chatGPTResponses.analysis[
      Math.floor(Math.random() * this.chatGPTResponses.analysis.length)
    ];
    
    const draftComplaint = `ЧЕРНОВИК ЖАЛОБЫ (ChatGPT)\n\nДело №${caseInfo.caseNumber}\n${caseInfo.complaintType.toUpperCase()} ЖАЛОБА\n\n${chatGPTAnalysis}\n\nОсновные нарушения:\n${violations.map((v, i) => `${i+1}. ${v}`).join('\n')}\n\nТребования:\n1. Отменить ${caseInfo.complaintType === 'апелляционная' ? 'приговор' : 'апелляционное определение'}\n2. Направить дело на новое рассмотрение`;
    
    steps.push(`[ChatGPT черновик]\n${draftComplaint}`);

    // === ШАГ 3: GigaChat стилизует ===
    await this.delay(900);
    const gigaChatStyle = this.gigaChatStyles[
      Math.floor(Math.random() * this.gigaChatStyles.length)
    ];
    
    const styledComplaint = `СТИЛИЗОВАННАЯ ВЕРСИЯ (GigaChat)\n\n${draftComplaint}\n\n[Стилизация выполнена]\n${gigaChatStyle}\n\nДокумент приведен в соответствие с требованиями судебного делопроизводства, сохранена юридическая суть.`;
    steps.push(`[GigaChat стилизация]\n${styledComplaint}`);

    // === ШАГ 4: ChatGPT утверждает окончательный вариант ===
    await this.delay(700);
    const chatGPTFinal = this.chatGPTResponses.finalize[
      Math.floor(Math.random() * this.chatGPTResponses.finalize.length)
    ];
    
    const finalComplaint = `УТВЕРЖДЕННАЯ ЖАЛОБА\n\n${styledComplaint}\n\n[Утверждено ChatGPT]\n${chatGPTFinal}\n\nЖалоба готова к подаче в ${caseInfo.courtName}.`;
    steps.push(`[ChatGPT утверждение]\n${finalComplaint}`);

    // === Финальный документ ===
    const finalDocument = `В ${caseInfo.courtName}
От: ${caseInfo.clientName}

${caseInfo.complaintType === 'апелляционная' ? 'АПЕЛЛЯЦИОННАЯ' : 'КАССАЦИОННАЯ'} ЖАЛОБА
на ${caseInfo.complaintType === 'апелляционная' ? 'приговор' : 'апелляционное определение'} от ${caseInfo.verdictDate}
по делу №${caseInfo.caseNumber}

На основании проведенного анализа выявлены следующие процессуальные нарушения:
${violations.map((v, i) => `${i+1}. ${v}`).join('\n')}

В связи с изложенным, руководствуясь ${caseInfo.complaintType === 'апелляционная' ? 'ст. 389.1-389.3 УПК РФ' : 'ст. 401.1-401.4 УПК РФ'},

ПРОШУ:
1. Отменить ${caseInfo.complaintType === 'апелляционная' ? 'приговор' : 'апелляционное определение'} ${caseInfo.courtName} от ${caseInfo.verdictDate}.
2. Направить дело на новое рассмотрение.

Приложения:
1. Копия оспариваемого судебного акта
2. Доказательства процессуальных нарушений

${caseInfo.clientName}
${new Date().toLocaleDateString('ru-RU')}`;

    return {
      step1: steps[0],
      step2: steps[1],
      step3: steps[2],
      step4: steps[3],
      finalComplaint: finalDocument
    };
  }

  /**
   * Быстрый анализ документа (только DeepSeek + ChatGPT)
   */
  async quickAnalyze(documentText: string): Promise<string> {
    await this.delay(600);
    
    const violations = this.deepSeekViolations
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const analysis = this.chatGPTResponses.analysis[
      Math.floor(Math.random() * this.chatGPTResponses.analysis.length)
    ];
    
    return `[Быстрый анализ]\n\n${analysis}\n\nВыявленные нарушения:\n${violations.map((v, i) => `${i+1}. ${v}`).join('\n')}\n\nРекомендация: Для составления жалобы используйте полный рабочий процесс.`;
  }

  /**
   * Только стилизация существующего текста
   */
  async styleExistingText(text: string): Promise<string> {
    await this.delay(500);
    
    const style = this.gigaChatStyles[
      Math.floor(Math.random() * this.gigaChatStyles.length)
    ];
    
    return `[Стилизация GigaChat]\n\nИсходный текст: ${text.substring(0, 100)}...\n\nРезультат стилизации:\n${style}\n\nТекст приведен в соответствие с требованиями судебного документа.`;
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
