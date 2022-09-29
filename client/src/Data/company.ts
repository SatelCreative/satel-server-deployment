import { getData, serverFetch } from '.';

export interface APICompanyOnly {
  id: string;
  name: string;
  image: string;
}

export interface CompanyFeatures {
  /* eslint-disable camelcase */
  replacement_parts: boolean;
  pim1_sync: boolean;
  company_transfer: boolean;
  custom_sku: boolean;
  /* eslint-enable camelcase */
}

export interface APICompany extends APICompanyOnly {
  defaultProductImage: string;
  pim1Url: string;
  erpCurrency: string;
  locale: string;
  erpWeightUnit: string;

  features?: CompanyFeatures;
}

interface APICompaniesResponse {
  companies: APICompanyOnly[];
}

async function load(queryArgs?: string) {
  let url = '/pim/companies';
  if (queryArgs) {
    url += queryArgs;
  }
  const { companies } = await getData<APICompaniesResponse>(url);
  return companies;
}

interface APICompaniesResponse {
  company: APICompany | null;
}

async function loadCurrent() {
  const { company } = await getData<APICompaniesResponse>(
    '/pim/companies/thisstore',
  );
  return company;
}

interface CreateCompanyProps {
  name: string;
  legacyPimUrl?: string;
  sourceCompanyId?: string;
}

async function create({
  name,
  legacyPimUrl,
  sourceCompanyId,
}: CreateCompanyProps) {
  // @todo figure out where type wen
  const body: any = {
    name,
    ...(legacyPimUrl ? { pim1Url: legacyPimUrl } : {}),
    ...(sourceCompanyId ? { sourceCompanyId } : {}),

    // image: shapeLogo, // @todo
  };

  const response = await serverFetch('/pim/companies', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });
  const { company }: { company: APICompany } = await response.json();

  return company;
}

async function set(id: string) {
  const body: Paths.PimStores.Put.RequestBody = {
    company_id: id,
  };

  const response = await serverFetch('/pim/stores', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update diagram');
  }

  await response.json();
}

async function updateCurrent(c: Partial<APICompany>) {
  // @todo figure out where type wen
  const body: any = {
    ...c,
    erpWeightUnit: c.erpWeightUnit as any,
  };

  Object.keys(body).forEach((key) => {
    if (body[key] === '') {
      delete body[key];
    }
  });

  const response = await serverFetch('/pim/companies/thisstore', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error updating company');
  }

  const { company }: { company: APICompany } = await response.json();

  return company;
}

const company = {
  load,
  loadCurrent,
  updateCurrent,
  create,
  set,
};

export default company;
