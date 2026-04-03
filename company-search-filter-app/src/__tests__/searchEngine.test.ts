import { searchCompanies } from '../logic/searchEngine';
import { parseQuery } from '../logic/queryParser';
import { COMPANIES } from '../data/dataset';

describe('SearchEngine', () => {
  describe('short-circuit behaviour', () => {
    it('returns full dataset when query is empty', () => {
      const result = searchCompanies(COMPANIES, parseQuery(''));
      expect(result).toHaveLength(COMPANIES.length);
    });

    it('returns full dataset when free text is under 3 chars and no qualifiers', () => {
      const result = searchCompanies(COMPANIES, parseQuery('ab'));
      expect(result).toHaveLength(COMPANIES.length);
    });

    it('does NOT short-circuit when a field filter is present even with short free text', () => {
      const result = searchCompanies(COMPANIES, parseQuery('industry:Tech'));
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(COMPANIES.length);
    });
  });

  describe('free-text partial matching', () => {
    it('matches by partial company name (case-insensitive)', () => {
      const result = searchCompanies(COMPANIES, parseQuery('apple'));
      expect(result.some((c) => c.name === 'Apple Inc.')).toBe(true);
    });

    it('matches "Amaz" against no company (none in dataset)', () => {
      const result = searchCompanies(COMPANIES, parseQuery('Amaz'));
      expect(result).toHaveLength(0);
    });

    it('matches by CEO name', () => {
      const result = searchCompanies(COMPANIES, parseQuery('Tim Cook'));
      expect(result.some((c) => c.details.ceo_name === 'Tim Cook')).toBe(true);
    });

    it('matches by country — all results contain Germany somewhere in their data', () => {
      const result = searchCompanies(COMPANIES, parseQuery('Germany'));
      // All results must have Germany in at least one searchable field
      result.forEach((c) => {
        const fields = [c.country, ...c.offices.map((o) => o.country), ...c.board_members.map((b) => b.name + b.role)];
        expect(fields.some((f) => f.toLowerCase().includes('germany'))).toBe(true);
      });
    });

    it('matches by board member name', () => {
      // Arthur Levinson is a board member of Apple Inc.
      const result = searchCompanies(COMPANIES, parseQuery('Arthur Levinson'));
      expect(result.some((c) => c.name === 'Apple Inc.')).toBe(true);
    });

    it('matches by office city', () => {
      // Wolfsburg is the HQ office city of Volkswagen
      const result = searchCompanies(COMPANIES, parseQuery('Wolfsburg'));
      expect(result.some((c) => c.name === 'Volkswagen AG')).toBe(true);
    });
  });

  describe('field filter matching', () => {
    it('filters by industry:Retail — only Retail companies returned', () => {
      const result = searchCompanies(COMPANIES, parseQuery('industry:Retail'));
      expect(result.length).toBeGreaterThan(0);
      result.forEach((c) => expect(c.industry.toLowerCase()).toBe('retail'));
    });

    it('filters by size:Small — only Small companies returned', () => {
      const result = searchCompanies(COMPANIES, parseQuery('size:Small'));
      result.forEach((c) => expect(c.details.size).toBe('Small'));
    });

    it('field filter is case-insensitive', () => {
      const lower = searchCompanies(COMPANIES, parseQuery('industry:tech'));
      const upper = searchCompanies(COMPANIES, parseQuery('industry:Tech'));
      expect(lower.map((c) => c.id).sort()).toEqual(upper.map((c) => c.id).sort());
    });
  });

  describe('numeric comparison matching', () => {
    it('revenue>100000000000 returns only companies with revenue > 100B', () => {
      const result = searchCompanies(COMPANIES, parseQuery('revenue>100000000000'));
      result.forEach((c) => expect(c.financials.revenue).toBeGreaterThan(100_000_000_000));
    });

    it('founded_year>=2010 returns only companies founded 2010 or later', () => {
      const result = searchCompanies(COMPANIES, parseQuery('founded_year>=2010'));
      result.forEach((c) => expect(c.founded_year).toBeGreaterThanOrEqual(2010));
    });

    it('founded_year<1900 returns only companies founded before 1900', () => {
      const result = searchCompanies(COMPANIES, parseQuery('founded_year<1900'));
      result.forEach((c) => expect(c.founded_year).toBeLessThan(1900));
    });
  });

  describe('AND conjunction across query types', () => {
    it('industry:Retail revenue>50000 returns only Retail companies with revenue > 50000', () => {
      const result = searchCompanies(COMPANIES, parseQuery('industry:Retail revenue>50000'));
      result.forEach((c) => {
        expect(c.industry.toLowerCase()).toBe('retail');
        expect(c.financials.revenue).toBeGreaterThan(50000);
      });
    });

    it('returns empty array when no company satisfies all conditions', () => {
      // No Tech company with revenue < 0
      const result = searchCompanies(COMPANIES, parseQuery('industry:Tech revenue<0'));
      expect(result).toHaveLength(0);
    });
  });
});
