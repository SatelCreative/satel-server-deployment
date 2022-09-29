import React from 'react';
import { Thumbnail } from '@shopify/polaris';
import { CompanyContext } from '../../Context';

interface Props {
  source: string | undefined;
  alt: string;
}

export default function ProductThumbnail({ source, alt, ...props }: Props) {
  const company = React.useContext(CompanyContext);
  return (
    <Thumbnail
      alt={alt}
      source={source || company.defaultProductImage}
      size="medium"
      {...props}
    />
  );
}
