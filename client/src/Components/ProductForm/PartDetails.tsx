import React from 'react';
import { Stack, Card, Scrollable } from '@shopify/polaris';

interface PartDetailsProps {
  erp: {
    key: string;
    value: number | string;
  }[];
}

function PartDetails(props: PartDetailsProps) {
  const { erp } = props;
  return (
    <Card subdued sectioned>
      <Scrollable hint horizontal>
        <Stack wrap={false} alignment="leading">
          {erp.map(({ key, value }) => (
            <Card.Section key={key} title={key}>
              <Stack vertical alignment="leading" distribution="leading">
                <Stack.Item>
                  <span>{value}</span>
                </Stack.Item>
              </Stack>
            </Card.Section>
          ))}
        </Stack>
      </Scrollable>
    </Card>
  );
}
export default PartDetails;
