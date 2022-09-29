import React from 'react';
import { Card, EmptyState, Scrollable, ResourceList } from '@shopify/polaris';

import { Field, FieldProps } from 'formik';
import { FormValuesOption, FormValuesGroup } from './Categorizations';
import OptionsListItem from './OptionsListItem';
import ItemAdd from './ItemAdd';
import sortOptionsByKey from '../../Utils';

interface OptionsListProps {
  /**
   * List of the options to render
   */
  options: FormValuesOption[];

  /**
   * When an option is added
   */
  onAdd: (name: string) => void;

  loading: boolean;
  saving: boolean;
}

function OptionsList(props: OptionsListProps) {
  const { options, onAdd, loading, saving } = props;

  const sortedOptions = React.useMemo(
    () => options.sort(sortOptionsByKey('option')),
    [options],
  );

  return (
    <Card>
      <Scrollable shadow style={{ height: 520 }}>
        <ResourceList
          resourceName={{ singular: 'Option', plural: 'Options' }}
          items={sortedOptions}
          resolveItemId={(option: FormValuesOption) =>
            option.id || option.option
          }
          renderItem={(option: FormValuesOption, id) => (
            <OptionsListItem key={id} option={option} />
          )}
        />
      </Scrollable>
      <Card.Section subdued>
        <ItemAdd
          label="Add an option"
          placeholder="Raster pro"
          disabled={loading || saving}
          onAdd={onAdd}
        />
      </Card.Section>
    </Card>
  );
}

interface OptionListConnectorProps {
  name: string;
  loading: boolean;
  saving: boolean;
}

function OptionListConnector({ name, ...status }: OptionListConnectorProps) {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps<FormValuesGroup>) => {
        const group: FormValuesGroup = field.value;

        if (!group) {
          return <EmptyState heading="Select a group" image="" />;
        }

        return (
          <OptionsList
            {...status}
            options={group.options}
            onAdd={(option) => {
              form.setFieldValue(`${name}.options`, [
                ...group.options,
                { option },
              ]);
            }}
          />
        );
      }}
    </Field>
  );
}

export default OptionListConnector;
