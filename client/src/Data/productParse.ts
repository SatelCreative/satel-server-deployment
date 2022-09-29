import {
  APIProduct,
  APIProductOnly,
  APIProductPart,
  APIChildPart,
} from './types';
import { ProductOnly, Product, ProductPart, ProductOnlyPart } from '../types';

export function productOnlyPartParse(part: APIChildPart) {
  const p: ProductOnlyPart = {
    id: part.id,
    sku: part.sku,
    price: part.price,
    engineeringTitle: part.engineering_title,
  };

  return p;
}

export function productOnlyParse(product: APIProductOnly) {
  const p: ProductOnly = {
    id: product.id,
    title: product.shopify_title,
    image: product.image,
    updatedAt: product.updatedAt,
    createdAt: product.createdAt,
    nParts: product.nParts,
    nImages: product.nImages,
    parts: product.parts.map(productOnlyPartParse),
    published: product.published,
  };

  return p;
}

export function productPartParse(part: APIProductPart) {
  const p: ProductPart = {
    id: part.id,
    sku: part.sku,
    discontinued: part.discontinued,
    // eslint-disable-next-line no-unneeded-ternary
    upSold: !!part.upsell,
    alternate: part.alternate,
    price: part.erp.price,
    salePrice: part.sale_price,
    promotion: part.promotion,
    option1: part.option_values[0] ? part.option_values[0] : 'Default Title',
    option2: part.option_values[1] ? part.option_values[1] : '',
    option3: part.option_values[2] ? part.option_values[2] : '',
    erp: Object.keys(part.erp).map((key) => ({
      key,
      value: part.erp[key],
    })),
    replacements: part.replacements ? part.replacements : [],
  };

  return p;
}

export function productParse(product: APIProduct) {
  const p: Product = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description ?? '',
    published: product.published,
    callOnly: product.call_only,
    installationRequired: product.installation_required,
    seoTitle: product.seotitle ? product.seotitle : undefined,
    seoDescription: product.seodescription ? product.seodescription : undefined,
    option1: product.option_titles[0] ? product.option_titles[0] : 'Title',
    option2: product.option_titles[1] ? product.option_titles[1] : '',
    option3: product.option_titles[2] ? product.option_titles[2] : '',
    categorizations: product.categorization,
    images: product.images.map((source) => ({
      source,
      alt: '',
    })),
    parts: product.parts
      .sort((partA, partB) => partA.position - partB.position)
      .map(productPartParse),
  };

  return p;
}
