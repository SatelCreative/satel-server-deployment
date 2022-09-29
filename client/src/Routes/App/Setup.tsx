import React, { useState, useEffect } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Banner, Card, SkeletonBodyText } from '@shopify/polaris';
import SetupForm from '../../Components/SetupForm';
import { company, companyLoad } from '../../Data';
import { APICompanyOnly } from '../../Data/company';
import useToast from '../../BridgeHooks/useToast';
import { Page } from '../../Components/Page';

/**
 * Ensures the current company can in
 * fact be setup
 *
 * @param {*} { children }
 * @returns
 */
function SetupCheck({ children, loading: l }: any) {
  const showToast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyLoad()
      .then((response) => {
        if (response.error) {
          // eslint-disable-next-line no-console
          console.warn(
            `Error loading "/companies/thisstore", proceeding with setup anyway`,
          );
        } else if (response.company) {
          showToast({
            message: 'Setup already completed, redirecting...',
            error: true,
          });
          navigate(`/company/${response.company.id}`);
          return;
        }
        setLoading(false);
      })
      .catch((e) => {
        // This should never be reached
        // eslint-disable-next-line no-console
        console.warn('companyLoad() threw');
        throw e;
      });
  }, [showToast]);

  if (loading || l) {
    return (
      <>
        <Card sectioned>
          <SkeletonBodyText />
        </Card>
        <Card sectioned>
          <SkeletonBodyText />
        </Card>
      </>
    );
  }

  return children;
}

interface SetupBannerProps {
  show: boolean;
  existingCompanies: boolean;
  onDismiss: () => void;
}

function SetupBanner(props: SetupBannerProps) {
  const { show, existingCompanies, onDismiss } = props;

  if (!show) {
    return null;
  }

  // @todo someone should update this copy

  // When there are companies to select
  let content = (
    <>
      <p>
        You are almost ready to go! To start, please let us know what company
        this Shopify store belongs to.
      </p>
      <p>Use the list below to select your company.</p>
    </>
  );

  // When company must be created
  if (!existingCompanies) {
    content = (
      <>
        <p>
          Can&apos;t find the right company? Use the provided fields to create
          your company.
        </p>
      </>
    );
  }

  return (
    <>
      <Banner
        title="Welcome to the Shape Technologies PIM!"
        onDismiss={onDismiss}
      >
        {content}
      </Banner>
      <br />
    </>
  );
}

function SetupRoute(props: RouteComponentProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<APICompanyOnly[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<APICompanyOnly[]>(
    [],
  );

  useEffect(() => {
    company
      .load()
      .then((cs) => {
        setCompanies(cs);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e);
        throw e;
      });
  }, []);

  useEffect(() => {
    company
      .load('?only_empty=false')
      .then((cs) => {
        setFilteredCompanies(cs);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e);
        throw e;
      });
  }, []);

  return (
    <Page title="Setup" titleHidden>
      <SetupCheck loading={loading}>
        <SetupBanner
          show={showBanner && !loading}
          existingCompanies={companies.length !== 0}
          onDismiss={() => setShowBanner(false)}
        />
        <SetupForm
          companies={companies}
          filteredCompanies={filteredCompanies}
        />
      </SetupCheck>
    </Page>
  );
}

export default SetupRoute;
