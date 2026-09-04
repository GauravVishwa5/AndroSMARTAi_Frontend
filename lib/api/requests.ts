import apiClient from './client';
import { localCache } from './cache';
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
import {
  CaseFinding,
  FindingsResponse,
  CollateralRiskScore,
  DisbursementReadiness,
  AdvocateReview,
  AuditTrailResponse,
} from '@/types/enterprise';

export const requestsApi = {
  getRequestsList: async (forceRefresh = false): Promise<any[]> => {
    const cacheKey = 'req_list_cache';
    if (!forceRefresh) {
      const cached = localCache.get<any[]>(cacheKey);
      if (cached) return cached;
    }

    const response = await apiClient.get('/api/request-list');
    let items: any[] = [];
    if (Array.isArray(response.data)) {
      items = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      items = response.data.data;
    }

    localCache.set(cacheKey, items, 3); // 3-minute cache
    return items;
  },

  getRequestDetails: async (requestId: string, forceRefresh = false): Promise<BankForm> => {
    const cacheKey = `req_details_${requestId}`;
    if (!forceRefresh) {
      const cached = localCache.get<BankForm>(cacheKey);
      if (cached && (cached.id || cached.propertyName || (cached as any).property_name)) return cached;
    }

    const response = await apiClient.get(`/api/request/${requestId}`);
    if (response.data) {
      localCache.set(cacheKey, response.data, 5); // 5-minute cache
    }
    return response.data;
  },

  createRequest: async (payload: Partial<BankForm>): Promise<BankForm> => {
    const response = await apiClient.post('/api/new-request', payload);
    localCache.remove('req_list_cache');
    return response.data;
  },

  updateRequest: async (requestId: string, payload: Partial<BankForm>): Promise<BankForm> => {
    const response = await apiClient.post('/api/new-request', {
      ...payload,
      request_id: requestId,
      id: requestId,
    });
    localCache.remove(`req_details_${requestId}`);
    localCache.remove('req_list_cache');
    return response.data;
  },

  uploadNewDocuments: async (requestId: string, files: File[], docTypes?: string[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });
    if (docTypes && docTypes.length > 0) {
      docTypes.forEach((dt) => {
        formData.append('doc_types', dt);
      });
    }
    const response = await apiClient.post(
      `/api/upload-documents/${encodeURIComponent(requestId)}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  getBranchStats: async () => {
    const cacheKey = 'branch_stats_cache';
    const cached = localCache.get(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/v1/branch/dashboard-stats');
    localCache.set(cacheKey, response.data, 2);
    return response.data;
  },

  getLegalStats: async () => {
    const cacheKey = 'legal_stats_cache';
    const cached = localCache.get(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/v1/legal/dashboard-stats');
    localCache.set(cacheKey, response.data, 2);
    return response.data;
  },

  getSearchStats: async () => {
    const cacheKey = 'search_stats_cache';
    const cached = localCache.get(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/v1/search/dashboard-stats');
    localCache.set(cacheKey, response.data, 2);
    return response.data;
  },

  updateRequestStatus: async (requestId: string, status: string, reason?: string) => {
    const response = await apiClient.patch(`/api/request/${requestId}/status`, {
      status,
      reason,
    });
    localCache.remove(`req_details_${requestId}`);
    localCache.remove('req_list_cache');
    return response.data;
  },

  // Document Verification
  verifyDocument: async (requestId: string, documentId: string, status: 'clear' | 'rejected', reason?: string) => {
    const response = await apiClient.patch(
      `/api/request/${requestId}/documents/${encodeURIComponent(documentId)}/verify`,
      { status, reason }
    );
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  verifyAllDocuments: async (requestId: string, status: 'clear' | 'rejected' = 'clear', reason?: string) => {
    const response = await apiClient.patch(`/api/request/${requestId}/documents/verify-all`, {
      status,
      reason,
    });
    localCache.remove(`req_details_${requestId}`);
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
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  getDocumentTypes: async (reqId?: string, caseType?: string): Promise<DocumentTypesResponse> => {
    const response = await apiClient.get('/api/document-types', {
      params: { req_id: reqId, case_type: caseType },
    });
    return response.data;
  },

  // OCR Triggers & Retry
  retryDocumentOcr: async (requestId: string, documentId: string) => {
    const response = await apiClient.post(
      `/api/request/${encodeURIComponent(requestId)}/documents/${encodeURIComponent(documentId)}/ocr`
    );
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  retryAllOcr: async (requestId: string) => {
    const response = await apiClient.post(`/api/request/${encodeURIComponent(requestId)}/retry-ocr-all`);
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  // Geography & Masters (Cached with 30-minute TTL)
  getStates: async (): Promise<GeographicState[]> => {
    const cacheKey = 'master_states';
    const cached = localCache.get<GeographicState[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/states');
    localCache.set(cacheKey, response.data, 30);
    return response.data;
  },

  getDistricts: async (stateId?: number): Promise<District[]> => {
    const cacheKey = `master_districts_${stateId || 'all'}`;
    const cached = localCache.get<District[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/district', { params: { state_id: stateId } });
    localCache.set(cacheKey, response.data, 30);
    return response.data;
  },

  getTalukas: async (districtId: number): Promise<Taluka[]> => {
    const cacheKey = `master_talukas_${districtId}`;
    const cached = localCache.get<Taluka[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/taluka', { params: { district_id: districtId } });
    localCache.set(cacheKey, response.data, 30);
    return response.data;
  },

  getVillages: async (talukaId?: number, districtId?: number): Promise<Village[]> => {
    const cacheKey = `master_villages_${talukaId || 'none'}_${districtId || 'none'}`;
    const cached = localCache.get<Village[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/villages', { params: { taluka_id: talukaId, district_id: districtId } });
    localCache.set(cacheKey, response.data, 30);
    return response.data;
  },

  // Delhi DORIS Masters
  getDelhiSROs: async (): Promise<DelhiSRO[]> => {
    const cacheKey = 'master_delhi_sros';
    const cached = localCache.get<DelhiSRO[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/delhi-igr/master/sros');
    const items = response.data?.items || (Array.isArray(response.data) ? response.data : []);
    localCache.set(cacheKey, items, 30);
    return items;
  },

  getDelhiLocalities: async (sroId: string): Promise<DelhiLocality[]> => {
    const cacheKey = `master_delhi_localities_${sroId}`;
    const cached = localCache.get<DelhiLocality[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get('/api/delhi-igr/master/localities', {
      params: { sro_id: sroId, limit: 1000 },
    });
    const items = response.data?.items || (Array.isArray(response.data) ? response.data : []);
    localCache.set(cacheKey, items, 30);
    return items;
  },

  // Document & Text Translation
  translateText: async (text: string, sourceLang: string = 'auto', targetLang: string = 'en', docType?: string) => {
    const response = await apiClient.post('/api/translate', {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
      doc_type: docType,
    });
    return response.data;
  },

  translateDocument: async (requestId: string, docId: string, sourceLang: string = 'auto', targetLang: string = 'en') => {
    const response = await apiClient.post(
      `/api/request/${encodeURIComponent(requestId)}/documents/${encodeURIComponent(docId)}/translate`,
      null,
      {
        params: { source_lang: sourceLang, target_lang: targetLang },
      }
    );
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  // Field Survey & Site Geotagging (Cached per request)
  getSurvey: async (requestId: string, forceRefresh = false) => {
    const cacheKey = `req_survey_${requestId}`;
    if (!forceRefresh) {
      const cached = localCache.get(cacheKey);
      if (cached) return cached;
    }

    const response = await apiClient.get(`/api/request/${encodeURIComponent(requestId)}/survey`);
    if (response.data) {
      localCache.set(cacheKey, response.data, 5); // 5-minute cache
    }
    return response.data;
  },

  saveSurvey: async (requestId: string, data: Record<string, any>) => {
    const response = await apiClient.post(`/api/request/${encodeURIComponent(requestId)}/survey`, data);
    localCache.remove(`req_survey_${requestId}`);
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  uploadSurveyPhoto: async (
    requestId: string,
    file: File,
    metadata?: { category?: string; latitude?: number; longitude?: number; accuracy?: number; notes?: string }
  ) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (metadata?.category) formData.append('category', metadata.category);
    if (metadata?.latitude !== undefined && metadata?.latitude !== null) formData.append('latitude', String(metadata.latitude));
    if (metadata?.longitude !== undefined && metadata?.longitude !== null) formData.append('longitude', String(metadata.longitude));
    if (metadata?.accuracy !== undefined && metadata?.accuracy !== null) formData.append('accuracy', String(metadata.accuracy));
    if (metadata?.notes) formData.append('notes', metadata.notes);

    const response = await apiClient.post(
      `/api/request/${encodeURIComponent(requestId)}/survey/photo`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    localCache.remove(`req_survey_${requestId}`);
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  deleteSurveyPhoto: async (requestId: string, photoId: string) => {
    const response = await apiClient.delete(
      `/api/request/${encodeURIComponent(requestId)}/survey/photo/${encodeURIComponent(photoId)}`
    );
    localCache.remove(`req_survey_${requestId}`);
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  // ============================================================================
  // ENTERPRISE PLATFORM (PHASES 1 - 6) APIS
  // ============================================================================

  // Phase 1: Canonical Findings
  getFindings: async (requestId: string, forceRefresh = false): Promise<FindingsResponse> => {
    const cacheKey = `req_findings_${requestId}`;
    if (!forceRefresh) {
      const cached = localCache.get<FindingsResponse>(cacheKey);
      if (cached) return cached;
    }
    const response = await apiClient.get(`/api/request/${encodeURIComponent(requestId)}/findings`);
    if (response.data) {
      localCache.set(cacheKey, response.data, 2);
    }
    return response.data;
  },

  updateFindingStatus: async (
    requestId: string,
    findingId: string | number,
    status: 'OPEN' | 'RESOLVED' | 'WAIVED',
    resolutionNotes?: string
  ): Promise<any> => {
    const response = await apiClient.patch(
      `/api/request/${encodeURIComponent(requestId)}/findings/${encodeURIComponent(String(findingId))}`,
      { status, resolution_notes: resolutionNotes || '' }
    );
    localCache.remove(`req_findings_${requestId}`);
    localCache.remove(`req_risk_${requestId}`);
    localCache.remove(`req_readiness_${requestId}`);
    localCache.remove(`req_audit_${requestId}`);
    return response.data;
  },

  syncFindings: async (requestId: string): Promise<any> => {
    const response = await apiClient.post(`/api/request/${encodeURIComponent(requestId)}/findings/sync`);
    localCache.remove(`req_findings_${requestId}`);
    localCache.remove(`req_risk_${requestId}`);
    localCache.remove(`req_readiness_${requestId}`);
    return response.data;
  },

  // Phase 2: Collateral Risk Score
  getRiskAssessment: async (requestId: string, forceRefresh = false): Promise<CollateralRiskScore> => {
    const cacheKey = `req_risk_${requestId}`;
    if (!forceRefresh) {
      const cached = localCache.get<CollateralRiskScore>(cacheKey);
      if (cached) return cached;
    }
    const response = await apiClient.get(`/api/request/${encodeURIComponent(requestId)}/risk-assessment`);
    if (response.data) {
      localCache.set(cacheKey, response.data, 2);
    }
    return response.data;
  },

  // Phase 3: Disbursement Readiness
  getDisbursementReadiness: async (requestId: string, forceRefresh = false): Promise<DisbursementReadiness> => {
    const cacheKey = `req_readiness_${requestId}`;
    if (!forceRefresh) {
      const cached = localCache.get<DisbursementReadiness>(cacheKey);
      if (cached) return cached;
    }
    const response = await apiClient.get(`/api/request/${encodeURIComponent(requestId)}/disbursement-readiness`);
    if (response.data) {
      localCache.set(cacheKey, response.data, 2);
    }
    return response.data;
  },

  // Phase 5: Advocate Maker-Checker
  getAdvocateReview: async (requestId: string, forceRefresh = false): Promise<{ review: AdvocateReview | null; enabled: boolean }> => {
    const cacheKey = `req_advocate_${requestId}`;
    if (!forceRefresh) {
      const cached = localCache.get<{ review: AdvocateReview | null; enabled: boolean }>(cacheKey);
      if (cached) return cached;
    }
    const response = await apiClient.get(`/api/request/${encodeURIComponent(requestId)}/advocate-review`);
    if (response.data) {
      localCache.set(cacheKey, response.data, 2);
    }
    return response.data;
  },

  submitAdvocateMaker: async (
    requestId: string,
    payload: { bar_council_id: string; legal_opinion: string; maker_notes?: string }
  ): Promise<any> => {
    const response = await apiClient.post(
      `/api/request/${encodeURIComponent(requestId)}/advocate-review/submit-maker`,
      payload
    );
    localCache.remove(`req_advocate_${requestId}`);
    localCache.remove(`req_audit_${requestId}`);
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  actionAdvocateChecker: async (
    requestId: string,
    payload: { action: 'APPROVE' | 'REJECT' | 'RETURN'; checker_notes?: string }
  ): Promise<any> => {
    const response = await apiClient.post(
      `/api/request/${encodeURIComponent(requestId)}/advocate-review/action-checker`,
      payload
    );
    localCache.remove(`req_advocate_${requestId}`);
    localCache.remove(`req_audit_${requestId}`);
    localCache.remove(`req_details_${requestId}`);
    return response.data;
  },

  // Phase 6: Case Audit Trail
  getAuditTrail: async (
    requestId: string,
    params?: { limit?: number; offset?: number; event_type?: string },
    forceRefresh = false
  ): Promise<AuditTrailResponse> => {
    const cacheKey = `req_audit_${requestId}_${params?.limit || 50}_${params?.offset || 0}_${params?.event_type || 'all'}`;
    if (!forceRefresh) {
      const cached = localCache.get<AuditTrailResponse>(cacheKey);
      if (cached) return cached;
    }
    const response = await apiClient.get(`/api/request/${encodeURIComponent(requestId)}/audit-trail`, {
      params,
    });
    if (response.data) {
      localCache.set(cacheKey, response.data, 2);
    }
    return response.data;
  },
};

export default requestsApi;
