import type { CaseInfo, LegalGuardResult } from '../core/legalguard.types';
import { legalGuardPipeline } from './legalguard.pipeline';

/**
 * Единая точка входа для интерфейса приложения.
 * В отличие от старой реализации здесь нет случайных/заготовленных
 * юридических выводов: неподключённый ИИ не имитируется.
 */
export class AIService {
  async fullComplaintWorkflow(
    documentText: string,
    caseInfo: CaseInfo,
  ): Promise<LegalGuardResult> {
    return legalGuardPipeline.run(documentText, caseInfo);
  }

  async quickAnalyze(documentText: string): Promise<LegalGuardResult> {
    return legalGuardPipeline.run(documentText, {
      caseNumber: '',
      courtName: '',
      verdictDate: '',
      clientName: '',
      complaintType: 'апелляционная',
    });
  }

  isAvailable(): boolean {
    return true;
  }
}

let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}
