import { ParsedQuery, FieldFilter, NumericComparison } from '../state/types';

const KNOWN_FIELDS = new Set([
  'name',
  'country',
  'industry',
  'founded_year',
  'revenue',
  'net_income',
  'company_type',
  'size',
  'ceo_name',
  'headquarters',
  'year',
]);

// Matches: field>=value, field<=value, field>value, field<value, field=value
// Also handles optional spaces: "revenue > 5000" or "revenue>5000"
const NUMERIC_OPERATORS_RE = /^([a-zA-Z_]+)\s*(>=|<=|>|<|=)\s*(.+)$/;
// Matches: field:value or "field : value" (spaces around colon)
const FIELD_FILTER_RE = /^([a-zA-Z_]+)\s*:\s*(.+)$/;

/**
 * Normalise the raw input before tokenising:
 * - Collapse "industry : Retail" → "industry:Retail"
 * - Collapse "revenue > 5000" → "revenue>5000"
 * This lets users type with or without spaces around operators.
 */
function normaliseInput(input: string): string {
  // Collapse spaces around numeric operators (>=, <=, >, <, =)
  let out = input.replace(/([a-zA-Z_]+)\s*(>=|<=|>|<|=)\s*(\S)/g, '$1$2$3');
  // Collapse spaces around colon
  out = out.replace(/([a-zA-Z_]+)\s*:\s*(\S)/g, '$1:$2');
  return out;
}

export function parseQuery(input: string): ParsedQuery {
  const freeText: string[] = [];
  const fieldFilters: FieldFilter[] = [];
  const numericComparisons: NumericComparison[] = [];

  const normalised = normaliseInput(input);
  const tokens = normalised.trim().split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    // Try numeric comparison first (>=, <= must be checked before > and <)
    const numericMatch = token.match(NUMERIC_OPERATORS_RE);
    if (numericMatch) {
      const [, field, operator, rawValue] = numericMatch;
      if (KNOWN_FIELDS.has(field)) {
        const num = Number(rawValue);
        if (!isNaN(num) && rawValue.trim() !== '') {
          numericComparisons.push({
            field,
            operator: operator as NumericComparison['operator'],
            value: num,
          });
          continue;
        }
      }
    }

    // Try field:value filter
    const fieldMatch = token.match(FIELD_FILTER_RE);
    if (fieldMatch) {
      const [, field, value] = fieldMatch;
      if (KNOWN_FIELDS.has(field)) {
        fieldFilters.push({ field, value });
        continue;
      }
    }

    // Fall through to free text
    freeText.push(token);
  }

  return { freeText, fieldFilters, numericComparisons };
}

export function formatParsedQuery(pq: ParsedQuery): string {
  const parts: string[] = [];

  for (const ft of pq.freeText) {
    parts.push(ft);
  }
  for (const ff of pq.fieldFilters) {
    parts.push(`${ff.field}:${ff.value}`);
  }
  for (const nc of pq.numericComparisons) {
    parts.push(`${nc.field}${nc.operator}${nc.value}`);
  }

  return parts.join(' ');
}
