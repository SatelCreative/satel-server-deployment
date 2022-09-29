/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react';
import JobProcessorUI from './JobProgressorUI';
import { useToast } from '../../BridgeHooks';
import useMutation from '../../Hooks/useMutation';
import useData from '../../Hooks/useData'

interface JobStartResponse {
  jobid: string;
  [key: string]: any;
}

interface JobStatusResponse {
  job_data: {
    status: string;
    progress: number;
    errors: number;
    errorlog: string[];
  }
}

function JobProcessor(props: any) {
  const { endpoint, labelButton, jobDescription } = props;

  const showToast = useToast();
  const [mutate, { mutationData }] = useMutation<JobStartResponse>(endpoint);
  const jobId: undefined | string = mutationData?.jobid;

  const [syncing, setSyncing] = useState(false);

  const { data: jobData } = useData<JobStatusResponse>(`/pim/jobs/${jobId}`, {
    disabled: !jobId || !syncing,
    poll: syncing,
    interval: 500,
  });

  const progress: number = (jobData?.['job_data']?.progress ?? 0.0) * 100;
  const error: number = jobData?.['job_data']?.errors ?? 0;

  useEffect(() => {
    if (error > 0) {
      setSyncing(false)
      showToast({error: true, message: jobData?.['job_data']?.errorlog.toString() ?? "An error occurred" })
    }
    if (progress >= 100) {
      setSyncing(false);
      showToast({message: "Sync completed" })
    }
  }, [progress, error]);

  const handleStartSync = useCallback(() => {
    setSyncing(true);
    mutate();
  }, [jobId]);

  return (
    <JobProcessorUI
      onSync={handleStartSync}
      labelButton={labelButton}
      jobDescription={jobDescription}
      syncing={syncing}
      error={false}
      syncErrorMessage={""}
      syncProgress={progress}
    />
  );
}


export default JobProcessor;

// TYPES
export interface JobProcessorProps {
  endpoint: string;
  labelButton: string;
  jobDescription: string;
  type: string | number;
}
