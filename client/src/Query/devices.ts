import { useQuery, useMutation, useQueryClient } from 'react-query';
import { get, post, put, del } from './fetch';
import { Device } from './types';

export const DEVICE_KEY = 'device';

export interface DevicesArgs {
  page?: number;
  pageSize?: number;
  query?: string;
  params?: { [key: string]: string };
}

async function fetchDevices(args: DevicesArgs) {
  const { page = 1, query = '', pageSize = 50, params = {} } = args;

  const queryString = new URLSearchParams();
  queryString.append('search', query);
  queryString.append('page', `${page}`);
  queryString.append('limit', `${pageSize}`);

  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key]);
  });

  return await get<{ hasNextPage: boolean; devices: Device[] }>(
    `/pim/devices/?${queryString}`,
  );
}

export function useDevices(args: DevicesArgs = {}) {
  return useQuery([DEVICE_KEY, args], () => fetchDevices(args), {
    keepPreviousData: true,
  });
}

async function fetchDevicesByIds(ids: string) {
  if (!ids.length) {
    return [];
  }

  const { devices } = await get<{ hasNextPage: boolean; devices: Device[] }>(
    `/pim/devices/?ids=${ids}`,
  );
  return devices;
}

export function useDevicesByIds(ids: string[]) {
  return useQuery([DEVICE_KEY, ids.join(',')], () =>
    fetchDevicesByIds(ids.join(',')),
  );
}

async function fetchDeviceById(id: string) {
  const { device } = await get<{ device: Device }>(`/pim/devices/${id}`);
  return device;
}

export function useDevice(id: string) {
  return useQuery([DEVICE_KEY, id], () => fetchDeviceById(id));
}

export interface DeviceCreatePayload {
  name: string;
  category?: string | null;
  subcategories?: string[];
  compatibilities?: string[];
}

async function createDevice(input: DeviceCreatePayload) {
  const { device } = await post<{ device: Device }>('/pim/devices/', {
    device: {
      ...input,
      // TODO remove
      device_type: [],
    },
  });

  return device;
}

export function useDeviceCreate() {
  const queryClient = useQueryClient();
  return useMutation(createDevice, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(DEVICE_KEY);
      queryClient.setQueryData([DEVICE_KEY, data.id], data);
    },
  });
}

export interface DeviceUpdatePayload {
  id: string;
  name: string;
  category?: string | null;
  subcategories?: string[];
  compatibilities?: string[];
}

async function updateDevice(input: DeviceUpdatePayload) {
  const { device } = await put<{ device: Device }>(`/pim/devices/${input.id}`, {
    device: {
      ...input,
      // TODO remove
      device_type: [],
    },
  });

  return device;
}

export function useDeviceUpdate() {
  const queryClient = useQueryClient();
  return useMutation(updateDevice, {
    onSuccess: (data) => {
      queryClient.setQueryData([DEVICE_KEY, data.id], data);
    },
  });
}

async function deleteDevice(id: string) {
  await del<null>(`/pim/devices/${id}`, null);
  return id;
}

export function useDeviceDelete() {
  const queryClient = useQueryClient();
  return useMutation(deleteDevice, {
    onSuccess: (id) => {
      queryClient.removeQueries([DEVICE_KEY, id]);
      queryClient.invalidateQueries(DEVICE_KEY);
    },
  });
}
