import React, { useCallback } from 'react';
import {
  Scrollable,
  ResourceList,
  Stack,
  TextStyle,
  Badge,
} from '@shopify/polaris';
import { CategorizationGroup } from '../../Data/categorization';

interface GroupListItemProps extends CategorizationGroup {
  /**
   * Unique identifier of this group
   */
  id: string;

  /**
   * Is this group selected
   */
  selected: boolean;

  /**
   * The number of the children that
   * are selected
   */
  selectedOptions: number;

  /**
   * Callback for when this group
   * is selected
   */
  onSelect: (id: string) => void;
}

function GroupListItem(props: GroupListItemProps) {
  // eslint-disable-next-line react/prop-types
  const { id, name, selected, selectedOptions, onSelect } = props;

  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

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
            <Badge>{`${selectedOptions} selected`}</Badge>
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    </div>
  );
}

interface GroupListProps {
  loading: boolean;
  selected: string | undefined;
  groups: (CategorizationGroup & { selectedOptions: number })[];
  onSelect: (group: CategorizationGroup) => void;
}

function GroupList(props: GroupListProps) {
  const { loading, selected, groups, onSelect } = props;

  const handleSelect = useCallback(
    (id: string) => {
      const group = groups.find((g) => g.id === id);

      if (!group) {
        // eslint-disable-next-line no-console
        console.warn(`<GroupList /> got out of sync`);
        return;
      }

      onSelect(group);
    },
    [groups, onSelect],
  );

  return (
    <Scrollable shadow style={{ height: 600 }}>
      <ResourceList
        loading={loading}
        items={groups}
        idForItem={(group) => group.id}
        renderItem={(group, id) => (
          <GroupListItem
            {...group}
            id={id}
            selected={id === selected}
            selectedOptions={group.selectedOptions}
            onSelect={handleSelect}
          />
        )}
      />
    </Scrollable>
  );
}

export default GroupList;
