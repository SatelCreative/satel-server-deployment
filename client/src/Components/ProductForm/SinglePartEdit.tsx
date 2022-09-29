import React, { useMemo } from 'react';
import { Button, Stack, Heading, Card, Layout } from '@shopify/polaris';
import { ProductPart } from '../../types';
import Part from './Part';
import { PartsLayout } from './Parts';
import PartDetails from './PartDetails';

export interface SinglePartsEditProps {
  disabled: boolean;
  part: ProductPart;
  options: {
    option1: string;
    option2: string;
    option3: string;
  };
  onRequestAdd: () => void;
}

function PartsEdit(props: SinglePartsEditProps) {
  const { disabled, part, onRequestAdd } = props;

  const sharedProps = {
    name: `parts.0`,
    disabled,
  };

  const header = useMemo(
    () => (
      <Stack alignment="center" distribution="trailing">
        <Stack.Item fill>
          <Heading>Part Number: {part.sku}</Heading>
        </Stack.Item>
        <Stack.Item>
          <Button disabled={disabled} onClick={onRequestAdd}>
            Add parts
          </Button>
        </Stack.Item>
      </Stack>
    ),
    [disabled, onRequestAdd, part.sku],
  );
  return (
    <>
      <PartsLayout header={header}>
        <div className="partListing">
          <Stack vertical>
            <Stack.Item>
              <Layout>
                <Layout.Section>
                  <Layout>
                    <Layout.Section secondary>
                      <Card>
                        <Card.Section title="Alternate">
                          <Part.Alternate
                            distribution="leading"
                            {...sharedProps}
                          />
                        </Card.Section>
                      </Card>
                    </Layout.Section>
                    <Layout.Section secondary>
                      <Card>
                        <Card.Section title="Price">
                          <Part.Price distribution="leading" {...sharedProps} />
                        </Card.Section>
                      </Card>
                    </Layout.Section>
                  </Layout>
                </Layout.Section>
                <Layout.Section>
                  <Heading>Details of Part</Heading>
                </Layout.Section>
                <Layout.Section>
                  <PartDetails erp={part.erp} />
                </Layout.Section>
              </Layout>
            </Stack.Item>
          </Stack>
        </div>
      </PartsLayout>
    </>
  );
}
export default PartsEdit;
