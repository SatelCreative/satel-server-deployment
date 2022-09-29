export interface Config {
  API_KEY: string;
  IN_IFRAME: boolean;
  SHOPIFY_DOMAIN: string;
  SHOPIFY_HOST: string;
  SENTRY_DSN?: string;
  ENVIRONMENT: string;
}

const API_KEY = document
  .getElementsByName('api-key')[0]
  .getAttribute('content');

if (!API_KEY) {
  throw new Error('No Shopify API key found');
}

const SENTRY_DSN =
  document.getElementsByName('sentry-dsn')[0].getAttribute('content') ||
  undefined;

const ENVIRONMENT =
  document.getElementsByName('environment')[0].getAttribute('content') ||
  'development';

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const IN_IFRAME = inIframe();

function getDomain(): string {
  const url = new URL(window.location.href, 'https://fake.test');
  const domain: string | null = url.searchParams.get('shop');

  if (!domain) {
    // @todo
    throw new Error('Unable to load domain');
  }

  return domain;
}

function getHost(): string {
  const url = new URL(window.location.href, 'https://fake.test');
  const host: string | null = url.searchParams.get('host');

  if (!host) {
    throw new Error('Unable to load host');
  }

  return host;
}

const SHOPIFY_DOMAIN = IN_IFRAME ? getDomain() : '';
const SHOPIFY_HOST = IN_IFRAME ? getHost() : '';

const config: Config = {
  API_KEY,
  IN_IFRAME,
  SHOPIFY_DOMAIN,
  SHOPIFY_HOST,
  SENTRY_DSN,
  ENVIRONMENT,
};

export default config;
