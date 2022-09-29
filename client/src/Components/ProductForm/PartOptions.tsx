import React from 'react';
import { Stack, TextStyle, Icon } from '@shopify/polaris';
import { AlertMinor } from '@shopify/polaris-icons';
import { TextField } from '@satel/formik-polaris';
import { ErrorMessage } from 'formik';

interface PartOptionsProps {
  disabled: boolean;
  name: string;
  option1: string;
  option2: string;
  option3: string;
}

function PartOptions(props: PartOptionsProps) {
  const { name, disabled, option1, option2, option3 } = props;

  // @todo fix plz
  const style = { minHeight: '8.15rem' };

  return (
    <Stack distribution="trailing" alignment="center">
      <ErrorMessage name={`${name}.options`}>
        {(message) => {
          if (!message) {
            return null;
          }

          return (
            <Stack alignment="center" spacing="extraTight">
              <Icon source={AlertMinor} color="critical" />
              <TextStyle variation="negative">{message}</TextStyle>
            </Stack>
          );
        }}
      </ErrorMessage>
      <div style={style}>
        <TextField
          autoComplete="off"
          key="option1"
          name={`${name}.option1`}
          label={option1}
          disabled={disabled}
        />
      </div>
      <div style={style}>
        <TextField
          autoComplete="off"
          key="option2"
          name={`${name}.option2`}
          label={option2 || 'Option 2'}
          disabled={disabled || !option2}
        />
      </div>
      <div style={style}>
        <TextField
          autoComplete="off"
          key="option3"
          name={`${name}.option3`}
          label={option3 || 'Option 3'}
          disabled={disabled || !option3}
        />
      </div>
    </Stack>
  );
}

export default PartOptions;
