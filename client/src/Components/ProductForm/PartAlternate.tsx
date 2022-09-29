import React, { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  StackProps,
  Autocomplete,
  AutocompleteProps,
  Icon,
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { useDebounce } from 'use-debounce';
import { Field, FieldProps } from 'formik';
import { Checkbox } from '@satel/formik-polaris';
import { partsLoad } from '../../Data';
import { PartAlternate as PA } from '../../types';

interface PartAlternateProps {
  disabled: boolean;
  name: string;
  distribution: StackProps['distribution'];
}

interface InternalProps {
  alternate?: PA;
  onAlternateUpdate: (alternate?: PA) => void;
}

function PartAlternateInternal(props: PartAlternateProps & InternalProps) {
  const { distribution, name, disabled, alternate, onAlternateUpdate } = props;

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 200);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState<PA[]>([]);

  useEffect(() => {
    setLoading(true);
    partsLoad({
      pageSize: 6,
      query: debouncedQuery,
      params: { onshopify: 'true' },
    })
      .then((payload) => {
        setParts(payload.parts);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e);
        setLoading(false);
      });
  }, [debouncedQuery]);

  // @todo fix plz
  const style = { minHeight: '8.15rem' };

  const handleClear = useCallback(() => {
    if (alternate) {
      setQuery('');
      onAlternateUpdate(undefined);
    }
  }, [alternate, onAlternateUpdate]);

  const handleSelect = useCallback(
    ([id]: string[]) => {
      const part = parts.find((p) => p.id === id);

      if (!part) {
        return;
      }

      onAlternateUpdate({ id: part.id, sku: part.sku });
    },
    [onAlternateUpdate, parts],
  );

  // This is meant to prevent the need for
  // any validation
  const handleBlur = useCallback(() => {
    if (query && !alternate) {
      const part = parts[0];
      setQuery('');

      if (part) {
        handleSelect([part.id]);
      }
    }
  }, [alternate, handleSelect, parts, query]);

  const textFieldMarkup = (
    <Autocomplete.TextField
      autoComplete="off"
      label="Alternate"
      placeholder="123-45"
      onBlur={handleBlur}
      value={alternate ? alternate.sku : query}
      onChange={setQuery}
      onClearButtonClick={handleClear}
      onFocus={handleClear}
      prefix={!alternate && <Icon source={SearchMinor} color="subdued" />}
      clearButton={!!alternate}
      disabled={disabled}
      readOnly={!!alternate}
    />
  );

  const options: AutocompleteProps['options'] = parts.map((p) => ({
    value: p.id,
    label: (
      <Stack alignment="center">
        <p>{p.sku}</p>
      </Stack>
    ),
  }));

  return (
    <Stack distribution={distribution} alignment="center">
      <div style={style}>
        <Autocomplete
          allowMultiple={false}
          listTitle="Parts"
          preferredPosition="below"
          loading={loading}
          options={options}
          selected={alternate ? [alternate.id] : []}
          onSelect={handleSelect}
          textField={textFieldMarkup}
        />
      </div>
      <Stack alignment="center">
        <Checkbox
          label="Up sell"
          name={`${name}.upSold`}
          // Just using this until connected
          encode={(v) => (v ? true : undefined)}
          disabled={disabled}
        />
      </Stack>
      <Stack alignment="center">
        <Checkbox
          label="Discontinued"
          name={`${name}.discontinued`}
          disabled={disabled}
        />
      </Stack>
    </Stack>
  );
}

function PartAlternate({ name, ...props }: PartAlternateProps) {
  const alternateName = `${name}.alternate`;

  return (
    <Field name={alternateName}>
      {({ field, form }: FieldProps<PA>) => (
        <PartAlternateInternal
          {...props}
          name={name}
          alternate={field.value}
          onAlternateUpdate={(alternate) =>
            form.setFieldValue(alternateName, alternate)
          }
        />
      )}
    </Field>
  );
}

export default PartAlternate;
