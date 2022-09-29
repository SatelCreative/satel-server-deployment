import { object, array, string } from 'yup';
import { NewProductFormValues, Part } from './NewProductForm';

const PART_SCHEMA = object({
  id: string().required(),
  sku: string().required(),
});

const PRODUCT_CREATE_SCHEMA = object({
  title: string().min(3, 'Too short').required('Required field'),
  parts: array(PART_SCHEMA),
});

export default PRODUCT_CREATE_SCHEMA;
