import { RouteComponentProps } from '@reach/router';
import { Checkbox } from '@satel/formik-polaris';
import {
  Card,
  FormLayout,
  SkeletonBodyText,
  SkeletonPage,
} from '@shopify/polaris';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback } from 'react';
import { useToast } from '../../BridgeHooks';
import { Page } from '../../Components/Page';
import { PageForm } from '../../Components/PageForm';
import { Flags, useFlags, useFlagsUpdate } from '../../Query';

interface FlagsFormProps {
  initialFlags: Flags;
}

function FlagsForm(props: FlagsFormProps) {
  const { initialFlags } = props;

  const showToast = useToast();
  const { mutateAsync: updateFlags } = useFlagsUpdate();

  const handleSubmit = useCallback(
    async (values: Flags, helpers: FormikHelpers<Flags>) => {
      try {
        const result = await updateFlags(values);
        if (result) {
          showToast({ message: 'Flags updated' });
          helpers.resetForm({ values: result });
        } else {
          throw new Error('');
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
        showToast({ message: 'Error updating flags', error: true });
      }
    },
    [showToast, updateFlags],
  );

  const formik = useFormik({
    initialValues: initialFlags,
    onSubmit: handleSubmit,
  });

  return (
    <PageForm formik={formik} existingResource sectioned>
      <Card sectioned>
        <FormLayout>
          {Object.keys(initialFlags.flags).map((name) => (
            <Checkbox key={name} name={`flags.${name}`} label={name} />
          ))}
        </FormLayout>
      </Card>
    </PageForm>
  );
}

export function FlagsRoute(props: RouteComponentProps) {
  const { data } = useFlags();

  if (!data) {
    return (
      <SkeletonPage title="Feature flags" breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page title="Feature flags" breadcrumbs={[{ content: 'Home', url: '/' }]}>
      <FlagsForm initialFlags={data} />
    </Page>
  );
}
