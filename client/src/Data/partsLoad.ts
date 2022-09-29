import { getData } from '.';
import { Part } from '../types';

interface PartsLoadProps {
  page?: number;
  pageSize?: number;
  query?: string;
  params?: { [key: string]: string };
}

interface PartsLoadResponse {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  parts: Part[];
}

async function partsLoad(props: PartsLoadProps = {}) {
  const { page = 1, query = '', pageSize = 8, params = {} } = props;

  const queryString = new URLSearchParams();
  queryString.append('search', query);
  queryString.append('page', `${page}`);
  queryString.append('limit', `${pageSize}`);

  Object.keys(params).forEach((key) => {
    queryString.append(key, params[key]);
  });

  const { parts: rawParts, has_next_page: hasNextPage } =
    await getData<Paths.PimParts.Get.Responses.$200>(
      `/pim/parts?${queryString}`,
    );

  const parts = rawParts.map<Part>((part) => ({
    id: part.id,
    ...(part.image ? { image: part.image } : {}),
    sku: part.sku,
    title: part.shopify_title || part.engineering_title,
    onShopify: part.onshopify,
    updatedAt: part.updatedAt * 1000,
    createdAt: part.createdAt * 1000,
    ...(part.product_id ? { parentId: part.product_id } : {}),
    price: part.price,
    engineeringTitle: part.engineering_title,
    /* eslint-disable multiline-ternary */
    erp: part.erp
      ? Object.keys(part.erp).map((key) => ({
          key,
          value: (part.erp as any)[key],
        }))
      : [],
    /* eslint-enable multiline-ternary */
  }));

  const response: PartsLoadResponse = {
    parts,
    hasNextPage,
    hasPrevPage: page > 1,
  };

  return response;
}

export default partsLoad;
