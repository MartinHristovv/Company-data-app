import { filterCompanies } from '../logic/filterEngine';
import { DEFAULT_FILTERS } from '../state/types';
import { COMPANIES } from '../data/dataset';

describe('FilterEngine', () => {
  describe('empty filters', () => {
    it('returns all companies when no filters are active', () => {
      const result = filterCompanies(COMPANIES, DEFAULT_FILTERS);
      expect(result).toHaveLength(COMPANIES.length);
    });
  });

  describe('industry filter', () => {
    it('filters to a single industry', () => {
      const result = filterCompanies(COMPANIES, { ...DEFAULT_FILTERS, industries: ['Tech'] });
      expect(result.length).toBeGreaterThan(0);
      result.forEach((c) => expect(c.industry).toBe('Tech'));
    });

    it('filters to multiple industries (OR within dimension)', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        industries: ['Tech', 'Finance'],
      });
      result.forEach((c) => expect(['Tech', 'Finance']).toContain(c.industry));
    });

    it('is case-insensitive', () => {
      const lower = filterCompanies(COMPANIES, { ...DEFAULT_FILTERS, industries: ['tech'] });
      const normal = filterCompanies(COMPANIES, { ...DEFAULT_FILTERS, industries: ['Tech'] });
      expect(lower.map((c) => c.id).sort()).toEqual(normal.map((c) => c.id).sort());
    });
  });

  describe('company type filter', () => {
    it('filters to Public only', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        companyTypes: ['Public'],
      });
      result.forEach((c) => expect(c.details.company_type).toBe('Public'));
    });

    it('filters to Private only', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        companyTypes: ['Private'],
      });
      result.forEach((c) => expect(c.details.company_type).toBe('Private'));
    });
  });

  describe('size filter', () => {
    it('filters to Small only', () => {
      const result = filterCompanies(COMPANIES, { ...DEFAULT_FILTERS, sizes: ['Small'] });
      result.forEach((c) => expect(c.details.size).toBe('Small'));
    });

    it('filters to multiple sizes', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        sizes: ['Small', 'Medium'],
      });
      result.forEach((c) => expect(['Small', 'Medium']).toContain(c.details.size));
    });
  });

  describe('revenue range filter', () => {
    it('applies revenueMin correctly', () => {
      const min = 10_000_000_000;
      const result = filterCompanies(COMPANIES, { ...DEFAULT_FILTERS, revenueMin: min });
      result.forEach((c) => expect(c.financials.revenue).toBeGreaterThanOrEqual(min));
    });

    it('applies revenueMax correctly', () => {
      const max = 5_000_000_000;
      const result = filterCompanies(COMPANIES, { ...DEFAULT_FILTERS, revenueMax: max });
      result.forEach((c) => expect(c.financials.revenue).toBeLessThanOrEqual(max));
    });

    it('ignores revenue range when min > max', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        revenueMin: 1_000_000_000,
        revenueMax: 100,
      });
      // Invalid range — should return all companies (no revenue filter applied)
      expect(result).toHaveLength(COMPANIES.length);
    });
  });

  describe('founded year range filter', () => {
    it('applies foundedYearMin correctly', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        foundedYearMin: 2000,
      });
      result.forEach((c) => expect(c.founded_year).toBeGreaterThanOrEqual(2000));
    });

    it('applies foundedYearMax correctly', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        foundedYearMax: 1950,
      });
      result.forEach((c) => expect(c.founded_year).toBeLessThanOrEqual(1950));
    });

    it('ignores year range when min > max', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        foundedYearMin: 2020,
        foundedYearMax: 1900,
      });
      expect(result).toHaveLength(COMPANIES.length);
    });
  });

  describe('AND conjunction across multiple filters', () => {
    it('applies industry + size together', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        industries: ['Finance'],
        sizes: ['Large'],
      });
      result.forEach((c) => {
        expect(c.industry).toBe('Finance');
        expect(c.details.size).toBe('Large');
      });
    });

    it('returns empty array when no company satisfies all filters', () => {
      const result = filterCompanies(COMPANIES, {
        ...DEFAULT_FILTERS,
        industries: ['Aerospace'],
        companyTypes: ['Public'],
      });
      // SpaceX is the only Aerospace company and it's Private
      expect(result).toHaveLength(0);
    });
  });
});
