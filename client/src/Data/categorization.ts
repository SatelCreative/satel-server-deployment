import shortid from 'shortid';
import { getData, serverFetch } from '.';

export enum CategorizationResource {
  Product = 'products',
  Diagram = 'diagrams',
}

export interface CategorizationOption {
  id: string;
  option: string;
}

export interface CategorizationGroup {
  id: string; // Added client side
  name: string;
  options: CategorizationOption[];
}

export enum CategorizationType {
  Category = 'categories',
  SubCategory = 'subcategories',
  Compatibility = 'compatibilities',
}

export interface Categorization {
  categories: CategorizationGroup[];
  subcategories: CategorizationGroup[];
  compatibilities: CategorizationGroup[];
}

interface APICategorizationResponse {
  categorizations: {
    compatibilities: APICategorizationCategory[];
    categories: APICategorizationCategory[];
    subcategories: APICategorizationCategory[];
  };
}

interface APICategorizationOption {
  id: string;
  option: string;
}

interface APICategorizationCategory {
  name: string;
  options: APICategorizationOption[];
}

interface APICategorizationResponse {
  categorizations: {
    compatibilities: APICategorizationCategory[];
    categories: APICategorizationCategory[];
    subcategories: APICategorizationCategory[];
  };
}

function parseGroup(category: APICategorizationCategory): CategorizationGroup {
  const id = shortid.generate();

  return {
    id,
    ...category,
  };
}

async function load(resource: CategorizationResource): Promise<Categorization> {
  const { categorizations: c } = await getData<APICategorizationResponse>(
    `/pim/categorizations/${resource}`,
  );

  return {
    categories: c.categories.map(parseGroup),
    compatibilities: c.compatibilities.map(parseGroup),
    subcategories: c.subcategories.map(parseGroup),
  };
}

export interface CategorizationNewOption {
  group: CategorizationType;
  name: string;
  option: string;
  belongsTo: 'products' | 'diagrams';
}

interface APICategorizationNewOption {
  group: 'compatibility' | 'category' | 'subcategory';
  name: string;
  option: string;
  // eslint-disable-next-line camelcase
  belongs_to: 'products' | 'diagrams';
}

const convertType = (
  group: CategorizationType,
): 'compatibility' | 'category' | 'subcategory' => {
  switch (group) {
    case CategorizationType.Category: {
      return 'category';
    }

    case CategorizationType.SubCategory: {
      return 'subcategory';
    }

    case CategorizationType.Compatibility: {
      return 'compatibility';
    }
    default:
      throw new Error('Cannot convert type');
  }
};

async function addOption(option: CategorizationNewOption) {
  const body: Paths.PimCategorizations.Post.RequestBody = {
    group: convertType(option.group),
    name: option.name,
    option: option.option,
    belongs_to: option.belongsTo,
  };

  const response = await serverFetch('/pim/categorizations', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accepts: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to save option');
  }

  // @todo get this type from openapi
  const payload = await response.json();

  // todo do something with this

  return payload;
}

async function addOptions(options: CategorizationNewOption[]) {
  return await Promise.all(options.map(addOption));
}

const categorization = {
  load,
  addOption,
  addOptions,
};

export default categorization;
