import React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import {
  ResourceList,
  Stack,
  Pagination,
  Card,
  _SECRET_INTERNAL_FilterControl as FilterControl,
} from '@shopify/polaris';

import { SettingsMinor } from '@shopify/polaris-icons';
import { ProductOnly } from '../../types';
import { productsLoad } from '../../Data';
import { usePaginatedResource } from '../../Hooks';
import ProductsListItem from '../../Components/ListItems/ProductsListItem';
import { useLoading } from '../../BridgeHooks';
import { Page } from '../../Components/Page';

function Products(props: RouteComponentProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const {
    loading,
    pagination,
    items: products,
    query,
    handleQueryUpdate,
  } = usePaginatedResource<ProductOnly>({
    loadItems: productsLoad,
  });

  useLoading(loading, { controlled: true });

  const handleRenderRow = React.useCallback(
    (product: ProductOnly) => <ProductsListItem product={product} />,
    [],
  );

  const filterControl = React.useMemo(
    () => (
      <FilterControl
        placeholder="Search products"
        searchValue={query}
        onSearchChange={handleQueryUpdate}
      />
    ),
    [handleQueryUpdate, query],
  );

  return (
    <Page
      title="Products"
      breadcrumbs={[{ content: 'Home', url: '/' }]}
      primaryAction={{
        content: 'Create product',
        url: '/parts?hint=true',
      }}
      secondaryActions={[
        {
          content: 'Manage categorization',
          url: '/products/categorization',
          icon: SettingsMinor,
        },
      ]}
      fullWidth
    >
      <Card>
        <Card.Section>
          <div ref={ref}>
            <ResourceList
              resourceName={{ singular: 'Product', plural: 'Products' }}
              items={products}
              loading={loading}
              renderItem={handleRenderRow}
              filterControl={filterControl}
            />
          </div>
        </Card.Section>
        <Card.Section>
          <Stack alignment="center" distribution="center">
            <Pagination {...pagination} />
          </Stack>
        </Card.Section>
      </Card>
    </Page>
  );
}

export default Products;
