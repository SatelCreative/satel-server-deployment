import React, { useCallback } from 'react';
import { Button } from '@shopify/polaris';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField } from '@satel/formik-polaris';
import { object, string } from 'yup';

const CATEGORY_SCHEMA = object({
  name: string().min(3, 'Too short'),
});

interface ItemAddProps {
  /**
   * Label for the input
   */
  label: string;

  /**
   * Placeholder text for the input
   */
  placeholder: string;

  /**
   * If the form is accepting input
   */
  disabled: boolean;

  /**
   * User has added an item
   */
  onAdd: (name: string) => void;
}

function ItemAdd(props: ItemAddProps) {
  const { label, placeholder, disabled, onAdd } = props;

  const handleSubmit = useCallback(
    (values: { name: string }, helpers: FormikHelpers<{ name: string }>) => {
      onAdd(values.name);
      helpers.resetForm();
    },
    [onAdd],
  );

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={CATEGORY_SCHEMA}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ dirty }) => (
        <Form>
          <TextField
            autoComplete="off"
            name="name"
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            connectedRight={
              <Button primary submit disabled={disabled || !dirty}>
                Add
              </Button>
            }
          />
        </Form>
      )}
    </Formik>
  );
}

export default ItemAdd;
