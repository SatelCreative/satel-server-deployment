import React, { useCallback } from 'react';
import { Stack, Tag, Tooltip } from '@shopify/polaris';
import { Field, FieldArray } from 'formik';
import { Part } from './NewProductForm';

interface PartTagsProps {
  parts: Part[];
  onRemove: (index: number) => void;
}

function PartTags(props: PartTagsProps) {
  const { parts, onRemove } = props;
  const handleRemove = useCallback(
    (index: number) => () => {
      onRemove(index);
    },
    [onRemove],
  );

  if (parts.length === 1) {
    const part = parts[0];
    return (
      <Tooltip content="Product must have at least one part">
        <Tag key={part.id} disabled>
          {part.sku}
        </Tag>
      </Tooltip>
    );
  }
  return (
    <>
      {parts.map((part, index) => (
        <span key={part.id} style={{ padding: '1em 1em 1em 0' }}>
          <Tag onRemove={handleRemove(index)}>{part.sku}</Tag>
        </span>
      ))}
    </>
  );
}

function PartsSelector() {
  return (
    <Stack>
      <FieldArray name="parts">
        {({ remove }) => (
          <Field name="parts">
            {({ field }: any) => {
              const parts = field.value;
              return <PartTags parts={parts} onRemove={remove} />;
            }}
          </Field>
        )}
      </FieldArray>
    </Stack>
  );
}

export default PartsSelector;
