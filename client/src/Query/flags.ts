import { useMutation, useQuery, useQueryClient } from 'react-query';
import snakeCaseKeys from 'snakecase-keys';
import { get, patch } from './fetch';

export interface Flags {
  id: string;
  flags: {
    [key: string]: boolean;
  };
}

interface Company {
  id: string;
  features: {
    [key: string]: boolean;
  };
}

async function fetchCompany() {
  const { company } = await get<{ company: Company }>(
    '/pim/companies/thisstore',
  );
  return company;
}

export function useCompany() {
  return useQuery(['companies', 'thisstore'], () => fetchCompany());
}

export function useFlags() {
  const { data: company, ...rest } = useCompany();

  const data: Flags | undefined = company
    ? { id: company.id, flags: company.features }
    : undefined;

  return { data, ...rest };
}

async function updateFlags(input: Flags): Promise<Flags> {
  const { id, flags } = input;

  const { company } = await patch<{ company: Company }>(
    `/pim/companies/${id}`,
    {
      features: snakeCaseKeys(flags),
    },
  );
  const data: Flags = { id: company.id, flags: company.features };
  return data;
}

export function useFlagsUpdate() {
  const queryCache = useQueryClient();
  return useMutation(updateFlags, {
    onSuccess: (data) => {
      // TODO remember to invalidate diagrams as well
      queryCache.invalidateQueries('companies');
    },
  });
}
