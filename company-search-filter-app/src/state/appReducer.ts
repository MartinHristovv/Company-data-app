import { AppState, AppAction, DEFAULT_FILTERS, ParsedQuery } from './types';
import { COMPANIES } from '../data/dataset';
import { parseQuery } from '../logic/queryParser';
import { searchCompanies } from '../logic/searchEngine';
import { filterCompanies } from '../logic/filterEngine';
import { sortCompanies } from '../logic/sortEngine';

export const initialState: AppState = {
  searchQuery: '',
  parsedQuery: { freeText: [], fieldFilters: [], numericComparisons: [] },
  filters: DEFAULT_FILTERS,
  sortField: null,
  sortDirection: 'asc',
  results: COMPANIES,
};

function computeResults(
  searchQuery: string,
  filters: AppState['filters'],
  sortField: AppState['sortField'],
  sortDirection: AppState['sortDirection']
): { parsedQuery: ParsedQuery; results: AppState['results'] } {
  const parsedQuery = parseQuery(searchQuery);
  const searched = searchCompanies(COMPANIES, parsedQuery);
  const filtered = filterCompanies(searched, filters);
  const results = sortCompanies(filtered, sortField, sortDirection);
  return { parsedQuery, results };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SEARCH': {
      const searchQuery = action.payload;
      const { parsedQuery, results } = computeResults(
        searchQuery,
        state.filters,
        state.sortField,
        state.sortDirection
      );
      return { ...state, searchQuery, parsedQuery, results };
    }

    case 'SET_FILTER': {
      const filters = { ...state.filters, ...action.payload };
      const { parsedQuery, results } = computeResults(
        state.searchQuery,
        filters,
        state.sortField,
        state.sortDirection
      );
      return { ...state, filters, parsedQuery, results };
    }

    case 'CLEAR_FILTERS': {
      const filters = DEFAULT_FILTERS;
      const { parsedQuery, results } = computeResults(
        state.searchQuery,
        filters,
        state.sortField,
        state.sortDirection
      );
      return { ...state, filters, parsedQuery, results };
    }

    case 'SET_SORT': {
      const sortField = action.payload.field;
      const sortDirection = action.payload.direction;
      const { parsedQuery, results } = computeResults(
        state.searchQuery,
        state.filters,
        sortField,
        sortDirection
      );
      return { ...state, sortField, sortDirection, parsedQuery, results };
    }

    default:
      return state;
  }
}
