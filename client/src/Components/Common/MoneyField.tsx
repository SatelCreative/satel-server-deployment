import React, { useState, useCallback, useMemo } from 'react';
import { Field, getIn, FieldProps } from 'formik';
import {
  TextField as PolarisTextField,
  TextFieldProps,
} from '@shopify/polaris';

interface FormatMoneyProps {
  amount: number;
  locale?: string;
  currency?: string;
}

function formatMoney({
  amount,
  locale = 'en-US',
  currency = 'USD',
}: FormatMoneyProps) {
  // @todo fix precision loss
  const floatValue = amount !== 0 ? amount / 100 : 0;

  const formattedNumber = new Intl.NumberFormat(locale, {
    currency,
    style: 'decimal',
  }).format(floatValue);

  return formattedNumber;
}

type Props = TextFieldProps & {
  /**
   * The field identifier that formik can use to
   * connect this field to the data. Will also be
   * used as the polaris id
   */
  name: string;
};

export type MoneyFieldProps = Omit<
  Props,
  'id' | 'value' | 'onChange' | 'onBlur' | 'onFocus' | 'error'
>;

function InternalMoneyField(props: FieldProps<number> & MoneyFieldProps) {
  const {
    field: { value: formikValue },
    form: { touched, errors, setFieldValue, setFieldTouched },
    name,
    ...polarisProps
  } = props;

  const [value, setValue] = useState(() =>
    formatMoney({ amount: formikValue }),
  );

  const handleChange = useCallback(
    (v: string) => {
      setValue(v);

      // Try to update formik

      const n = Number.parseFloat(v);

      // We need the extra regex check to ensure
      // js doesn't try and help us out
      if (Number.isNaN(n) || !v.match(/^-?\d*(\.\d+)?$/)) {
        setFieldValue(name, NaN);
      } else {
        setFieldValue(name, Math.round(n * 100));
      }
    },
    [name, setFieldValue],
  );

  const handleBlur = useCallback(() => {
    setFieldTouched(name, true);
  }, [name, setFieldTouched]);

  const handleFocus = useCallback(() => {
    setFieldTouched(name, false);
  }, [name, setFieldTouched]);

  const error = useMemo(() => {
    try {
      if (getIn(touched, name)) {
        return getIn(errors, name);
      }
    } catch (e) {
      throw new Error(
        `Formik errors object is in an abnormal state, TextField "${name}" could not check it's error state`,
      );
    }
  }, [errors, name, touched]);

  return (
    <PolarisTextField
      type="currency"
      prefix="$"
      {...polarisProps}
      id={name}
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      error={error}
    />
  );
}

function MoneyField(props: MoneyFieldProps) {
  const { name, ...polarisProps } = props;

  return (
    <Field
      name={name}
      render={(fieldProps: FieldProps) => (
        <InternalMoneyField {...fieldProps} {...polarisProps} name={name} />
      )}
    />
  );
}

export default MoneyField;
