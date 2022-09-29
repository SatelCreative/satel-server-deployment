import { Device, DeviceCreatePayload, DeviceUpdatePayload } from '../../Query';
import { DeviceFormValues as V } from './schema';

export function deviceToValue(device: Device): V {
  return {
    id: device.id,
    name: device.name,
    category: device.category,
    subcategory: device.subcategories,
    compatibility: device.compatibilities,
  };
}

export function valuesToCreatePayload(values: V): DeviceCreatePayload {
  return {
    name: values.name,
    category: values.category ?? null,
    subcategories: values.subcategory,
    compatibilities: values.compatibility,
  };
}

export function valuesToUpdatePayload(values: V): DeviceUpdatePayload {
  if (!values.id) {
    throw new Error('Update payload must contain an `id`');
  }

  return {
    id: values.id,
    name: values.name,
    category: values.category ?? null,
    subcategories: values.subcategory,
    compatibilities: values.compatibility,
  };
}
