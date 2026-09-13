import type {
  ArbiterFinding,
  FinalControlResult,
  StrategyArgument,
} from '../core/legalguard.types';

/**
 * Последний барьер перед формированием документа.
 * Арбитр оценивает содержание; этот слой проверяет целостность процесса
 * и не позволяет неподтверждённым выводам попасть в итоговую стратегию.
 */
export function runFinalControl(
  findings: ArbiterFinding[],
  strategy: StrategyArgument[],
): FinalControlResult {
  const blockingReasons: string[] = [];
  const warnings: string[] = [];

  const accepted = findings.filter((item) => item.status === 'accepted');
  const acceptedIds = new Set(accepted.map((item) => item.id));
  const knownIds = new Set(findings.map((item) => item.id));
  const strategyIds = new Set(strategy.map((item) => item.findingId));

  if (findings.length === 0) {
    blockingReasons.push('Арбитр не вернул ни одного вывода.');
  }

  const duplicateStrategyIds = strategy
    .map((item) => item.findingId)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateStrategyIds.length > 0) {
    blockingReasons.push(
      `В стратегии обнаружено повторное использование вывода: ${[...new Set(duplicateStrategyIds)].join(', ')}.`,
    );
  }

  for (const argument of strategy) {
    if (!knownIds.has(argument.findingId)) {
      blockingReasons.push(`Стратегия ссылается на неизвестный вывод: ${argument.findingId}.`);
    } else if (!acceptedIds.has(argument.findingId)) {
      blockingReasons.push(
        `В стратегию попал вывод, не допущенный Арбитром: ${argument.findingId}.`,
      );
    }
  }

  for (const acceptedFinding of accepted) {
    if (!strategyIds.has(acceptedFinding.id)) {
      warnings.push(
        `Принятый Арбитром вывод не использован в стратегии: ${acceptedFinding.id}.`,
      );
    }
  }

  for (const finding of findings) {
    if (finding.status === 'needs_review') {
      blockingReasons.push(`Вывод требует дополнительной проверки: ${finding.id}.`);
    }
    if (finding.status === 'pending') {
      blockingReasons.push(`Вывод остался без решения Арбитра: ${finding.id}.`);
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
