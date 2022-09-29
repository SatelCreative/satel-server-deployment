import React, { ReactNode, Context, useEffect } from 'react';
import { Location } from '@reach/router';
import { Frame } from '@shopify/polaris';

import Header from './Header';
import { ShowToastProps, StatusContextType } from '../../Context/StatusContext';
import { CompanyContextType } from '../../Context/CompanyContext';
import { useAppBridge, useToast } from '../../BridgeHooks';

interface LayoutProps {
  /**
   * Status context instance
   */
  StatusContext: Context<StatusContextType>;

  /**
   * Company context instance
   */
  CompanyContext: Context<CompanyContextType>;

  /**
   * Rest of the App
   */
  children: ReactNode;
}

function Layout(props: LayoutProps) {
  const { StatusContext, CompanyContext, children } = props;

  const app = useAppBridge();
  const showToast = useToast();

  const [title, setTitle] = React.useState('');

  const company = React.useContext(CompanyContext);

  useEffect(() => {
    const unsubscribe = app.subscribe(({ payload, type }) => {
      if (type === 'APP::TITLEBAR::UPDATE') {
        setTitle(payload.title);
      }
    });
    return unsubscribe;
  }, [app]);

  const handleShowToast = React.useCallback(
    (p: ShowToastProps) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          `StatusContext is deprecated. Please use the useToast hook instead`,
        );
      }
      showToast({ ...p, message: p.content });
    },
    [showToast],
  );

  return (
    <Frame>
      <Header
        show={!!company.id && false}
        title={title}
        logo={company.image}
        companyName={company.name}
      />
      <StatusContext.Provider value={{ showToast: handleShowToast }}>
        {children}
      </StatusContext.Provider>
    </Frame>
  );
}

export default Layout;
