import { ResourceListProps } from '@shopify/polaris';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useToast } from '../../BridgeHooks';
import { PageForm } from '../../Components/PageForm';
import {
  Categorizations,
  CategorizationCreatePayload,
  useCategorizationCreate,
} from '../../Query';
import { CategorizationInput } from './CategorizationInput';
import { CategorizationFormValues } from './schema';
import { categorizationsToValue } from './utils';

export interface CategorizationFormProps {
  initialCategorization: Categorizations;
  type: 'products' | 'diagrams' | 'devices';
  resourceName?: ResourceListProps['resourceName'];
}

export function CategorizationForm(props: CategorizationFormProps) {
  const { initialCategorization, type, resourceName } = props;

  const { singular, plural } = useMemo<{
    singular: string;
    plural: string;
  }>(() => {
    if (resourceName) {
      return resourceName;
    }
    switch (type) {
      case 'devices': {
        return {
          singular: 'device',
          plural: 'devices',
        };
      }
      case 'diagrams': {
        return {
          singular: 'diagram',
          plural: 'diagrams',
        };
      }
      default: {
        return {
          singular: 'product',
          plural: 'products',
        };
      }
    }
  }, [resourceName, type]);

  const showToast = useToast();

  const initialValues = useMemo(
    () => categorizationsToValue(initialCategorization),
    [initialCategorization],
  );

  const { mutateAsync: createCategorization } = useCategorizationCreate();

  const handleSubmit = useCallback(
    async (
      values: CategorizationFormValues,
      helpers: FormikHelpers<CategorizationFormValues>,
    ) => {
      // Accumulate new values
      const updates: CategorizationCreatePayload[] = [];
      values.categories.options
        .filter((o) => !o.id)
        .forEach((o) => {
          updates.push({
            belongsTo: type,
            group: 'category',
            name: o.group,
            option: o.option,
          });
        });
      values.subcategories.options
        .filter((o) => !o.id)
        .forEach((o) => {
          updates.push({
            belongsTo: type,
            group: 'subcategory',
            name: o.group,
            option: o.option,
          });
        });
      values.compatibilities.options
        .filter((o) => !o.id)
        .forEach((o) => {
          updates.push({
            belongsTo: type,
            group: 'compatibility',
            name: o.group,
            option: o.option,
          });
        });

      for (let i = 0; i < updates.length; i += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await createCategorization(updates[i]);
        } catch (e) {
          showToast({
            message: `Error adding option ${updates[i].name}`,
            error: true,
          });
          return;
        }
      }
      showToast({
        message: 'Categorization updated',
      });
    },
    [createCategorization, showToast, type],
  );

  const formik = useFormik<CategorizationFormValues>({
    initialValues,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <PageForm formik={formik} existingResource renderFormElement={false}>
      <PageForm.AnnotatedSection
        title="Categories"
        description={
          <>
            <p key="1">
              The category is used to define the {singular} type which will get
              the customer started on looking for their {singular}.
            </p>
            <br />
            <p key="2">
              For example the list of {singular} types could be
              &quot;machines&quot;, &quot;pumps&quot;, &quot;cutting heads&quot;
              but also &quot;Installation material&quot; if needed.
            </p>
          </>
        }
      >
        <CategorizationInput name="categories" label="Categories" />
      </PageForm.AnnotatedSection>
      <PageForm.AnnotatedSection
        title="Sub Categories"
        description={
          <>
            <p key="1">
              The sub-category is used to identify properties of the {singular}.
              A{singular} can have multiple properties at the same time.
            </p>
            <br />
            <p key="2">
              For example given a group &quot;Rated pressure&quot; with options
              &quot;40k&quot;, &quot;45k&quot;, &quot;60k&quot;,
              &quot;94k&quot;, we can imagine having a {singular} that is rated
              for &quot;60k&quot; and &quot;94k&quot;.
            </p>
          </>
        }
      >
        <CategorizationInput name="subcategories" label="Sub Categories" />
      </PageForm.AnnotatedSection>
      <PageForm.AnnotatedSection
        title="Compatibilities"
        description={
          <>
            <p>
              Certain {plural} are compatible only with a specific machine or
              pump. The compatibility defines a list of {plural} that the
              searched {singular} is compatible with.
            </p>
          </>
        }
      >
        <CategorizationInput name="compatibilities" label="Compatibilities" />
      </PageForm.AnnotatedSection>
    </PageForm>
  );
}
