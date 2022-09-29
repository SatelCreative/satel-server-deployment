import React from 'react';
import ReactDOM from 'react-dom';

import '@shopify/polaris/build/esm/styles.css';

import App from './App';
import Web from './Web';

import config from './config';

if (config.IN_IFRAME) {
  // Authentication stuff
  // @todo move
  let token;

  const url = new URL(window.location.href);
  const urlParamToken = url.searchParams.get('jwt');
  const lsToken = window.localStorage.getItem(config.SHOPIFY_DOMAIN);

  if (urlParamToken) {
    token = urlParamToken;
  } else if (lsToken) {
    token = lsToken;
  } else {
    token = '';
  }

  window.localStorage.setItem(config.SHOPIFY_DOMAIN, token);

  // @todo replace `react-sticky` and enable strict mode
  ReactDOM.render(<App />, document.getElementById('root'));
} else {
  ReactDOM.render(
    <React.StrictMode>
      <Web />
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
