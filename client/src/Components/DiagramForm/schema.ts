import { object, string, boolean, array } from 'yup';
import { ImageValue, imageSchema } from './ImageInput';
import { DiagramPartValue, partSchema } from './PartsInput';

export interface DiagramFormValues {
  id?: string;
  title: string;
  number?: string;
  published: boolean;
  image: ImageValue;
  parts: DiagramPartValue[];
  devices: string[];
  category: string | undefined;
  subcategory: string[];
  compatibility: string[];
}

export const validationSchema = object({
  title: string().label('Title').trim().required().default(''),
  number: string().default(''),
  published: boolean().default(false),
  image: imageSchema().label('Image').required().default(undefined),
  parts: array(partSchema()).default([]),
  devices: array(string()).default([]),
  category: string(),
  subcategory: array(string()).default([]),
  compatibility: array(string()).default([]),
});
