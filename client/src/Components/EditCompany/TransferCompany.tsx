/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react';

import { companyTransfer } from '../../Data';
import JobProcessorUI from '../Common/JobProgressorUI';
import { useToast } from '../../BridgeHooks';
import useData from '../../Hooks/useData';

interface CompanyTransferResponse {
  company_transfer_job: {
    company_id: string;
    status: string;
    progress: number;
    error_count: number;
    processed_count: number;
    total: number;
  }
}

function TransferCompany(props: any) {
  const { endpoint, labelButton, jobDescription } = props;
  const [ includeProductsEndpoint, setIncludeProductsEndpoint ] = useState(endpoint)

  const showToast = useToast();
  const [syncing, setSyncing] = useState(false);
  const { data } = useData<CompanyTransferResponse>(includeProductsEndpoint, {
    poll: syncing,
    interval: 500,
  });
  let progress: number = (data?.['company_transfer_job']?.progress ?? 0.0) * 100;
  let transferStatus: string | undefined = data?.['company_transfer_job']?.status 

  useEffect(() => {
    if (progress >= 100) {
      setSyncing(false);
    }

    if (transferStatus === "COMPLETE") {
      setSyncing(false)
    }
  }, [progress, transferStatus]);  



  const handleEndpointUpdate = useCallback((checkedVal) => {
    if (checkedVal) {
      const new_endpoint = includeProductsEndpoint.replace("false", "true")
      setIncludeProductsEndpoint(new_endpoint)
    } else {
      setIncludeProductsEndpoint(endpoint)
    }
  }, [])

  const handleStartSync = useCallback(async () => {
    setSyncing(true);
    const transferStatusCheck = !transferStatus ? undefined : ["NEW","FAILED","STOPPED","COMPLETED"].includes(transferStatus)
    if (transferStatusCheck) {
      companyTransfer(includeProductsEndpoint, data?.company_transfer_job.company_id).then(postResponse => {
        transferStatus = postResponse?.["company_transfer_job"].status 
        progress = (postResponse?.['company_transfer_job']?.progress ?? 0.0) * 100
  
        if (transferStatus === "COMPLETED") {
          setSyncing(false);
          showToast({message: "Transfer is complete"});
          progress = (postResponse?.['company_transfer_job']?.progress ?? 0.0) * 100
          transferStatus = postResponse?.["company_transfer_job"].status 
        }
  
        if (transferStatus === "PENDING") {
          setSyncing(true)
          showToast({ message: "Transfer is about to start"})
          progress = (data?.['company_transfer_job']?.progress ?? 0.0) * 100
          transferStatus = data?.company_transfer_job.status 
          if (transferStatus === 'PENDING') {
            progress = (data?.['company_transfer_job']?.progress ?? 0.0) * 100
          }
          if (transferStatus === 'COMPLETED') {
            progress = (data?.['company_transfer_job']?.progress ?? 0.0) * 100
            setSyncing(false)
            showToast({message: "Transfer is complete"})
          }
          if (transferStatus === 'FAILED') {
            progress = 0
            setSyncing(false)
            showToast({error: true, message: "Transfer failed"})
          }
        }
      })

    }
  }, [data, progress]);

  return (
    <JobProcessorUI
      onSync={handleStartSync}
      onEndpointUpdate={handleEndpointUpdate}
      labelButton={labelButton}
      jobDescription={jobDescription}
      syncing={syncing}
      error={false}
      syncErrorMessage={""}
      syncProgress={progress}
    />
  );
}

export default TransferCompany;

// TYPES
export interface TransferCompanyProps {
  endpoint: string;
  labelButton: string;
  jobDescription: string;
  type: string | number;
}
