import React from 'react';

interface Props {
  amount: number;
  locale?: string;
  currency?: string;
}

function Money({ amount, locale = 'en-US', currency = 'USD' }: Props) {
  // @todo fix precision loss
  const floatValue = amount !== 0 ? amount / 100 : 0;

  const formattedNumber = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  }).format(floatValue);

  return <>{formattedNumber}</>;
}

export default Money;
