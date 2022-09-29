import React from 'react';
import { Button, Card, FormLayout } from '@shopify/polaris';
import { Select, TextField } from '@satel/formik-polaris';
import { Form } from 'formik';

const REPLACEMENT_COMPANIES = [
  { label: 'IWP', value: 'IWP' },
  { label: 'Accu', value: 'Accu' },
  { label: 'Flow', value: 'Flow' },
  { label: 'KMT', value: 'KMT' },
  { label: 'JetEdge', value: 'JetEdge' },
  { label: 'Omax', value: 'Omax' },
  { label: 'WSI', value: 'WSI' },
  { label: 'Bystronic', value: 'Bystronic' },
  { label: 'Tecnocut', value: 'Tecnocut' },
  { label: 'x_ref', value: 'x_ref' },
  { label: 'Other', value: 'other' },
];

interface Options {
  label: string;
  value: string;
}

interface InternalReplacementProps {
  dirty: boolean;
  partSkus: Options[];
}

function InternalReplacementParts(props: InternalReplacementProps) {
  const { dirty, partSkus } = props;
  return (
    <Form>
      <Card title="Replacements">
        <Card.Section>
          <FormLayout>
            <FormLayout.Group>
              <Select
                label="Select part to replace"
                labelHidden
                options={partSkus}
                name="replacementPartId"
                placeholder="Select part"
              />
              <Select
                label="Select the company the new part is from"
                labelHidden
                options={REPLACEMENT_COMPANIES}
                name="company"
                placeholder="Select company"
              />
              <TextField
                autoComplete="off"
                label="Replacement part number"
                labelHidden
                name="sku"
                placeholder="Replacement SKU"
              />
              <Button submit primary disabled={!dirty}>
                Add
              </Button>
            </FormLayout.Group>
          </FormLayout>
        </Card.Section>
      </Card>
    </Form>
  );
}

export default InternalReplacementParts;
