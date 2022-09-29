import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { EmptyState } from '@shopify/polaris';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Error(props: RouteComponentProps): JSX.Element {
  return (
    <EmptyState
      heading="Error"
      action={{ content: 'Install', url: '/install' }}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      <p>TODO</p>
    </EmptyState>
  );
}

export default Error;
