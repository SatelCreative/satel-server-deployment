import { RouteComponentProps } from '@reach/router';

import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { DeviceForm } from '../../Components/DeviceForm';
import { Page } from '../../Components/Page';
import { useDeviceCategorizations } from '../../Query';

function NewDeviceRoute(props: RouteComponentProps) {
  const { data: categorizations } = useDeviceCategorizations();

  if (!categorizations) {
    return (
      <SkeletonPage title="New" breadcrumbs>
        <SkeletonBodyText lines={4} />
      </SkeletonPage>
    );
  }

  return (
    <Page title="New" breadcrumbs={[{ content: 'Devices', url: '/devices' }]}>
      <DeviceForm categorizations={categorizations} />
    </Page>
  );
}

export default NewDeviceRoute;
