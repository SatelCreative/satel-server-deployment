import React, { useCallback, useMemo } from 'react';
import {
  AppProvider,
  Card,
  Modal,
  FormLayout,
  Stack,
  Button,
} from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import { TextField } from '@satel/formik-polaris';
import { connect, FormikProps, Formik, Form } from 'formik';
import { OPTIONS_SCHEMA } from './schema';

interface OptionsModalProps {
  open: boolean;
  onClose: () => void;
}

export interface OptionsFormValues {
  option1: string;
  option2?: string;
  option3?: string;
  hadOption2: boolean;
  hadOption3: boolean;
}

function OptionsModal(props: OptionsModalProps & { formik: FormikProps<any> }) {
  const { open, onClose, formik: parentFormik } = props;

  const { option1, option2, option3 } = parentFormik.values;
  const { setFieldValue, initialValues: parentInital } = parentFormik;

  const initialValues: OptionsFormValues = useMemo(() => {
    return {
      option1,
      option2,
      option3,
      hadOption2: !!parentInital.option2,
      hadOption3: !!parentInital.option3,
    };
  }, [option1, option2, option3, parentInital.option2, parentInital.option3]);

  const handleSubmit = useCallback(
    (values) => {
      setFieldValue('option1', values.option1);
      setFieldValue('option2', values.option2);
      setFieldValue('option3', values.option3);

      // Clear existing parts options
      parentFormik.values.parts.forEach((_: any, index: any) => {
        if (!values.option3) {
          setFieldValue(`parts.${index}.option3`, undefined);
        }
        if (!values.option2) {
          setFieldValue(`parts.${index}.option2`, undefined);
        }
      });

      onClose();
    },
    [onClose, parentFormik.values.parts, setFieldValue],
  );

  return (
    <Formik<OptionsFormValues>
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={OPTIONS_SCHEMA}
      validateOnChange={false}
      validateOnBlur
    >
      {({ dirty, resetForm }) => (
        <AppProvider i18n={translations}>
          <Modal
            title=""
            titleHidden
            open={open}
            onClose={() => {
              resetForm();
              onClose();
            }}
          >
            <Form>
              <Card>
                <Card.Section>
                  <FormLayout>
                    <TextField
                      autoComplete="off"
                      name="option1"
                      label="Option1"
                      placeholder="Diameter"
                    />
                    <TextField
                      autoComplete="off"
                      name="option2"
                      label="Option2"
                      placeholder="Width"
                    />
                    <TextField
                      autoComplete="off"
                      name="option3"
                      label="Option3"
                      placeholder="Length"
                    />
                  </FormLayout>
                </Card.Section>
                <Card.Section>
                  <Stack distribution="trailing">
                    <Button
                      onClick={() => {
                        resetForm();
                        onClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button submit primary disabled={!dirty}>
                      Done
                    </Button>
                  </Stack>
                </Card.Section>
              </Card>
            </Form>
          </Modal>
        </AppProvider>
      )}
    </Formik>
  );
}

export default connect<OptionsModalProps>(OptionsModal);
