import React, { Component, ReactNode } from 'react';
import {
  init,
  configureScope,
  withScope,
  captureException,
  showReportDialog,
} from '@sentry/browser';
import { EmptyState } from '@shopify/polaris';
import { isRedirect, RouteComponentProps } from '@reach/router';
import config from './config';

if (
  process.env.NODE_ENV === 'production' &&
  config.SENTRY_DSN &&
  config.ENVIRONMENT !== 'development'
) {
  init({
    dsn: config.SENTRY_DSN,
    environment: config.ENVIRONMENT,
    // @todo
    // release: config.RELEASE,
  });

  configureScope((scope) => {
    scope.setTag('shopify_api_key', config.API_KEY);
    if (config.SHOPIFY_DOMAIN) {
      scope.setTag('shopify_domain', config.SHOPIFY_DOMAIN);
    }
  });

  // eslint-disable-next-line no-console
  console.info(`Initialized sentry for ${config.ENVIRONMENT}`);
}

class SentryErrorBoundary extends Component<
  { children: ReactNode } & RouteComponentProps,
  { eventId: string | null; hasError?: boolean }
> {
  // eslint-disable-next-line react/state-in-constructor
  state = { eventId: null, hasError: undefined };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Propagate redirects to parent router
    // https://reach.tech/router/api/isRedirect
    if (isRedirect(error)) {
      throw error;
    }

    withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    const { hasError = false } = this.state;

    if (hasError) {
      // render fallback UI
      return (
        <EmptyState
          heading="Something went wrong"
          action={{
            content: 'Give feedback',
            onAction: () => {
              showReportDialog({
                // eslint-disable-next-line react/destructuring-assignment
                eventId: this.state.eventId || undefined,
              });
            },
          }}
          secondaryAction={{
            content: 'Go home',
            onAction: () => window.location.replace('/'),
          }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>Send feedback about this error so that we can fix it for you</p>
        </EmptyState>
      );
    }

    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}

export { SentryErrorBoundary };
