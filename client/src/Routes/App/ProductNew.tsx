import React, { useMemo } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { productCreate } from '../../Data';
import NewProductForm from '../../Components/NewProductForm';
import { useToast } from '../../BridgeHooks';
import { Page } from '../../Components/Page';

function ProductNewRoute(props: RouteComponentProps) {
  const showToast = useToast();

  const initialPart = useMemo(() => {
    if (!props.location) {
      return undefined;
    }
    const url = new URL(props.location.href);
    const id = url.searchParams.get('id');
    const sku = url.searchParams.get('sku');
    if (id && sku) {
      return { id, sku };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductSave = async ({ title, parts }: any) => {
    const response = await productCreate({
      title,
      parts: parts.map((part: any) => part.id),
    });

    if (response.error) {
      // eslint-disable-next-line no-console
      console.warn(response.message);
      showToast({ message: 'Error creating product', error: true });
    } else {
      showToast({ message: 'Successfully created product' });
      navigate(`/products/${response.productId}`);
    }
  };

  return (
    <Page
      title="New product"
      titleHidden
      breadcrumbs={[{ content: 'Products', url: '/products' }]}
    >
      <NewProductForm initialPart={initialPart} onSubmit={handleProductSave} />
    </Page>
  );
}

export default ProductNewRoute;
