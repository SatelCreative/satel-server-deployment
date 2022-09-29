import React from 'react';
import {
  TextStyle,
  ResourceList,
  Stack,
  ButtonGroup,
  Button,
} from '@shopify/polaris';

import { EditMinor, DeleteMinor } from '@shopify/polaris-icons';
import { FormValuesOption } from './Categorizations';

interface OptionListItemProps {
  /**
   * The option to render
   */
  option: FormValuesOption;
}

function OptionsListItem({ option }: OptionListItemProps) {
  return (
    <ResourceList.Item
      id={option.id || option.option}
      onClick={() => undefined}
    >
      <Stack distribution="equalSpacing" alignment="center">
        <TextStyle key={option.id}>{option.option}</TextStyle>
        <ButtonGroup>
          <Button icon={EditMinor} plain />
          <Button icon={DeleteMinor} plain destructive />
        </ButtonGroup>
      </Stack>
    </ResourceList.Item>
  );
}

export default OptionsListItem;
