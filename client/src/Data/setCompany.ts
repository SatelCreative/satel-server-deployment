import { serverFetch } from '.';

async function setCompany(id: string) {
  const body = {
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

  return id;
}

export default setCompany;
