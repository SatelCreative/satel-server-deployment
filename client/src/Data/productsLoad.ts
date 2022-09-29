import { getData } from '.';
import { APIProductOnly } from './types';
import { ProductOnly } from '../types';
import { productOnlyParse } from './productParse';

const DEFAULT_PAGE_SIZE = 12;

interface APIProductsResponse {
  products: APIProductOnly[];
  // eslint-disable-next-line camelcase
  has_next_page: boolean;
}

interface ProductsLoadProps {
  pageSize?: number;
  query?: string;
  page?: number;
}

export interface ProductsLoadResponse {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: ProductOnly[];
}

async function productsLoad(props: ProductsLoadProps = {}) {
  const { pageSize = DEFAULT_PAGE_SIZE, query = '', page = 1 } = props;

  const params = new URLSearchParams();
  params.append('limit', `${pageSize}`);
  params.append('search', query);
  params.append('page', `${page}`);

  // params.append('nparts', 'gt:5'); // for debugging

  const { products, has_next_page: hasNextPage } =
    await getData<APIProductsResponse>(`/pim/products?${params}`);

  const response: ProductsLoadResponse = {
    items: products.map(productOnlyParse),
    hasNextPage,
    hasPrevPage: page > 1,
  };

  return response;
}

export default productsLoad;
