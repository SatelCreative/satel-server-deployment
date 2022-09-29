import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Diagram } from '.';
import { authenticatedFetch, get, put, post } from './fetch';

async function fetchDiagramById(id: string) {
  const { diagram } = await get<{ diagram: Diagram }>(`/pim/diagrams/${id}`);
  return diagram;
}

export function useDiagram(id: string) {
  return useQuery(['diagram', id], () => fetchDiagramById(id));
}

export interface DiagramExistingPartPayload {
  id: string;
  position: number;
}

export interface DiagramCustomPartPayload {
  sku: string;
  position: number;
}

export type DiagramPartPayload =
  | DiagramExistingPartPayload
  | DiagramCustomPartPayload;

export interface DiagramCreatePayload {
  title: string;
  image: Blob;
  number?: string;
}

async function createDiagram(input: DiagramCreatePayload) {
  const { image, ...postInput } = input;

  const formData = new FormData();
  formData.append('file', image);

  const response = await authenticatedFetch('/pim/diagrams/images', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  /* eslint-disable camelcase */
  const { tmp_image_id }: { tmp_image_id: string } = await response.json();

  const { diagramId } = await post<{ diagramId: string }>('/pim/diagrams/', {
    ...postInput,
    tmp_image_id,
  });

  /* eslint-enable camelcase */

  return diagramId;
}

export function useDiagramCreate() {
  return useMutation(createDiagram);
}

export interface DiagramUpdatePayload {
  id: string;
  name?: string;
  number?: string;
  published?: boolean;
  categorization?: string[];
  parts?: DiagramPartPayload[];
  devices?: string[];

  // Required for some reason
  image: string;
}

async function updateDiagramById(input: DiagramUpdatePayload) {
  const { diagram } = await put<{ diagram: Diagram }>(
    `/pim/diagrams/${input.id}`,
    input,
  );
  return diagram;
}

export function useDiagramUpdate() {
  const queryCache = useQueryClient();
  return useMutation(updateDiagramById, {
    onSuccess: (data) => {
      // TODO remember to invalidate diagrams as well
      queryCache.setQueryData(['diagram', data.id], data);
    },
  });
}
