/* eslint-disable camelcase */
import { PartAlternate, PartReplacement } from '../types';
// PARTS

/**
 * Part that is contained within a diagram
 */
export interface APIDiagramPart {
  /**
   * If not in the pim, no id provided
   */
  id?: string;

  /**
   * Shopify title
   */
  title?: string;

  /**
   * Shopify image
   */
  image?: string;

  /**
   * Shape internal SKU. Can be manually entered
   */
  sku: string;

  /**
   * Diagram based number of this part
   */
  position: number;
}

// DIAGRAMS

/**
 * Diagram that is loaded /diagrams
 */
export interface APIDiagramOnly {
  id: string;
  name: string;
  published: false;
  image: string;

  /**
   * Number of parts associated with this diagram
   */
  nParts: number;

  /**
   * Time in seconds
   */
  createdAt: number;

  /**
   * Time in seconds
   */
  updatedAt: number;
}

/**
 * Diagram that is loaded /diagram
 */
export interface APIDiagram {
  id: string;
  name: string;
  published: false;
  image: string;

  /**
   * Time in seconds
   */
  createdAt: number;

  /**
   * Time in seconds
   */
  updatedAt: number;

  /**
   * List of parts associated with this diagram
   */
  parts: APIDiagramPart[];

  /**
   * List of categorizations
   */
  categorization: string[];
}

// PRODUCTS
export interface APIChildPart {
  id: string;
  sku: string;
  engineering_title: string;
  price: number;
}

/**
 * Product form returned from /products
 */
export interface APIProductOnly {
  id: string;
  image: string;
  nImages: number;
  nParts: number;
  parts: APIChildPart[];
  shopify_title: string;
  updatedAt: number;
  createdAt: number;
  published: boolean;
}

/**
 * Parts from returned withing products from /products/:id
 */
export interface APIProductPart {
  /**
   * API identifier of the product
   */
  id: string;

  /**
   * Unique part number of this part
   */
  sku: string;

  /**
   * 1 based index of where this part is
   */
  position: number;

  /**
   * Cents based value of the sale price
   */
  sale_price: number;

  /**
   * price - promotion === sale_price
   */
  promotion: number;

  /**
   * If this part has been discontinued
   */
  discontinued: boolean;

  upsell?: boolean;

  alternate?: PartAlternate;
  replacements?: PartReplacement[];

  /**
   * Up to three values. Based on products
   * "options_titles" headers
   */
  option_values: string[];

  /**
   * Random read-only unstructured data
   */
  erp: {
    price: number;
    createdAt: number;
    updatedAt: number;

    [key: string]: number | string;
  };
}

/**
 * Product from returned from /products/:id
 */
export interface APIProduct {
  /**
   * API identifier of the product
   */
  id: string;

  /**
   * Shopify handle of the product
   */
  handle: string;

  /**
   * Shopify title of the product
   */
  title: string;

  /**
   * Description of the product shown on storefront
   */
  description: string;

  /**
   * Array of image urls. Can be data urls
   */
  images: string[];

  seotitle?: string;
  seodescription?: string | null;
  published: boolean;
  call_only: boolean;
  installation_required: boolean;

  option_titles: string[];
  categorization: string[];

  /**
   * Array of parts
   */
  parts: APIProductPart[];
}
