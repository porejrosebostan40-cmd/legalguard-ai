```text
import { extractTextFromFile } from './fileParser';
import { LegalFacts, LegalViolation } from './types';
import { templates } from './templates';

class LegalRuleEngine {
  private rules = [
    {
      name: 'SPECIAL_PROCEDURE_LIMIT',
      condition: (t: string) => /ст\.316\s*УПК/iu.test(t),
      action: (): LegalViolation => ({
        type: 'PROCEDURAL',
        article: 'УПК РФ ст.316-317',
        description: 'В особом порядке нельзя оспаривать факты',
        recommendation: 'Ограничьте жалобу на вопросы права',
      }),
    },
    {
      name: 'PARTIAL_EXCLUSION',
      condition: (t: string) => {
        const ex = t.match(/исключается\s*п\.\s*«[а-г]»/giu);
        return ex && ex.length > 0 && ex.length < 4;
      },
      action: (): LegalViolation => ({
        type: 'SUBSTANTIVE',
        article: 'УК РФ ч.2 ст.158',
        description: 'Исключён часть признаков – переквалификация не требуется',
        recommendation: 'Не требуйте переквалификации на ч.1',
      }),
    },
  ];

  check(text: string): LegalViolation[] {
    return this.rules.filter((r) => r.condition(text)).map((r) => r.action());
  }
}

function extractFacts(text: string): LegalFacts {
  return {
    article: text.match(/ст\.?\s*(\d+)/iu)?.[1] ?? '',
    part: text.match(/ч\.?\s*(\d+)/iu)?.[1] ?? '',
    excludedPoints: Array.from(text.matchAll(/исключается\s*п\.\s*«([а-г])»/giu)).map((m) => m[1]),
    mentionedPlace: text.includes('жилище') ? 'жилище' : text.includes('квартира') ? 'квартира' : '',
    punishment: text.match(/наказание.*?(лишение|штраф|условно)/iu)?.[0] ?? '',
  };
}

function buildDraft(facts: LegalFacts, violations: LegalViolation[], userGoal: string): string {
  const tpl = templates[userGoal] || templates.appeal;
  return tpl
    .replace('{{article}}', facts.article)
    .replace('{{part}}', facts.part)
    .replace('{{violations}}', violations.map((v, i) => `${i + 1}. ${v.article}: ${v.description}`).join('\n'))
    .replace('{{recommendations}}', violations.map((v) => v.recommendation).join('\n'));
}

export async function analyze(userGoal: string, file?: File, text?: string): Promise<string> {
  let sourceText = '';
  if (file) sourceText = await extractTextFromFile(file);
  else if (text) sourceText = text;
  else throw new Error('Необходимо загрузить файл или ввести текст');

  const facts = extractFacts(sourceText);
  const engine = new LegalRuleEngine();
  const violations = engine.check(sourceText);
  const draft = buildDraft(facts, violations, userGoal);

  const styled = await gigaStyle(draft);
  const final = await gptFinal(styled);
  return final;
}

async function gigaStyle(text: string): Promise<string> {
  const model = await loadWASM('giga-stylist-q4.wasm');
  const prompt = `Ты помощник адвоката. Отредактируй текст, убери повторы, добавь нужные клише, НЕ меняй правовую суть. Верни только отредактированный текст, без комментариев.\n\n${text}`;
  return model.generate(prompt, { maxTokens: 1024 });
}

async function gptFinal(text: string): Promise<string> {
  const model = await loadWASM('gpt-final-q4.wasm');
  const prompt = `Ты главный юрист. Проверь связность, нумерацию, добавь вводные/заключительные фразы. Верни финальный текст жалобы.\n\n${text}`;
  return model.generate(prompt, { maxTokens: 1536 });
}

async function loadWASM(url: string) {
  const { AutoModel, AutoTokenizer } = await import('@xenova/transformers');
  const model = await AutoModel.from_pretrained(url, { quantized: true });
  const tokenizer = await AutoTokenizer.from_pretrained(url);
  return {
    generate: async (prompt: string, opts: { maxTokens: number }) => {
      const inputs = tokenizer(prompt);
      const outputs = await model.generate(inputs, { max_new_tokens: opts.maxTokens });
      return tokenizer.decode(outputs[0], { skip_special_tokens: true });
    },
  };
}
```
