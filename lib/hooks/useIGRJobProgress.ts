'use client';

import { useState, useEffect } from 'react';
import { igrApi } from '@/lib/api/igr';
import { ScrapeJobResponse } from '@/types/pms';

export function useIGRJobProgress(jobId: string | null, pollIntervalMs = 2500) {
  const [jobData, setJobData] = useState<ScrapeJobResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;
    setIsLoading(true);

    const checkProgress = async () => {
      try {
        const data = await igrApi.getJobProgress(jobId);
        if (isMounted) {
          setJobData(data);
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            setIsLoading(false);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.response?.data?.detail || 'Failed to poll IGR job progress');
        }
      }
    };

    checkProgress();
    const interval = setInterval(() => {
      if (jobData?.status !== 'COMPLETED' && jobData?.status !== 'FAILED') {
        checkProgress();
      } else {
        clearInterval(interval);
      }
    }, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId, jobData?.status, pollIntervalMs]);

  return { jobData, isLoading, error, isCompleted: jobData?.status === 'COMPLETED' };
}
