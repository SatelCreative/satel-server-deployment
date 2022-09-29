import React, { useState, useEffect, useCallback } from 'react';
import './Assets/style.css';
import { EmptyState, AppProvider } from '@shopify/polaris';
import translations from '@shopify/polaris/locales/en.json';
import { Redirect } from '@shopify/app-bridge/actions';
import { navigate } from '@reach/router';
import { configureScope } from '@sentry/browser';
import { Provider } from '@shopify/app-bridge-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Link from './Link';

import Layout from './Components/Layout/Layout';

import {
  Provider as P,
  useLoading,
  useToast,
  useAppBridge,
} from './BridgeHooks';
import config from './config';
import { checkStatus, companyLoad } from './Data';
import { StatusContext } from './Context';
import CompanyContext, {
  CompanyContextType,
  DEFAULT_COMPANY_CONTEXT,
} from './Context/CompanyContext';
import { DEFAULT_FEATURE_FLAGS } from './flags';
import { DEFAULT_PRODUCT_IMAGE } from './constants';
import AppRouter from './AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Status() {
  const app = useAppBridge();
  const showToast = useToast();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useLoading(true);
  const [companyContext, setCompanyContext] = useState<CompanyContextType>(
    DEFAULT_COMPANY_CONTEXT,
  );

  const init = useCallback(async () => {
    try {
      const status = await checkStatus();

      if (!status.authorized) {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.REMOTE, status.redirect);
        return;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      showToast({ message: 'Error loading app', error: true });
      setError(true);
      setLoading(false);
      return;
    }

    const companyResponse = await companyLoad();

    if (!('error' in companyResponse) || companyResponse.error) {
      // eslint-disable-next-line no-console
      console.warn('Error loading company');
      showToast({ message: 'Error loading app', error: true });
      setError(true);
      setLoading(false);
      return;
    }

    if (!companyResponse.company) {
      setLoading(false);
      navigate('/setup');
      return;
    }

    configureScope((scope) => {
      scope.setTags({
        company_name: companyResponse.company?.name || '',
        company_id: companyResponse.company?.id || '',
        currency: (companyResponse.company as any)?.erpCurrency || '',
        weight_unit: (companyResponse.company as any)?.erpWeightUnit || '',
        locale: (companyResponse.company as any)?.locale || '',
      });
      scope.setContext(
        'company_features',
        (companyResponse.company?.features || {}) as any,
      );
    });

    setCompanyContext({
      /* eslint-disable camelcase */
      ...companyResponse.company,
      defaultProductImage:
        companyResponse.company.defaultProductImage || DEFAULT_PRODUCT_IMAGE,
      features: {
        ...DEFAULT_FEATURE_FLAGS,
        PRODUCTS_REPLACEMENTS:
          companyResponse.company?.features?.replacement_parts === true,
        COMPANY_LEGACY_SYNC:
          companyResponse.company?.features?.pim1_sync === true,
        COMPANY_TRANSFER:
          companyResponse.company?.features?.company_transfer === true,
        /* eslint-enable camelcase */
      },
    });

    setLoading(false);
  }, [app, setLoading, showToast]);

  useEffect(() => {
    init().catch((e) => {
      // eslint-disable-next-line no-console
      console.warn(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <EmptyState
        heading="Error loading app"
        action={{
          content: 'Reload',
          onAction: () => window.location.reload(),
        }}
        image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
      />
    );
  }

  if (loading) {
    return null;
  }

  return (
    <CompanyContext.Provider value={companyContext}>
      <Layout StatusContext={StatusContext} CompanyContext={CompanyContext}>
        <AppRouter />
      </Layout>
    </CompanyContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider
        config={{
          apiKey: config.API_KEY,
          host: config.SHOPIFY_HOST,
          forceRedirect: false,
        }}
      >
        <P key="provider">
          <AppProvider linkComponent={Link} i18n={translations}>
            <Status />
          </AppProvider>
        </P>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
