import shapeLogo from '../Assets/Shape-Logo_color.png';
import { serverFetch } from '.';
import { CompanyFeatures } from './company';

export interface Company {
  name: string;
  image: string;
  pim1Url: string;
  id: string;
  defaultProductImage?: string | undefined;

  features?: CompanyFeatures;
}

async function companyCreate({ companyName, oldPimUrl, sourceCompanyId }: any) {
  // @todo figure out where type went
  const body: any = {
    name: companyName,
    image: shapeLogo,
    pim1Url: oldPimUrl,
    sourceCompanyId,
  } as any; // @todo waiting on #773

  const response = await serverFetch('/pim/companies', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });
  return response.json();
}

export default companyCreate;
