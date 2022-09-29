import React, { useCallback } from 'react';
import { Card, ResourceList, Scrollable } from '@shopify/polaris';
import { FormValuesGroup } from './Categorizations';
import ItemAdd from './ItemAdd';
import GroupListItem from './GroupListItem';

interface GroupListProps {
  /**
   * Has the resource been loaded yet
   */
  loading: boolean;

  /**
   * Is the resource being saved
   */
  saving: boolean;

  /**
   * The categories that we are editing
   */
  groups: FormValuesGroup[];

  /**
   * Defines which group is currently selected
   */
  selectedGroup: string | undefined;

  /**
   * Callback to change selected group
   */
  onSelectGroup: (id: string) => void;

  /**
   * Callback to add a group
   */
  onAddGroup: (name: string) => void;
}

function GroupList(props: GroupListProps) {
  const { loading, saving, groups, selectedGroup, onSelectGroup, onAddGroup } =
    props;

  const handleSelectGroup = useCallback(
    (id: string) => {
      onSelectGroup(id);
    },
    [onSelectGroup],
  );

  const handleGroupAdd = useCallback(
    (groupName: string) => {
      onAddGroup(groupName);
    },
    [onAddGroup],
  );

  return (
    <Card>
      <Scrollable shadow style={{ height: 520 }}>
        <ResourceList
          loading={loading}
          items={groups}
          idForItem={(group) => group.id || group.name}
          renderItem={(group: FormValuesGroup, id) => (
            <GroupListItem
              {...group}
              id={id}
              selected={selectedGroup === id}
              onSelect={handleSelectGroup}
            />
          )}
        />
      </Scrollable>
      <Card.Section subdued>
        <ItemAdd
          label="Create a new Categorization: "
          placeholder="Cutting head"
          disabled={loading || saving}
          onAdd={handleGroupAdd}
        />
      </Card.Section>
    </Card>
  );
}

export default GroupList;
