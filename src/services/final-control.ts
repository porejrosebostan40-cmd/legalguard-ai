import type {
  ArbiterFinding,
  FinalControlResult,
  StrategyArgument,
} from '../core/legalguard.types';

/**
 * Последний барьер перед формированием документа.
 * Этот слой не оценивает право по существу вместо Арбитра.
 * Он проверяет целостность процесса и блокирует очевидно небезопасный результат.
 */
export function runFinalControl(
  findings: ArbiterFinding[],
  strategy: StrategyArgument[],
): FinalControlResult {
  const blockingReasons: string[] = [];
  const warnings: string[] = [];

  const accepted = findings.filter((item) => item.status === 'accepted');
  const acceptedIds = new Set(accepted.map((item) => item.id));
  const strategyIds = new Set(strategy.map((item) => item.findingId));

  if (findings.length === 0) {
    blockingReasons.push('Арбитр не вернул ни одного вывода.');
  }

  for (const argument of strategy) {
    if (!acceptedIds.has(argument.findingId)) {
      blockingReasons.push(
        `В стратегию попал вывод, не допущенный Арбитром: ${argument.findingId}.`,
      );
    }
  }

  for (const finding of accepted) {
    if (!strategyIds.has(finding.id)) {
      warnings.push(`Принятый Арбитром вывод не использован в стратегии: ${finding.id}.`);
    }
  }

  for (const finding of findings) {
    if (finding.status === 'needs_review') {
      warnings.push(`Требует дополнительной проверки: ${finding.id}.`);
    }
    if (finding.status === 'rejected' && strategyIds.has(finding.id)) {
      blockingReasons.push(`Отклонённый вывод обнаружен в стратегии: ${finding.id}.`);
    }
  }

  return {
    passed: blockingReasons.length === 0,
    blockingReasons,
    warnings,
    checkedFindingIds: findings.map((finding) => finding.id),
  };
}
