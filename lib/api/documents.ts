import apiClient from './client';

export const documentsApi = {
  queueOcrAndUpload: async (requestId: string, files: File[], documentTypes: string[]) => {
    const formData = new FormData();
    formData.append('form_id', requestId.replace('REQ-', ''));
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('document_types', JSON.stringify(documentTypes));

    const response = await apiClient.post('/api/queue-ocr-and-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getLsrDocuments: async (requestId: string) => {
    const response = await apiClient.get(`/api/v1/requests/${requestId}/lsr-documents`);
    return response.data;
  },

  retryOcr: async (requestId: string, documentId: string) => {
    const response = await apiClient.post(
      `/api/v1/requests/${requestId}/lsr-documents/${encodeURIComponent(documentId)}/retry`
    );
    return response.data;
  },

  triggerVisionOcr: async (requestId: string, documentId: string) => {
    const response = await apiClient.post(
      `/api/v1/requests/${requestId}/lsr-documents/${encodeURIComponent(documentId)}/vision-ocr`
    );
    return response.data;
  },

  triggerVisionDirect: async (requestId: string, documentId: string) => {
    const response = await apiClient.post(
      `/api/v1/requests/${requestId}/lsr-documents/${encodeURIComponent(documentId)}/vision-direct`
    );
    return response.data;
  },

  updateDocumentType: async (requestId: string, documentId: string, documentType: string) => {
    const response = await apiClient.patch(
      `/api/v1/requests/${requestId}/lsr-documents/${encodeURIComponent(documentId)}/type`,
      { document_type: documentType }
    );
    return response.data;
  },
};
