import { serverFetch } from '.';

export interface NewProduct {
  title: string;
  parts: string[];
}

interface SuccessResponse {
  error: false;
  productId: string;
}

interface ErrorResponse {
  error: true;
  message: string;
}

type CreateProductResponse = SuccessResponse | ErrorResponse;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function productCreate({
  title,
  parts,
}: any): Promise<CreateProductResponse> {
  const body: Paths.PimProducts.Post.QueryParameters = {
    title,
    parts,
  };

  const response = await serverFetch('/pim/products', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });

  if (!response.ok) {
    return {
      error: true,
      message: 'Failed to create new product',
    };
  }

  try {
    // eslint-disable-next-line camelcase
    const { product_id } = await response.json();

    return {
      error: false,
      productId: product_id,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to create new product', e);
    return {
      error: true,
      message: 'Failed to create new product',
    };
  }
}

export default productCreate;
