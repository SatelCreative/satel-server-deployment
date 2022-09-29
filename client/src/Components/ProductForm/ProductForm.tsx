// @todo refactor
import React, { useCallback } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { Card } from '@shopify/polaris';
import { Product, ProductPart } from '../../types';
import General from './General';
import { SCHEMA } from './schema';
import Published from './Published';
import Flags from './Flags';
import Parts from './Parts';
import Images, { Image } from './Images';
import CategorizationSelector from '../CategorizationSelector';
import CategorizationWarningBanner from '../CategorizationSelector/CategorizationWarningBanner';
import { CategorizationResource } from '../../Data/categorization';
import { PageForm } from '../PageForm';

export interface ProductFormValues {
  title: string;
  handle: string;
  description?: string;
  option1: string;
  option2: string;
  option3: string;
  images: Image[];
  parts: ProductPart[];
  categorizations: string[];
}

interface ProductFormProps {
  /**
   * Defines if the initial data is loading
   */
  loading?: boolean;

  /**
   * The product before any modifications
   * have been made
   */
  initialProduct?: Product;

  /**
   * Callback for when the form is submitting.
   * Will only be called after validation has passed
   */
  onSubmit: (
    values: ProductFormValues,
  ) => Promise<Product | void> | Product | void;
}

function ProductForm(props: ProductFormProps) {
  const {
    loading = false,
    initialProduct = {
      title: '',
      handle: '',
      description: '',
      option1: 'Title',
      option2: '',
      option3: '',
      parts: [],
      images: [],
      categorizations: [],
    },
    onSubmit,
  } = props;

  const handleSubmit = useCallback(
    (values: ProductFormValues, helpers: FormikHelpers<ProductFormValues>) => {
      Promise.resolve(onSubmit(values))
        .then((product: Product | void) => {
          helpers.setSubmitting(false);
          if (product) {
            helpers.resetForm({ values: product });
          }
        })
        .catch(() => {
          helpers.setSubmitting(false);
        });
    },
    [onSubmit],
  );

  const formik = useFormik<ProductFormValues>({
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: SCHEMA,
    initialValues: initialProduct,
    onSubmit: handleSubmit,
  });

  const disabled = loading || formik.isSubmitting;

  return (
    <PageForm
      formik={formik}
      existingResource={!!initialProduct.title}
      renderFormElement={false}
    >
      <PageForm.Section>
        <General disabled={disabled} />
      </PageForm.Section>
      <PageForm.Section oneThird secondary>
        <Published disabled={disabled} />
        <Flags disabled={disabled} />
        <Images disabled={disabled} />
      </PageForm.Section>
      <PageForm.Section>
        <Card>
          <CategorizationWarningBanner
            show={!formik.values.categorizations.length}
            resource={formik.values.title}
          />
          <CategorizationSelector
            disabled={disabled}
            selected={formik.values.categorizations}
            onUpdateSelected={(selected) =>
              formik.setFieldValue('categorizations', selected)
            }
            resourceType={CategorizationResource.Product}
          />
        </Card>
      </PageForm.Section>
      <PageForm.Section fullWidth>
        <Parts disabled={disabled} />
      </PageForm.Section>
    </PageForm>
  );
}

export default ProductForm;
