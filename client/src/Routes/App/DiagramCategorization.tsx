import { RouteComponentProps } from '@reach/router';
import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { CategorizationForm } from '../../Components/CategorizationForm/CategorizationForm';
import { Page } from '../../Components/Page';
import { useDiagramCategorizations } from '../../Query';

export function DiagramCategorizationRoute(props: RouteComponentProps) {
  const { data } = useDiagramCategorizations();

  if (!data) {
    return (
      <SkeletonPage title="Diagram Categorization" breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page
      title="Diagram Categorization"
      breadcrumbs={[
        {
          content: 'Diagrams',
          url: '/diagrams',
        },
      ]}
    >
      <CategorizationForm initialCategorization={data} type="diagrams" />
    </Page>
  );
}
