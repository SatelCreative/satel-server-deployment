import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Card, Banner } from '@shopify/polaris';
import { useLoading, useToast } from '../../BridgeHooks';
import { company } from '../../Data';
import { APICompany } from '../../Data/company';
import CompanyForm from '../../Components/CompanyForm';
import FetchCategorization from '../../Components/EditCompany/FetchCategorization';
import JobProcessor from '../../Components/Common/JobProcessor';
import { CompanyContext } from '../../Context';
import TransferCompany from '../../Components/EditCompany/TransferCompany';
import { Page } from '../../Components/Page';

function CompanyRoute(props: RouteComponentProps) {
  const showToast = useToast();
  const [loading, setLoading] = useLoading(true);
  const [currentCompany, setCompany] = useState<APICompany>();

  const { features } = useContext(CompanyContext);

  useEffect(() => {
    company
      .loadCurrent()
      .then((c) => {
        if (!c) {
          return navigate('/setup');
        }

        setCompany(c);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn(e);
        showToast({ message: 'Error loading company', error: true });
        throw e;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    async (updatedCompany: APICompany) => {
      try {
        const c = await company.updateCurrent(updatedCompany);
        showToast({ message: 'Company updated' });
        return c;
      } catch (e) {
        showToast({ message: 'Error saving company', error: true });
      }
    },
    [showToast],
  );

  const contentMarkup = useMemo(() => {
    if (features.COMPANY_TRANSFER && features.COMPANY_LEGACY_SYNC) {
      return (
        <>
          <Banner status="info" title="Synchronization">
            Use the following to transfer from another company
          </Banner>
          <FetchCategorization />
          <JobProcessor
            key="Download-from-PIM"
            labelButton="Start"
            jobDescription="Download part data from PIM1"
            endpoint="/pim/parts/pim1"
          />
          <JobProcessor
            key="Download-from-Shopify"
            labelButton="Start"
            jobDescription="Download product data from Shopify"
            endpoint="/pim/products/shopify"
          />
          <TransferCompany
            key="Company-transfer"
            labelButton="Start"
            jobDescription="Company Sync"
            endpoint={
              currentCompany
                ? `pim/companies/${currentCompany.id}/transfers?transfer_products=false`
                : ''
            }
          />
        </>
      );
    }

    if (features.COMPANY_LEGACY_SYNC) {
      return (
        <>
          <Banner status="info" title="Synchronization">
            Use the following options to sync the old PIM with the new PIM and
            to sync the new PIM with shopify
          </Banner>
          <FetchCategorization />
          <JobProcessor
            key="Download-from-PIM"
            labelButton="Start"
            jobDescription="Download part data from PIM1"
            endpoint="/pim/parts/pim1"
          />
          <JobProcessor
            key="Download-from-Shopify"
            labelButton="Start"
            jobDescription="Download product data from Shopify"
            endpoint="/pim/products/shopify"
          />
        </>
      );
    }

    if (features.COMPANY_TRANSFER) {
      return (
        <>
          <Banner status="info" title="Synchronization">
            Use the following to transfer from another company
          </Banner>
          <TransferCompany
            key="Company-transfer"
            labelButton="Start"
            jobDescription="Company Sync"
            endpoint={
              currentCompany
                ? `pim/companies/${currentCompany.id}/transfers?transfer_products=false`
                : ''
            }
          />
        </>
      );
    }

    return (
      <>
        <Banner status="info" title="Synchronization">
          Use the following options to download data into the PIM
        </Banner>
        <JobProcessor
          key="Download-from-Shopify"
          labelButton="Start"
          jobDescription="Download product data from Shopify"
          endpoint="/pim/products/shopify"
        />
      </>
    );
  }, [features.COMPANY_LEGACY_SYNC, features.COMPANY_TRANSFER, currentCompany]);

  if (loading || !currentCompany) {
    return (
      <Page
        title="Company"
        titleHidden
        breadcrumbs={[
          {
            content: 'Home',
            url: '/',
          },
        ]}
      />
    );
  }

  return (
    <Page
      title="Company"
      titleHidden
      breadcrumbs={[
        {
          content: 'Home',
          url: '/',
        },
      ]}
    >
      <CompanyForm initialCompany={currentCompany} onSubmit={handleSubmit} />
      <br />
      <Card>{contentMarkup}</Card>
    </Page>
  );
}

export default CompanyRoute;
