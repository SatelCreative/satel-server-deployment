import React from 'react';
import {
  ChoiceList,
  ChoiceListProps,
  Scrollable,
  TextField,
  EmptySearchResult as PolarisEmptySearchResult,
} from '@shopify/polaris';

type ChoiceDescriptor = ChoiceListProps['choices'][0];

interface SelectOptionProps {
  disabled: boolean;
  loading: boolean;
  isCategory: boolean;
  sortedOptions: ChoiceDescriptor[];
  selected: string[];
  updateSelectedCategorizations: (sel: string[]) => void;
  query: string;
  handleSearchValueChange: (query: string) => void;
}

function SelectOptionList(props: SelectOptionProps) {
  const {
    disabled,
    selected,
    sortedOptions,
    isCategory,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading,
    updateSelectedCategorizations,
    query,
    handleSearchValueChange,
  } = props;

  return (
    <Scrollable shadow style={{ height: 600 }}>
      <div className="category-selector">
        <TextField
          autoComplete="off"
          disabled={disabled}
          onChange={(q: string) => handleSearchValueChange(q)}
          value={query}
          label="Search Options"
          labelHidden
          placeholder="Search Options"
        />
        {!sortedOptions.length && (
          <div style={{ paddingTop: '50px' }}>
            <PolarisEmptySearchResult
              title="No options found"
              description="Try another search term"
              withIllustration
            />
          </div>
        )}

        <ChoiceList
          title="categorizations"
          titleHidden
          disabled={disabled}
          selected={selected}
          choices={sortedOptions}
          onChange={updateSelectedCategorizations}
          allowMultiple={isCategory}
        />
      </div>
    </Scrollable>
  );
}

export default SelectOptionList;
