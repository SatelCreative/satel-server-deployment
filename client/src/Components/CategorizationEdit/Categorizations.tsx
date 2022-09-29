import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Tabs, TabsProps } from '@shopify/polaris';
import { Formik, FormikHelpers } from 'formik';
import shortid from 'shortid';
import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import Category from './Category';
import {
  CategorizationNewOption,
  CategorizationResource,
} from '../../Data/categorization';
import { useAppBridge } from '../../BridgeHooks';

// @todo rename form values

export interface FormValuesOption {
  id?: string;
  option: string;
}

export interface FormValuesGroup {
  id?: string;
  name: string;
  options: FormValuesOption[];
}

export interface FormValues {
  categories: FormValuesGroup[];
  subcategories: FormValuesGroup[];
  compatibilities: FormValuesGroup[];
}

const TABS: TabsProps['tabs'] = [
  {
    id: 'categories',
    panelID: 'categories',
    accessibilityLabel: 'Category',
    content: 'Category',
  },
  {
    id: 'subcategories',
    panelID: 'subcategories',
    accessibilityLabel: 'Sub Category',
    content: 'Sub Category',
  },
  {
    id: 'compatibilities',
    panelID: 'compatibilities',
    accessibilityLabel: 'Compatibility',
    content: 'Compatibility',
  },
];

interface InternalCategorizationsProps extends FormValues {
  loading: boolean;
  saving: boolean;
  dirty: boolean;
  isSubmitting: boolean;
  resetForm: () => void;
  submitForm: () => void;
  setFieldValue: FormikHelpers<FormValues>['setFieldValue'];
}

function InternalCategorizations(props: InternalCategorizationsProps) {
  const {
    loading,
    saving,
    dirty,
    isSubmitting,
    resetForm,
    submitForm,
    setFieldValue,
    ...values
  } = props;

  const [selectedTab, setSelectedTab] = useState(0);
  const selectedResource = TABS[selectedTab].id;

  const options = useMemo(
    () => ({
      saveAction: {
        disabled: false,
      },
      discardAction: {
        disabled: false,
        discardConfirmationModal: true,
      },
    }),
    [],
  );

  const app = useAppBridge();
  const [saveBar] = useState(ContextualSaveBar.create(app, options));

  useEffect(() => {
    if (dirty || isSubmitting) {
      saveBar.dispatch(ContextualSaveBar.Action.SHOW);

      if (isSubmitting) {
        saveBar.set({
          saveAction: {
            disabled: true,
          },
          discardAction: {
            disabled: true,
          },
        });
      } else {
        saveBar.set(options);
      }
    } else {
      saveBar.dispatch(ContextualSaveBar.Action.HIDE);
    }
  }, [dirty, isSubmitting, options, saveBar]);

  useEffect(() => {
    return saveBar.subscribe(ContextualSaveBar.Action.DISCARD, () => {
      resetForm();
    });
  }, [resetForm, saveBar]);

  useEffect(() => {
    return saveBar.subscribe(ContextualSaveBar.Action.SAVE, () => {
      submitForm();
    });
  }, [saveBar, submitForm]);

  return (
    <Tabs tabs={TABS} selected={selectedTab} onSelect={setSelectedTab}>
      <br />
      <Category
        name={selectedResource}
        loading={loading}
        saving={saving}
        groups={(values as any)[selectedResource]}
        onAddGroup={(name) => {
          const group = {
            id: shortid.generate(), // Fake id
            name,
            options: [],
          };
          setFieldValue(selectedResource, [
            ...(values as any)[selectedResource],
            group,
          ]);
        }}
      />
    </Tabs>
  );
}

interface CategorizationsProps extends FormValues {
  /**
   * If the categorizations are
   * being loaded from the server
   */
  loading: boolean;

  saving: boolean;

  onSubmit: (updates: any[]) => void;

  resource: CategorizationResource;
}

function Categorizations(props: CategorizationsProps) {
  const {
    loading,
    saving,
    resource: belongsTo,
    onSubmit,
    ...initialValue
  } = props;

  const handleSubmit = useCallback(
    (values) => {
      const updates: CategorizationNewOption[] = [];

      function extractNew(groups: FormValuesGroup[], resource: any) {
        groups.forEach((group) => {
          group.options
            .filter((o) => !o.id)
            .forEach((o) => {
              updates.push({
                group: resource,
                name: group.name,
                option: o.option,
                belongsTo,
              });
            });
        });
      }

      extractNew(values.categories, 'categories');
      extractNew(values.subcategories, 'subcategories');
      extractNew(values.compatibilities, 'compatibilities');

      onSubmit(updates);
    },
    [belongsTo, onSubmit],
  );

  return (
    <Formik<FormValues>
      enableReinitialize
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={initialValue}
      onSubmit={handleSubmit}
    >
      {({
        values,
        setFieldValue,
        submitForm,
        isSubmitting,
        dirty,
        resetForm,
      }) => (
        <InternalCategorizations
          isSubmitting={isSubmitting}
          dirty={dirty}
          resetForm={resetForm}
          submitForm={submitForm}
          loading={loading}
          saving={saving}
          setFieldValue={setFieldValue}
          {...values}
        />
      )}
    </Formik>
  );
}

export default Categorizations;
