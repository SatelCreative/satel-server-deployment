import React, { useCallback } from 'react';
import { Button, Stack, Heading, ResourceList, Card } from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import { ReplacementPart } from './PartsReplacements';
import { noop } from '../../Utils';

interface ReplacementListProps {
  replacements: ReplacementPart[];
  onRemoveReplacement: (index: string, part: ReplacementPart) => void;
}

function ReplacementPartsList(props: ReplacementListProps) {
  const { replacements, onRemoveReplacement } = props;

  const handleRemoveReplacement = useCallback(
    (index, part) => {
      onRemoveReplacement(index, part);
    },
    [onRemoveReplacement],
  );

  return (
    <Card>
      <ResourceList
        items={replacements}
        resolveItemId={(part: ReplacementPart) => part.replacementPartId}
        renderItem={(part: ReplacementPart, index) => (
          <ResourceList.Item id={`${index}`} onClick={noop}>
            <Card.Section key={index}>
              <Stack alignment="center" distribution="equalSpacing">
                <Stack vertical spacing="extraTight">
                  <Stack.Item>Part #</Stack.Item>
                  <Heading>{part.replacementPartSku}</Heading>
                </Stack>
                <Stack vertical spacing="extraTight">
                  <Stack.Item>Company</Stack.Item>
                  <Heading>{part.company}</Heading>
                </Stack>
                <Stack vertical spacing="extraTight">
                  <Stack.Item>Replaces Part #</Stack.Item>
                  <Heading>{part.sku}</Heading>
                </Stack>
                <Button
                  destructive
                  icon={DeleteMinor}
                  onClick={() => handleRemoveReplacement(index, part)}
                />
              </Stack>
            </Card.Section>
          </ResourceList.Item>
        )}
      />
    </Card>
  );
}

export default ReplacementPartsList;
