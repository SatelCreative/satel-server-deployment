import { RouteComponentProps } from '@reach/router';
import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { CategorizationForm } from '../../Components/CategorizationForm/CategorizationForm';
import { Page } from '../../Components/Page';
import { useDeviceCategorizations } from '../../Query';

export function DeviceCategorizationRoute(props: RouteComponentProps) {
  const { data } = useDeviceCategorizations();

  if (!data) {
    return (
      <SkeletonPage title="Device Categorization" breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page
      title="Device Categorization"
      breadcrumbs={[
        {
          content: 'Devices',
          url: '/devices',
        },
      ]}
    >
      <CategorizationForm initialCategorization={data} type="devices" />
    </Page>
  );
}
