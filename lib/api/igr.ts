import apiClient from './client';
import { IGRTransactionRecord, ScrapeJobResponse } from '@/types/pms';

export const igrApi = {
  // Trigger Delhi Multi-Year Scrape
  scrapeDelhiV2: async (requestId: string): Promise<ScrapeJobResponse> => {
    const response = await apiClient.post('/api/delhi-igr/scrape-delhi-v2', {
      request_id: requestId,
    });
    return response.data;
  },

  // Trigger Maharashtra Multi-Year Scrape
  scrapeMaharashtraV2: async (requestId: string): Promise<ScrapeJobResponse> => {
    const response = await apiClient.post('/api/scrape-all-years-v2', {
      request_id: requestId,
    });
    return response.data;
  },

  // Poll Scrape Job Progress
  getJobProgress: async (jobId: string): Promise<ScrapeJobResponse> => {
    const response = await apiClient.get(`/api/igr-jobs/${jobId}`);
    return response.data;
  },

  // Get Scraped Transactions (SCR View)
  getIgrTransactions: async (requestId: string, relevantOnly = true): Promise<IGRTransactionRecord[]> => {
    const response = await apiClient.get(`/api/igr/all/${requestId}`, {
      params: { relevant: relevantOnly },
    });
    return response.data?.items || response.data || [];
  },

  // Get Marathi / English specific translation
  getTransactionsByLanguage: async (requestId: string, lang: 'en' | 'mr'): Promise<IGRTransactionRecord[]> => {
    const response = await apiClient.get(`/api/transactions/${requestId}/language/${lang}`);
    return response.data?.items || response.data || [];
  },

  // Manual Include / Exclude Override
  updateTransactionOverride: async (
    transactionId: number,
    data: { bank_form_id: number; is_excluded: boolean; manual_comment?: string }
  ) => {
    const response = await apiClient.patch(`/api/transaction/${transactionId}/status`, data);
    return response.data;
  },

  // Health / Proxy Monitor
  getScraperHealth: async () => {
    const response = await apiClient.get('/api/health/status');
    return response.data;
  },
};
