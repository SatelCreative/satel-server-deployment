import { serverFetch } from '../Data';
import { Company } from './companyCreate';

interface APICompanyResponse {
  company: Company | null;
}

interface Response {
  error: boolean;
  company?: Company;
}

export default async function companyLoad(): Promise<Response> {
  const response = await serverFetch('/pim/companies/thisstore');

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.warn(
      `Recieved ${
        // eslint-disable-line
        response.status
      } when trying to load '/pim/companies/thisstore'`,
    );
    return {
      error: true,
    };
  }

  const { company }: APICompanyResponse = await response.json();

  return {
    error: false,
    company: company || undefined,
  };
}
