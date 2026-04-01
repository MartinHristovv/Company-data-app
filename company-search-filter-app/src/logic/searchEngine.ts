import { Company } from '../data/types';
import { ParsedQuery, NumericComparison } from '../state/types';

// Numeric fields that support numeric comparisons
const NUMERIC_FIELDS = new Set(['founded_year', 'revenue', 'net_income', 'year']);

function getFieldValue(company: Company, field: string): string | number | undefined {
  switch (field) {
    case 'name':           return company.name;
    case 'country':        return company.country;
    case 'industry':       return company.industry;
    case 'founded_year':   return company.founded_year;
    case 'revenue':        return company.financials.revenue;
    case 'net_income':     return company.financials.net_income;
    case 'year':           return company.financials.year;
    case 'company_type':   return company.details.company_type;
    case 'size':           return company.details.size;
    case 'ceo_name':       return company.details.ceo_name;
    case 'headquarters':   return company.details.headquarters;
    default:               return undefined;
  }
}

function getSearchableStrings(company: Company): string[] {
  const base = [
    company.name,
    company.country,
    company.industry,
    String(company.founded_year),
    company.financials.revenue.toString(),
    company.financials.net_income.toString(),
    company.financials.year.toString(),
    company.details.company_type,
    company.details.size,
    company.details.ceo_name,
    company.details.headquarters,
  ];

  // Include board member names and roles
  for (const bm of company.board_members) {
    base.push(bm.name, bm.role);
  }

  // Include office cities and countries
  for (const office of company.offices) {
    base.push(office.city, office.country, office.type);
  }

  return base;
}

function satisfiesNumericComparison(company: Company, nc: NumericComparison): boolean {
  const fieldVal = getFieldValue(company, nc.field);

  // If the field is not a known numeric field, skip the comparison (treat as pass)
  if (!NUMERIC_FIELDS.has(nc.field)) {
    return true;
  }

  const numVal = typeof fieldVal === 'number' ? fieldVal : Number(fieldVal);
  if (isNaN(numVal)) {
    // Non-numeric value on a numeric field — skip comparison
    return true;
  }

  switch (nc.operator) {
    case '>':  return numVal > nc.value;
    case '<':  return numVal < nc.value;
    case '>=': return numVal >= nc.value;
    case '<=': return numVal <= nc.value;
    case '=':  return numVal === nc.value;
    default:   return true;
  }
}

function matchesFreeText(company: Company, tokens: string[]): boolean {
  if (tokens.length === 0) return true;

  const searchableFields = getSearchableStrings(company);

  // At least one token must partially match (case-insensitive) any searchable field
  for (const token of tokens) {
    const lowerToken = token.toLowerCase();
    let tokenMatched = false;

    for (let i = 0; i < searchableFields.length; i++) {
      if (searchableFields[i].toLowerCase().includes(lowerToken)) {
        tokenMatched = true;
        break;
      }
    }

    if (!tokenMatched) {
      return false;
    }
  }

  return true;
}

function matchesFieldFilters(company: Company, fieldFilters: ParsedQuery['fieldFilters']): boolean {
  for (const ff of fieldFilters) {
    const fieldVal = getFieldValue(company, ff.field);
    if (fieldVal === undefined) {
      // Unknown field — treat as no match
      return false;
    }
    if (String(fieldVal).toLowerCase() !== ff.value.toLowerCase()) {
      return false;
    }
  }
  return true;
}

export function searchCompanies(companies: Company[], query: ParsedQuery): Company[] {
  const { freeText, fieldFilters, numericComparisons } = query;

  // Short-circuit: if no meaningful query, return all companies unchanged
  const combinedFreeTextLength = freeText.join('').length;
  if (combinedFreeTextLength < 3 && fieldFilters.length === 0 && numericComparisons.length === 0) {
    return companies;
  }

  const results: Company[] = [];

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];

    // Check free-text: at least one token must match at least one searchable field
    if (!matchesFreeText(company, freeText)) {
      continue;
    }

    // Check field filters: each must match (case-insensitive equality)
    if (!matchesFieldFilters(company, fieldFilters)) {
      continue;
    }

    // Check numeric comparisons: each must be satisfied
    let passesNumeric = true;
    for (const nc of numericComparisons) {
      if (!satisfiesNumericComparison(company, nc)) {
        passesNumeric = false;
        break;
      }
    }
    if (!passesNumeric) {
      continue;
    }

    results.push(company);
  }

  return results;
}
