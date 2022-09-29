import { serverFetch } from '.';
import config from '../config';

type APIStatusResponse = { authorized: true } | { redirect: string };

type Status = { authorized: true } | { authorized: false; redirect: string };

async function checkStatus(): Promise<Status> {
  try {
    const url = new URL(
      `/pim/status${window.location.search}`,
      `${window.location.protocol}//${window.location.host}`,
    );

    if (!url.searchParams.has('shop')) {
      url.searchParams.set('shop', config.SHOPIFY_DOMAIN);
    }

    const response = await serverFetch(`${url}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch status. ${response.status}`);
    }

    const status: APIStatusResponse = await response.json();

    if ('authorized' in status && status.authorized) {
      return { authorized: true };
    }

    if ('redirect' in status && typeof status.redirect === 'string') {
      return { authorized: false, redirect: status.redirect };
    }

    throw new Error(
      'Server responded with 200 but response was not recognized',
    );
  } catch (e: any) {
    // @todo consider logging somewhere useful
    // eslint-disable-next-line no-console
    console.warn(`Error requesting status, "${e?.message}"`);
    throw e;
  }
}

export default checkStatus;
