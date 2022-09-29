import React, { useContext, useState } from 'react';
import {
  ResourceList,
  Card,
  Pagination,
  Stack,
  Thumbnail,
  TextStyle,
  Button,
  Banner,
  _SECRET_INTERNAL_FilterControl as FilterControl,
} from '@shopify/polaris';
import { RouteComponentProps, navigate } from '@reach/router';
import { usePaginatedResource } from '../../Hooks';
import { Part } from '../../types';
import { partsLoad } from '../../Data';
import { CompanyContext } from '../../Context';
import LastUpdated from '../../Components/Common/LastUpdated';
import { useLoading } from '../../BridgeHooks';
import Money from '../../Components/Common/Money';
import { noop } from '../../Utils';
import { Page } from '../../Components/Page';

interface PartListItemProps {
  id: string;
  part: Part;
}

function PartListItem(props: PartListItemProps) {
  const { defaultProductImage } = useContext(CompanyContext);
  const { id, part } = props;

  const media = (
    <Thumbnail source={part.image || defaultProductImage} alt="thumbnail" />
  );

  const openProduct = ((e: any) => {
    e.stopPropagation();
    navigate(`/products/${part.parentId}`);
  }) as () => void;

  const initializeProduct = ((e: any) => {
    e.stopPropagation();
    navigate(`/products/new?id=${part.id}&sku=${part.sku}`);
  }) as () => void;

  return (
    <div className="partListing">
      <ResourceList.Item id={id} media={media} onClick={noop}>
        <Stack alignment="center" distribution="trailing">
          <Stack.Item fill>
            <Stack vertical spacing="extraTight">
              <TextStyle variation="strong">{part.engineeringTitle}</TextStyle>
              <Stack.Item>
                Part number:{' '}
                <TextStyle variation="strong">{part.sku}</TextStyle>
              </Stack.Item>
              <Stack.Item>
                Price:{' '}
                <TextStyle variation="strong">
                  <Money amount={part.price} />
                </TextStyle>
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item>
            <LastUpdated date={part.updatedAt} />
          </Stack.Item>
          <Stack.Item>
            {part.onShopify ? (
              <Button onClick={openProduct}>View Product</Button>
            ) : (
              <Button primary onClick={initializeProduct}>
                Create Product
              </Button>
            )}
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    </div>
  );
}

async function loadItems(props: any) {
  const { parts, ...rest } = await partsLoad({ ...props, pageSize: 20 });

  return {
    items: parts,
    ...rest,
  };
}

function PartsRoute(props: RouteComponentProps) {
  const { location: { href } = { href: '' } } = props;
  const url = new URL(href);
  const [showHint, setShowHint] = useState(
    url.searchParams.get('hint') === 'true',
  );

  const ref = React.useRef<HTMLDivElement>(null);

  const { loading, items, query, pagination, handleQueryUpdate } =
    usePaginatedResource<Part>({
      loadItems,
    });

  useLoading(loading, { controlled: true });

  return (
    <Page title="Parts" breadcrumbs={[{ content: 'Home', url: '/' }]} fullWidth>
      {showHint && (
        <>
          <Banner
            status="info"
            onDismiss={() => setShowHint(false)}
            title="How to create a new product"
          >
            Create a new product starting with the first part you want in the
            product
          </Banner>
          <br />
        </>
      )}
      <Card>
        <div ref={ref}>
          <ResourceList
            resourceName={{ singular: 'part', plural: 'parts' }}
            loading={loading}
            items={items}
            hasMoreItems={pagination.hasNext}
            renderItem={(part: Part, id) => (
              <PartListItem id={id} part={part} />
            )}
            filterControl={
              <FilterControl
                placeholder="Search parts"
                searchValue={query}
                onSearchChange={handleQueryUpdate}
              />
            }
          />
          <Card.Section>
            <Stack distribution="center">
              <Pagination {...pagination} />
            </Stack>
          </Card.Section>
        </div>
      </Card>
    </Page>
  );
}

export default PartsRoute;
