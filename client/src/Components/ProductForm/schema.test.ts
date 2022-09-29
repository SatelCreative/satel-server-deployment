/* eslint-env jest */
import { SCHEMA, OPTIONS_SCHEMA } from './schema';
import { ProductFormValues } from './ProductForm';
import { OptionsFormValues } from './OptionsModal';

const BASE_PRODUCT: ProductFormValues = {
  title: 'A Product',
  handle: 'a-product',
  option1: 'Title',
  option2: '',
  option3: '',
  parts: [
    {
      id: 'partid',
      discontinued: false,
      upSold: false,
      price: 1234,
      salePrice: 1234,
      promotion: 0,
      sku: '123-a-part',
      option1: 'Default title',
      option2: '',
      option3: '',
      erp: [],
    },
  ],
  images: [],
  categorizations: [],
};

describe('Product Validation Schema', () => {
  it('passes a product with all required fields', async () => {
    await SCHEMA.validate(BASE_PRODUCT);
  });

  it('requires a title of length 3', async () => {
    expect.assertions(2);

    try {
      await SCHEMA.validate({ ...BASE_PRODUCT, title: '12' });
    } catch (e: any) {
      expect(e.name).toEqual('ValidationError');
      expect(e.message).toEqual('Title must be at least 3 characters long');
    }
  });

  it('promotion must be less than price', async () => {
    expect.assertions(2);

    try {
      await SCHEMA.validate({
        ...BASE_PRODUCT,
        parts: [{ ...BASE_PRODUCT.parts[0], promotion: 1234 }],
      });
    } catch (e: any) {
      expect(e.name).toEqual('ValidationError');
      expect(e.message).toEqual('Promotion must be less than price');
    }
  });
});

const BASE_OPTIONS: OptionsFormValues = {
  option1: 'Default',
  hadOption2: false,
  hadOption3: false,
};

describe('Product Options Validation Schema', () => {
  it('passes options with all required fields', async () => {
    await OPTIONS_SCHEMA.validate(BASE_OPTIONS);
  });

  it('requires option1 to be of length 2', async () => {
    expect.assertions(2);

    try {
      await OPTIONS_SCHEMA.validate({ ...BASE_OPTIONS, option1: '1' });
    } catch (e: any) {
      expect(e.name).toEqual('ValidationError');
      expect(e.message).toEqual('option1 must be at least 2 characters');
    }
  });
});
