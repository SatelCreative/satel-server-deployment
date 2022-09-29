import { useState, useCallback, useEffect } from 'react';
import { TextField, TextFieldProps } from '@shopify/polaris';

type Props = TextFieldProps & {
  amount: number;
  onAmountUpdate(n: number): void;
  currency?: string;
};

function MoneyInput(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currency = 'USD', amount, onAmountUpdate } = props;

  const [value, setValue] = useState(`${amount !== 0 ? amount / 100 : 0}`);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setValue(`${amount !== 0 ? amount / 100 : 0}`);
    setValid(true);
  }, [amount]);

  const handleChange = useCallback(
    (v: string) => {
      const floatValue = Number(v);

      if (Number.isNaN(floatValue)) {
        setValue(v);
        setValid(false);
      } else {
        setValue(v);
        setValid(true);
        // @todo fix precision loss
        onAmountUpdate(floatValue * 100);
      }
    },
    [onAmountUpdate],
  );

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      error={!valid}
      type="currency"
      prefix="$"
    />
  );
}

export default MoneyInput;
