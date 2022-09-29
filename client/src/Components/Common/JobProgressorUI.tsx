import React, { useState, useCallback } from 'react';
import {
  Button,
  ProgressBar,
  Card,
  Stack,
  TextStyle,
  TextContainer,
  Checkbox,
} from '@shopify/polaris';

function JobProcessorUI(props: FormProps) {
  const {
    labelButton,
    syncing,
    syncProgress,
    error,
    syncErrorMessage,
    onSync,
    jobDescription,
    onEndpointUpdate,
  } = props;

  const [checked, setChecked] = useState(false);
  const handleChange = useCallback(
    (newChecked) => {
      setChecked(newChecked);
      if (onEndpointUpdate) {
        onEndpointUpdate(newChecked);
      }
    },
    [onEndpointUpdate],
  );

  return (
    <Card.Section>
      <TextContainer>{jobDescription}</TextContainer>
      <ProgressBar progress={syncProgress} size="medium" />
      <br />
      <Stack vertical>
        {onEndpointUpdate && (
          <Checkbox
            checked={checked}
            onChange={handleChange}
            label="Transfer Products"
            disabled={syncing || error}
          />
        )}
        <Button onClick={() => onSync()} loading={syncing}>
          {labelButton}
        </Button>
      </Stack>
      <br />
      {error && <TextStyle variation="negative">{syncErrorMessage}</TextStyle>}
    </Card.Section>
  );
}

export default JobProcessorUI;

// TYPES
export interface JobProcessorUIProps {
  labelButton: string;
  jobDescription: string;
  syncing: boolean;
  syncProgress: number;
  error: boolean;
  syncErrorMessage: string;
  onSync: () => void;
  onEndpointUpdate?: (arg: boolean) => void | undefined;
}

type FormProps = JobProcessorUIProps;
