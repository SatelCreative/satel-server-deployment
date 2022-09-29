import { TabsProps } from '@shopify/polaris';
import flowLogo from './Assets/logo.png';

export const COMPANIES = [
  {
    name: 'Flow Parts North America',
    image: flowLogo,
  },
  {
    name: 'Flow Parts Europe',
    image: flowLogo,
  },
];

export const DEFAULT_PRODUCT_IMAGE =
  'https://cdn.shopify.com/s/files/applications/523599bed72bed480dbb27ced94e9bfb_512x512.png?1558042196';

export const TABS: TabsProps['tabs'] = [
  {
    id: 'categories',
    panelID: 'categories',
    accessibilityLabel: 'Category',
    content: 'Category',
  },
  {
    id: 'subcategories',
    panelID: 'subcategories',
    accessibilityLabel: 'Sub Category',
    content: 'Sub Category',
  },
  {
    id: 'compatibilities',
    panelID: 'compatibilities',
    accessibilityLabel: 'Compatibility',
    content: 'Compatibility',
  },
];
