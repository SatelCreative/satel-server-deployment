import React, { useEffect } from 'react';
import { EmptyState } from '@shopify/polaris';
import { navigate } from '@reach/router';
import { useToast } from '../../BridgeHooks';

interface ErrorComponentProps {
  showToastMessage: string;
  viewMessageError: string;
  warnMessage: Error;
}
function ErrorComponent(props: ErrorComponentProps) {
  const showToast = useToast();
  const { showToastMessage, viewMessageError, warnMessage } = props;
  useEffect(() => {
    showToast({ message: showToastMessage, error: true });
    // eslint-disable-next-line no-console
    console.warn(warnMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EmptyState
      heading="Error"
      action={{
        content: 'Home',
        onAction: () => {
          navigate('/');
        },
      }}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      <p>{viewMessageError}</p>
    </EmptyState>
  );
}

export default ErrorComponent;
