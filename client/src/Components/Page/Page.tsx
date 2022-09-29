import React, { useMemo } from 'react';
import {
  PageProps as PolarisPageProps,
  Page as PolarisPage,
} from '@shopify/polaris';
import { useLocation, useNavigate } from '@reach/router';
import { TitleBar, useRoutePropagation } from '@shopify/app-bridge-react';

export type PageProps = Omit<PolarisPageProps, 'title'> & { title: string };

export function Page(props: PageProps) {
  const { title, breadcrumbs = [] } = props;

  const navigate = useNavigate();
  useRoutePropagation(useLocation());

  const appBridgeBreadcrumbs = useMemo(
    () =>
      breadcrumbs.map((crumb) => {
        if ('url' in crumb) {
          return {
            ...crumb,
            url: undefined,
            onAction: () => navigate(crumb.url),
          };
        }
        return crumb;
      }),
    [breadcrumbs, navigate],
  );

  return (
    <>
      <TitleBar title={title} breadcrumbs={appBridgeBreadcrumbs} />
      <PolarisPage {...props} />
    </>
  );
}
