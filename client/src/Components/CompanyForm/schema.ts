import { object, string } from 'yup';

const SCHEMA = object({
  id: string(),
  pim1Url: string(),
  erpCurrency: string().matches(/^[A-Z]{3}$/, 'Must be valid ISO-4217 (USD)'),
  erpWeightUnit: string(),
  locale: string().matches(
    /^[a-z]{2}-[A-Z]{2}$/,
    'Must be valid ISO-639-1 (en-US)',
  ),
  name: string().min(3, 'Too short').required('Required field'),
  image: string().min(3, 'Too short').url('Enter a valid URL'),
  defaultProductImage: string().min(3, 'Too short').url('Enter a valid URL'),
});

export default SCHEMA;
