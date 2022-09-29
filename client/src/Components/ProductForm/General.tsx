import React from 'react';
import { Card, FormLayout } from '@shopify/polaris';
import { TextField } from '@satel/formik-polaris';

interface GeneralProps {
  disabled?: boolean;
}

function General({ disabled = false }: GeneralProps) {
  return (
    <Card title="General">
      <Card.Section>
        <FormLayout>
          <TextField
            autoComplete="off"
            name="title"
            disabled={disabled}
            label="Title"
          />
          <TextField
            autoComplete="off"
            name="description"
            disabled={disabled}
            label="Description"
            multiline={8}
          />
        </FormLayout>
      </Card.Section>
      <Card.Section>
        <FormLayout>
          <FormLayout.Group>
            <TextField
              autoComplete="off"
              name="seoTitle"
              disabled={disabled}
              label="SEO Title"
              maxLength={70}
              showCharacterCount
              helpText={<span>70 characters maximum</span>}
            />
            <TextField
              autoComplete="off"
              name="handle"
              disabled={disabled}
              label="SEO Handle"
              helpText={
                <span>lowercase letters, numbers, and dashes only</span>
              }
            />
          </FormLayout.Group>
          <TextField
            autoComplete="off"
            name="seoDescription"
            disabled={disabled}
            label="SEO Description"
            type="text"
            multiline
            maxLength={320}
            showCharacterCount
            helpText={<span>320 characters maximum</span>}
          />
        </FormLayout>
      </Card.Section>
    </Card>
  );
}

export default General;
