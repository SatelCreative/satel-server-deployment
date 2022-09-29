import React from 'react';
import { RouteComponentProps } from '@reach/router';

import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { DiagramForm } from '../../Components/DiagramForm';
import { useDiagram, useDiagramCategorizations } from '../../Query';
import { Page } from '../../Components/Page';

function DiagramRoute(props: RouteComponentProps<{ id: string }>) {
  const { id } = props;

  if (!id) {
    throw new Error('Invalid diagram id');
  }

  const { data } = useDiagram(id);
  const { data: categorizations } = useDiagramCategorizations();

  if (!data || !categorizations) {
    return (
      <SkeletonPage breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page
      title={data.name}
      breadcrumbs={[{ content: 'Diagrams', url: '/diagrams' }]}
    >
      <DiagramForm initialDiagram={data} categorizations={categorizations} />
    </Page>
  );
}

export default DiagramRoute;
