export interface Device {
  /**
   * Unique id of the device
   */
  id: string;

  /**
   * Human readable title of device
   */
  name: string;
  category: string | undefined;
  subcategories: string[];
  compatibilities: string[];
}

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
  shopifyTitle?: string;

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
    [key: string]: number | string;
  };
}

/**
 * Part connection to a diagram
 */
export interface DiagramPart {
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

/**
 * API representation of a Diagram
 */
export interface Diagram {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Human readable name of diagram
   */
  name: string;

  /**
   * Unique identifier for the diagram
   * NOTE - null when diagram was created before number existed
   */
  number: string | null;

  /**
   * If the diagram is published on Shopify
   */
  published: false;

  /**
   * URL of the diagram image
   */
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
  parts: DiagramPart[];

  /**
   * List of device ids associated with this diagram
   */
  devices: string[];

  /**
   * List of categorizations
   */
  categorization: string[];
}

export interface CategorizationOption {
  id: string;
  option: string;
}

export interface Categorization {
  name: string;
  options: CategorizationOption[];
}

export interface Categorizations {
  categories: Categorization[];
  subcategories: Categorization[];
  compatibilities: Categorization[];
}
