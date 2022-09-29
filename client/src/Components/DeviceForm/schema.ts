import { array, object, string } from 'yup';

export interface DeviceFormValues {
  id?: string;
  name: string;
  category: string | undefined | null;
  subcategory: string[];
  compatibility: string[];
}

export const validationSchema = object({
  name: string().label('Title').trim().required().default(''),
  category: string().nullable(),
  subcategory: array(string()).default([]),
  compatibility: array(string()).default([]),
});
