import React, { useState, useMemo, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  FormLayout,
  Button,
  SelectOption,
  Card,
  RadioButton,
  Stack,
} from '@shopify/polaris';
import { Select, TextField } from '@satel/formik-polaris';
import { object, string } from 'yup';
import { Redirect } from '@shopify/app-bridge/actions';
import { company } from '../../Data';
import { APICompanyOnly } from '../../Data/company';
import useToast from '../../BridgeHooks/useToast';
import { useAppBridge } from '../../BridgeHooks';

interface CompanySelectProps {
  disabled: boolean;

  /**
   * List of companies to choose from
   */
  companies: APICompanyOnly[];

  /**
   * If this is the active form option
   */
  selected: boolean;

  /**
   * When Choose company has been selected
   */
  onSelect: () => void;
}

function CompanySelect(props: CompanySelectProps) {
  const { disabled, companies, selected, onSelect } = props;

  const options = useMemo<SelectOption[]>(
    () =>
      companies.map((c: APICompanyOnly) => ({
        label: c.name,
        value: c.id,
      })),
    [companies],
  );

  if (!companies.length) {
    return null;
  }

  return (
    <Card>
      <Card.Section>
        <RadioButton
          id="selectCompany"
          label="Choose existing company"
          checked={selected}
          onChange={() => onSelect()}
          disabled={disabled}
        />
        <FormLayout>
          <Select
            name="company"
            label="Company"
            placeholder="Select Company"
            options={options}
            disabled={disabled || !selected}
          />
        </FormLayout>
      </Card.Section>
    </Card>
  );
}

interface CompanyCreateProps {
  disabled: boolean;

  /**
   * If we should show selector
   */
  empty: boolean;

  /**
   * If this is the active form option
   */
  selected: boolean;

  /**
   * When Choose company has been selected
   */
  onSelect: () => void;
  filteredCompanies: APICompanyOnly[];
}

function CompanyCreate(props: CompanyCreateProps) {
  const { empty, disabled, selected, onSelect, filteredCompanies } = props;
  const options = useMemo<SelectOption[]>(
    () =>
      filteredCompanies.map((c: APICompanyOnly) => ({
        label: c.name,
        value: c.id,
      })),
    [filteredCompanies],
  );
  return (
    <Card>
      <Card.Section>
        {!empty && (
          <RadioButton
            id="createCompany"
            label="Create new Company"
            checked={selected}
            onChange={() => onSelect()}
            disabled={disabled}
          />
        )}
        <FormLayout>
          <FormLayout.Group>
            <TextField
              autoComplete="off"
              name="name"
              disabled={disabled || !selected}
              label="Company Name"
              placeholder="Shape Technologies"
            />
            <TextField
              autoComplete="off"
              name="legacyPimUrl"
              disabled={disabled || !selected}
              label="PIM 1 URL"
              placeholder="https://pim.mycompany.com"
            />
            <Select
              name="sourceCompanyId"
              label="Source Company"
              placeholder="Select Company"
              options={options}
              disabled={disabled || !selected}
            />
          </FormLayout.Group>
        </FormLayout>
      </Card.Section>
    </Card>
  );
}

interface FormValues {
  company: string;
  name: string;
  legacyPimUrl: string;
  sourceCompanyId: string;
}

interface SetupFormProps {
  companies: APICompanyOnly[];
  filteredCompanies: APICompanyOnly[];
}

function SetupForm({ companies, filteredCompanies }: SetupFormProps) {
  const app = useAppBridge();
  const showToast = useToast();

  const empty = companies.length === 0;

  const [choose, setChoose] = useState(!empty);

  const SCHEMA = useMemo(() => {
    if (choose) {
      return object({
        company: string()
          .oneOf(companies.map((c) => c.id))
          .required('Please select a company'),
      });
    }
    return object({
      name: string()
        .trim()
        .min(2, 'Company name must be at least two characters')
        .required('Company name is required'),
      legacyPimUrl: string().url('Must be a valid url'),
    });
  }, [choose, companies]);

  const handleSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!choose) {
        company
          .create(values)
          .then(({ id }) => company.set(id))
          .then((id) => {
            showToast({
              message: `Created and set ${values.name} as your company`,
            });
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, '/');
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.warn(e);
            showToast({
              message: `Failed to set ${values.name} as your company`,
              error: true,
            });
            helpers.resetForm();
          });
      } else {
        company
          .set(values.company)
          .then(() => {
            const comp = companies.find((c) => c.id === values.company);
            showToast({
              message: `Set${comp && ` ${comp.name} as`} your company`,
            });
            const redirect = Redirect.create(app);
            redirect.dispatch(Redirect.Action.APP, '/');
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.warn(e);
            showToast({
              message: `Failed to set your company`,
              error: true,
            });
            helpers.resetForm();
          });
      }
    },
    [app, choose, companies, showToast],
  );

  return (
    <Formik<FormValues>
      initialValues={{
        company: '',
        name: '',
        legacyPimUrl: '',
        sourceCompanyId: '',
      }}
      validationSchema={SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <CompanySelect
            disabled={isSubmitting}
            companies={companies}
            selected={choose}
            onSelect={() => {
              setChoose(true);
            }}
          />
          <CompanyCreate
            empty={companies.length === 0}
            disabled={isSubmitting}
            selected={!choose}
            onSelect={() => setChoose(false)}
            filteredCompanies={filteredCompanies}
          />
          <br />
          <Stack alignment="center" distribution="trailing">
            <Button submit primary loading={isSubmitting} disabled={!dirty}>
              {choose ? 'Set Company' : 'Create and Set'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default SetupForm;
