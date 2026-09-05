import apiClient from './client';

export const reportsApi = {
  generateLsr: async (requestId: string) => {
    const response = await apiClient.post('/api/generate-lsr', { request_id: requestId });
    return response.data;
  },

  generateScr: async (requestId: string) => {
    const response = await apiClient.post('/api/sr-generate-report', { request_id: requestId });
    return response.data;
  },

  generateSr: async (requestId: string) => {
    const response = await apiClient.post('/api/sr-report', { request_id: requestId });
    return response.data;
  },

  // Direct report download via secure S3 presigned URL
  getReportDownloadUrl: async (requestId: string, reportType: 'lsr' | 'scr' | 'sr') => {
    const response = await apiClient.get(`/api/v1/requests/${requestId}/reports/${reportType}/download-url`);
    return response.data;
  },
};
