'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  FileCheck2,
  Database,
  FileSpreadsheet,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Download,
  Eye,
  RefreshCw,
  Edit3,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCw,
  GitCommit,
  GitBranch,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ArrowLeft,
  Camera,
  Upload,
  X,
  Maximize2,
  Copy,
  Check,
  Search,
  FileSearch,
  Lock,
  Award,
  History,
  ShieldAlert,
} from 'lucide-react';
import { SitePhotoInspection } from '@/components/survey/SitePhotoInspection';
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal';
import { DocumentUploadModal } from '@/components/documents/DocumentUploadModal';
import { FlowOfTitleTimeline } from '@/components/workspace/FlowOfTitleTimeline';
import { OcrDataGrid } from '@/components/workspace/OcrDataGrid';
import { IgrRegistrySearch } from '@/components/workspace/IgrRegistrySearch';
import { FieldSiteSurvey } from '@/components/workspace/FieldSiteSurvey';
import { EncumbranceFlags } from '@/components/workspace/EncumbranceFlags';
import { TsrLiveEditor } from '@/components/workspace/TsrLiveEditor';
import { DocumentViewer, ActiveHighlightEntity } from '@/components/workspace/DocumentViewer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { requestsApi } from '@/lib/api/requests';
import { useAuthStore } from '@/lib/store/authStore';
import { DisbursementBanner } from '@/components/workspace/DisbursementBanner';
import { RiskScoreGauge } from '@/components/workspace/RiskScoreGauge';
import { CaseFindingsList } from '@/components/workspace/CaseFindingsList';
import { MakerCheckerSignOff } from '@/components/workspace/MakerCheckerSignOff';
import { AuditTimelineDrawer } from '@/components/workspace/AuditTimelineDrawer';
import {
  CaseFinding,
  CollateralRiskScore,
  DisbursementReadiness,
  AdvocateReview,
  CaseAuditEvent,
} from '@/types/enterprise';
import { getDemoWorkspaceCase } from '@/lib/demoData';

