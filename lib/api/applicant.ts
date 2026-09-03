import { apiClient } from './client';

export interface ApplicantApplicationSummary {
  id: number;
  application_number: string;
  bank_name: string;
  applicant_name: string;
  property_name: string;
  city?: string;
  district?: string;
  status: string;
  created_at: string;
  pending_deficiencies_count: number;
}

export interface DeficiencyRequest {
  id: string;
  document_title: string;
  deficiency_note?: string;
  status: 'pending' | 'uploaded' | 'verified';
  requested_at: string;
  requested_by?: string;
  file_name?: string;
  uploaded_at?: string;
}

export interface TimelineStep {
  id: number;
  title: string;
  description: string;
  state: 'completed' | 'in_progress' | 'pending';
}

export interface ApplicantUploadedDocument {
  doc_id: string;
  file_name: string;
  document_type: string;
  uploaded_at: string;
  verification_status: string;
}

export interface ApplicantApplicationDetail {
  id: number;
  application_number: string;
  bank_name: string;
  applicant_name: string;
  property_name: string;
  flat_number?: string;
  address?: string;
  city?: string;
  district?: string;
  status: string;
  created_at: string;
  timeline: TimelineStep[];
  deficiency_requests: DeficiencyRequest[];
  uploaded_documents: ApplicantUploadedDocument[];
}

export const applicantApi = {
  activateAccount: async (token: string, password: string) => {
    const response = await apiClient.post('/api/applicant/activate', { token, password });
    return response.data;
  },

  getApplications: async (): Promise<{ success: boolean; applications: ApplicantApplicationSummary[] }> => {
    const response = await apiClient.get('/api/applicant/applications');
    return response.data;
  },

  getApplicationDetail: async (id: string | number): Promise<{ success: boolean; application: ApplicantApplicationDetail }> => {
    const response = await apiClient.get(`/api/applicant/applications/${id}`);
    return response.data;
  },

  uploadDocument: async (
    id: string | number,
    file: File,
    deficiencyId?: string,
    documentType: string = 'Applicant Document'
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    if (deficiencyId) {
      formData.append('deficiency_id', deficiencyId);
    }
    formData.append('document_type', documentType);

    const response = await apiClient.post(`/api/applicant/applications/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
