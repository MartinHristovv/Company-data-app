import { sortCompanies } from '../logic/sortEngine';
import { COMPANIES } from '../data/dataset';

const SIZE_ORDER = { Small: 0, Medium: 1, Large: 2 } as const;

describe('SortEngine', () => {
  describe('null sortField', () => {
    it('returns the same array reference when sortField is null', () => {
      const result = sortCompanies(COMPANIES, null, 'asc');
      expect(result).toBe(COMPANIES);
    });
  });

  describe('does not mutate input', () => {
    it('returns a new array, leaving original order intact', () => {
      const copy = [...COMPANIES];
      sortCompanies(COMPANIES, 'revenue', 'asc');
      expect(COMPANIES.map((c) => c.id)).toEqual(copy.map((c) => c.id));
    });
  });

  describe('numeric sort — revenue', () => {
    it('sorts by revenue ascending', () => {
      const result = sortCompanies(COMPANIES, 'revenue', 'asc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i].financials.revenue).toBeGreaterThanOrEqual(
          result[i - 1].financials.revenue
        );
      }
    });

    it('sorts by revenue descending', () => {
      const result = sortCompanies(COMPANIES, 'revenue', 'desc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i].financials.revenue).toBeLessThanOrEqual(
          result[i - 1].financials.revenue
        );
      }
    });
  });

  describe('numeric sort — founded_year', () => {
    it('sorts by founded_year ascending', () => {
      const result = sortCompanies(COMPANIES, 'founded_year', 'asc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i].founded_year).toBeGreaterThanOrEqual(result[i - 1].founded_year);
      }
    });
  });

  describe('string sort — name', () => {
    it('sorts by name ascending (locale-aware)', () => {
      const result = sortCompanies(COMPANIES, 'name', 'asc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i].name.localeCompare(result[i - 1].name)).toBeGreaterThanOrEqual(0);
      }
    });

    it('sorts by name descending', () => {
      const result = sortCompanies(COMPANIES, 'name', 'desc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i].name.localeCompare(result[i - 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('enum sort — size', () => {
    it('sorts by size ascending: Small < Medium < Large', () => {
      const result = sortCompanies(COMPANIES, 'size', 'asc');
      for (let i = 1; i < result.length; i++) {
        expect(SIZE_ORDER[result[i].details.size]).toBeGreaterThanOrEqual(
          SIZE_ORDER[result[i - 1].details.size]
        );
      }
    });

    it('sorts by size descending: Large > Medium > Small', () => {
      const result = sortCompanies(COMPANIES, 'size', 'desc');
      for (let i = 1; i < result.length; i++) {
        expect(SIZE_ORDER[result[i].details.size]).toBeLessThanOrEqual(
          SIZE_ORDER[result[i - 1].details.size]
        );
      }
    });
  });

  describe('net_income sort', () => {
    it('sorts by net_income ascending (handles negatives)', () => {
      const result = sortCompanies(COMPANIES, 'net_income', 'asc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i].financials.net_income).toBeGreaterThanOrEqual(
          result[i - 1].financials.net_income
        );
      }
    });
  });
});
