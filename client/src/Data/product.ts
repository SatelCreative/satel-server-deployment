import { serverFetch } from '.';
import { productParse } from './productParse';
import { APIProduct } from './types';
import { PartAlternate, PartReplacement } from '../types';

interface ProductPartUpdatePayload {
  id: string;
  promotion?: number;
  option1?: string;
  option2?: string;
  option3?: string;
  alternate?: PartAlternate;
  upSold?: boolean;
  discontinued?: boolean;
  replacements?: PartReplacement[];
}

export interface ProductUpdatePayload {
  title: string;
  handle: string;
  description?: string;
  published?: boolean;
  callOnly?: boolean;
  categorizations?: string[];
  installationRequired?: boolean;
  seoTitle?: boolean;
  seoDescription?: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
  parts?: ProductPartUpdatePayload[];
}

interface APIProductPartUpdate {
  id: string;
  promotion?: number;
  // eslint-disable-next-line camelcase
  option_values?: string[];
  alternate?: PartAlternate | Record<string, any>;
  discontinued?: boolean;
  replacements?: PartReplacement[] | null;
  upsell?: boolean;
}

interface APIProductUpdate {
  title?: string;
  handle?: string;
  description?: string;
  published?: boolean;
  // eslint-disable-next-line camelcase
  call_only?: boolean;
  // eslint-disable-next-line camelcase
  installation_required?: boolean;
  seotitle?: boolean;
  seodescription?: boolean;
  // eslint-disable-next-line camelcase
  option_titles?: string[];
  parts?: APIProductPartUpdate[];
  categorization?: string[];
}

function extractOptions(item: {
  option1?: string;
  option2?: string;
  option3?: string;
}) {
  const options: string[] = [];

  for (let i = 1; i <= 3; i += 1) {
    const key = `option${i}`;

    if ((item as any)[key]) {
      options.push((item as any)[key]);
    } else {
      break;
    }
  }

  return options.length ? options : undefined;
}

function parseReplacements(replacements: any) {
  if (!replacements) {
    return [];
  }

  const rep: PartReplacement[] = replacements.map((replacement: any) => {
    const b = replacement?.brand || replacement.company;
    return {
      brand: b.toLowerCase(),
      sku: replacement.sku,
    };
  });
  return rep;
}

function parsePart(part: ProductPartUpdatePayload) {
  const alternate: Record<string, any> | PartAlternate = part.alternate || {};

  const r: APIProductPartUpdate = {
    id: part.id,
    promotion: part.promotion,
    option_values: extractOptions(part),
    upsell: part.upSold,
    discontinued: part.discontinued,
    alternate,
    replacements: parseReplacements(part.replacements) || undefined,
  };

  return r;
}

async function update(id: string, product: ProductUpdatePayload) {
  const body: APIProductUpdate = {
    title: product.title,
    handle: product.handle,
    description: product.description,
    seotitle: product.seoTitle,
    seodescription: product.seoDescription,
    published: product.published,
    call_only: product.callOnly,
    installation_required: product.installationRequired,
    categorization: product.categorizations,
    option_titles: extractOptions(product),
    parts: product.parts ? product.parts.map(parsePart) : undefined,
  };

  const response = await serverFetch(`/pim/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }

  const updatedProduct: { product: APIProduct } = await response.json();

  return productParse(updatedProduct.product);
}

const product = {
  update,
};

export default product;
