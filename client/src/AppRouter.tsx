import React, { useContext, useState } from 'react';
import { Router as ReachRouter } from '@reach/router';

import { Button } from '@shopify/polaris';
import { App as A } from './Routes';
import { CompanyContext } from './Context';
import { SentryErrorBoundary } from './sentry';
import { DiagramPartsModal, CategorizationsGroupModal } from './Routes/Modal';
import DeviceRoute from './Routes/App/Device';
import NewDeviceRoute from './Routes/App/NewDevice';
import DevicesRoute from './Routes/App/Devices';
import { DeviceCategorizationRoute } from './Routes/App/DeviceCategorization';
import { DiagramCategorizationRoute } from './Routes/App/DiagramCategorization';
import { ProductCategorizationRoute } from './Routes/App/ProductCategorizationRoute';
import { DiagramDevicesModal } from './Routes/Modal/DiagramDevicesModal';
import { FlagsRoute } from './Routes/App/Flags';

function SentryTest(props: any) {
  const [error, setError] = useState(false);

  if (error) {
    throw new Error('CLIENT_TEST_ERROR');
  }

  return (
    <Button
      onClick={() => {
        setError(true);
      }}
    >
      Test sentry error
    </Button>
  );
}

function Feature({ children, enabled }: any) {
  if (!enabled) {
    return <A.NotFound />;
  }

  return children;
}

function AppRouter() {
  const { features } = useContext(CompanyContext);

  return (
    <ReachRouter>
      <SentryErrorBoundary default>
        <A.Home path="/" />
        <Feature path="parts" enabled={features.PARTS_BASE}>
          <A.Parts path="/" />
          <A.NotFound default />
        </Feature>
        <Feature path="products" enabled={features.PRODUCTS_BASE}>
          <A.Products path="/" />
          <A.Product path="/:productId" />
          <A.ProductNew path="/new" />
          <A.NotFound default />
        </Feature>
        <Feature path="diagrams" enabled={features.DIAGRAMS_BASE}>
          <A.Diagrams path="/" />
          <A.Diagram path="/:id" />
          <A.CreateDiagram path="/new" />
          <A.NotFound default />
        </Feature>
        <DevicesRoute path="/devices" />
        <NewDeviceRoute path="/devices/new" />
        <DeviceRoute path="/devices/:id" />
        <ProductCategorizationRoute path="/products/categorization" />
        <DiagramCategorizationRoute path="/diagrams/categorization" />
        <DeviceCategorizationRoute path="/devices/categorization" />
        <A.Setup path="/setup" />
        <A.Company path="/company" />
        <FlagsRoute path="/flags" />
        <SentryTest path="/mh701FVCpcOV" />
        <DiagramPartsModal path="/modal/diagrams/parts" />
        <DiagramDevicesModal path="/modal/diagrams/devices" />
        <CategorizationsGroupModal path="/modal/categorizations/:id" />
        <A.NotFound default />
      </SentryErrorBoundary>
    </ReachRouter>
  );
}

export default AppRouter;