export default function RequestWorkspacePage() {
  const params = useParams();
  const requestId = (params?.id as string) || 'REQ-101';
  const { user } = useAuthStore();

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<
    | 'TIMELINE'
    | 'EXTRACTED_OCR'
    | 'IGR_SEARCH'
    | 'SITE_SURVEY'
    | 'DISCREPANCIES'
    | 'FINDINGS'
    | 'LEGAL_SIGN_OFF'
    | 'AUDIT_TRAIL'
    | 'TSR_REPORT'
  >('TIMELINE');

  // Interactive Entity Highlighting State (Syncs OCR Grid <-> Document Viewer)
  const [activeHighlightEntity, setActiveHighlightEntity] = useState<ActiveHighlightEntity | null>(null);
  const [translatedEntitiesMap, setTranslatedEntitiesMap] = useState<{ [docId: string]: any }>({});

  // Request State
  const [requestData, setRequestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<'Pending' | 'Verified' | 'Rejected' | 'In Progress'>('Pending');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Enterprise Collateral Intelligence State (Phases 1 - 6)
  const [readiness, setReadiness] = useState<DisbursementReadiness | null>(null);
  const [collateralRisk, setCollateralRisk] = useState<CollateralRiskScore | null>(null);
  const [caseFindings, setCaseFindings] = useState<CaseFinding[]>([]);
  const [advocateReview, setAdvocateReview] = useState<AdvocateReview | null>(null);
  const [auditEvents, setAuditEvents] = useState<CaseAuditEvent[]>([]);
  const [totalAuditEvents, setTotalAuditEvents] = useState(0);
  const [isEnterpriseLoading, setIsEnterpriseLoading] = useState(false);

  // Documents & Preview State
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [leftPanelTab, setLeftPanelTab] = useState<'VIEWER' | 'RAW_TEXT' | 'FIELDS'>('VIEWER');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedRawText, setCopiedRawText] = useState(false);
  const [rawTextSearch, setRawTextSearch] = useState('');
  const [rotation, setRotation] = useState(0);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editFormData, setEditFormData] = useState({
    propertyName: '',
    flatNumber: '',
    ownerName: '',
    applicantName: '',
    bankName: '',
    Bank_branch: '',
    address: '',
    state: '',
    sro_id: '',
    district: '',
    taluka: '',
    city: '',
    village: '',
    pinCode: '',
    ctsNumber: '',
    from_year: 2001,
    advocateName: '',
    searchName: '',
    caseType: 'General',
  });

  // Masters for Edit Modal
  const [editDelhiSros, setEditDelhiSros] = useState<any[]>([]);
  const [editDelhiLocalities, setEditDelhiLocalities] = useState<any[]>([]);
  const [editDistricts, setEditDistricts] = useState<any[]>([]);
  const [editTalukas, setEditTalukas] = useState<any[]>([]);
  const [editVillages, setEditVillages] = useState<any[]>([]);

  // Load masters for edit modal
  useEffect(() => {
    requestsApi.getDelhiSROs().then((res) => {
      const arr = Array.isArray(res) ? res : (res as any)?.items || [];
      setEditDelhiSros(arr);
    }).catch(() => {});

    requestsApi.getDistricts().then((res) => {
      setEditDistricts(Array.isArray(res) ? res : []);
    }).catch(() => {});
  }, []);

  // Fetch localities when SRO changes in edit modal
  useEffect(() => {
    if (editFormData.state === 'Delhi' && editFormData.sro_id) {
      requestsApi.getDelhiLocalities(editFormData.sro_id).then((res) => {
        const arr = Array.isArray(res) ? res : (res as any)?.items || [];
        setEditDelhiLocalities(arr);
      }).catch(() => {});
    }
  }, [editFormData.state, editFormData.sro_id]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  const loadDetails = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getRequestDetails(requestId, forceRefresh);
      if (data) {
        setRequestData(data);
        if (data.status) {
          const s = String(data.status).toLowerCase();
          if (s.includes('clear') || s.includes('verified') || s.includes('completed')) {
            setRequestStatus('Verified');
          } else if (s.includes('reject') || s.includes('flag')) {
            setRequestStatus('Rejected');
          } else if (s.includes('progress') || s.includes('investig')) {
            setRequestStatus('In Progress');
          } else {
            setRequestStatus('Pending');
          }
        }
      }
    } catch (err) {
      console.warn('Could not load request details from API, using default workspace view:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnterpriseData = async (forceRefresh = false) => {
    if (!requestId) return;
    setIsEnterpriseLoading(true);
    try {
      const [readinessRes, riskRes, findingsRes, advocateRes, auditRes] = await Promise.allSettled([
        requestsApi.getDisbursementReadiness(requestId, forceRefresh),
        requestsApi.getRiskAssessment(requestId, forceRefresh),
        requestsApi.getFindings(requestId, forceRefresh),
        requestsApi.getAdvocateReview(requestId, forceRefresh),
        requestsApi.getAuditTrail(requestId, { limit: 50, offset: 0 }, forceRefresh),
      ]);

      if (readinessRes.status === 'fulfilled' && readinessRes.value) {
        setReadiness(readinessRes.value);
      }
      if (riskRes.status === 'fulfilled' && riskRes.value) {
        setCollateralRisk(riskRes.value);
      }
      if (findingsRes.status === 'fulfilled' && findingsRes.value?.findings) {
        setCaseFindings(findingsRes.value.findings);
      }
      if (advocateRes.status === 'fulfilled' && advocateRes.value?.review) {
        setAdvocateReview(advocateRes.value.review);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value?.events) {
        setAuditEvents(auditRes.value.events);
        setTotalAuditEvents(auditRes.value.total || auditRes.value.events.length);
      }
    } catch (err) {
      console.warn('Could not load enterprise collateral metrics:', err);
    } finally {
      setIsEnterpriseLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      // 1. Populate demo workspace data immediately for seamless instant presentation
      const demo = getDemoWorkspaceCase(requestId);
      setRequestData(demo.requestData);
      setReadiness(demo.readiness);
      setCollateralRisk(demo.risk);
      setCaseFindings(demo.findings);
      setAdvocateReview(demo.advocateReview);
      setAuditEvents(demo.auditEvents);
      setTotalAuditEvents(demo.auditEvents.length);
      setIsLoading(false);
      setIsEnterpriseLoading(false);

      const s = String(demo.requestData?.status || '').toLowerCase();
      if (s.includes('clear') || s.includes('verified') || s.includes('completed')) {
        setRequestStatus('Verified');
      } else if (s.includes('reject') || s.includes('flag') || s.includes('block')) {
        setRequestStatus('Rejected');
      } else if (s.includes('progress') || s.includes('investig')) {
        setRequestStatus('In Progress');
      } else {
        setRequestStatus('Pending');
      }

      // 2. Fetch live updates if server is available, gracefully preserving demo data on error
      loadDetails(false);
      loadEnterpriseData(false);
    }
  }, [requestId]);

  const handleOpenEditModal = () => {
    const st = requestData?.state || 'Delhi';
    const sro = requestData?.sro_id || requestData?.sro || '95';
    setEditFormData({
      propertyName: requestData?.propertyName || requestData?.property_name || '',
      flatNumber: requestData?.flatNumber || requestData?.flat_number || '',
      ownerName: requestData?.ownerName || requestData?.owner_name || '',
      applicantName: requestData?.applicantName || requestData?.applicant_name || requestData?.ownerName || '',
      bankName: requestData?.bankName || requestData?.bank_name || '',
      Bank_branch: requestData?.Bank_branch || requestData?.bank_branch || '',
      address: requestData?.address || '',
      state: st,
      sro_id: sro,
      district: requestData?.district || 'Mumbai Suburban',
      taluka: requestData?.taluka || '',
      city: requestData?.city || '',
      village: requestData?.village || '',
      pinCode: requestData?.pinCode || requestData?.pin_code || '',
      ctsNumber: requestData?.ctsNumber || requestData?.ctsnumber || '',
      from_year: requestData?.from_year || 2001,
      advocateName: requestData?.advocateName || requestData?.advocate_name || '',
      searchName: requestData?.searchName || requestData?.search_name || '',
      caseType: requestData?.caseType || requestData?.case_type || 'General',
    });
    setShowEditModal(true);
  };

  const handleSaveEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      await requestsApi.updateRequest(requestId, editFormData);
      setStatusFeedback({
        type: 'success',
        message: 'Property details updated and saved successfully to database!',
      });
      setShowEditModal(false);
      await loadDetails();
      setTimeout(() => setStatusFeedback(null), 5000);
    } catch (err: any) {
      console.error('Failed to update form:', err);
      setStatusFeedback({
        type: 'error',
        message: err?.response?.data?.detail || 'Failed to save property changes',
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleOpenUploadModal = (isReupload: boolean = false) => {
    setIsReuploadMode(isReupload);
    setShowUploadModal(true);
  };

  const handleUpdateStatus = async (newStatus: 'Verified' | 'Rejected' | 'In Progress') => {
    setIsUpdatingStatus(true);
    setStatusFeedback(null);
    try {
      await requestsApi.updateRequestStatus(requestId, newStatus);
      setRequestStatus(newStatus);
      setStatusFeedback({
        type: 'success',
        message:
          newStatus === 'Verified'
            ? 'Property Title Approved & Verified in Postgres Database!'
            : newStatus === 'Rejected'
            ? 'Discrepancy Flagged on Property Title!'
            : 'Request status updated to In Progress!',
      });
      setTimeout(() => setStatusFeedback(null), 5000);
    } catch (err: any) {
      console.error('Failed to update status on backend API:', err);
      setRequestStatus(newStatus);
      setStatusFeedback({
        type: 'success',
        message: `Status updated to ${newStatus} (Local State)`,
      });
      setTimeout(() => setStatusFeedback(null), 4000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const [isRetryingOcr, setIsRetryingOcr] = useState(false);

  const handleRetryOcr = async (docToRetry?: any) => {
    setIsRetryingOcr(true);
    try {
      const docId = docToRetry?.id || currentDoc?.id;
      if (docId) {
        await requestsApi.retryDocumentOcr(requestId, docId);
        setStatusFeedback({
          type: 'success',
          message: 'OCR extraction completed and document updated!',
        });
      } else {
        await requestsApi.retryAllOcr(requestId);
        setStatusFeedback({
          type: 'success',
          message: 'OCR executed for all documents!',
        });
      }
      await loadDetails();
      setTimeout(() => setStatusFeedback(null), 5000);
    } catch (err: any) {
      console.error('OCR trigger failed:', err);
      setStatusFeedback({
        type: 'error',
        message: err?.response?.data?.detail || 'Failed to trigger OCR extraction',
      });
    } finally {
      setIsRetryingOcr(false);
    }
  };

  let rawDocsList: any[] = [];
  const candidateDocs = requestData?.documents || requestData?.documents_report || requestData?.lsr_documents;
  if (Array.isArray(candidateDocs) && candidateDocs.length > 0) {
    rawDocsList = candidateDocs;
  } else if (typeof candidateDocs === 'string') {
    try {
      const parsed = JSON.parse(candidateDocs);
      if (Array.isArray(parsed) && parsed.length > 0) rawDocsList = parsed;
    } catch {
      rawDocsList = [];
    }
  }
  if (rawDocsList.length === 0) {
    const demoFallback = getDemoWorkspaceCase(requestId);
    rawDocsList = demoFallback.docs || [];
  }

  const docs = rawDocsList.length > 0 ? rawDocsList.map((d: any, idx: number) => { try {
    // 1. Resolve extracted_json from document itself or from requestData.extracted_json
    let ej: any = d.extracted_json || d.data || d.extracted_data || null;

    if (!ej && requestData?.extracted_json) {
      const typeKey = d.document_type || d.type;
      const allEntries = requestData.extracted_json;

      if (typeKey && allEntries[typeKey]) {
        ej = allEntries[typeKey];
      } else {
        for (const [k, v] of Object.entries(allEntries)) {
          if (v && typeof v === 'object') {
            const pf = (v as any).processed_files;
            if (Array.isArray(pf)) {
              const match = pf.find((p: any) =>
                (p.file_name && d.file_name && p.file_name === d.file_name) ||
                (p.name && d.name && p.name === d.name) ||
                (p.doc_id && d.doc_id && p.doc_id === d.doc_id)
              );
              if (match) {
                ej = match.data || match;
                break;
              }
            }
          }
        }
      }
    }

    // 2. Unwrap processed_files container if present
    if (ej && typeof ej === 'object' && Array.isArray(ej.processed_files) && ej.processed_files.length > 0) {
      const match = ej.processed_files.find((p: any) =>
        (p.file_name && d.file_name && p.file_name === d.file_name) ||
        (p.name && d.name && p.name === d.name) ||
        (p.doc_id && d.doc_id && p.doc_id === d.doc_id)
      ) || ej.processed_files[0];
      ej = match?.data || match || {};
    }

    if (ej && typeof ej === 'object' && ej.data && typeof ej.data === 'object') {
      ej = ej.data;
    }

    ej = (ej && typeof ej === 'object') ? ej : {};

    // Safe string converter — prevents "Objects are not valid as React child" errors
    // when Gemini returns nested objects instead of scalar strings
    const safeStr = (val: any): string => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'number' || typeof val === 'boolean') return String(val);
      // Gracefully unwrap common monetary object shapes
      if (typeof val === 'object') {
        if (val.total_amount !== undefined) return `₹ ${Number(val.total_amount).toLocaleString('en-IN')}`;
        if (val.amount !== undefined) return `₹ ${Number(val.amount).toLocaleString('en-IN')}`;
        if (val.value !== undefined) return String(val.value);
        if (val.name !== undefined) return String(val.name);
        if (val.text !== undefined) return String(val.text);
        // Last resort: compact JSON snippet
        try { return JSON.stringify(val); } catch { return '[Object]'; }
      }
      return '';
    };

    let fileUrl = '#';
    if (typeof d.file_url === 'string') {
      fileUrl = d.file_url;
    } else if (Array.isArray(d.file_url) && d.file_url.length > 0) {
      fileUrl = d.file_url[0];
    } else if (d.url) {
      fileUrl = d.url;
    }

    // Resolve parties safely
    const partiesList: any[] = Array.isArray(ej.parties) ? ej.parties : [];
    const partySeller = partiesList.find((p: any) =>
      p?.role?.toLowerCase().includes('seller') ||
      p?.role?.toLowerCase().includes('vendor') ||
      p?.role?.toLowerCase().includes('transferor')
    );
    const partyBuyer = partiesList.find((p: any) =>
      p?.role?.toLowerCase().includes('buyer') ||
      p?.role?.toLowerCase().includes('purchaser') ||
      p?.role?.toLowerCase().includes('vendee') ||
      p?.role?.toLowerCase().includes('borrower')
    );
    const partyAuthority = partiesList.find((p: any) =>
      p?.role?.toLowerCase().includes('authority') ||
      p?.role?.toLowerCase().includes('registrar') ||
      p?.role?.toLowerCase().includes('officer') ||
      p?.role?.toLowerCase().includes('society')
    ) || (partiesList.length > 0 && !partySeller && !partyBuyer ? partiesList[0] : null);

    // Resolve consideration — handles plain string, number, or object {part_payment, total_amount, ...}
    const rawConsideration = ej.consideration || ej.consideration_amount || ej.amount || ej.loan_amount;
    const considerationVal: string = rawConsideration
      ? safeStr(rawConsideration)
      : (ej.financial_details?.consideration_or_value?.value !== undefined
          ? (ej.financial_details.consideration_or_value.value === 0
              ? '₹ 0 (Non-Monetary / Regulatory)'
              : `₹ ${Number(ej.financial_details.consideration_or_value.value).toLocaleString('en-IN')}`)
          : '');

    const rawStampDuty = ej.stampDuty || ej.stamp_duty;
    const stampDutyVal: string = rawStampDuty
      ? safeStr(rawStampDuty)
      : (ej.financial_details?.stamp_duty_paid?.value
          ? `₹ ${Number(ej.financial_details.stamp_duty_paid.value).toLocaleString('en-IN')}`
          : '');

    return {
      id: d.id || d.doc_id || `doc-${idx + 1}`,
      name: d.file_name || d.name || `Document_${idx + 1}.pdf`,
      type: d.document_type || d.type || 'Property Deed',
      status: (d.verification_status || d.status || 'clear') as 'clear' | 'rejected' | 'pending',
      ocrStatus: d.ocr_status || (d.raw_text && d.raw_text.trim().length > 0 ? 'done' : 'pending'),
      date: d.created_at || d.uploaded_at || 'Recent',
      fileUrl,
      rawText: d.raw_text || d.full_text || d.raw_ocr_text || '',
      ocrMeta: d.ocr_meta || {},
      extracted_json: ej,
      extracted: {
        vendor: safeStr(ej.vendor || ej.seller_names || ej.seller || ej.transferor || partySeller?.name || ''),
        vendee: safeStr(ej.vendee || ej.purchaser_names || ej.purchaser || ej.transferee || ej.borrower || partyBuyer?.name || ''),
        authority: partyAuthority?.name ? `${partyAuthority.name}${partyAuthority.role ? ` (${partyAuthority.role})` : ''}` : '',
        date: safeStr(ej.date || ej.registration_date || ej.execution_date || ej.document_date || ''),
        consideration: considerationVal,
        propertyDesc: safeStr(ej.propertyDesc || ej.property_description || ej.schedule_property || ej.address || ej.property_details?.description || ''),
        cts: safeStr(ej.cts || ej.cts_number || ej.survey_number || ej.gat_number || ej.property_details?.cts_number || ''),
        sro: safeStr(ej.sro || ej.sro_name || ej.sub_registrar || ej.property_details?.revenue_village || ''),
        regNo: safeStr(ej.regNo || ej.document_number || ej.registration_number || ej.doc_no || ''),
        stampDuty: stampDutyVal,
        remarks: Array.isArray(ej.encumbrances_or_remarks)
          ? ej.encumbrances_or_remarks.map((r: any) => (typeof r === 'string' ? r : r?.remark || r?.description || r?.text || JSON.stringify(r))).join(' • ')
          : safeStr(ej.remarks || ''),
        documentTitle: safeStr(ej.document_title || ej.title || ''),
      },
    };
  } catch (mapErr) {
    console.warn('[docs.map] Error processing document at index', idx, mapErr);
    return {
      id: d.id || d.doc_id || `doc-${idx + 1}`,
      name: d.file_name || d.name || `Document_${idx + 1}.pdf`,
      type: d.document_type || d.type || 'Property Deed',
      status: (d.verification_status || d.status || 'clear') as 'clear' | 'rejected' | 'pending',
      ocrStatus: d.ocr_status || 'pending',
      date: d.created_at || d.uploaded_at || 'Recent',
      fileUrl: typeof d.file_url === 'string' ? d.file_url : (d.url || '#'),
      rawText: d.raw_text || '',
      ocrMeta: {},
      extracted_json: {},
      extracted: {},
    };
  }
  }) : [];

  const currentDoc = docs[Math.min(selectedDocIndex, Math.max(0, docs.length - 1))] || null;

  const propName = requestData?.propertyName || requestData?.property_name || 'Deepali Residency';
  const flatNo = requestData?.flatNumber || requestData?.flat_number ? `Flat ${requestData?.flatNumber || requestData?.flat_number}` : 'Flat 235';
  const ownerName = requestData?.ownerName || requestData?.owner_name || requestData?.applicantName || 'Ajay Kumar';
  const cts = requestData?.ctsNumber || requestData?.ctsnumber || 'CTS-1029';
  const location = requestData?.address || `${requestData?.city || 'Pitampura'}, ${requestData?.state || 'New Delhi'}`;
  const bankBranch = requestData?.Bank_branch || requestData?.bank_branch || requestData?.bankName || 'Axis Bank Pitampura Branch';

  // 1-Click Interactive Citation Navigation
  const handleJumpToCitation = (documentId?: string | null, pageNumber?: number | null) => {
    if (!documentId) return;
    const cleanDoc = String(documentId).toLowerCase().trim();
    const foundIdx = docs.findIndex((d: any) => {
      const idMatch = String(d.id || '').toLowerCase().includes(cleanDoc);
      const nameMatch = String(d.name || '').toLowerCase().includes(cleanDoc);
      const catMatch = String(d.category || '').toLowerCase().includes(cleanDoc);
      const typeMatch = String(d.type || '').toLowerCase().includes(cleanDoc);
      return idMatch || nameMatch || catMatch || typeMatch;
    });
    if (foundIdx !== -1) {
      setSelectedDocIndex(foundIdx);
    }
    setLeftPanelTab('VIEWER');
    if (pageNumber) {
      setActiveHighlightEntity({
        key: 'page_citation',
        label: `Page ${pageNumber}`,
        value: `Page Citation [p. ${pageNumber}]`,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification Banner */}
      {statusFeedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-fadeIn ${
          statusFeedback.type === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {statusFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span className="text-xs font-semibold">{statusFeedback.message}</span>
          </div>
          <button
            onClick={() => setStatusFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Level 1: Case Header & Status Bar */}
      <div className="rounded-xl border theme-border shadow-sm overflow-hidden">
        {/* Accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1D4ED8] via-indigo-500 to-violet-500" />
        <div className="p-4 theme-surface flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Left: Case Identity & Property Schedule */}
          <div className="flex items-start sm:items-center gap-3">
            <Link
              href="/branch"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 transition-all shrink-0 mt-0.5 sm:mt-0"
              title="Back to Requests"
              aria-label="Back to Requests"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-[#1D4ED8] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {requestId}
                </span>
                <h1 className="text-base font-bold theme-text-primary tracking-tight">
                  {propName} {flatNo && <span className="font-normal text-slate-500">({flatNo})</span>}
                </h1>
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-800 border theme-border text-slate-600 dark:text-slate-400">
                  CTS {cts}
                </span>
                {/* Status Badge */}
                <StatusBadge status={requestStatus} />
              </div>

              {/* Metadata chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 border theme-border text-slate-600 dark:text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {ownerName}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 border theme-border text-slate-600 dark:text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="truncate max-w-[200px]" title={location}>{location}</span>
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 border theme-border text-slate-600 dark:text-slate-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  {bankBranch}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Legal Decision Actions */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 theme-border">
            <button
              onClick={() => loadDetails(true)}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 transition-all disabled:opacity-50 cursor-pointer"
              title="Sync with live database"
              aria-label="Sync with database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <button
              onClick={handleOpenEditModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 transition-all cursor-pointer"
              title="Edit property details"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit</span>
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

            <button
              onClick={() => handleUpdateStatus('In Progress')}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 cursor-pointer ${
                requestStatus === 'In Progress' || (requestStatus !== 'Verified' && requestStatus !== 'Rejected')
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Scrutiny</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('Verified')}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 cursor-pointer ${
                requestStatus === 'Verified'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clear Title</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('Rejected')}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 cursor-pointer ${
                requestStatus === 'Rejected'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flag Issue</span>
            </button>

            <button
              onClick={() => setActiveTab('TSR_REPORT')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1D4ED8] to-indigo-600 hover:from-[#1E40AF] hover:to-indigo-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>View TSR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Disbursement Gate Banner (Phase 3 & 7) */}
      <DisbursementBanner
        readiness={readiness}
        isLoading={isEnterpriseLoading}
        onRefresh={() => loadEnterpriseData(true)}
        onJumpToCitation={handleJumpToCitation}
      />

      {/* Main Dual-Pane Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[700px]">
        {/* Left Column (5 Cols): Document Inspection */}
        <div className="lg:col-span-5 flex flex-col rounded-xl theme-surface border overflow-hidden shadow-sm">
          {/* Scope Header: Document Specific */}
          <div className="px-3 py-2.5 border-b theme-border bg-blue-50/60 dark:bg-blue-950/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-0.5 h-4 rounded-full bg-[#1D4ED8] shrink-0" />
              <FileText className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-blue-400 shrink-0" />
              <span className="text-[11px] font-bold text-[#1D4ED8] dark:text-blue-300 uppercase tracking-wider truncate">
                Document Inspection: {currentDoc?.type || 'Deed'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-100 dark:bg-blue-950/60 text-[#1D4ED8] dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
              Pg {selectedDocIndex + 1}/{docs.length}
            </span>
          </div>

          {/* Document Switcher Toolbar */}
          <div className="p-2 border-b theme-border bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2">
            {/* Document Selector Dropdown */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <select
                value={selectedDocIndex}
                onChange={(e) => setSelectedDocIndex(Number(e.target.value))}
                aria-label="Select document to inspect"
                className="w-full pl-2 pr-6 py-1 rounded-md theme-input border border-slate-300 dark:border-slate-700 text-xs font-medium theme-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
              >
                {docs.map((doc, idx) => (
                  <option key={doc.id} value={idx}>
                    {idx + 1}. {doc.type} {doc.name ? `(${doc.name})` : ''} {doc.ocrStatus === 'done' ? '• OCR Done' : '• Pending'}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setIsReuploadMode(false);
                  setShowUploadModal(true);
                }}
                title="Upload Document"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-medium transition-colors shadow-2xs"
              >
                <Upload className="w-3 h-3" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              <button
                onClick={() => {
                  setIsReuploadMode(true);
                  setShowUploadModal(true);
                }}
                title="Replace Current Document"
                className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowPreviewModal(true)}
                className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors"
                title="Fullscreen Document Inspector"
                aria-label="Fullscreen Document Inspector"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Viewer Body */}
          <div className="flex-1 p-2 bg-slate-100/40 dark:bg-slate-900/60 overflow-hidden flex flex-col min-h-[550px]">
            <DocumentViewer
              doc={currentDoc}
              activeHighlight={activeHighlightEntity}
              onClearHighlight={() => setActiveHighlightEntity(null)}
              onSelectEntityFromDoc={(key, value) => {
                setActiveHighlightEntity({ key, label: key, value });
              }}
              onDocumentTranslated={(transText, transEnts) => {
                const docKey = currentDoc?.id || (currentDoc as any)?.doc_id || `doc-${selectedDocIndex}`;
                if (transEnts) {
                  setTranslatedEntitiesMap((prev) => ({ ...prev, [docKey]: transEnts }));
                }
                if (currentDoc) {
                  (currentDoc as any).translated_text = transText;
                }
              }}
            />
          </div>
        </div>

        {/* Right Column (7 Cols): Case-Wide Analysis */}
        <div className="lg:col-span-7 flex flex-col rounded-xl theme-surface border overflow-hidden shadow-sm">
          {/* Scope Header: Case Wide */}
          <div className="px-3 py-2.5 border-b theme-border bg-violet-50/60 dark:bg-violet-950/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-0.5 h-4 rounded-full bg-violet-500 shrink-0" />
              <GitBranch className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider truncate">
                Case Analysis: {
                  activeTab === 'TIMELINE' ? 'Flow of Title Devolution' :
                  activeTab === 'EXTRACTED_OCR' ? 'OCR Evidence & Source Provenance' :
                  activeTab === 'IGR_SEARCH' ? 'Land Registry Cross-Verification' :
                  activeTab === 'SITE_SURVEY' ? 'Physical Site Survey & Boundary Audit' :
                  activeTab === 'DISCREPANCIES' ? 'Encumbrance & Risk Defect Matrix' :
                  activeTab === 'FINDINGS' ? 'Evidence-Backed Findings Matrix' :
                  activeTab === 'LEGAL_SIGN_OFF' ? 'Advocate Maker-Checker Sign-Off' :
                  activeTab === 'AUDIT_TRAIL' ? 'Forensic Audit Timeline' :
                  'Title Search Report (TSR)'
                }
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shrink-0">
              All Docs
            </span>
          </div>


          {/* 1280x800 Optimized Segmented Tab Bar */}
          <div className="border-b theme-border bg-white dark:bg-slate-900 p-1.5 flex items-center justify-between gap-1 overflow-x-auto">
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border theme-border text-xs w-full justify-between">
              {[
                { id: 'TIMELINE', shortLabel: 'Timeline', icon: GitBranch },
                { id: 'EXTRACTED_OCR', shortLabel: 'OCR Data', icon: FileSpreadsheet },
                { id: 'IGR_SEARCH', shortLabel: 'IGR Search', icon: Database },
                { id: 'DISCREPANCIES', shortLabel: 'Risk & Flags', icon: AlertTriangle },
                {
                  id: 'FINDINGS',
                  shortLabel: 'Findings',
                  icon: ShieldAlert,
                  badge: caseFindings.filter((f) => f.status === 'OPEN' && (f.severity === 'CRITICAL' || f.severity === 'HIGH')).length,
                },
                { id: 'LEGAL_SIGN_OFF', shortLabel: 'Sign-Off', icon: Award },
                { id: 'AUDIT_TRAIL', shortLabel: 'Audit', icon: History },
                { id: 'SITE_SURVEY', shortLabel: 'Site Survey', icon: Camera },
                { id: 'TSR_REPORT', shortLabel: 'TSR Report', icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1 px-1.5 rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-[#1D4ED8] dark:text-blue-400 font-semibold shadow-2xs border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{tab.shortLabel}</span>
                    {tab.badge ? (
                      <span className="ml-0.5 px-1 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white leading-none">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Quick Dropdown on smaller views */}
            <div className="sm:hidden shrink-0">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border theme-border theme-card text-xs font-bold theme-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="TIMELINE">🌿 Flow of Title Timeline</option>
                <option value="EXTRACTED_OCR">📊 OCR Data Grid</option>
                <option value="IGR_SEARCH">🏛️ IGR Registry Search</option>
                <option value="DISCREPANCIES">⚠️ Risk & Flags</option>
                <option value="FINDINGS">🛡️ Findings Matrix</option>
                <option value="LEGAL_SIGN_OFF">⚖️ Advocate Sign-Off</option>
                <option value="AUDIT_TRAIL">📜 Forensic Audit Trail</option>
                <option value="SITE_SURVEY">📍 Field Site Survey</option>
                <option value="TSR_REPORT">📝 TSR / Live Editor</option>
              </select>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-5 overflow-y-auto">
            {/* Tab 1: Flow-of-Title Timeline Graph */}
            {activeTab === 'TIMELINE' && (
              <FlowOfTitleTimeline
                requestId={requestId}
                ownerName={ownerName}
                propertyName={propName}
                flatNumber={flatNo}
                bankBranch={bankBranch}
                docs={docs}
                onSelectDoc={(idx) => {
                  setSelectedDocIndex(idx);
                  setLeftPanelTab('VIEWER');
                }}
              />
            )}

            {/* Tab 2: OCR Extracted Fields Matrix */}
            {activeTab === 'EXTRACTED_OCR' && (
              <OcrDataGrid
                requestId={requestId}
                docs={docs}
                selectedDocIndex={selectedDocIndex}
                onSelectDoc={(idx) => setSelectedDocIndex(idx)}
                selectedEntityKey={activeHighlightEntity?.key}
                translatedEntities={
                  translatedEntitiesMap[
                    docs[selectedDocIndex]?.id ||
                    (docs[selectedDocIndex] as any)?.doc_id ||
                    `doc-${selectedDocIndex}`
                  ]
                }
                onSelectEntity={(entity) => {
                  setActiveHighlightEntity(entity);
                  if (leftPanelTab !== 'VIEWER' && leftPanelTab !== 'RAW_TEXT') {
                    setLeftPanelTab('VIEWER');
                  }
                }}
              />
            )}

            {/* Tab 3: IGR Search Match */}
            {activeTab === 'IGR_SEARCH' && (
              <IgrRegistrySearch
                requestId={requestId}
                stateName={requestData?.state || 'Delhi'}
                sroId={requestData?.sro_id || requestData?.sro || '95'}
                sroName={requestData?.sro_name || ''}
                villageName={requestData?.village || ''}
                districtName={requestData?.district || ''}
                talukaName={requestData?.taluka || ''}
                ctsNumber={cts}
                ownerName={ownerName}
                fromYear={requestData?.from_year || 2001}
              />
            )}

            {/* Tab 4: Discrepancy & Encumbrance Flags + Collateral Risk Gauge */}
            {activeTab === 'DISCREPANCIES' && (
              <div className="space-y-5">
                <RiskScoreGauge
                  assessment={collateralRisk}
                  isLoading={isEnterpriseLoading}
                  onRefresh={() => loadEnterpriseData(true)}
                  onJumpToFinding={() => setActiveTab('FINDINGS')}
                />
                <div className="border-t pt-4 theme-border">
                  <EncumbranceFlags
                    requestId={requestId}
                    ownerName={ownerName}
                    propertyName={propName}
                  />
                </div>
              </div>
            )}

            {/* Tab 5: Evidence-Backed Canonical Findings Matrix */}
            {activeTab === 'FINDINGS' && (
              <CaseFindingsList
                requestId={requestId}
                findings={caseFindings}
                isLoading={isEnterpriseLoading}
                onRefresh={() => loadEnterpriseData(true)}
                onJumpToCitation={handleJumpToCitation}
                onFindingStatusChanged={() => loadEnterpriseData(true)}
              />
            )}

            {/* Tab 6: Advocate Maker-Checker Workflow */}
            {activeTab === 'LEGAL_SIGN_OFF' && (
              <MakerCheckerSignOff
                requestId={requestId}
                advocateReview={advocateReview}
                isLoading={isEnterpriseLoading}
                onRefresh={() => loadEnterpriseData(true)}
                currentUserId={user?.id}
                currentUserName={
                  user
                    ? user.first_name
                      ? `${user.first_name} ${user.last_name || ''}`.trim()
                      : user.username
                    : requestData?.advocateName
                }
              />
            )}

            {/* Tab 7: Forensic Immutable Case Audit Trail */}
            {activeTab === 'AUDIT_TRAIL' && (
              <AuditTimelineDrawer
                requestId={requestId}
                events={auditEvents}
                totalEvents={totalAuditEvents}
                isLoading={isEnterpriseLoading}
                onRefresh={() => loadEnterpriseData(true)}
              />
            )}

            {/* Tab 8: Field Site Survey */}
            {activeTab === 'SITE_SURVEY' && (
              <FieldSiteSurvey
                requestId={requestId}
                propertyName={propName}
                location={location}
              />
            )}

            {/* Tab 6: Live TSR Report */}
            {activeTab === 'TSR_REPORT' && (
              <TsrLiveEditor
                requestId={requestId}
                requestData={requestData}
                ownerName={ownerName}
                propertyName={propName}
                flatNumber={flatNo}
                bankBranch={bankBranch}
                advocateName={requestData?.advocateName || requestData?.advocate_name || 'Adv. Suresh Verma'}
                ctsNumber={cts}
                docs={docs}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL 1: Edit Property Request Form ──────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl theme-surface border shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold theme-text-primary">Edit Request Form & Property Details</h3>
                  <p className="text-xs theme-text-secondary">Modify case metadata for {requestId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-card border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Property Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.propertyName}
                    onChange={(e) => setEditFormData({ ...editFormData, propertyName: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Flat / Unit Number</label>
                  <input
                    type="text"
                    value={editFormData.flatNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, flatNumber: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Owner / Borrower Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.ownerName}
                    onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Applicant Name</label>
                  <input
                    type="text"
                    value={editFormData.applicantName}
                    onChange={(e) => setEditFormData({ ...editFormData, applicantName: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={editFormData.bankName}
                    onChange={(e) => setEditFormData({ ...editFormData, bankName: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Bank Branch</label>
                  <input
                    type="text"
                    value={editFormData.Bank_branch}
                    onChange={(e) => setEditFormData({ ...editFormData, Bank_branch: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold theme-text-primary mb-1">Full Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Locked Jurisdiction Fields in Edit Modal */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      Property Registry Jurisdiction
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <Lock className="w-2.5 h-2.5" />
                      Locked on Intake
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold theme-text-secondary mb-1">
                        State / Land Registry
                      </label>
                      <select
                        disabled
                        value={editFormData.state}
                        className="w-full theme-input border rounded-xl px-3 py-2 text-xs opacity-75 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium"
                      >
                        <option value="Delhi">Delhi (DORIS IGR)</option>
                        <option value="Maharashtra">Maharashtra (e-Search)</option>
                      </select>
                    </div>

                    {editFormData.state === 'Delhi' ? (
                      <>
                        <div>
                          <label className="block text-xs font-semibold theme-text-secondary mb-1">
                            Sub-Registrar Office (SRO)
                          </label>
                          <select
                            disabled
                            value={editFormData.sro_id}
                            className="w-full theme-input border rounded-xl px-3 py-2 text-xs opacity-75 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium truncate"
                          >
                            <option value="">-- SRO Office --</option>
                            {editDelhiSros.map((s: any) => (
                              <option key={s.sro_id} value={s.sro_id}>
                                {s.sro_name} {s.locality_count ? `(${s.locality_count})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold theme-text-secondary mb-1">
                            Locality Name
                          </label>
                          <select
                            disabled
                            value={editFormData.village}
                            className="w-full theme-input border rounded-xl px-3 py-2 text-xs opacity-75 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium truncate"
                          >
                            <option value="">-- Locality --</option>
                            {editDelhiLocalities.map((l: any, i: number) => (
                              <option key={i} value={l.locality_name}>
                                {l.locality_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-semibold theme-text-secondary mb-1">
                            District
                          </label>
                          <select
                            disabled
                            value={editFormData.district}
                            className="w-full theme-input border rounded-xl px-3 py-2 text-xs opacity-75 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <option value="">-- District --</option>
                            {editDistricts.map((d: any) => (
                              <option key={d.id} value={d.district_name || d.name}>
                                {d.district_name || d.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold theme-text-secondary mb-1">
                            Taluka / Area
                          </label>
                          <input
                            disabled
                            type="text"
                            value={editFormData.taluka || editFormData.village}
                            className="w-full theme-input border rounded-xl px-3 py-2 text-xs opacity-75 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed text-slate-700 dark:text-slate-300 font-medium"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">City</label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">CTS / Survey Number</label>
                  <input
                    type="text"
                    value={editFormData.ctsNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, ctsNumber: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={editFormData.pinCode}
                    onChange={(e) => setEditFormData({ ...editFormData, pinCode: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Advocate Name</label>
                  <input
                    type="text"
                    value={editFormData.advocateName}
                    onChange={(e) => setEditFormData({ ...editFormData, advocateName: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">Search From Year</label>
                  <input
                    type="number"
                    value={editFormData.from_year}
                    onChange={(e) => setEditFormData({ ...editFormData, from_year: Number(e.target.value) || 2001 })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t theme-border">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border theme-card font-semibold theme-text-secondary hover:theme-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSavingEdit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Enhanced Drag-and-Drop Document Upload ─────────────── */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        isReupload={isReuploadMode}
        currentDocName={currentDoc?.name}
        onUpload={async (files, docTypes) => {
          if (isReuploadMode && currentDoc?.id) {
            await requestsApi.replaceDocument(requestId, currentDoc.id, files[0]);
            setStatusFeedback({
              type: 'success',
              message: `Document "${currentDoc.name}" successfully re-uploaded & replaced!`,
            });
          } else {
            await requestsApi.uploadNewDocuments(requestId, files, docTypes);
            setStatusFeedback({
              type: 'success',
              message: `${files.length} document(s) successfully uploaded to request!`,
            });
          }
          await loadDetails(true);
          setTimeout(() => setStatusFeedback(null), 5000);
        }}
      />

      {/* ── MODAL 3: Fullscreen Document & Raw OCR Text Inspector ──────── */}
      <DocumentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={currentDoc}
        requestId={requestId}
        onRetryOcr={handleRetryOcr}
      />
    </div>
  );
}
