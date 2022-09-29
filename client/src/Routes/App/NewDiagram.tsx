import React from 'react';
import { RouteComponentProps } from '@reach/router';

import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { DiagramForm } from '../../Components/DiagramForm';
import { useDiagramCategorizations } from '../../Query';
import { Page } from '../../Components/Page';

function NewDiagramRoute(props: RouteComponentProps) {
  const { data: categorizations } = useDiagramCategorizations();

  if (!categorizations) {
    return (
      <SkeletonPage title="New" breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page title="New" breadcrumbs={[{ content: 'Diagrams', url: '/diagrams' }]}>
      <DiagramForm categorizations={categorizations} />
    </Page>
  );
}

export default NewDiagramRoute;
