import { Company } from '../data/types';
import { FilterState } from '../state/types';

export function filterCompanies(companies: Company[], filters: FilterState): Company[] {
  const {
    industries,
    companyTypes,
    sizes,
    revenueMin,
    revenueMax,
    foundedYearMin,
    foundedYearMax,
  } = filters;

  // Determine if revenue range is valid (ignore if min > max)
  const applyRevenue =
    revenueMin !== null || revenueMax !== null
      ? !(revenueMin !== null && revenueMax !== null && revenueMin > revenueMax)
      : false;

  // Determine if founded year range is valid (ignore if min > max)
  const applyFoundedYear =
    foundedYearMin !== null || foundedYearMax !== null
      ? !(foundedYearMin !== null && foundedYearMax !== null && foundedYearMin > foundedYearMax)
      : false;

  return companies.filter((company) => {
    // Industry filter (case-insensitive)
    if (industries.length > 0) {
      const industryLower = company.industry.toLowerCase();
      if (!industries.some((i) => i.toLowerCase() === industryLower)) return false;
    }

    // Company type filter
    if (companyTypes.length > 0) {
      if (!companyTypes.includes(company.details.company_type)) return false;
    }

    // Size filter
    if (sizes.length > 0) {
      if (!sizes.includes(company.details.size)) return false;
    }

    // Revenue range filter
    if (applyRevenue) {
      if (revenueMin !== null && company.financials.revenue < revenueMin) return false;
      if (revenueMax !== null && company.financials.revenue > revenueMax) return false;
    }

    // Founded year range filter
    if (applyFoundedYear) {
      if (foundedYearMin !== null && company.founded_year < foundedYearMin) return false;
      if (foundedYearMax !== null && company.founded_year > foundedYearMax) return false;
    }

    return true;
  });
}
