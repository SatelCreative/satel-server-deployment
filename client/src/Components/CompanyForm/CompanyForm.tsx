import React, { useCallback } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import { FormLayout, Card, Link } from '@shopify/polaris';
import { TextField, Select } from '@satel/formik-polaris';
import { APICompany } from '../../Data/company';
import SCHEMA from './schema';
import { PageForm } from '../PageForm';

interface CompanyFormProps {
  initialCompany: APICompany;
  onSubmit: (company: APICompany) => Promise<APICompany | void>;
}

function CompanyForm(props: CompanyFormProps) {
  const { initialCompany, onSubmit } = props;

  const handleSubmit = useCallback(
    (values: APICompany, helpers: FormikHelpers<APICompany>) => {
      Promise.resolve(onSubmit(values))
        .then((newCompany) => {
          if (newCompany) {
            helpers.resetForm({ values: newCompany });
          } else {
            helpers.setSubmitting(false);
          }
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn('<CompanyForm> passed onSubmit callback threw');
          // eslint-disable-next-line no-console
          console.warn(e);
          helpers.setSubmitting(false);
        });
    },
    [onSubmit],
  );

  const formik = useFormik({
    initialValues: initialCompany,
    onSubmit: handleSubmit,
    validationSchema: SCHEMA,
  });

  return (
    <PageForm formik={formik} existingResource>
      <PageForm.Section>
        <Card sectioned>
          <FormLayout>
            <TextField autoComplete="off" name="name" label="Name" />
            <TextField
              autoComplete="off"
              name="image"
              label="Company logo url"
              helpText="Will be displayed in the top left of all pages"
            />
            <TextField
              autoComplete="off"
              name="defaultProductImage"
              label="Default product image url"
              helpText="Will be used on products without images"
            />
          </FormLayout>
        </Card>
      </PageForm.Section>
      <PageForm.Section oneThird>
        <Card sectioned subdued>
          <FormLayout>
            <TextField
              autoComplete="off"
              name="erpCurrency"
              label="Currency"
              placeholder="USD"
              helpText={
                <span>
                  Provide a currency code{' '}
                  <Link
                    external
                    url="https://en.wikipedia.org/wiki/ISO_4217#Active_codes"
                  >
                    ISO-4217
                  </Link>
                </span>
              }
            />
            <TextField
              autoComplete="off"
              name="locale"
              label="Locale"
              placeholder="en-US"
              helpText={
                <span>
                  Provide a language code{' '}
                  <Link
                    external
                    url="https://en.wikipedia.org/wiki/Language_localisation#Language_tags_and_codes"
                  >
                    ISO-639-1
                  </Link>
                </span>
              }
            />
            <Select
              name="erpWeightUnit"
              label="Weight unit"
              options={[
                { label: 'pound (lb)', value: 'lb' },
                { label: 'ounce (oz)', value: 'oz' },
                { label: 'kilogram (kg)', value: 'kg' },
                { label: 'gram (g)', value: 'g' },
              ]}
            />
          </FormLayout>
        </Card>
      </PageForm.Section>
    </PageForm>
  );
}

export default CompanyForm;
