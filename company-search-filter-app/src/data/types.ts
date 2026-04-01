export interface FinancialData {
  year: number;
  revenue: number; // USD
  net_income: number; // USD
}

export interface CompanyDetails {
  company_type: 'Public' | 'Private';
  size: 'Small' | 'Medium' | 'Large';
  ceo_name: string;
  headquarters: string;
}

export interface BoardMember {
  name: string;
  role: string;
}

export interface Office {
  city: string;
  country: string;
  type: 'HQ' | 'Regional' | 'R&D';
}

export interface Company {
  id: string;
  name: string;
  country: string;
  industry: string;
  founded_year: number;
  financials: FinancialData;
  details: CompanyDetails;
  board_members: BoardMember[];
  offices: Office[];
}
