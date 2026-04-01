import { Company } from '../data/types';
import { SortField, SortDirection } from '../state/types';

const SIZE_ORDER: Record<'Small' | 'Medium' | 'Large', number> = {
  Small: 0,
  Medium: 1,
  Large: 2,
};

export function sortCompanies(
  companies: Company[],
  sortField: SortField,
  sortDirection: SortDirection
): Company[] {
  if (sortField === null) {
    return companies;
  }

  const sorted = [...companies];

  sorted.sort((a, b) => {
    let result = 0;

    switch (sortField) {
      case 'name':
        result = a.name.localeCompare(b.name);
        break;
      case 'company_type':
        result = a.details.company_type.localeCompare(b.details.company_type);
        break;
      case 'founded_year':
        result = a.founded_year - b.founded_year;
        break;
      case 'revenue':
        result = a.financials.revenue - b.financials.revenue;
        break;
      case 'net_income':
        result = a.financials.net_income - b.financials.net_income;
        break;
      case 'size':
        result = SIZE_ORDER[a.details.size] - SIZE_ORDER[b.details.size];
        break;
    }

    return sortDirection === 'desc' ? -result : result;
  });

  return sorted;
}
