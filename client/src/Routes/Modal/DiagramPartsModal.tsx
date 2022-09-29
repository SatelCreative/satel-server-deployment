import { useCallback, useContext, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Modal as ModalAction } from '@shopify/app-bridge/actions';
import {
  ResourceList,
  ResourceItem,
  Stack,
  Heading,
  Thumbnail,
  Pagination,
  Card,
  Filters,
  Button,
  FormLayout,
} from '@shopify/polaris';
import { useDebounce } from 'use-debounce';
import { Form, FormikProvider, useFormik } from 'formik';
import { TextField } from '@satel/formik-polaris';
import { object, string } from 'yup';
import { useParts, Part } from '../../Query';
import { extractId, noop } from '../../Utils';
import { CompanyContext } from '../../Context';

import s from './modal.module.css';

function CustomPartSelector() {
  const app = useAppBridge();

  const handleSelect = useCallback(
    (values: { sku: string }) => {
      app.dispatch(
        ModalAction.data({ channel: 'part', type: 'SELECT', part: values }),
      );
    },
    [app],
  );

  const formik = useFormik({
    initialValues: {
      sku: '',
    },
    validationSchema: object({
      sku: string().required(),
    }),
    onSubmit: handleSelect,
  });

  return (
    <div className={s.fix}>
      <FormikProvider value={formik}>
        <Form>
          <Card sectioned>
            <FormLayout>
              <TextField
                autoComplete="off"
                name="sku"
                label="Part number"
                placeholder="123-456"
              />
              <Stack distribution="trailing" alignment="baseline">
                <Button submit primary>
                  Add part
                </Button>
              </Stack>
            </FormLayout>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}

function ExistingPartSelector() {
  const app = useAppBridge();
  const { defaultProductImage } = useContext(CompanyContext);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 200);

  const { data, isFetching } = useParts({
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
      const part = data?.parts.find((p: any) => p.id === id);

      if (!part) {
        // eslint-disable-next-line no-console
        console.warn('Failed to locate part with id', id);
        return;
      }

      app.dispatch(ModalAction.data({ channel: 'part', type: 'SELECT', part }));
    },
    [app, data],
  );

  const handleRenderItem = useCallback(
    (part: Part, id: string) => {
      return (
        <ResourceItem key={id} id={id} onClick={handleSelect}>
          <Stack alignment="center">
            <Thumbnail
              source={part.image ?? defaultProductImage}
              size="small"
              alt=""
            />
            <Stack.Item fill>
              <Heading>{part.sku}</Heading>
            </Stack.Item>
            <Button onClick={noop}>Add to diagram</Button>
          </Stack>
        </ResourceItem>
      );
    },
    [defaultProductImage, handleSelect],
  );

  return (
    <Card>
      <div style={{ minHeight: '95vh' }}>
        <ResourceList
          items={data?.parts ?? []}
          loading={isFetching}
          renderItem={handleRenderItem}
          resolveItemId={extractId}
          resourceName={{ singular: 'part', plural: 'parts' }}
          filterControl={
            <Filters
              queryPlaceholder="Search parts"
              queryValue={query}
              onQueryChange={handleQueryChange}
              onQueryClear={handleQueryClear}
              onClearAll={handleQueryClear}
              filters={[]}
            />
          }
        />
      </div>
      {data && data.parts.length && !isFetching && (
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

export function DiagramPartsModal(props: RouteComponentProps) {
  const { location } = props;

  if (location?.search.includes('custom=true')) {
    return <CustomPartSelector />;
  }

  return <ExistingPartSelector />;
}
