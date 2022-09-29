import { SelectOption, TextFieldProps } from '@shopify/polaris';

export interface Operator {
  key: string;
  optionLabel: string;
  filterLabel?: string;
}
export interface AppliedFilter {
  key: string;
  value: string;
  label?: string;
}

export enum FilterType {
  Select = 0,
  TextField = 1,
  DateSelector = 2,
}
export interface FilterBase<FilterKeys = Record<string, unknown>> {
  label: string;
  key: keyof FilterKeys | string;
  operatorText?: string | Operator[];
  type: FilterType;
}
export interface FilterSelect<FilterKeys = Record<string, unknown>>
  extends FilterBase<FilterKeys> {
  type: FilterType.Select;
  options: SelectOption[];
}
export interface FilterTextField<FilterKeys = Record<string, unknown>>
  extends FilterBase<FilterKeys> {
  type: FilterType.TextField;
  textFieldType?: TextFieldProps['type'];
}
export interface FilterDateSelector<FilterKeys = Record<string, unknown>>
  extends FilterBase<FilterKeys> {
  type: FilterType.DateSelector;
  minKey: string;
  maxKey: string;
  dateOptionType?: 'past' | 'future' | 'full';
}
export declare type Filter<FilterKeys = Record<string, unknown>> =
  | FilterSelect<FilterKeys>
  | FilterTextField<FilterKeys>
  | FilterDateSelector<FilterKeys>;

/**
 * Internal part type that keeps
 * everything consistent
 *
 * @interface Part
 */
export interface Part {
  /**
   * API id of the part
   */
  id: string;

  /**
   * Shape internal SKU. Can be manually entered
   */
  sku: string;

  /**
   * Title (Shopify (if exists) or engineering)
   */
  title: string;

  /**
   * Thumbnail image
   */
  image?: string;

  /**
   * If the part is on shopify
   */
  onShopify: boolean;

  /**
   * Time in ms
   */
  createdAt: number;

  /**
   * Time in ms
   */
  updatedAt: number;

  parentId?: string;

  price: number;
  engineeringTitle: string;

  /**
   * Random read only data
   */
  erp: {
    key: string;
    value: number | string;
  }[];
}

/**
 * Internal part type embedded in product list
 */
export interface ProductOnlyPart {
  /**
   * API id of the products
   */
  id: string;

  sku: string;
  price: number;
  engineeringTitle: string;
}

/**
 * Internal product type for the product list
 */
export interface ProductOnly {
  /**
   * API id of the products
   */
  id: string;

  /**
   * Shopify title of the product
   */
  title: string;

  /**
   * Thumbnail image or default
   */
  image: string;

  /**
   * Time in ms
   */
  createdAt: number;

  /**
   * Time in ms
   */
  updatedAt: number;

  nParts: number;
  nImages: number;

  parts: ProductOnlyPart[];
  published: boolean;
}

export interface PartAlternate {
  id: string;
  sku: string;
}

export interface PartReplacement {
  sku: string;
  brand: string;
}

/**
 * Shape of the parts that are nested within
 * product objects
 */
export interface ProductPart {
  /**
   * API identifier of the product
   */
  id: string;

  /**
   * Unique part number of this part
   */
  sku: string;

  /**
   * Readonly price from erp data
   */
  price: number;

  /**
   * Cents based value of the sale price
   */
  salePrice: number;

  /**
   * price - promotion === sale_price
   */
  promotion: number;

  /**
   * If this part has been discontinued
   */
  discontinued: boolean;

  upSold: boolean;

  option1: string;
  option2: string;
  option3: string;

  alternate?: PartAlternate;
  replacements?: PartReplacement[];

  /**
   * Random read only data
   */
  erp: {
    key: string;
    value: number | string;
  }[];
}

/**
 * Internal product type for the whole product
 */
export interface Product {
  /**
   * API id of the product
   */
  id: string;

  /**
   * Shopify handle of product
   */
  handle: string;

  /**
   * Shopify title of the product
   */
  title: string;

  /**
   * Shopify description
   */
  description?: string;

  /**
   * Title shown on google
   */
  seoTitle?: string;

  /**
   * Description shown on google
   */
  seoDescription?: string;

  published: boolean;
  callOnly: boolean;
  installationRequired: boolean;
  option1: string;
  option2: string;
  option3: string;

  categorizations: string[];

  images: { source: string; alt: string }[];

  /**
   * Parts list
   */
  parts: ProductPart[];
}

/**
 * Internal type for diagram child
 * parts. Allows for consistently
 * handling them even when they are
 * duplicates or sku only
 *
 * @interface DiagramPart
 */
export interface DiagramPart
  extends Omit<
    Part,
    | 'title'
    | 'createdAt'
    | 'updatedAt'
    | 'onShopify'
    | 'parentId'
    | 'price'
    | 'engineeringTitle'
  > {
  /**
   * Internally generated id
   *
   */
  id: string;

  /**
   * API id of the part (if applicable
   * could be an SKU only part)
   */
  partId?: string;

  /**
   * Title (May not exist in SKU only parts)
   */
  title?: string;

  /**
   * Diagram based number of this part
   */
  position: number;
}

/**
 * Internal representation of a diagram. Allows for
 * more consistent handling of diagrams when the API
 * changes
 *
 * @interface Diagram
 */
export interface Diagram {
  /**
   * Database id of the diagram
   */
  id: string;

  /**
   * The title of the diagram
   */
  title: string;

  /**
   * If the diagram is currently published on Shopify
   */
  published: false;

  /**
   * URL of the diagram image
   */
  image: string;

  /**
   * Time in ms
   */
  createdAt: number;

  /**
   * Time in ms
   */
  updatedAt: number;

  /**
   * List of parts associated with this diagram
   */
  parts: DiagramPart[];

  /**
   * List of categorizations
   */
  categorization: string[];
}
