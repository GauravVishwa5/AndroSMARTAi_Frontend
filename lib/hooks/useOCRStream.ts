'use client';

import { useEffect, useState } from 'react';

export interface OCREvent {
  type: 'file_started' | 'file_done' | 'job_done' | 'error';
  file_name?: string;
  index?: number;
  total?: number;
  status?: 'success' | 'failed';
  error?: string;
  s3_url?: string;
}

export function useOCRStream(jobId: string | null) {
  const [events, setEvents] = useState<OCREvent[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!jobId) return;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const eventSource = new EventSource(`${API_BASE_URL}/api/stream/${jobId}`);

    eventSource.onmessage = (event) => {
      try {
        const data: OCREvent = JSON.parse(event.data);
        setEvents((prev) => [...prev, data]);

        if (data.index && data.total) {
          setProgress(Math.round((data.index / data.total) * 100));
        }

        if (data.type === 'job_done') {
          setIsCompleted(true);
          setProgress(100);
          eventSource.close();
        }
      } catch (err) {
        console.error('Failed to parse SSE event', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [jobId]);

  return { events, isCompleted, progress };
}
