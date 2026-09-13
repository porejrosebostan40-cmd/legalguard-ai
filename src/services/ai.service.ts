import type { CaseInfo, LegalGuardResult } from '../core/legalguard.types';
import { legalGuardPipeline } from './legalguard.pipeline';

/**
 * Единая точка входа для интерфейса приложения.
 * Неподключённый ИИ не имитируется: результат строится только из конвейера.
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

  async analyzeVerdict(documentText: string): Promise<string> {
    const result = await this.quickAnalyze(documentText);
    return this.formatResult(result);
  }

  async draftAppeal(request: string, caseInfo: Omit<CaseInfo, 'complaintType'>): Promise<string> {
    const result = await this.fullComplaintWorkflow(request, {
      ...caseInfo,
      complaintType: 'апелляционная',
    });
    return this.formatResult(result);
  }

  async searchPractice(request: string, complaintType: CaseInfo['complaintType']): Promise<string> {
    const result = await this.fullComplaintWorkflow(request, {
      caseNumber: '',
      courtName: '',
      verdictDate: '',
      clientName: '',
      complaintType,
    });
    return this.formatResult(result);
  }

  isAvailable(): boolean {
    return true;
  }

  private formatResult(result: LegalGuardResult): string {
    const lines = [`Запуск: ${result.runId}`];
    for (const item of result.trace) {
      lines.push(`[${item.status.toUpperCase()}] ${item.code} ${item.message}`);
    }

    if (result.strategy.length > 0) {
      lines.push('', 'Допущенные основания:');
      result.strategy.forEach((item) => {
        lines.push(`${item.position}. ${item.heading}`, item.argument);
      });
    }

    if (result.finalControl?.warnings.length) {
      lines.push('', 'Предупреждения финального контроля:');
      lines.push(...result.finalControl.warnings.map((warning) => `— ${warning}`));
    }

    return lines.join('\n');
  }
}

let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}
