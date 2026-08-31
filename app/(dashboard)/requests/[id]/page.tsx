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
import { requestsApi } from '@/lib/api/requests';

export default function RequestWorkspacePage() {
  const params = useParams();
  const requestId = (params?.id as string) || 'REQ-349';

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<
    'TIMELINE' | 'EXTRACTED_OCR' | 'IGR_SEARCH' | 'SITE_SURVEY' | 'DISCREPANCIES' | 'TSR_REPORT'
  >('TIMELINE');

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
    city: '',
    village: '',
    pinCode: '',
    ctsNumber: '',
    from_year: 2001,
    advocateName: '',
    searchName: '',
    caseType: 'General',
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  const loadDetails = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getRequestDetails(requestId);
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
    setEditFormData({
      propertyName: requestData?.propertyName || requestData?.property_name || 'Deepali Residency',
      flatNumber: requestData?.flatNumber || requestData?.flat_number || '235',
      ownerName: requestData?.ownerName || requestData?.owner_name || 'Ajay Kumar',
      applicantName: requestData?.applicantName || requestData?.applicant_name || requestData?.ownerName || 'Ajay Kumar',
      bankName: requestData?.bankName || requestData?.bank_name || 'Axis Bank',
      Bank_branch: requestData?.Bank_branch || requestData?.bank_branch || 'Pitampura Branch',
      address: requestData?.address || 'Pitampura, New Delhi',
      state: requestData?.state || 'Delhi',
      city: requestData?.city || 'New Delhi',
      village: requestData?.village || '',
      pinCode: requestData?.pinCode || requestData?.pin_code || '110034',
      ctsNumber: requestData?.ctsNumber || requestData?.ctsnumber || 'CTS-1029',
      from_year: requestData?.from_year || 2001,
      advocateName: requestData?.advocateName || requestData?.advocate_name || 'Adv. Suresh Verma',
      searchName: requestData?.searchName || requestData?.search_name || 'Title Search 2026',
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

  const handleUpdateStatus = async (newStatus: 'Verified' | 'Rejected') => {
    setIsUpdatingStatus(true);
    setStatusFeedback(null);
    try {
      await requestsApi.updateRequestStatus(requestId, newStatus);
      setRequestStatus(newStatus);
      setStatusFeedback({
        type: 'success',
        message: newStatus === 'Verified' ? 'Property Title Approved & Verified in Postgres Database!' : 'Discrepancy Flagged on Property Title!',
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
  const docs = (Array.isArray(rawDocs) && rawDocs.length > 0) ? rawDocs.map((d: any, idx: number) => ({
    id: d.doc_id || `doc-${idx + 1}`,
    name: d.file_name || `Document_${idx + 1}.pdf`,
    type: d.document_type || d.type || 'Property Deed',
    status: (d.verification_status || 'clear') as 'clear' | 'rejected' | 'pending',
    ocrStatus: d.ocr_status || (d.raw_text && d.raw_text.trim().length > 0 ? 'done' : 'pending'),
    date: d.uploaded_at || 'Recent',
    fileUrl: typeof d.file_url === 'string' ? d.file_url : (Array.isArray(d.file_url) ? d.file_url[0] : '#'),
    rawText: d.raw_text || d.full_text || '',
    ocrMeta: d.ocr_meta || {},
    extracted: {
      vendor: requestData?.advocateName || 'Previous Landholder',
      vendee: requestData?.ownerName || requestData?.applicantName || 'Borrower',
      date: requestData?.date_of_issue || 'Registered Record',
      consideration: 'Institutional Mortgage',
      propertyDesc: `${requestData?.propertyName || 'Property'} ${requestData?.flatNumber ? `Flat ${requestData?.flatNumber}` : ''}, ${requestData?.address || requestData?.city || 'Location'}`,
      cts: requestData?.ctsNumber || requestData?.ctsnumber || 'CTS-Record',
      sro: `${requestData?.district || 'SRO District'} Sub-Registrar`,
      regNo: requestData?.permitnumber || requestData?.permitNumber || `DOC #${requestId}`,
    },
  })) : [
    {
      id: 'doc-1',
      name: 'Registered_Sale_Deed_2020.pdf',
      type: 'Sale Deed',
      status: 'clear' as const,
      ocrStatus: 'done',
      date: 'Aug 30, 2026',
      fileUrl: '#',
      rawText: 'MORTGAGE DEED AGREEMENT\nThis Deed of Mortgage is made on 31st August 2026.\nBetween Borrower: Mr. Rahul Sharma\nAnd Lender: State Bank of India\nProperty Description: Flat No 402, 4th Floor, Survey No 142/3, CTS No 589, Village Borivali.\nLoan Amount: Rs. 75,00,000/-',
      ocrMeta: { total_pages: 1, char_count: 245 },
      extracted: {
        vendor: 'Sunil K. Sharma',
        vendee: requestData?.ownerName || 'Ajay Kumar',
        date: '14-Aug-2020',
        consideration: 'Rs. 85,00,000',
        propertyDesc: `${requestData?.propertyName || 'Deepali Residency'}, Flat ${requestData?.flatNumber || '235'}`,
        cts: requestData?.ctsNumber || 'CTS-1029',
        sro: 'SRO VI-A Pitampura',
        regNo: 'Doc #8472/Book-I',
      },
    },
    {
      id: 'doc-2',
      name: 'Parent_Chain_Deed_1998.pdf',
      type: 'Parent Deed',
      status: 'clear' as const,
      ocrStatus: 'done',
      date: 'Aug 29, 2026',
      fileUrl: '#',
      extracted: {
        vendor: 'DDA / DLF Housing Ltd',
        vendee: 'Sunil K. Sharma',
        date: '22-Mar-1998',
        consideration: 'Rs. 18,50,000',
        propertyDesc: `${requestData?.propertyName || 'Deepali Residency'} Plot 235`,
        cts: requestData?.ctsNumber || 'CTS-1029',
        sro: 'SRO VI Delhi',
        regNo: 'Doc #1249/Book-I',
      },
    },
  ];

  const currentDoc = docs[Math.min(selectedDocIndex, docs.length - 1)] || docs[0];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl theme-surface border backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/branch"
            className="p-2 rounded-xl theme-card border theme-text-primary hover:border-blue-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {requestId}
              </span>
              <span className="text-slate-400">&bull;</span>
              <h1 className="text-base font-bold theme-text-primary">
                {propName} &mdash; {flatNo}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                {cts}
              </span>
              {requestStatus === 'Verified' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Clean Title
                </span>
              )}
              {requestStatus === 'Rejected' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Flagged
                </span>
              )}
            </div>
            <p className="text-xs theme-text-secondary mt-0.5">
              Borrower: <strong className="theme-text-primary">{ownerName}</strong> &bull; {location} &bull; {bankBranch}
            </p>
          </div>
        </div>

        {/* Quick Review Actions + Edit Form Button */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          {/* Edit Form Button */}
          <button
            onClick={handleOpenEditModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border theme-card text-xs font-semibold theme-text-primary hover:border-blue-500 hover:text-blue-500 transition-all active:scale-95 shadow-sm"
            title="Edit Property & Case Details"
          >
            <Edit3 className="w-4 h-4 text-blue-500" />
            <span>Edit Form</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('Verified')}
            disabled={isUpdatingStatus}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
              requestStatus === 'Verified'
                ? 'bg-emerald-600 text-white shadow-emerald-600/25 shadow-md'
                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isUpdatingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Clear Title (Approve)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('Rejected')}
            disabled={isUpdatingStatus}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
              requestStatus === 'Rejected'
                ? 'bg-red-600 text-white shadow-red-600/25 shadow-md'
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25 hover:bg-red-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Flag Discrepancy</span>
          </button>

          <button
            onClick={() => setActiveTab('TSR_REPORT')}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all active:scale-95 col-span-2 sm:col-span-1"
          >
            <FileText className="w-4 h-4" />
            <span>Generate TSR</span>
          </button>
        </div>
      </div>


      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* Left Column (5 Cols): Real Document Viewer & Raw OCR Inspector */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl theme-surface border overflow-hidden shadow-sm">
          {/* Document Switcher Header with Upload / Reupload Controls */}
          <div className="p-3 border-b theme-border bg-slate-50 dark:bg-slate-950/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              {/* Document Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-1">
                {docs.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedDocIndex === idx
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-200 dark:hover:bg-slate-800'
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
                ))}
              </div>

              {/* Upload & Reupload Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setIsReuploadMode(false);
                    setShowUploadModal(true);
                  }}
                  title="Upload New Document"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
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
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg theme-card border text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:border-blue-500 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Re-upload</span>
                </button>
              </div>
            </div>

            {/* Left Panel View Mode Switcher (Viewer vs Raw OCR Text) */}
            <div className="flex items-center justify-between border-t theme-border pt-2 text-xs">
              <div className="flex items-center p-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-semibold">
                <button
                  onClick={() => setLeftPanelTab('VIEWER')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    leftPanelTab === 'VIEWER'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Document View
                </button>
                <button
                  onClick={() => setLeftPanelTab('RAW_TEXT')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    leftPanelTab === 'RAW_TEXT'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Raw OCR Text</span>
                </button>
                <button
                  onClick={() => setLeftPanelTab('FIELDS')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    leftPanelTab === 'FIELDS'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Fields
                </button>
              </div>

              {/* Viewport Zoom & Fullscreen Controls */}
              <div className="flex items-center gap-1">
                {leftPanelTab === 'VIEWER' && (
                  <>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
                      className="p-1 rounded theme-card border theme-text-primary text-xs"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-mono theme-text-muted px-0.5">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.min(200, prev + 15))}
                      className="p-1 rounded theme-card border theme-text-primary text-xs"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1 rounded theme-card border theme-text-primary text-xs"
                      title="Rotate 90deg"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="p-1.5 rounded theme-card border text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors"
                  title="Full Screen Document & Raw Text Preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Left Panel Body: Tab Content */}
          <div className="flex-1 p-3 bg-slate-100/70 dark:bg-slate-950/90 overflow-hidden flex flex-col min-h-[500px]">
            {/* SUB-TAB 1: Real Interactive Document Previewer */}
            {leftPanelTab === 'VIEWER' && (
              <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-1">
                {currentDoc.fileUrl && currentDoc.fileUrl !== '#' ? (
                  currentDoc.name.toLowerCase().endsWith('.pdf') ||
                  currentDoc.fileUrl.toLowerCase().includes('.pdf') ? (
                    <div
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'top center',
                      }}
                      className="w-full h-full min-h-[480px] transition-transform duration-200"
                    >
                      <iframe
                        src={`${currentDoc.fileUrl}#toolbar=1&navpanes=0`}
                        title={currentDoc.name}
                        className="w-full h-full min-h-[500px] rounded-xl border theme-border bg-white shadow-md"
                      />
                    </div>
                  ) : currentDoc.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/) ||
                    currentDoc.fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp)/) ? (
                    <div
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                      className="transition-transform duration-200 p-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentDoc.fileUrl}
                        alt={currentDoc.name}
                        className="max-h-[500px] max-w-full rounded-xl object-contain shadow-lg border theme-border"
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-3 theme-card rounded-2xl border shadow-sm max-w-sm">
                      <FileText className="w-10 h-10 text-blue-500 mx-auto" />
                      <h4 className="text-xs font-bold theme-text-primary">{currentDoc.name}</h4>
                      <p className="text-[11px] theme-text-muted">Document uploaded to cloud storage</p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <a
                          href={currentDoc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open File</span>
                        </a>
                        <button
                          onClick={() => setShowPreviewModal(true)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border theme-card text-xs font-semibold theme-text-primary hover:border-blue-500 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>Inspect Raw Text</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center space-y-3 theme-card rounded-2xl border shadow-sm max-w-sm">
                    <FileSearch className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="text-xs font-bold theme-text-primary">{currentDoc.name}</h4>
                    <p className="text-[11px] theme-text-muted">
                      No cloud URL attached yet. Upload the original scan to enable interactive PDF viewing.
                    </p>
                    <button
                      onClick={() => {
                        setIsReuploadMode(true);
                        setShowUploadModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-500 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 2: Extracted Raw OCR Text Inspector */}
            {leftPanelTab === 'RAW_TEXT' && (
              <div className="flex-1 flex flex-col rounded-xl theme-card border overflow-hidden shadow-xs">
                {/* Search & Copy Toolbar */}
                <div className="p-2.5 border-b theme-border bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={rawTextSearch}
                      onChange={(e) => setRawTextSearch(e.target.value)}
                      placeholder="Filter keywords in extracted text..."
                      className="w-full pl-8 pr-2.5 py-1 rounded-lg border theme-border bg-white dark:bg-slate-900 text-xs theme-text-primary placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRetryOcr(currentDoc)}
                      disabled={isRetryingOcr}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 shadow-xs"
                      title="Run or retry OCR on this document"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRetryingOcr ? 'animate-spin' : ''}`} />
                      <span className="text-[11px]">{isRetryingOcr ? 'OCR...' : currentDoc.rawText ? 'Retry OCR' : 'Run OCR'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (currentDoc.rawText) {
                          navigator.clipboard.writeText(currentDoc.rawText);
                          setCopiedRawText(true);
                          setTimeout(() => setCopiedRawText(false), 2000);
                        }
                      }}
                      disabled={!currentDoc.rawText}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border theme-border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all disabled:opacity-50 shrink-0"
                      title="Copy full raw text"
                    >
                      {copiedRawText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Raw Text Content */}
                <div className="flex-1 p-3 overflow-auto bg-slate-50/40 dark:bg-slate-950/30 font-mono text-[11px] leading-relaxed theme-text-primary whitespace-pre-wrap select-text">
                  {currentDoc.rawText ? (
                    rawTextSearch.trim() ? (
                      currentDoc.rawText
                        .split('\n')
                        .filter((line: string) => line.toLowerCase().includes(rawTextSearch.toLowerCase()))
                        .join('\n') || 'No matching lines found for search term.'
                    ) : (
                      currentDoc.rawText
                    )
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                      <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 border border-indigo-100 dark:border-indigo-900/50">
                        <Sparkles className="w-6 h-6 opacity-80" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold theme-text-secondary">No Raw OCR Text Extracted</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Click below to execute the OCR extraction pipeline on this document.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleRetryOcr(currentDoc)}
                          disabled={isRetryingOcr}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-sm"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRetryingOcr ? 'animate-spin' : ''}`} />
                          <span>{isRetryingOcr ? 'Extracting OCR...' : 'Run OCR Extraction Now'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsReuploadMode(true);
                            setShowUploadModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border theme-card text-xs font-semibold theme-text-secondary hover:theme-text-primary transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Re-upload</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Raw Text Status Footer */}
                <div className="px-3 py-1.5 border-t theme-border bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-[10px] theme-text-muted font-mono">
                  <span>Status: {currentDoc.ocrStatus?.toUpperCase() || 'DONE'}</span>
                  <span>{currentDoc.rawText?.length || 0} characters</span>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: Structured Bounding Box & Fields */}
            {leftPanelTab === 'FIELDS' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-3 theme-card rounded-xl border">
                <div className="flex items-center justify-between pb-2 border-b theme-border">
                  <h4 className="text-xs font-bold theme-text-primary">Extracted Document Entities</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {currentDoc.type}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                      Vendor (Transferor)
                    </span>
                    <p className="font-semibold theme-text-primary">{currentDoc.extracted.vendor}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      Vendee (Purchaser / Borrower)
                    </span>
                    <p className="font-semibold theme-text-primary">{currentDoc.extracted.vendee}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                      Consideration & Stamp Duty
                    </span>
                    <p className="font-semibold theme-text-primary">{currentDoc.extracted.consideration}</p>
                  </div>

                  <div className="p-2.5 rounded-xl theme-surface border">
                    <span className="text-[9px] font-bold uppercase tracking-wider theme-text-secondary block mb-0.5">
                      Schedule Property Description
                    </span>
                    <p className="text-[11px] leading-relaxed theme-text-primary">{currentDoc.extracted.propertyDesc}</p>
                  </div>
                </div>
              </div>
            )}
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
                { id: 'TSR_REPORT', shortLabel: 'TSR Editor', label: 'TSR / Live Editor', icon: FileCheck2 },
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
              />
            )}

            {/* Tab 3: IGR Search Match */}
            {activeTab === 'IGR_SEARCH' && (
              <IgrRegistrySearch
                requestId={requestId}
                stateName={requestData?.state || 'Delhi'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
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

                <div>
                  <label className="block font-semibold theme-text-primary mb-1">State</label>
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
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
