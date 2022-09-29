import { RouteComponentProps } from '@reach/router';
import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { CategorizationForm } from '../../Components/CategorizationForm/CategorizationForm';
import { Page } from '../../Components/Page';
import { useProductCategorizations } from '../../Query';

export function ProductCategorizationRoute(props: RouteComponentProps) {
  const { data } = useProductCategorizations();

  if (!data) {
    return (
      <SkeletonPage title="Product Categorization" breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page
      title="Product Categorization"
      breadcrumbs={[
        {
          content: 'Products',
          url: '/products',
        },
      ]}
    >
      <CategorizationForm initialCategorization={data} type="products" />
    </Page>
  );
}
