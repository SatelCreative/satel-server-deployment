import { RouteComponentProps } from '@reach/router';
import {
  Card,
  Filters,
  Heading,
  Link,
  Pagination,
  ResourceItem,
  ResourceList,
  Stack,
} from '@shopify/polaris';
import { SettingsMinor } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Page } from '../../Components/Page';
import { Device, useDevices } from '../../Query';
import { extractId } from '../../Utils';

function DevicesRoute(props: RouteComponentProps) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 200);

  const { data, isFetching } = useDevices({
    page,
    query: debouncedQuery,
    pageSize: 25,
  });

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const handleQueryClear = useCallback(() => {
    setQuery('');
    setPage(1);
  }, []);

  const handleRenderItem = useCallback((device: Device, id: string) => {
    return (
      <ResourceItem key={id} id={id} url={`/devices/${device.id}`}>
        <Stack alignment="center">
          <Link url={`/devices/${device.id}`}>
            <Heading>{device.name}</Heading>
          </Link>
        </Stack>
      </ResourceItem>
    );
  }, []);

  return (
    <Page
      title="Devices"
      breadcrumbs={[
        {
          content: 'Home',
          url: '/',
        },
      ]}
      primaryAction={{
        content: 'Create Device',
        url: '/devices/new',
      }}
      secondaryActions={[
        {
          content: 'Manage categorization',
          url: '/devices/categorization',
          icon: SettingsMinor,
        },
      ]}
      fullWidth
    >
      <Card>
        <Card.Section>
          <ResourceList
            items={data?.devices ?? []}
            loading={isFetching}
            renderItem={handleRenderItem}
            resolveItemId={extractId}
            resourceName={{ singular: 'device', plural: 'devices' }}
            filterControl={
              <Filters
                queryPlaceholder="Search devices"
                queryValue={query}
                onQueryChange={handleQueryChange}
                onQueryClear={handleQueryClear}
                onClearAll={handleQueryClear}
                filters={[]}
              />
            }
          />
        </Card.Section>
        <Card.Section>
          <Stack alignment="center" distribution="center">
            <Pagination
              hasNext={data?.hasNextPage}
              hasPrevious={data && page > 1}
              onNext={() => {
                setPage((old) => old + 1);
                window.scrollTo(0, 0);
              }}
              onPrevious={() => {
                setPage((old) => Math.max(old - 1, 1));
                window.scrollTo(0, 0);
              }}
            />
          </Stack>
        </Card.Section>
      </Card>
    </Page>
  );
}

export default DevicesRoute;
