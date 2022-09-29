/* eslint-disable react/no-unused-prop-types */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tabs, Layout, Card } from '@shopify/polaris';
import { categorization } from '../../Data';
import {
  CategorizationGroup,
  CategorizationOption,
  CategorizationResource,
} from '../../Data/categorization';
import GroupList from './GroupList';
import sortOptionsByKey from '../../Utils';
import SelectOptionList from './SelectOption';
import { TABS } from '../../constants';
import { useSearch, useResource } from '../../Hooks';

interface CategorizationsSelectorProps {
  disabled: boolean;
  selected: string[];
  connectedResource?: CategorizationResource;
  onUpdateSelected: (selected: string[]) => void;
  resourceType: string;
}

function CategorizationSelector(props: CategorizationsSelectorProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disabled, selected, onUpdateSelected, resourceType } = props;

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<CategorizationGroup>();

  function load() {
    return categorization.load(resourceType as CategorizationResource);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, resource } = useResource(load);

  const options = useMemo<CategorizationOption[]>(() => {
    if (loading || !resource || !selectedGroup) {
      return [];
    }
    return selectedGroup.options;
  }, [loading, resource, selectedGroup]);

  const groups = useMemo<
    (CategorizationGroup & {
      selectedOptions: number;
      options: CategorizationOption[];
    })[]
  >(() => {
    if (loading || !resource) {
      return [];
    }

    return (resource as any)[TABS[selectedTab].id].map((g: any) => ({
      ...g,
      selectedOptions: g.options.filter(({ id }: any) => selected.includes(id))
        .length,
    }));
  }, [loading, resource, selected, selectedTab]);

  // Automatically select first group

  useEffect(() => {
    if (!groups.length) {
      if (selectedGroup) {
        setSelectedGroup(undefined);
      }
    }

    if (!selectedGroup || !groups.find((g) => selectedGroup.id === g.id)) {
      setSelectedGroup(groups[0]);
    }
  }, [selectedGroup, groups]);

  const sortedOptions = useMemo(() => {
    return options.sort(sortOptionsByKey('option')).map((option) => {
      return { label: option.option, value: option.id };
    });
  }, [options]);

  const [items, query, setQuery] = useSearch(sortedOptions, {
    keys: ['label'],
  });

  useEffect(() => {
    setQuery('');
  }, [setQuery, selectedGroup]);

  // If 'category' tab is selected we check that there
  // are no other categories selected before updating,
  // otherwise we send the whole selected list to onUpdateSelected
  const updateSelectedCategorizations = useCallback(
    (sel: string[]) => {
      if (selectedTab === 0) {
        const categoryOptions = groups.reduce(
          (acc: string[], current: CategorizationGroup) => {
            return acc.concat(current.options.map((option) => option.id));
          },
          [],
        );

        const noCategorySelected = selected.filter(
          (option) => !categoryOptions.includes(option),
        );
        return onUpdateSelected([...noCategorySelected, ...sel]);
      }
      return onUpdateSelected(sel);
    },
    [groups, onUpdateSelected, selected, selectedTab],
  );

  return (
    <Tabs tabs={TABS} selected={selectedTab} onSelect={setSelectedTab}>
      <Layout>
        <Layout.Section secondary>
          <Card>
            <GroupList
              loading={loading}
              groups={groups}
              selected={selectedGroup ? selectedGroup.id : undefined}
              onSelect={setSelectedGroup}
            />
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <SelectOptionList
            disabled={disabled}
            loading={loading}
            isCategory={selectedTab > 0}
            sortedOptions={items}
            selected={selected}
            updateSelectedCategorizations={updateSelectedCategorizations}
            query={query}
            handleSearchValueChange={setQuery}
          />
        </Layout.Section>
      </Layout>
    </Tabs>
  );
}

export default CategorizationSelector;
