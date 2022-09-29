import React, { useEffect, useCallback, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Product } from '../../types';
import { productLoad, product as productOperations } from '../../Data';
import ProductForm from '../../Components/ProductForm';
import { useLoading } from '../../BridgeHooks';
import { ProductFormValues } from '../../Components/ProductForm/ProductForm';
import useToast from '../../BridgeHooks/useToast';
import { Page } from '../../Components/Page';

function ProductRoute({
  productId,
}: RouteComponentProps<{ productId: string }>) {
  if (!productId) {
    throw new Error('Failed to load product');
  }

  const showToast = useToast();

  const [loading, setLoading] = useLoading(true);
  const [product, setProduct] = useState<Product>();

  const handleProductsLoad = useCallback(
    (p: Product) => {
      setProduct(p);
      setLoading(false);
    },
    [setLoading],
  );

  const handleProductsError = useCallback(
    (e) => {
      // eslint-disable-next-line no-console
      console.warn(e);
      showToast({ message: 'Error saving product', error: true });
      setLoading(false);
    },
    [setLoading, showToast],
  );

  useEffect(() => {
    productLoad(productId).then(handleProductsLoad).catch(handleProductsError);
    // Only loaded once on init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    async (values: ProductFormValues) => {
      try {
        const updatedProduct = await productOperations.update(productId, {
          ...values,
        });

        setProduct(updatedProduct);
        showToast({ message: 'Saved product' });

        return updatedProduct;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
        showToast({ message: 'Error saving product', error: true });
      }
    },
    [productId, showToast],
  );

  return (
    <Page
      title={product?.title ?? 'Product'}
      titleHidden
      breadcrumbs={[{ content: 'Products', url: '/products' }]}
      fullWidth
    >
      <ProductForm
        loading={loading}
        initialProduct={product}
        onSubmit={handleSubmit}
      />
    </Page>
  );
}

export default ProductRoute;
