import { serverFetch } from '.';

async function companyTransfer(endpoint: any, id: any) {
  const body = {
    id,
  } as any; // @todo waiting on #773

  const response = await serverFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });
  return await response.json();
}

export default companyTransfer;
