// @todo refactor
/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import {
  ResourceList,
  Stack,
  Button,
  Badge,
  TextStyle,
  Tooltip,
} from '@shopify/polaris';
import { EditMinor, DeleteMinor } from '@shopify/polaris-icons';
import { FormValuesGroup } from './Categorizations';
import { noop } from '../../Utils';

function GroupStatus({ options }: { options: number }) {
  if (options === 0) {
    return (
      <Tooltip content="Will be removed upon save">
        <Badge status="warning">No options</Badge>
      </Tooltip>
    );
  }

  if (options === 1) {
    return <Badge>1 option</Badge>;
  }

  return <Badge>{`${options} options`}</Badge>;
}

interface GroupListItemProps extends FormValuesGroup {
  /**
   * Unique identifier of this group
   */
  id: string;

  /**
   * Is this group selected
   */
  selected: boolean;

  /**
   * Callback for when this group
   * is selected
   */
  onSelect: (id: string) => void;
}

function GroupListItem(props: GroupListItemProps) {
  const { id, name, options, selected, onSelect } = props;

  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const empty = options.length === 0;

  return (
    // @todo clean this up
    <div
      style={
        selected
          ? {
              backgroundImage:
                'linear-gradient(rgba(179,188,245,.15),rgba(179,188,245,.15))',
            }
          : {}
      }
    >
      <ResourceList.Item id={id} onClick={handleClick}>
        <Stack alignment="center" distribution="leading">
          <Stack.Item fill>
            <TextStyle variation="strong">{name}</TextStyle>
          </Stack.Item>
          <Stack.Item>
            <GroupStatus options={options.length} />
          </Stack.Item>
          <Stack.Item>
            <Tooltip content="Coming soon!">
              <Button plain disabled icon={EditMinor} onClick={noop} />
            </Tooltip>
          </Stack.Item>
          <Stack.Item>
            <Tooltip content="Coming soon!">
              <Button
                destructive
                plain
                disabled
                icon={DeleteMinor}
                onClick={noop}
              />
            </Tooltip>
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    </div>
  );
}

export default GroupListItem;
