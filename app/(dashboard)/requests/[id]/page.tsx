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
import { requestsApi } from '@/lib/api/requests';

export default function RequestWorkspacePage() {
  const params = useParams();
  const requestId = (params?.id as string) || 'REQ-349';

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<
    'TIMELINE' | 'EXTRACTED_OCR' | 'IGR_SEARCH' | 'SITE_SURVEY' | 'DISCREPANCIES' | 'TSR_REPORT'
  >('TIMELINE');

  // Interactive Entity Highlighting State (Syncs OCR Grid <-> Document Viewer)
  const [activeHighlightEntity, setActiveHighlightEntity] = useState<ActiveHighlightEntity | null>(null);
  const [translatedEntitiesMap, setTranslatedEntitiesMap] = useState<{ [docId: string]: any }>({});

  // Request State
  const [requestData, setRequestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<'Pending' | 'Verified' | 'Rejected'>('Pending');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      const arr = Array.isArray(res) ? res : [];
      setEditDistricts(arr);
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
          } else if (s.includes('rejected') || s.includes('flagged')) {
            setRequestStatus('Rejected');
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

  useEffect(() => {
    if (requestId) {
      loadDetails();
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

  const rawDocs = requestData?.documents;
  const docs = (Array.isArray(rawDocs) && rawDocs.length > 0) ? rawDocs.map((d: any, idx: number) => {
    const ej = d.extracted_json || d.data || d.extracted_data || (requestData?.extracted_json ? requestData.extracted_json[d.document_type || d.type] : null) || {};
    return {
      id: d.doc_id || `doc-${idx + 1}`,
      name: d.file_name || `Document_${idx + 1}.pdf`,
      type: d.document_type || d.type || 'Property Deed',
      status: (d.verification_status || 'clear') as 'clear' | 'rejected' | 'pending',
      ocrStatus: d.ocr_status || (d.raw_text && d.raw_text.trim().length > 0 ? 'done' : 'pending'),
      date: d.uploaded_at || 'Recent',
      fileUrl: typeof d.file_url === 'string' ? d.file_url : (Array.isArray(d.file_url) ? d.file_url[0] : '#'),
      rawText: d.raw_text || d.full_text || d.raw_ocr_text || '',
      ocrMeta: d.ocr_meta || {},
      extracted_json: ej,
      extracted: {
        vendor: ej.vendor || ej.seller_names || ej.seller || ej.transferor || ej.parties?.seller || '',
        vendee: ej.vendee || ej.purchaser_names || ej.purchaser || ej.transferee || ej.borrower || ej.parties?.purchaser || '',
        date: ej.date || ej.registration_date || ej.execution_date || '',
        consideration: ej.consideration || ej.consideration_amount || ej.amount || ej.loan_amount || '',
        propertyDesc: ej.propertyDesc || ej.property_description || ej.schedule_property || ej.address || '',
        cts: ej.cts || ej.cts_number || ej.survey_number || ej.gat_number || '',
        sro: ej.sro || ej.sro_name || ej.sub_registrar || '',
        regNo: ej.regNo || ej.document_number || ej.registration_number || ej.doc_no || '',
        stampDuty: ej.stampDuty || ej.stamp_duty || '',
      },
    };
  }) : [];

  const currentDoc = docs[Math.min(selectedDocIndex, Math.max(0, docs.length - 1))] || null;

  const propName = requestData?.propertyName || requestData?.property_name || 'Deepali Residency';
  const flatNo = requestData?.flatNumber || requestData?.flat_number ? `Flat ${requestData?.flatNumber || requestData?.flat_number}` : 'Flat 235';
  const ownerName = requestData?.ownerName || requestData?.owner_name || requestData?.applicantName || 'Ajay Kumar';
  const cts = requestData?.ctsNumber || requestData?.ctsnumber || 'CTS-1029';
  const location = requestData?.address || `${requestData?.city || 'Pitampura'}, ${requestData?.state || 'New Delhi'}`;
  const bankBranch = requestData?.Bank_branch || requestData?.bank_branch || requestData?.bankName || 'Axis Bank Pitampura Branch';

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

      {/* Top Breadcrumb & Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl theme-surface border shadow-xs backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Request Info & Property Summary */}
        <div className="flex items-start sm:items-center gap-3.5">
          <Link
            href="/branch"
            className="p-2.5 rounded-xl theme-card border theme-text-secondary hover:theme-text-primary hover:border-blue-500 transition-all shrink-0 shadow-2xs mt-0.5 sm:mt-0"
            title="Back to Requests"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {requestId}
              </span>
              <h1 className="text-base sm:text-lg font-bold theme-text-primary tracking-tight">
                {propName} &mdash; <span className="font-semibold theme-text-secondary">{flatNo}</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold font-mono theme-card border theme-text-secondary">
                CTS {cts}
              </span>

              {/* Status Badge */}
              {requestStatus === 'Verified' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Clean Title
                </span>
              )}
              {requestStatus === 'Rejected' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Flagged Discrepancy
                </span>
              )}
              {requestStatus !== 'Verified' && requestStatus !== 'Rejected' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  In Progress
                </span>
              )}
            </div>

            {/* Subtitle Metadata Bar */}
            <div className="flex items-center gap-2 text-xs theme-text-secondary flex-wrap">
              <span>
                Borrower: <strong className="theme-text-primary font-semibold">{ownerName}</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="truncate max-w-xs sm:max-w-md" title={location}>
                {location}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="theme-text-muted">{bankBranch}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 theme-border">
          {/* Refresh / Sync Button */}
          <button
            onClick={() => loadDetails(true)}
            disabled={isLoading}
            className="p-2 rounded-xl theme-card border text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:border-blue-500 transition-all active:scale-95 shadow-2xs disabled:opacity-50"
            title="Sync with database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          {/* Edit Form Button */}
          <button
            onClick={handleOpenEditModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-primary hover:border-blue-500 hover:text-blue-500 transition-all active:scale-95 shadow-2xs"
            title="Edit property details"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
            <span>Edit Form</span>
          </button>

          {/* In Progress Button */}
          <button
            onClick={() => handleUpdateStatus('In Progress')}
            disabled={isUpdatingStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 shadow-2xs ${
              requestStatus === 'In Progress' || (requestStatus !== 'Verified' && requestStatus !== 'Rejected')
                ? 'bg-amber-500 text-white shadow-amber-500/20'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}
            title="Mark status as In Progress"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </button>

          {/* Approve Button */}
          <button
            onClick={() => handleUpdateStatus('Verified')}
            disabled={isUpdatingStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 shadow-2xs ${
              requestStatus === 'Verified'
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isUpdatingStatus ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
            <span>Clear Title</span>
          </button>

          {/* Flag Button */}
          <button
            onClick={() => handleUpdateStatus('Rejected')}
            disabled={isUpdatingStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 shadow-2xs ${
              requestStatus === 'Rejected'
                ? 'bg-rose-600 text-white shadow-rose-600/20'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Flag Discrepancy</span>
          </button>

          {/* View TSR Report */}
          <button
            onClick={() => setActiveTab('TSR_REPORT')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-95 shrink-0"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>View TSR</span>
          </button>
        </div>
      </div>


      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* Left Column (5 Cols): Real Document & OCR Viewer */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl theme-surface border overflow-hidden shadow-xs">
          {/* Document Switcher Header with Upload / Reupload Controls & Maximize */}
          <div className="p-3 border-b theme-border bg-slate-500/5 flex items-center justify-between gap-2.5 min-w-0">
            {/* Document Tabs / Dropdown */}
            <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
              {docs.length > 2 ? (
                <div className="relative flex items-center gap-2 flex-1 min-w-0">
                  <select
                    value={selectedDocIndex}
                    onChange={(e) => setSelectedDocIndex(Number(e.target.value))}
                    className="w-full sm:max-w-[280px] pl-3 pr-8 py-2 rounded-xl theme-input border text-xs font-semibold theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 truncate shadow-2xs"
                  >
                    {docs.map((doc, idx) => (
                      <option key={doc.id} value={idx}>
                        {idx + 1}. {doc.type} {doc.name ? `— ${doc.name}` : ''} {doc.ocrStatus === 'done' ? '✓' : '⏳'}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] font-mono theme-text-muted shrink-0">
                    {selectedDocIndex + 1}/{docs.length}
                  </span>
                </div>
              ) : (
                docs.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      selectedDocIndex === idx
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{doc.type}</span>
                    {doc.ocrStatus && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          doc.ocrStatus === 'done' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                        }`}
                      />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Action Buttons: Upload, Re-upload, Maximize */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setIsReuploadMode(false);
                  setShowUploadModal(true);
                }}
                title="Upload New Document"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              <button
                onClick={() => {
                  setIsReuploadMode(true);
                  setShowUploadModal(true);
                }}
                title="Re-upload / Replace Current Document"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:border-blue-500 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replace</span>
              </button>

              <button
                onClick={() => setShowPreviewModal(true)}
                className="p-2 rounded-xl theme-card border theme-text-secondary hover:theme-text-primary hover:border-blue-500 transition-colors"
                title="Full Screen Document & Raw Text Preview"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Viewer Body */}
          <div className="flex-1 p-2 bg-slate-500/5 overflow-hidden flex flex-col min-h-[550px]">
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

        {/* Right Column (7 Cols): Multi-Tab Investigation Suite */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl theme-surface border overflow-hidden shadow-sm">
          {/* Compact Tab Navigation Header */}
          <div className="border-b theme-border bg-slate-50/80 dark:bg-slate-950/70 backdrop-blur-sm p-2 flex items-center justify-between gap-2 overflow-x-auto">
            {/* Compact Segmented Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              {[
                { id: 'TIMELINE', shortLabel: 'Timeline', label: 'Flow of Title Timeline', icon: GitBranch },
                { id: 'EXTRACTED_OCR', shortLabel: 'OCR Grid', label: 'OCR Data Grid', icon: FileSpreadsheet },
                { id: 'IGR_SEARCH', shortLabel: 'IGR Search', label: 'IGR Registry Search', icon: Database },
                { id: 'SITE_SURVEY', shortLabel: 'Site Survey', label: 'Field Site Survey', icon: Camera },
                { id: 'DISCREPANCIES', shortLabel: 'Flags', label: 'Encumbrance Flags', icon: AlertTriangle },
                { id: 'TSR_REPORT', shortLabel: 'TSR Report', label: 'Title Search Report (TSR) & View Report', icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    title={tab.label}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                        : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-300/50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.shortLabel}</span>
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
                <option value="SITE_SURVEY">📍 Field Site Survey</option>
                <option value="DISCREPANCIES">⚠️ Encumbrance Flags</option>
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

            {/* Tab 4: Discrepancy & Encumbrance Flags */}
            {activeTab === 'DISCREPANCIES' && (
              <EncumbranceFlags
                requestId={requestId}
                ownerName={ownerName}
                propertyName={propName}
              />
            )}

            {/* Tab 5: Field Site Survey */}
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
          await loadDetails();
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
