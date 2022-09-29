import React, { Component, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Page, FormLayout, Button, Banner, Card } from '@shopify/polaris';
import { Formik, Form, FormikProps } from 'formik';
import { object, string } from 'yup';
import { TextField } from '@satel/formik-polaris';

interface FormValues {
  domain: string;
}

const schema = object({
  domain: string()
    .min(2, 'Must be at least two characters long')
    .matches(/^[a-zA-Z0-9][-a-zA-Z0-9.]{0,}[a-zA-Z0-9]$/, 'Invalid character')
    .required('Required'),
});

function Install(props: RouteComponentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const install = useCallback(async (domain: any) => {
    setLoading(true);
    setError(false);

    const fullDomain = domain.endsWith('.myshopify.com')
      ? domain
      : `${domain}.myshopify.com`;

    try {
      const response = await fetch('/pim/install', {
        headers: {
          'Shopify-Store-Domain': fullDomain,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid response');
      }

      const data = await response.json();

      // const { redirect } = await RESPONSE_SCHEMA.validate(data);

      // Redirect
      window.location.href = data.redirect;
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href, 'https://fake.test');
    const shop = url.searchParams.get('shop');

    if (!shop) {
      return;
    }

    setLoading(true);
    install(shop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorBanner = error ? (
    <Banner title="Error" status="critical">
      <p>
        An error occurred while trying to install the app. Please check the
        domain and try again. If this error persists the server may be down
      </p>
    </Banner>
  ) : null;

  return (
    <Page title="Shape Technologies PIM">
      {errorBanner}
      <Banner title="Directions" status="info">
        <p>
          Enter the <code>*.myshopify.com</code> domain of the Shopify Store you
          want to install this app on
        </p>
      </Banner>
      <br />
      <br />
      <Card>
        <Card.Section>
          <Formik
            initialValues={{ domain: '' }}
            validationSchema={schema}
            onSubmit={({ domain }: FormValues, { setSubmitting }) => {
              install(domain).then(() => setSubmitting(false));
            }}
            validateOnChange={false}
            validateOnBlur
          >
            {({ isValid }: FormikProps<FormValues>) => (
              <Form>
                <FormLayout>
                  <TextField
                    autoComplete="off"
                    name="domain"
                    disabled={loading}
                    label="Store Domain"
                    placeholder="my-shop"
                    suffix=".myshopify.com"
                  />
                  <Button submit primary loading={loading} disabled={!isValid}>
                    Install
                  </Button>
                </FormLayout>
              </Form>
            )}
          </Formik>
        </Card.Section>
      </Card>
    </Page>
  );
}

export default Install;
