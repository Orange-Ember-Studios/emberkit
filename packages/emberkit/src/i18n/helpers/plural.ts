import type { PluralForms } from '../types.js';

export function selectPluralForm(locale: string, count: number, forms: PluralForms): string {
  const rule = new Intl.PluralRules(locale).select(count);
  return forms[rule] ?? forms.other;
}

export function parsePluralMessage(message: string): PluralForms | null {
  const segments = message.split('|').map((s) => s.trim());
  if (segments.length < 2) return null;

  const forms: Partial<Record<Intl.LDMLPluralRule, string>> = {};

  for (const segment of segments) {
    const match = /^(\w+)\s+(.+)$/.exec(segment);
    if (!match) continue;
    const [, rule, text] = match;
    forms[rule as Intl.LDMLPluralRule] = text;
  }

  if (!forms.other && segments.length > 0) {
    const last = segments[segments.length - 1];
    const implicit = /^(\w+)\s+(.+)$/.exec(last);
    forms.other = implicit ? implicit[2] : last;
  }

  return forms.other ? (forms as PluralForms) : null;
}
