import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { EmptyState } from '@shopify/polaris';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NotFoundRoute(props: RouteComponentProps): JSX.Element {
  return (
    <EmptyState
      heading="The page you're looking for couldn't be found"
      action={{ content: 'Go Back Home', url: '/' }}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      <p>Check the web address and try again.</p>
    </EmptyState>
  );
}

export default NotFoundRoute;
