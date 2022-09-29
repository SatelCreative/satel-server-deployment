import { RouteComponentProps } from '@reach/router';
import { TextField } from '@satel/formik-polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Card, FormLayout } from '@shopify/polaris';
import { Form, FormikHelpers, FormikProvider, useFormik } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import { object, string } from 'yup';
import { Modal as ModalAction } from '@shopify/app-bridge/actions';
import { relative } from 'path';

interface GroupValues {
  value: string;
}

export function CategorizationsGroupModal(
  props: RouteComponentProps<{ id: string }>,
) {
  const { id } = props;

  if (!id) {
    throw new Error('Invalid group id');
  }
  const app = useAppBridge();

  useEffect(() => {
    app.dispatch(ModalAction.data({ id, type: 'INIT' }));
  }, [app, id]);

  const handleSubmit = useCallback(
    (value: GroupValues, helpers: FormikHelpers<GroupValues>) => {
      app.dispatch(
        ModalAction.data({ id, type: 'SUBMIT', value: value.value }),
      );
      helpers.resetForm();
    },
    [app, id],
  );

  const validationSchema = useMemo(
    () =>
      object({
        value: string().label('Option').trim().min(3).required(),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      value: '',
    },
    onSubmit: handleSubmit,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });

  useEffect(() => {
    app.dispatch(ModalAction.data({ id, type: 'DIRTY', dirty: formik.dirty }));
  }, [app, formik.dirty, id]);

  useEffect(() => {
    return app.subscribe(
      ModalAction.Action.DATA,
      (action: { id: string; type: string; fromPage?: boolean }) => {
        if (action.id !== id || !action.fromPage) {
          return;
        }

        switch (action.type) {
          case 'SUBMIT': {
            formik.submitForm();
            return;
          }
          default:
            // eslint-disable-next-line no-console
            console.warn('Unknown action', action);
        }
      },
    );
  }, [app, id, formik]);

  return (
    <div style={{ height: '100vh', background: 'white', overflowY: 'hidden' }}>
      <FormikProvider value={formik}>
        <Form>
          <Card sectioned>
            <TextField
              autoComplete="off"
              name="value"
              label="Group name"
              placeholder="Mechanical"
            />
            <div style={{ height: 300 }} />
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );

  return <p>TEST {id}</p>;
}
