import React, { useMemo, useCallback } from 'react';
import { Card } from '@shopify/polaris';
import { TextField } from '@satel/formik-polaris';
import { FormikHelpers, useFormik } from 'formik';
import { useNavigate } from '@reach/router';
import PartsSelector from './PartsSelector';
import PartsList from './PartsList';
import PRODUCT_CREATE_SCHEMA from './schema';
import { PageForm } from '../PageForm';

export interface Part {
  id: string;
  sku: string;
}
export interface NewProductFormValues {
  title: string;
  parts: Part[];
}

interface NewProductFormProps {
  /**
   * First part in product initialization
   */
  initialPart?: Part;
  /**
   * Callback for when the form is submitting.
   * Will only be called after validation has passed
   */
  onSubmit: (values: NewProductFormValues) => Promise<void> | void;
}

function NewProductForm(props: NewProductFormProps) {
  const { initialPart, onSubmit } = props;

  const navigate = useNavigate();

  const initialValues = useMemo(() => {
    if (!initialPart) {
      return { title: '', parts: [] };
    }
    return {
      title: '',
      parts: [{ id: initialPart.id, sku: initialPart.sku }],
    };
  }, [initialPart]);

  const handleSubmit = useCallback(
    (
      values: NewProductFormValues,
      helpers: FormikHelpers<NewProductFormValues>,
    ) => {
      Promise.resolve(onSubmit(values))
        .then(() => {
          helpers.setSubmitting(false);
        })
        .catch(() => {
          helpers.setSubmitting(false);
        });
    },
    [onSubmit],
  );

  const formik = useFormik({
    initialValues,
    validationSchema: PRODUCT_CREATE_SCHEMA,
    onSubmit: handleSubmit,
  });

  return (
    <PageForm
      formik={formik}
      sectioned
      // TODO this may not be completely correct
      discardAction={{ onBack: () => navigate('/parts', { replace: true }) }}
    >
      <Card>
        <Card.Section>
          <TextField
            autoComplete="off"
            name="title"
            placeholder="Product title"
            label="Product Title"
          />
        </Card.Section>
        <Card.Section title="Selected parts">
          <PartsSelector />
        </Card.Section>
        <Card.Section title="Parts">
          <PartsList />
        </Card.Section>
      </Card>
    </PageForm>
  );
}

export default NewProductForm;
