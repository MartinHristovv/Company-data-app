import { Company } from '../data/types';

export interface FilterState {
  industries: string[];
  companyTypes: ('Public' | 'Private')[];
  sizes: ('Small' | 'Medium' | 'Large')[];
  revenueMin: number | null;
  revenueMax: number | null;
  foundedYearMin: number | null;
  foundedYearMax: number | null;
}

export const DEFAULT_FILTERS: FilterState = {
  industries: [],
  companyTypes: [],
  sizes: [],
  revenueMin: null,
  revenueMax: null,
  foundedYearMin: null,
  foundedYearMax: null,
};

export type SortField =
  | 'name'
  | 'founded_year'
  | 'revenue'
  | 'net_income'
  | 'company_type'
  | 'size'
  | null;

export type SortDirection = 'asc' | 'desc';

export interface FieldFilter {
  field: string;
  value: string;
}

export interface NumericComparison {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '=';
  value: number;
}

export interface ParsedQuery {
  freeText: string[];
  fieldFilters: FieldFilter[];
  numericComparisons: NumericComparison[];
}

export interface AppState {
  searchQuery: string;
  parsedQuery: ParsedQuery;
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  results: Company[];
}

export type AppAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: { field: SortField; direction: SortDirection } };

/** Returns the number of active filter dimensions (for badge display). */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.industries.length > 0) count++;
  if (filters.companyTypes.length > 0) count++;
  if (filters.sizes.length > 0) count++;
  if (filters.revenueMin !== null || filters.revenueMax !== null) count++;
  if (filters.foundedYearMin !== null || filters.foundedYearMax !== null) count++;
  return count;
}
