import React from 'react';
import { Button, Stack } from '@shopify/polaris';
import { RouteComponentProps, navigate } from '@reach/router';

import backgroundImage from '../../Assets/homePageImage.png';
import { CompanyContext } from '../../Context';
import { Page } from '../../Components/Page';

function HomeRoute(props: RouteComponentProps) {
  const { features } = React.useContext(CompanyContext);

  return (
    <Page title="Home" titleHidden fullWidth>
      <div className="stage">
        <div className="listButton">
          <Stack vertical>
            <Button
              accessibilityLabel="Parts"
              primary
              disabled={!features.PARTS_BASE}
              onClick={() => navigate('/parts')}
            >
              Parts
            </Button>
            <Button
              accessibilityLabel="Products"
              primary
              disabled={!features.PRODUCTS_BASE}
              onClick={() => navigate('/products')}
            >
              Products
            </Button>
            <Button
              accessibilityLabel="Diagrams"
              onClick={() => navigate('/diagrams')}
              disabled={!features.DIAGRAMS_BASE}
              primary
            >
              Diagrams
            </Button>
            <Button
              accessibilityLabel="Devices"
              onClick={() => navigate('/devices')}
              primary
            >
              Devices
            </Button>
            <div className="urlButton">
              <Button
                accessibilityLabel="Edit and sync"
                onClick={() => navigate('/company')}
                primary
              >
                Company
              </Button>
            </div>
          </Stack>
        </div>
        <img src={backgroundImage} alt="Logo" className="stageBackground" />
      </div>
    </Page>
  );
}

export default HomeRoute;
