import React, { useCallback } from 'react';
import {
  ResourceList,
  Stack,
  TextStyle,
  Button,
  Badge,
  Heading,
  Tooltip,
} from '@shopify/polaris';

import { DeleteMinor } from '@shopify/polaris-icons';
import { ProductOnly } from '../../types';
import LastUpdated from '../../Components/Common/LastUpdated';
import ProductThumbnail from '../../Components/Common/ProductThumbnail';
import Truncate from '../Common/Truncate';
import Money from '../Common/Money';
import { noop } from '../../Utils';

function PartNumbers({ skus }: { skus: string[] }) {
  let skuSummary;
  if (skus.length === 1) {
    skuSummary = <TextStyle variation="strong">{skus[0]}</TextStyle>;
  }
  if (skus.length === 2) {
    skuSummary = (
      <>
        <TextStyle variation="strong">{skus[0]}</TextStyle> and{' '}
        <TextStyle variation="strong">{skus[1]}</TextStyle>
      </>
    );
  }
  if (skus.length > 2) {
    skuSummary = (
      <Tooltip content={skus.join(', ')}>
        <TextStyle variation="strong">{skus[0]}</TextStyle> and{' '}
        <TextStyle variation="strong">{skus.length - 1}</TextStyle> more
      </Tooltip>
    );
  }

  return (
    <Stack vertical spacing="tight">
      <TextStyle>Part number{skus.length > 1 && 's'}</TextStyle>
      <TextStyle>{skuSummary}</TextStyle>
    </Stack>
  );
}

function ProductsListItem({ product }: { product: ProductOnly }) {
  const publishedBadge = product.published ? (
    <Badge status="info">Published</Badge>
  ) : (
    <Badge status="warning">Unpublished</Badge>
  );

  const partsSummary =
    product.nParts === 1 ? '1 part' : `${product.nParts} parts`;

  let priceSummary;

  if (product.nParts === 1) {
    priceSummary = (
      <TextStyle variation="strong">
        <Money amount={product.parts[0].price} />
      </TextStyle>
    );
  } else {
    const prices = product.parts.map((p) => p.price);
    priceSummary = (
      <>
        <TextStyle variation="strong">
          <Money amount={Math.min(...prices)} />
        </TextStyle>{' '}
        -{' '}
        <TextStyle variation="strong">
          <Money amount={Math.max(...prices)} />
        </TextStyle>
      </>
    );
  }

  const handleDelete = useCallback((e: any) => {
    e.stopPropagation();
    // eslint-disable-next-line no-alert
    alert('not implemented');
  }, []) as () => void;

  return (
    <ResourceList.Item
      id={product.id}
      url={`/products/${product.id}`}
      onClick={noop}
    >
      <Stack distribution="equalSpacing" alignment="center">
        <Stack.Item>
          <ProductThumbnail
            source={product.image}
            alt={`Thumbnail image of ${product.title}`}
          />
        </Stack.Item>
        <Stack.Item fill>
          <Stack vertical spacing="extraTight">
            <Heading>
              <Truncate maxLength={97}>{product.title}</Truncate>
            </Heading>
            <Stack.Item>
              <TextStyle>{partsSummary}</TextStyle>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <div style={{ minWidth: 200 }}>
            <PartNumbers skus={product.parts.map((p) => p.sku)} />
          </div>
        </Stack.Item>
        <Stack.Item>
          <div style={{ minWidth: 200 }}>
            <Stack vertical spacing="tight">
              <TextStyle>
                {product.nParts === 1 ? 'Price' : 'Price range'}
              </TextStyle>
              <TextStyle>{priceSummary}</TextStyle>
            </Stack>
          </div>
        </Stack.Item>
        <div style={{ minWidth: 250 }}>
          <Stack vertical alignment="trailing" spacing="tight">
            {publishedBadge}
            <LastUpdated date={product.updatedAt * 1000} />
          </Stack>
        </div>
        <div style={{ zIndex: 10000 }}>
          <Button onClick={handleDelete} destructive icon={DeleteMinor} />
        </div>
      </Stack>
    </ResourceList.Item>
  );
}

export default ProductsListItem;
