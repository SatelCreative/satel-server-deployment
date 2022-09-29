import React, { useCallback, useContext } from 'react';
import {
  Card,
  Stack,
  Pagination,
  ResourceList,
  Thumbnail,
  Heading,
  Icon,
  TextField,
} from '@shopify/polaris';
import { Field, FieldProps } from 'formik';
import { SearchMinor } from '@shopify/polaris-icons';
import { Part } from './NewProductForm';
import { CompanyContext } from '../../Context';
import {
  usePaginatedResource,
  LoadItemsPayload,
  LoadItemsProps,
} from '../../Hooks';
import { partsLoad } from '../../Data';
import { Part as ListPart } from '../../types';
import { noop } from '../../Utils';

async function loadParts(props: LoadItemsProps) {
  const payload = await partsLoad({ ...props, params: { onshopify: 'false' } });
  const response: LoadItemsPayload<Part> = {
    ...payload,
    items: payload.parts,
  };
  return response;
}

interface InternalPartsListProps {
  selectedParts: Part[];
  disabled: boolean;
  onSelectionChange: (parts: Part[]) => void;
}

function InternalPartsList(props: InternalPartsListProps) {
  const { selectedParts, disabled, onSelectionChange } = props;

  const { defaultProductImage } = useContext(CompanyContext);

  const { loading, items, query, handleQueryUpdate, pagination } =
    usePaginatedResource({
      loadItems: loadParts,
    });

  const handleSelectionChange = useCallback(
    (ids: string[]) => {
      // We have to diff this against the selected because the
      // selected parts may no longer be loaded
      const existingParts = selectedParts.filter((p) => ids.includes(p.id));
      const existingIds = existingParts.map((p) => p.id);
      const newParts = ids
        .filter((id) => !existingIds.includes(id))
        .map((id) => items.find((p) => p.id === id) as ListPart)
        .map<Part>((p) => ({ id: p.id, sku: p.sku }));

      const p = [...existingParts, ...newParts];
      if (!p.length) {
        if (selectedParts.length) {
          onSelectionChange([selectedParts[0]]);
        } else {
          return;
        }

        return;
      }
      onSelectionChange(p);
    },
    [items, selectedParts, onSelectionChange],
  );

  return (
    <>
      <ResourceList
        loading={loading}
        items={items}
        resolveItemId={(part: Part) => part.id}
        selectedItems={selectedParts.map((p) => p.id)}
        onSelectionChange={handleSelectionChange}
        selectable={!disabled}
        renderItem={(part: ListPart, id) => (
          <ResourceList.Item
            id={id}
            media={
              <Thumbnail
                source={part.image || defaultProductImage}
                alt={part.sku}
              />
            }
            // Tried to use this to do the initial selection
            // but it killed the tab. Probably does something
            // Shopify Polaris doesn't expect. Could not recreate
            // the bug? in isolation
            // https://codesandbox.io/s/resource-list-select-object-8w3c7
            onClick={noop}
          >
            <Stack>
              <Stack.Item fill>
                <Stack vertical spacing="extraTight">
                  <Heading>{part.sku}</Heading>
                  <p>{part.engineeringTitle}</p>
                </Stack>
              </Stack.Item>
            </Stack>
          </ResourceList.Item>
        )}
        filterControl={
          <TextField
            autoComplete="off"
            label="search"
            labelHidden
            placeholder="Search Parts"
            prefix={<Icon source={SearchMinor} color="subdued" />}
            disabled={disabled}
            value={query}
            onChange={handleQueryUpdate}
          />
        }
      />
      {(!!items.length || loading) && (
        <Card.Section>
          <Stack distribution="center" alignment="center">
            <Pagination {...pagination} />
          </Stack>
        </Card.Section>
      )}
    </>
  );
}

function PartsList() {
  return (
    <Field name="parts">
      {({ field, form }: FieldProps<Part[]>) => {
        const parts = field.value;
        return (
          <InternalPartsList
            selectedParts={parts}
            onSelectionChange={(newParts) =>
              form.setFieldValue('parts', newParts)
            }
            disabled={form.isSubmitting}
          />
        );
      }}
    </Field>
  );
}

export default PartsList;
