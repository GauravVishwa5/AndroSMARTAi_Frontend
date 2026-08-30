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

  getWopiToken: async () => {
    const response = await apiClient.post('/api/wopi/token');
    return response.data;
  },

  getWopiEditorUrl: async (requestId: string, reportType: 'lsr' | 'scr' | 'sr') => {
    const response = await apiClient.post('/api/wopi/generate-shared-url', {
      request_id: requestId,
      report_type: reportType,
    });
    return response.data;
  },
};
