import { useQuery } from 'react-query';
import { get } from './fetch';
import { Part } from '.';

export interface PartsArgs {
  page?: number;
  pageSize?: number;
  query?: string;
  params?: { [key: string]: string };
}

async function fetchParts(args: PartsArgs) {
  const { page = 1, query = '', pageSize = 50, params = {} } = args;

  const queryString = new URLSearchParams();
  queryString.append('search', query);
  queryString.append('page', `${page}`);
  queryString.append('limit', `${pageSize}`);

  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key]);
  });

  return await get<{ hasNextPage: boolean; parts: Part[] }>(
    `/pim/parts/?${queryString}`,
  );
}

export function useParts(args: PartsArgs = {}) {
  return useQuery(['parts', args], () => fetchParts(args), {
    keepPreviousData: true,
  });
}
