import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Categorizations } from '.';
import { get, post } from './fetch';

async function fetchCategorizations(type: string) {
  const { categorizations } = await get<{ categorizations: Categorizations }>(
    `/pim/categorizations/${type}`,
  );
  return categorizations;
}

export function useProductCategorizations() {
  return useQuery(['categorizations', 'products'], () =>
    fetchCategorizations('products'),
  );
}

export function useDiagramCategorizations() {
  return useQuery(['categorizations', 'diagrams'], () =>
    fetchCategorizations('diagrams'),
  );
}

export function useDeviceCategorizations() {
  return useQuery(['categorizations', 'devices'], () =>
    fetchCategorizations('devices'),
  );
}

export interface CategorizationCreatePayload {
  group: 'compatibility' | 'category' | 'subcategory';
  name: string;
  option: string;
  belongsTo: 'products' | 'diagrams' | 'devices';
}

async function createCategorization(input: CategorizationCreatePayload) {
  const { belongsTo, ...payload } = input;
  await post('/pim/categorizations/', {
    ...payload,
    belongs_to: belongsTo,
  });
}

export function useCategorizationCreate() {
  const queryClient = useQueryClient();
  return useMutation(createCategorization, {
    onSuccess: () => {
      queryClient.invalidateQueries('categorizations');
    },
  });
}
