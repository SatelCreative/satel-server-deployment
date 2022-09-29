import { useMemo, useState } from 'react';
import {
  Card,
  Scrollable,
  OptionList,
  TextField,
  Icon,
  ChoiceList,
} from '@shopify/polaris';
import { useField } from 'formik';
import { SearchMinor } from '@shopify/polaris-icons';
import { useDebounce } from 'use-debounce';
import Fuse from 'fuse.js';
import { Categorization } from '../Query';

export interface CategoryInputProps {
  name: string;
  label: string;
  definitions: Categorization[];
  allowMultiple?: boolean;
  height?: number;
  readOnly?: boolean;
}

function CategoryInputMultiple(
  props: Omit<CategoryInputProps, 'allowMultiple'>,
) {
  const { name, label, definitions, height = 350, readOnly = false } = props;

  const [field, , helpers] = useField<string[]>(name);

  const sections = useMemo(
    () =>
      definitions.map(({ name: title, options }) => ({
        title,
        options: options.map(({ option, id }) => ({
          value: id,
          label: option,
          disabled: readOnly,
        })),
      })),
    [definitions, readOnly],
  );

  return (
    <Card title={label} subdued>
      <br />
      <Scrollable shadow style={{ height }}>
        <OptionList
          sections={sections}
          selected={field.value}
          onChange={helpers.setValue}
          allowMultiple
        />
      </Scrollable>
    </Card>
  );
}

function CategoryInputSingle(props: Omit<CategoryInputProps, 'allowMultiple'>) {
  const { name, label, definitions, height = 350, readOnly = false } = props;

  const [field, meta, helpers] = useField<string | undefined | null>(name);

  const [query, setQuery] = useState(
    meta.initialValue
      ? definitions.reduce((acc, section) => {
          const option = section.options.find(
            (o) => o.id === meta.initialValue,
          );
          if (option) {
            return option.option;
          }
          return acc;
        }, '')
      : '',
  );
  const [debouncedQuery] = useDebounce(query, 200);

  const sections = useMemo(
    () =>
      definitions.map(({ name: title, options }) => ({
        title,
        options: options.map(({ option, id }) => ({
          value: id,
          label: option,
        })),
      })),
    [definitions],
  );

  const filteredSections = useMemo(() => {
    const options = sections.reduce(
      (
        acc: {
          section: string;
          value: string;
          label: string;
          key: string;
        }[],
        section,
      ) => {
        const next = section.options.map((option) => ({
          ...option,
          section: section.title,
          key: `${section.title} ${option.label}`,
        }));
        return [...acc, ...next];
      },
      [],
    );

    if (!debouncedQuery.length) {
      return options;
    }

    const fuse = new Fuse(options, {
      keys: ['key'],
      includeScore: true,
    });

    return fuse.search(debouncedQuery).map((value) => value.item);
  }, [debouncedQuery, sections]);

  return (
    <Card title={label} subdued>
      <Card.Section>
        <TextField
          autoComplete="off"
          label="Search categories"
          placeholder="Search categories"
          labelHidden
          prefix={<Icon source={SearchMinor} />}
          value={query}
          onChange={setQuery}
          clearButton
          onClearButtonClick={() => setQuery('')}
        />
      </Card.Section>
      <Scrollable shadow style={{ height }}>
        <Card.Section>
          <ChoiceList
            title="Category"
            titleHidden
            choices={filteredSections.map((option) => ({
              value: option.value,
              label: option.label,
              helpText: option.section,
            }))}
            selected={field.value ? [field.value] : []}
            onChange={([selected]) => {
              helpers.setValue(selected);
            }}
            disabled={readOnly}
          />
        </Card.Section>
      </Scrollable>
    </Card>
  );
}

export function CategoryInput(props: CategoryInputProps) {
  const { allowMultiple = false, ...rest } = props;
  if (allowMultiple) {
    return <CategoryInputMultiple {...rest} />;
  }
  return <CategoryInputSingle {...rest} />;
}
