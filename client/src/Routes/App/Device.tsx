import { RouteComponentProps } from '@reach/router';

import { SkeletonBodyText, SkeletonPage } from '@shopify/polaris';
import { DeviceForm } from '../../Components/DeviceForm';
import { Page } from '../../Components/Page';
import { useDevice, useDeviceCategorizations } from '../../Query';

function DeviceRoute(props: RouteComponentProps<{ id: string }>) {
  const { id } = props;

  if (!id) {
    throw new Error('Invalid device id');
  }

  const { data } = useDevice(id);
  const { data: categorizations } = useDeviceCategorizations();

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
      breadcrumbs={[{ content: 'Devices', url: '/devices' }]}
    >
      <DeviceForm initialDevice={data} categorizations={categorizations} />
    </Page>
  );
}

export default DeviceRoute;
