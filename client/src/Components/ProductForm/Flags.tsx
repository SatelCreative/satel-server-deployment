import React from 'react';
import { Card, FormLayout, Stack, Tooltip, Icon } from '@shopify/polaris';
import { Checkbox } from '@satel/formik-polaris';
import { QuestionMarkMinor } from '@shopify/polaris-icons';

interface FlagsProps {
  disabled: boolean;
}

function Flags({ disabled }: FlagsProps) {
  return (
    <Card subdued sectioned>
      <FormLayout>
        <Stack spacing="extraTight" alignment="center">
          <Checkbox
            name="callOnly"
            label="Call only product"
            disabled={disabled}
          />
          <Tooltip content="Add to cart button will be disabled. A message saying to call customer service will be displayed.">
            <Icon source={QuestionMarkMinor} color="subdued" />
          </Tooltip>
        </Stack>
        <Stack spacing="extraTight" alignment="center">
          <Checkbox
            name="installationRequired"
            label="Professional Installation Required"
            disabled={disabled}
          />
          <Tooltip content="Warns customers that this product requires professional installation.">
            <Icon source={QuestionMarkMinor} color="subdued" />
          </Tooltip>
        </Stack>
      </FormLayout>
    </Card>
  );
}

export default Flags;
