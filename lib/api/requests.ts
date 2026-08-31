import apiClient from './client';
import {
  BankForm,
  DocumentTypesResponse,
  GeographicState,
  District,
  Taluka,
  Village,
  DelhiSRO,
  DelhiLocality,
} from '@/types/pms';

export const requestsApi = {
  getRequestsList: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/request-list');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },

  getRequestDetails: async (requestId: string): Promise<BankForm> => {
    const response = await apiClient.get(`/api/request/${requestId}`);
    return response.data;
  },

  createRequest: async (payload: Partial<BankForm>): Promise<BankForm> => {
    const response = await apiClient.post('/api/new-request', payload);
    return response.data;
  },

  getBranchStats: async () => {
    const response = await apiClient.get('/api/v1/branch/dashboard-stats');
    return response.data;
  },

  getLegalStats: async () => {
    const response = await apiClient.get('/api/v1/legal/dashboard-stats');
    return response.data;
  },

  getSearchStats: async () => {
    const response = await apiClient.get('/api/v1/search/dashboard-stats');
    return response.data;
  },

  updateRequestStatus: async (requestId: string, status: string, reason?: string) => {
    const response = await apiClient.patch(`/api/request/${requestId}/status`, {
      status,
      reason,
    });
    return response.data;
  },

  // Document Verification
  verifyDocument: async (requestId: string, documentId: string, status: 'clear' | 'rejected', reason?: string) => {
    const response = await apiClient.patch(
      `/api/request/${requestId}/documents/${encodeURIComponent(documentId)}/verify`,
      { status, reason }
    );
    return response.data;
  },

  verifyAllDocuments: async (requestId: string, status: 'clear' | 'rejected' = 'clear', reason?: string) => {
    const response = await apiClient.patch(`/api/request/${requestId}/documents/verify-all`, {
      status,
      reason,
    });
    return response.data;
  },

  replaceDocument: async (requestId: string, documentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.patch(
      `/api/request/${requestId}/documents/${encodeURIComponent(documentId)}/replace`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  getDocumentTypes: async (reqId?: string, caseType?: string): Promise<DocumentTypesResponse> => {
    const response = await apiClient.get('/api/document-types', {
      params: { req_id: reqId, case_type: caseType },
    });
    return response.data;
  },

  // Geography & Masters
  getStates: async (): Promise<GeographicState[]> => {
    const response = await apiClient.get('/api/states');
    return response.data;
  },

  getDistricts: async (stateId?: number): Promise<District[]> => {
    const response = await apiClient.get('/api/district', { params: { state_id: stateId } });
    return response.data;
  },

  getTalukas: async (districtId: number): Promise<Taluka[]> => {
    const response = await apiClient.get('/api/taluka', { params: { district_id: districtId } });
    return response.data;
  },

  getVillages: async (talukaId: number): Promise<Village[]> => {
    const response = await apiClient.get('/api/villages', { params: { taluka_id: talukaId } });
    return response.data;
  },

  // Delhi DORIS Masters
  getDelhiSROs: async (): Promise<DelhiSRO[]> => {
    const response = await apiClient.get('/api/delhi-igr/master/sros');
    return response.data;
  },

  getDelhiLocalities: async (sroId: string): Promise<DelhiLocality[]> => {
    const response = await apiClient.get('/api/delhi-igr/master/localities', {
      params: { sro_id: sroId },
    });
    return response.data;
  },
};
