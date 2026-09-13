import type {
  ArbiterFinding,
  CaseInfo,
  DeepSeekFinding,
  LegalGuardResult,
  PipelineTraceEntry,
  StrategyArgument,
} from '../core/legalguard.types';
import { providers } from './ai/providers';
import { runFinalControl } from './final-control';

function trace(
  code: string,
  stage: PipelineTraceEntry['stage'],
  status: PipelineTraceEntry['status'],
  message: string,
): PipelineTraceEntry {
  return {
    code,
    stage,
    status,
    message,
    timestamp: new Date().toISOString(),
  };
}

export class LegalGuardPipeline {
  async run(documentText: string, _caseInfo: CaseInfo): Promise<LegalGuardResult> {
    const runId = `LG-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
    const traceLog: PipelineTraceEntry[] = [];

    if (!documentText.trim()) {
      traceLog.push(trace('01', 'documents', 'error', 'Исходный судебный документ отсутствует.'));
      return this.emptyResult(runId, traceLog);
    }

    traceLog.push(trace('01', 'documents', 'ok', 'Исходный документ получен и передан в конвейер.'));

    let findings: DeepSeekFinding[] = [];
    try {
      findings = await providers.deepSeek.analyze(documentText);
      traceLog.push(trace('02', 'analyst', 'ok', `DeepSeek вернул ${findings.length} потенциальных оснований.`));
    } catch (error) {
      traceLog.push(trace('02', 'analyst', 'warning', this.errorMessage(error)));
      return this.emptyResult(runId, traceLog, findings);
    }

    let arbiterFindings: ArbiterFinding[] = [];
    try {
      arbiterFindings = await providers.chatGPT.arbitrate(findings, documentText);
      traceLog.push(trace('03', 'arbiter', 'ok', 'ChatGPT проверил результаты аналитика.'));
    } catch (error) {
      traceLog.push(trace('03', 'arbiter', 'warning', this.errorMessage(error)));
      return this.emptyResult(runId, traceLog, findings);
    }

    const accepted = arbiterFindings.filter((item) => item.status === 'accepted');
    const strategy: StrategyArgument[] = accepted.map((item, index) => ({
      findingId: item.id,
      position: index + 1,
      heading: item.claim,
      argument: item.reasoning,
      requestedRelief: item.appealCassationRelevance,
    }));

    traceLog.push(trace(
      '04',
      'strategist',
      'ok',
      `В стратегию допущено ${strategy.length} оснований; отклонённые выводы не включены.`,
    ));

    const finalControl = runFinalControl(arbiterFindings, strategy);
    traceLog.push(trace(
      '05',
      'final-control',
      finalControl.passed ? 'ok' : 'error',
      finalControl.passed
        ? 'Финальный контроль пройден. Результат может перейти к формированию документа.'
        : `Формирование документа заблокировано: ${finalControl.blockingReasons.join(' ')}`,
    ));

    return {
      runId,
      findings,
      arbiterFindings,
      strategy,
      finalControl,
      finalDocument: null,
      trace: traceLog,
      readyForSubmission: false,
    };
  }

  private emptyResult(
    runId: string,
    traceLog: PipelineTraceEntry[],
    findings: DeepSeekFinding[] = [],
  ): LegalGuardResult {
    return {
      runId,
      findings,
      arbiterFindings: [],
      strategy: [],
      finalControl: null,
      finalDocument: null,
      trace: traceLog,
      readyForSubmission: false,
    };
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Неизвестная ошибка провайдера.';
  }
}

export const legalGuardPipeline = new LegalGuardPipeline();
