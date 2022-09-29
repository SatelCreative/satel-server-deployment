import React, { useState, useEffect } from 'react';
import { Layout } from '@shopify/polaris';

import { FormValuesGroup } from './Categorizations';
import GroupList from './GroupList';
import OptionsList from './OptionsList';

interface CategoryProps {
  /**
   * Has the resource been loaded yet
   */
  loading: boolean;

  /**
   * Is the resource being saved
   */
  saving: boolean;

  /**
   * Formik based key of active category
   */
  name: string;

  /**
   * The categories that we are editing
   */
  groups: FormValuesGroup[];

  /**
   * Callback to add a group
   */
  onAddGroup: (name: string) => void;
}

function Category(props: CategoryProps) {
  const { name, loading, saving, groups, onAddGroup } = props;

  const [selectedGroup, setSelectedGroup] = useState<string>();

  useEffect(() => {
    if (!groups.length) {
      setSelectedGroup(undefined);
    } else {
      setSelectedGroup(groups[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const selectedIndex = groups.findIndex((g) => g.id === selectedGroup);

  return (
    <Layout>
      <Layout.Section secondary>
        <GroupList
          loading={loading}
          saving={saving}
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          onAddGroup={onAddGroup}
        />
      </Layout.Section>
      <Layout.Section>
        <OptionsList
          name={`${name}.${selectedIndex}`}
          loading={loading}
          saving={saving}
        />
      </Layout.Section>
    </Layout>
  );
}

export default Category;
