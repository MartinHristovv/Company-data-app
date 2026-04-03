import { parseQuery, formatParsedQuery } from '../logic/queryParser';

describe('QueryParser', () => {
  describe('parseQuery — free text', () => {
    it('returns empty freeText for empty input', () => {
      const result = parseQuery('');
      expect(result.freeText).toEqual([]);
      expect(result.fieldFilters).toEqual([]);
      expect(result.numericComparisons).toEqual([]);
    });

    it('puts plain tokens into freeText', () => {
      const result = parseQuery('apple london');
      expect(result.freeText).toEqual(['apple', 'london']);
    });

    it('unrecognised field qualifier falls through to freeText', () => {
      const result = parseQuery('foo:bar');
      expect(result.freeText).toEqual(['foo:bar']);
      expect(result.fieldFilters).toHaveLength(0);
    });
  });

  describe('parseQuery — field filters', () => {
    it('parses industry:Tech into fieldFilters', () => {
      const result = parseQuery('industry:Tech');
      expect(result.fieldFilters).toEqual([{ field: 'industry', value: 'Tech' }]);
    });

    it('parses size:Large into fieldFilters', () => {
      const result = parseQuery('size:Large');
      expect(result.fieldFilters).toEqual([{ field: 'size', value: 'Large' }]);
    });

    it('handles spaces around colon: "industry: Retail"', () => {
      const result = parseQuery('industry: Retail');
      expect(result.fieldFilters).toEqual([{ field: 'industry', value: 'Retail' }]);
    });

    it('parses multiple field filters', () => {
      const result = parseQuery('industry:Finance size:Large');
      expect(result.fieldFilters).toHaveLength(2);
      expect(result.fieldFilters[0]).toEqual({ field: 'industry', value: 'Finance' });
      expect(result.fieldFilters[1]).toEqual({ field: 'size', value: 'Large' });
    });
  });

  describe('parseQuery — numeric comparisons', () => {
    it('parses revenue>5000000', () => {
      const result = parseQuery('revenue>5000000');
      expect(result.numericComparisons).toEqual([
        { field: 'revenue', operator: '>', value: 5000000 },
      ]);
    });

    it('parses founded_year>=2000', () => {
      const result = parseQuery('founded_year>=2000');
      expect(result.numericComparisons).toEqual([
        { field: 'founded_year', operator: '>=', value: 2000 },
      ]);
    });

    it('handles spaces around operator: "revenue > 50000"', () => {
      const result = parseQuery('revenue > 50000');
      expect(result.numericComparisons).toEqual([
        { field: 'revenue', operator: '>', value: 50000 },
      ]);
    });

    it('malformed numeric value falls through to freeText', () => {
      const result = parseQuery('revenue>abc');
      expect(result.freeText).toContain('revenue>abc');
      expect(result.numericComparisons).toHaveLength(0);
    });
  });

  describe('parseQuery — mixed queries', () => {
    it('parses combined query: industry:Retail revenue>50000', () => {
      const result = parseQuery('industry:Retail revenue>50000');
      expect(result.fieldFilters).toEqual([{ field: 'industry', value: 'Retail' }]);
      expect(result.numericComparisons).toEqual([
        { field: 'revenue', operator: '>', value: 50000 },
      ]);
      expect(result.freeText).toHaveLength(0);
    });

    it('separates free text from structured tokens', () => {
      const result = parseQuery('apple industry:Tech');
      expect(result.freeText).toEqual(['apple']);
      expect(result.fieldFilters).toEqual([{ field: 'industry', value: 'Tech' }]);
    });
  });

  describe('formatParsedQuery — round-trip', () => {
    it('round-trip: parse → format → parse produces equivalent result', () => {
      const original = 'industry:Tech revenue>5000000 size:Large';
      const parsed1 = parseQuery(original);
      const formatted = formatParsedQuery(parsed1);
      const parsed2 = parseQuery(formatted);
      expect(parsed2.fieldFilters).toEqual(parsed1.fieldFilters);
      expect(parsed2.numericComparisons).toEqual(parsed1.numericComparisons);
      expect(parsed2.freeText).toEqual(parsed1.freeText);
    });
  });
});
