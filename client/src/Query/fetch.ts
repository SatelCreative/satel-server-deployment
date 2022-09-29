import camelcaseKeys from 'camelcase-keys';
import config from '../config';

export async function authenticatedFetch(
  url: RequestInfo,
  options: RequestInit = {},
): Promise<Response> {
  const token = window.localStorage.getItem(config.SHOPIFY_DOMAIN);
  const authHeaders = {
    'Shopify-Store-Domain': config.SHOPIFY_DOMAIN,
    ...(token ? { 'Authentication-Token': token } : {}),
  };
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers ? options.headers : {}),
      ...authHeaders,
    },
  });
}

export async function get<R = any>(url: string): Promise<R> {
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return camelcaseKeys(await response.json(), { deep: true });
}

export async function put<R = any, B = any>(url: string, body: B): Promise<R> {
  const response = await authenticatedFetch(url, {
    method: 'put',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return camelcaseKeys(await response.json(), { deep: true });
}

export async function patch<R = any, B = any>(
  url: string,
  body: B,
): Promise<R> {
  const response = await authenticatedFetch(url, {
    method: 'patch',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return camelcaseKeys(await response.json(), { deep: true });
}

export async function post<R = any, B = any>(url: string, body: B): Promise<R> {
  const response = await authenticatedFetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return camelcaseKeys(await response.json(), { deep: true });
}

export async function del<R = any, B = any>(url: string, body: B): Promise<R> {
  const response = await authenticatedFetch(url, {
    method: 'delete',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return camelcaseKeys(await response.json(), { deep: true });
}
