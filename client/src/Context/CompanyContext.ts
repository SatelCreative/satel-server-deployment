import React from 'react';
import { DEFAULT_FEATURE_FLAGS, FeatureFlags } from '../flags';

export interface CompanyContextType {
  id: string;
  image: string;
  name: string;
  defaultProductImage: string;
  features: FeatureFlags;
}

export const DEFAULT_COMPANY_CONTEXT: CompanyContextType = {
  id: '',
  name: '',
  image: '',
  defaultProductImage:
    'https://cdn.shopify.com/s/files/applications/523599bed72bed480dbb27ced94e9bfb_512x512.png?1558042196',
  features: DEFAULT_FEATURE_FLAGS,
};

const CompanyContext = React.createContext<CompanyContextType>(
  DEFAULT_COMPANY_CONTEXT,
);

export default CompanyContext;
