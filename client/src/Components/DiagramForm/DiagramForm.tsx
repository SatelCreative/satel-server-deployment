import React, { useMemo, useCallback } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import { Card, FormLayout } from '@shopify/polaris';
import { Checkbox, TextField } from '@satel/formik-polaris';
import { useNavigate } from '@reach/router';
import {
  Diagram,
  Categorizations,
  useDiagramUpdate,
  useDiagramCreate,
} from '../../Query';
import { validationSchema, DiagramFormValues } from './schema';
import {
  diagramToValue,
  valuesToUpdatePayload,
  valuesToCreatePayload,
} from './utils';
import { ImageInput } from './ImageInput';
import { PartsInput } from './PartsInput';
import { PageForm } from '../PageForm';
import { CategoryInput } from '../CategoryInput';
import { useToast } from '../../BridgeHooks';
import { DevicesInput } from './DevicesInput';

export interface DiagramFormProps {
  categorizations: Categorizations;
  initialDiagram?: Diagram;
}

export function DiagramForm(props: DiagramFormProps) {
  const { initialDiagram, categorizations } = props;

  const navigate = useNavigate();
  const showToast = useToast();

  const initialValues = useMemo(() => {
    if (!initialDiagram) {
      return validationSchema.getDefault();
    }
    return diagramToValue(initialDiagram, categorizations);
  }, [categorizations, initialDiagram]);

  const { mutateAsync: diagramCreate } = useDiagramCreate();
  const { mutateAsync: diagramUpdate } = useDiagramUpdate();

  const handleSubmit = useCallback(
    async (
      values: DiagramFormValues,
      helpers: FormikHelpers<DiagramFormValues>,
    ) => {
      if (!values.id) {
        const result = await diagramCreate(valuesToCreatePayload(values));
        if (result) {
          showToast({ message: `${values.title} created` });
          await navigate(`/diagrams/${result}`, { replace: true });
        } else {
          showToast({ message: 'Error saving diagram', error: true });
        }
      } else {
        const result = await diagramUpdate(valuesToUpdatePayload(values));
        if (result) {
          showToast({ message: `${values.title} saved` });
          helpers.resetForm({
            values: diagramToValue(result, categorizations),
          });
        } else {
          showToast({ message: 'Error saving diagram', error: true });
        }
      }
    },
    [categorizations, diagramCreate, diagramUpdate, navigate, showToast],
  );

  const formik = useFormik({
    initialValues: initialValues as any,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <PageForm
      formik={formik}
      existingResource={!!initialDiagram}
      discardAction={{ onBack: () => navigate('/diagrams', { replace: true }) }}
    >
      <PageForm.Section>
        <Card sectioned>
          <FormLayout>
            <TextField
              autoComplete="off"
              name="title"
              label="Title"
              placeholder="My diagram"
            />
            <TextField
              autoComplete="off"
              name="number"
              label="Number"
              placeholder="49671"
              helpText="Unique identifier for the diagram. Will be automatically generated if not provided"
            />
          </FormLayout>
        </Card>
        <ImageInput name="image" label="Image" readOnly={!!initialDiagram} />
        <PartsInput name="parts" label="Parts" readOnly={!initialDiagram} />
        <DevicesInput
          name="devices"
          label="Devices"
          readOnly={!initialDiagram}
        />
      </PageForm.Section>
      <PageForm.Section oneThird>
        <Card title="Visibility" sectioned>
          <FormLayout>
            <Checkbox
              name="published"
              label="Published"
              disabled={!initialDiagram}
            />
          </FormLayout>
        </Card>
        <CategoryInput
          name="category"
          label="Category"
          definitions={categorizations.categories}
          height={300}
          readOnly={!initialDiagram}
        />
        <CategoryInput
          name="subcategory"
          label="Sub Category"
          definitions={categorizations.subcategories}
          readOnly={!initialDiagram}
          allowMultiple
        />
        <CategoryInput
          name="compatibility"
          label="Compatibility"
          definitions={categorizations.compatibilities}
          readOnly={!initialDiagram}
          allowMultiple
        />
      </PageForm.Section>
    </PageForm>
  );
}
