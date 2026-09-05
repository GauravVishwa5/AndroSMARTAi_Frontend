export type RequestStatus = 'Pending' | 'Verified' | 'Rejected' | 'Sent for Investigation' | 'In Review' | 'Needs Clarification' | 'Completed';

export type OCRStatus = 'queued' | 'processing' | 'done' | 'failed';
export type VerificationStatus = 'pending' | 'clear' | 'rejected';

export interface DocumentItem {
  doc_id: string;
  file_name: string;
  file_url: string | [string, string]; // [s3_url, local_name]
  document_type?: string;
  ocr_status?: OCRStatus;
  verification_status?: VerificationStatus;
  verification_reason?: string;
  verified_by?: string;
  verified_at?: string;
  uploaded_at?: string;
  replacement_for?: string;
  extracted_json?: Record<string, any>;
}

export interface LSRDocumentItem {
  url?: string;
  s3_key?: string;
  generated_at?: string;
  files_processed?: number;
  report_id?: string;
}

export interface BankForm {
  id: string; // REQ-XXXX
  raw_id: number;
  ownerName: string;
  applicantName?: string;
  propertyName: string;
  bankName: string;
  Bank_branch?: string;
  flatNumber: string;
  address?: string;
  state?: string;
  city?: string;
  village?: string;
  villages?: string[];
  pinCode?: string;
  ctsNumber?: string;
  propertyNumber?: string | string[];
  propertyNumbers?: string | string[];
  from_year?: number;
  stampDuty?: string;
  lodgementReceipt?: string;
  signingPage?: string;
  indexII?: string;
  category?: string;
  permitNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  validity?: string;
  advocateName?: string;
  searchName?: string;
  caseType?: string;
  transactionType?: string;
  status: RequestStatus;
  documents: DocumentItem[];
  lsr_documents?: LSRDocumentItem[];
  scr_report?: any;
  sr_report?: any;
  created_at?: string;
  date_raised?: string;
}

export interface DocumentTypeOption {
  id: number;
  document_type: string;
}

export interface DocumentTypesResponse {
  status: string;
  case_type?: string;
  req_id?: string;
  count: number;
  document_types: DocumentTypeOption[];
  other_document_types: DocumentTypeOption[];
}

export interface GeographicState {
  id: number;
  state_name: string;
}

export interface District {
  id: number;
  district_name?: string;
  name?: string;
  name_en?: string;
  state_id?: number;
  region?: string;
}

export interface Taluka {
  id: number;
  taluka_name?: string;
  name?: string;
  name_en?: string;
  district_id?: number;
}

export interface Village {
  id: number;
  village_name?: string;
  name?: string;
  name_en?: string;
  taluka_id?: number;
  pincode?: string;
}

export interface DelhiSRO {
  sro_id: string;
  sro_name: string;
}

export interface DelhiLocality {
  locality_name: string;
}

export interface IGRTransactionRecord {
  id: number;
  doc_no?: string;
  document_name?: string;
  document_name_en?: string;
  registration_date?: string;
  sro_name?: string;
  sro_name_en?: string;
  seller_names?: string;
  seller_names_en?: string;
  purchaser_names?: string;
  purchaser_names_en?: string;
  property_description?: string;
  property_description_en?: string;
  consideration_amount?: number | string;
  market_value?: number | string;
  year?: string;
  is_excluded?: boolean;
  manual_comment?: string;
  relevance_score?: number;
  relevance_label?: 'relevant' | 'not_relevant';
  relevance_reason?: string;
  index2_fetched?: boolean;
  index2_raw_html?: string;
}

export interface ScrapeJobResponse {
  job_id: string;
  request_id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  percent_complete?: number;
  records_inserted?: number;
  total_units?: number;
  message?: string;
}
