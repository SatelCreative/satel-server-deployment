import { useCallback, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Modal as ModalAction } from '@shopify/app-bridge/actions';
import {
  ResourceList,
  ResourceItem,
  Stack,
  Heading,
  Pagination,
  Card,
  Filters,
  Button,
} from '@shopify/polaris';
import { useDebounce } from 'use-debounce';
import { useDevices, Device } from '../../Query';
import { extractId, noop } from '../../Utils';

export function DiagramDevicesModal(props: RouteComponentProps) {
  const app = useAppBridge();

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

  const handleSelect = useCallback(
    (id: string) => {
      app.dispatch(
        ModalAction.data({ channel: 'device', type: 'SELECT', device: id }),
      );
    },
    [app],
  );

  const handleRenderItem = useCallback(
    (device: Device, id: string) => {
      return (
        <ResourceItem key={id} id={id} onClick={handleSelect}>
          <Stack alignment="center">
            <Stack.Item fill>
              <Heading>{device.name}</Heading>
            </Stack.Item>
            <Button onClick={noop}>Add to diagram</Button>
          </Stack>
        </ResourceItem>
      );
    },
    [handleSelect],
  );

  return (
    <Card>
      <div style={{ minHeight: '95vh' }}>
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
      </div>
      {data && data.devices.length && !isFetching && (
        <Card.Section key="pagination">
          <Stack alignment="center" distribution="center">
            <Pagination
              hasNext={data && data.hasNextPage}
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
      )}
    </Card>
  );
}
