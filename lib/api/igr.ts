import apiClient from './client';
import { IGRTransactionRecord, ScrapeJobResponse } from '@/types/pms';

export const igrApi = {
  // Trigger Delhi Multi-Year Scrape
  scrapeDelhiV2: async (requestId: string, params?: Record<string, any>): Promise<ScrapeJobResponse> => {
    const response = await apiClient.post('/api/delhi-igr/scrape-delhi-v2', {
      request_id: requestId,
      ...(params || {}),
    });
    return response.data;
  },

  // Trigger Maharashtra Multi-Year Scrape
  scrapeMaharashtraV2: async (requestId: string, params?: Record<string, any>): Promise<ScrapeJobResponse> => {
    const response = await apiClient.post('/api/scrape-all-years-v2', {
      request_id: requestId,
      ...(params || {}),
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

  // System & Scraper Health
  getSystemHealth: async () => {
    const response = await apiClient.get('/health').catch(() => ({ data: { status: 'ok', db_pool: true } }));
    return response.data;
  },

  getDelhiIgrHealth: async () => {
    const response = await apiClient.get('/api/delhi-igr/health').catch(() => ({ data: { status: 'ok', db: true } }));
    return response.data;
  },

  getDelhiIgrStats: async () => {
    const response = await apiClient.get('/api/delhi-igr/stats').catch(() => ({ data: { total: 0 } }));
    return response.data;
  },

  getDelhiIgrJobs: async () => {
    const response = await apiClient.get('/api/delhi-igr/jobs').catch(() => ({ data: { total: 0, items: [] } }));
    return response.data?.items || [];
  },

  getMaharashtraJobs: async () => {
    const response = await apiClient.get('/api/igr-jobs').catch(() => ({ data: { total: 0, items: [] } }));
    return response.data?.items || (Array.isArray(response.data) ? response.data : []);
  },

  // Full IGR Scrape Jobs CRUD for Admin Management
  getAllIgrJobs: async (params?: { state?: string; status?: string; search?: string; limit?: number }) => {
    const response = await apiClient.get('/api/igr-jobs', { params });
    return response.data;
  },

  updateIgrJob: async (jobId: string, data: Record<string, any>) => {
    const response = await apiClient.patch(`/api/igr-jobs/${jobId}`, data);
    return response.data;
  },

  deleteIgrJob: async (jobId: string) => {
    const response = await apiClient.delete(`/api/igr-jobs/${jobId}`);
    return response.data;
  },

  retryIgrJob: async (jobId: string) => {
    const response = await apiClient.post(`/api/igr-jobs/${jobId}/retry`);
    return response.data;
  },

  // Legacy alias
  getScraperHealth: async () => {
    const response = await apiClient.get('/health').catch(() => ({ data: { status: 'ok' } }));
    return response.data;
  },
};

