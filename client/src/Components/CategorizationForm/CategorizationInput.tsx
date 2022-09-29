import { TextField } from '@satel/formik-polaris';
import { Modal, useAppBridge } from '@shopify/app-bridge-react';
import {
  Button,
  Card,
  ChoiceList,
  FormLayout,
  Stack,
  Tag,
  TextStyle,
} from '@shopify/polaris';
import {
  Form,
  FormikHelpers,
  FormikProvider,
  useField,
  useFormik,
} from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { object, string } from 'yup';
import { Modal as ModalAction } from '@shopify/app-bridge/actions';
import { useLoading } from '../../BridgeHooks';
import config from '../../config';

export interface CategorizationOptionValue {
  id?: string;
  group: string;
  option: string;
}

export interface CategorizationValue {
  groups: string[];
  options: CategorizationOptionValue[];
}

interface GroupOptionValues {
  option: string;
}

interface GroupOptionsProps {
  group: string;
  options: CategorizationOptionValue[];
  onAdd: (option: string, group: string) => void;
  onRemove: (option: string, group: string) => void;
}

function GroupOptions(props: GroupOptionsProps) {
  const { group, options, onAdd, onRemove } = props;

  const handleSubmit = useCallback(
    (value: GroupOptionValues, helpers: FormikHelpers<GroupOptionValues>) => {
      onAdd(value.option, group);
      helpers.resetForm();
    },
    [group, onAdd],
  );

  const validationSchema = useMemo(
    () =>
      object({
        option: string()
          .label('Option')
          .trim()
          .min(3)
          .notOneOf(
            options.map((o) => o.option),
            'Option already exists',
          )
          .required(),
      }),
    [options],
  );

  const formik = useFormik({
    initialValues: {
      option: '',
    },
    onSubmit: handleSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const handleRemove = useCallback(
    (option: string) => () => {
      onRemove(option, group);
    },
    [group, onRemove],
  );

  const tagsMarkup = useMemo(() => {
    return options.map((option, index) => {
      if (option.id) {
        return <Tag key={option.id}>{option.option}</Tag>;
      }
      return (
        <Tag key={option.option} onRemove={handleRemove(option.option)}>
          {option.option}
        </Tag>
      );
    });
  }, [handleRemove, options]);

  return (
    <FormikProvider value={formik}>
      <Form>
        <FormLayout>
          <Stack spacing="tight">{tagsMarkup}</Stack>
          <TextField
            autoComplete="off"
            name="option"
            label={`Add an option to ${group}`}
            placeholder={`Add an option to ${group}`}
            labelHidden
            connectedRight={
              <Button submit disabled={!formik.dirty}>
                Add option
              </Button>
            }
          />
        </FormLayout>
      </Form>
    </FormikProvider>
  );
}

export interface CategorizationInputProps {
  name: string;
  label: string;
}

export function CategorizationInput(props: CategorizationInputProps) {
  const { name, label } = props;

  const app = useAppBridge();

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);

  useLoading(groupModalOpen && !initialized, { controlled: true });

  const handleGroupModalOpen = useCallback(() => {
    setGroupModalOpen(true);
  }, []);
  const handleGroupModalClose = useCallback(() => {
    setGroupModalOpen(false);
    setInitialized(false);
    setSaveEnabled(false);
  }, []);

  const [groupsField, , groupsHelpers] = useField<
    CategorizationValue['groups']
  >(`${name}.groups`);
  const [optionsField, , optionsHelpers] = useField<
    CategorizationValue['options']
  >(`${name}.options`);

  const [selected, setSelected] = useState(groupsField.value[0] ?? '');

  const handleAddOption = useCallback(
    (option: string, group: string) => {
      const newValue = optionsField.value.slice();
      newValue.push({
        option,
        group,
      });
      optionsHelpers.setValue(newValue);
    },
    [optionsField.value, optionsHelpers],
  );

  const handleRemoveOption = useCallback(
    (option: string, group: string) => {
      const newValue = optionsField.value.filter(
        (o) => o.group !== group || o.option !== option,
      );
      optionsHelpers.setValue(newValue);
    },
    [optionsField.value, optionsHelpers],
  );

  const handleAddGroup = useCallback(
    (groupName: string) => {
      const newValue = groupsField.value.slice();
      newValue.push(groupName);
      groupsHelpers.setValue(newValue);
    },
    [groupsField.value, groupsHelpers],
  );

  const renderChildren = useCallback(
    (isSelected: boolean) => {
      if (!isSelected) {
        return null;
      }
      const values = optionsField.value.filter((o) => o.group === selected);
      return (
        <GroupOptions
          key={selected}
          group={selected}
          options={values}
          onAdd={handleAddOption}
          onRemove={handleRemoveOption}
        />
      );
    },
    [handleAddOption, handleRemoveOption, optionsField.value, selected],
  );

  useEffect(() => {
    return app.subscribe(
      ModalAction.Action.DATA,
      (action: {
        id: string;
        type: string;
        fromPage?: boolean;
        [key: string]: any;
      }) => {
        if (action.id !== name || !!action.fromPage) {
          return;
        }

        switch (action.type) {
          case 'INIT': {
            setInitialized(true);
            return;
          }
          case 'DIRTY': {
            setSaveEnabled(action?.dirty === true);
            return;
          }
          case 'SUBMIT': {
            handleAddGroup(action.value);
            handleGroupModalClose();
            return;
          }
          default:
            // eslint-disable-next-line no-console
            console.warn('Unknown action', action);
        }
      },
    );
  }, [app, handleAddGroup, handleGroupModalClose, name]);

  return (
    <Card
      sectioned
      actions={[{ content: 'Add new group', onAction: handleGroupModalOpen }]}
    >
      <ChoiceList
        title="todo"
        titleHidden
        choices={groupsField.value.map((o) => {
          const values = optionsField.value.filter((oo) => oo.group === o);
          return {
            label: (
              <Stack vertical spacing="extraTight">
                <TextStyle variation="strong">{o}</TextStyle>
                {selected !== o && (
                  <TextStyle variation="subdued">
                    {values.length} options
                  </TextStyle>
                )}
              </Stack>
            ),
            value: o,
            renderChildren,
          };
        })}
        selected={[selected]}
        onChange={([s]) => setSelected(s)}
      />
      <Modal
        title={`Add new group to ${label}`}
        src={`/modal/categorizations/${name}?shop=${config.SHOPIFY_DOMAIN}&host=${config.SHOPIFY_HOST}`}
        size="Small"
        open={groupModalOpen}
        onClose={handleGroupModalClose}
        primaryAction={{
          content: 'Add',
          onAction: () => {
            app.dispatch(
              ModalAction.data({ id: name, type: 'SUBMIT', fromPage: true }),
            );
          },
          disabled: !initialized || !saveEnabled,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleGroupModalClose,
            disabled: !initialized,
          },
        ]}
      />
    </Card>
  );
}
