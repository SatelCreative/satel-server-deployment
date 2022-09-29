import { TextField } from '@satel/formik-polaris';
import { Card, FormLayout } from '@shopify/polaris';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useNavigate } from '@reach/router';
import {
  Categorizations,
  Device,
  useDeviceCreate,
  useDeviceDelete,
  useDeviceUpdate,
} from '../../Query';
import { DeviceFormValues, validationSchema } from './schema';
import { PageForm } from '../PageForm';
import {
  deviceToValue,
  valuesToCreatePayload,
  valuesToUpdatePayload,
} from './utils';
import { useToast } from '../../BridgeHooks';
import { CategoryInput } from '../CategoryInput';

export interface DeviceFormProps {
  categorizations: Categorizations;
  initialDevice?: Device;
}

export function DeviceForm(props: DeviceFormProps) {
  const { initialDevice, categorizations } = props;

  const navigate = useNavigate();
  const showToast = useToast();

  const initialValues = useMemo<DeviceFormValues>(() => {
    if (!initialDevice) {
      return validationSchema.getDefault() as any;
    }
    return deviceToValue(initialDevice);
  }, [initialDevice]);

  const { mutateAsync: deviceCreate } = useDeviceCreate();
  const { mutateAsync: deviceUpdate } = useDeviceUpdate();
  const { mutateAsync: deviceDelete, isLoading: deleting } = useDeviceDelete();

  const handleSubmit = useCallback(
    async (
      values: DeviceFormValues,
      helpers: FormikHelpers<DeviceFormValues>,
    ) => {
      if (!values.id) {
        const result = await deviceCreate(valuesToCreatePayload(values));
        if (result) {
          showToast({ message: `${values.name} created` });
          await navigate(`/devices/${result.id}`, { replace: true });
        } else {
          showToast({ message: 'Error saving device', error: true });
        }
      } else {
        const result = await deviceUpdate(valuesToUpdatePayload(values));
        if (result) {
          showToast({ message: `${values.name} saved` });
          helpers.resetForm({
            values: deviceToValue(result),
          });
        } else {
          showToast({ message: 'Error saving device', error: true });
        }
      }
    },
    [deviceCreate, deviceUpdate, navigate, showToast],
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleDelete = useCallback(() => {
    if (!initialValues?.id) {
      throw new Error('Cannot delete device before creation');
    }
    deviceDelete(initialValues.id)
      .then(() => {
        showToast({ message: 'Device deleted' });
        return navigate('/devices', { replace: true });
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.warn(err);
        showToast({ message: 'Error deleting device', error: true });
      });
  }, [deviceDelete, initialValues?.id, navigate, showToast]);

  return (
    <PageForm
      formik={formik}
      existingResource={!!initialDevice}
      discardAction={{ onBack: () => navigate('/devices', { replace: true }) }}
      deleteAction={{
        onAction: handleDelete,
        confirmationModalTitle: `Delete ${initialValues.name}`,
        confirmationModalMessage: `Are you sure you want to delete ${initialValues.name}? This action cannot be undone.`,
        loading: deleting,
      }}
    >
      <PageForm.Section>
        <Card sectioned>
          <FormLayout>
            <TextField
              autoComplete="off"
              name="name"
              label="Title"
              placeholder=""
            />
          </FormLayout>
        </Card>
      </PageForm.Section>
      <PageForm.Section oneThird>
        <CategoryInput
          name="category"
          label="Category"
          definitions={categorizations.categories}
          height={300}
        />
        <CategoryInput
          name="subcategory"
          label="Sub Category"
          definitions={categorizations.subcategories}
          allowMultiple
        />
        <CategoryInput
          name="compatibility"
          label="Compatibility"
          definitions={categorizations.compatibilities}
          allowMultiple
        />
      </PageForm.Section>
    </PageForm>
  );
}
