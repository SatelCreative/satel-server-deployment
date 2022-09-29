import React from 'react';
import { Banner } from '@shopify/polaris';

interface WarningProps {
  show: boolean;
  resource: string;
}

function CategorizationWarningBanner(props: WarningProps) {
  const { show, resource } = props;
  if (!show) {
    return null;
  }
  return (
    <Banner status="warning" title={`${resource} is missing categorization`} />
  );
}

export default CategorizationWarningBanner;
