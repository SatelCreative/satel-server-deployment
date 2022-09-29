import React, { useMemo, useContext, useState, useCallback } from 'react';
import {
  ResourceList,
  Button,
  Stack,
  Heading,
  Thumbnail,
  Pagination,
  Card,
  TextField,
  Icon,
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { Part, ProductPart } from '../../types';
import { PartsLayout } from './Parts';
import {
  usePaginatedResource,
  LoadItemsProps,
  LoadItemsPayload,
} from '../../Hooks';
import { partsLoad } from '../../Data';
import { CompanyContext } from '../../Context';
import { useToast } from '../../BridgeHooks';
import { noop } from '../../Utils';

async function loadParts(props: LoadItemsProps) {
  const payload = await partsLoad({ ...props, params: { onshopify: 'false' } });
  const response: LoadItemsPayload<Part> = {
    ...payload,
    items: payload.parts,
  };
  return response;
}

export interface PartsAddProps {
  disabled: boolean;
  parts: ProductPart[];
  onCancel: () => void;
  onAddParts: (parts: ProductPart[]) => void;
}

function PartsAdd(props: PartsAddProps) {
  const { disabled, parts, onCancel, onAddParts } = props;
  const { defaultProductImage } = useContext(CompanyContext);
  const showToast = useToast();

  const { loading, items, query, handleQueryUpdate, pagination } =
    usePaginatedResource({
      loadItems: loadParts,
    });

  const [selectedParts, setSelectedParts] = useState<Part[]>([]);

  const handleSelectionChange = useCallback(
    (ids: string[]) => {
      // We have to diff this against the selected because the
      // selected parts may no longer be loaded
      const existingParts = selectedParts.filter((p) => ids.includes(p.id));
      const existingIds = existingParts.map((p) => p.id);
      const newParts = ids
        .filter((id) => !existingIds.includes(id))
        .map((id) => items.find((p) => p.id === id) as Part);

      setSelectedParts([...existingParts, ...newParts]);
    },
    [items, selectedParts],
  );

  const handleAdd = useCallback(() => {
    const existingIds = parts.map((p) => p.id);
    const parsedParts = selectedParts
      // Check for duplication
      .filter((p) => !existingIds.includes(p.id))
      .map<ProductPart>((part) => ({
        id: part.id,
        sku: part.sku,
        discontinued: false,
        upSold: false,
        salePrice: part.price,
        price: part.price,
        promotion: 0,
        option1: '',
        option2: '',
        option3: '',
        erp: part.erp,
        replacements: [],
      }));

    // Check for duplication
    const duplicates = selectedParts.length - parsedParts.length;

    if (duplicates) {
      const message =
        duplicates < 2
          ? 'Duplicate part not added'
          : `${duplicates} duplicate parts not added`;

      showToast({ message });
    }

    onAddParts(parsedParts);
  }, [onAddParts, parts, selectedParts, showToast]);

  const header = useMemo(() => {
    const nothingSelected = selectedParts.length === 0;
    const addingText =
      selectedParts.length < 2
        ? 'Add Part'
        : `Add ${selectedParts.length} Parts`;

    return (
      <Stack alignment="center" distribution="trailing">
        <Stack.Item fill>
          <Heading>Adding Parts</Heading>
        </Stack.Item>

        <Button disabled={disabled} onClick={onCancel}>
          Cancel
        </Button>

        <Button
          primary
          disabled={disabled || nothingSelected}
          onClick={handleAdd}
        >
          {addingText}
        </Button>
      </Stack>
    );
  }, [disabled, handleAdd, onCancel, selectedParts.length]);

  return (
    <PartsLayout header={header}>
      <div className="addPartsListing">
        <ResourceList
          loading={loading}
          items={items}
          resolveItemId={(part: Part) => part.id}
          selectedItems={selectedParts.map((p) => p.id)}
          onSelectionChange={handleSelectionChange}
          selectable={!disabled}
          renderItem={(part: Part, id) => (
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
      </div>
    </PartsLayout>
  );
}

export default PartsAdd;
