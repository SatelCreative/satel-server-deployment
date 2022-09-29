import config from '../config';

import checkStatus from './checkStatus';
import setCompany from './setCompany';
import uploadDiagram from './uploadDiagram';
import createDiagram from './createDiagram';

// Products
import product from './product';
import productLoad from './productLoad';
import productCreate from './productCreate';
import productsLoad from './productsLoad';

// Parts
import partsLoad from './partsLoad';

// Diagram
import diagramLoad from './diagramLoad';
import diagramsLoad from './diagramsLoad';
import diagramUpdate from './diagramUpdate';
import diagramDelete from './diagramDelete';

// Company
import company from './company';
import companyCreate from './companyCreate';
import companyLoad from './companyLoad';
import companyTransfer from './companyTransfer';

// Categorization
import categorization from './categorization';

/**
 * Just a simple fetch wrapper that also
 * includes the required authentication
 * headers
 *
 * @param url
 * @param options
 */
const serverFetch = async (
  url: RequestInfo,
  options?: RequestInit,
): Promise<Response> => {
  const token = window.localStorage.getItem(config.SHOPIFY_DOMAIN);
  const authHeaders = {
    'Shopify-Store-Domain': config.SHOPIFY_DOMAIN,
    ...(token ? { 'Authentication-Token': token } : {}),
  };
  return fetch(
    url,
    options
      ? {
          ...options,
          headers: {
            ...(options.headers ? options.headers : {}),
            ...authHeaders,
          },
        }
      : { headers: authHeaders },
  );
};

async function getData<R>(path: string): Promise<R> {
  const response = await serverFetch(path);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from "${path}", received ${response.status} - ${
        // eslint-disable-line
        response.statusText
      }`,
    );
  }
  // Await here will bubble the error
  return await response.json();
}

export {
  checkStatus,
  setCompany,
  uploadDiagram,
  createDiagram,
  // Products
  product,
  productLoad,
  productCreate,
  productsLoad,
  // Parts
  partsLoad,
  // Diagram
  diagramLoad,
  diagramsLoad,
  diagramUpdate,
  diagramDelete,
  // Company
  company,
  companyCreate,
  companyLoad,
  companyTransfer,
  // Categorization
  categorization,
  serverFetch,
  getData,
};
