import React from 'react';
import { Router as ReachRouter } from '@reach/router';
import { AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';

import { Web as W } from './Routes';

function Web() {
  return (
    <AppProvider i18n={translations}>
      <ReachRouter>
        <W.Install path="/" />
        <W.Error default />
      </ReachRouter>
    </AppProvider>
  );
}

export default Web;
