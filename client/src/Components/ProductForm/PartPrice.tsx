import React from 'react';
import { Stack, StackProps } from '@shopify/polaris';
import { useField } from 'formik';
import MoneyInput from '../Common/MoneyInput';
import MoneyField from '../Common/MoneyField';
import { noop } from '../../Utils';

interface PartPriceProps {
  disabled: boolean;
  name: string;
  distribution: StackProps['distribution'];
}

interface InternalProps {
  price: number;
  promotion: number;
}

function InternalPartPrice(props: PartPriceProps & InternalProps) {
  const { name, disabled, price, promotion, distribution } = props;

  // @todo fix plz
  const style = { minHeight: '8.15rem' };

  const salePrice = price - promotion;

  return (
    <Stack distribution={distribution} alignment="center">
      <div style={style}>
        <MoneyInput
          autoComplete="off"
          label="Price"
          disabled={disabled}
          amount={price}
          onAmountUpdate={noop}
          readOnly
        />
      </div>
      <div style={style}>
        <MoneyField
          autoComplete="off"
          name={`${name}.promotion`}
          label="Promotion"
          prefix="$"
          type="currency"
        />
      </div>
      <div style={style}>
        <MoneyInput
          autoComplete="off"
          label="Sale Price"
          disabled={disabled}
          amount={salePrice}
          onAmountUpdate={noop}
          name="salePrice"
          readOnly
        />
      </div>
    </Stack>
  );
}

function PartPrice({ name, ...props }: PartPriceProps) {
  const [priceField] = useField<number>(`${name}.price`);
  const [promotionField] = useField<number | undefined>(`${name}.promotion`);

  return (
    <InternalPartPrice
      {...props}
      name={name}
      price={priceField.value}
      promotion={promotionField.value || 0}
    />
  );
}

export default PartPrice;
