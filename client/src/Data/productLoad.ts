import { APIProduct } from './types';
import { getData } from '.';
import { productParse } from './productParse';

interface APIProductReponse {
  product: APIProduct;
}

async function productLoad(id: string) {
  const { product } = await getData<APIProductReponse>(`/pim/products/${id}`);

  return productParse(product);
}

export default productLoad;
