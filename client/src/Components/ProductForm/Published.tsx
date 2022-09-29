import React from 'react';
import { Card, FormLayout, Stack, Tooltip, Icon } from '@shopify/polaris';
import { Checkbox } from '@satel/formik-polaris';
import { QuestionMarkMinor } from '@shopify/polaris-icons';

interface PublishedProps {
  disabled: boolean;
}

function Published({ disabled }: PublishedProps) {
  return (
    <Card sectioned>
      <FormLayout>
        <Stack spacing="extraTight" alignment="center">
          <Checkbox name="published" label="Published" disabled={disabled} />
          <Tooltip content="If this product is available for purchase on the online store">
            <Icon source={QuestionMarkMinor} color="subdued" />
          </Tooltip>
        </Stack>
      </FormLayout>
    </Card>
  );
}

export default Published;
