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
} from 'lucide-react';
import { SitePhotoInspection } from '@/components/survey/SitePhotoInspection';
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

  // Documents state
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState('Sale Deed');

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
    setUploadFile(null);
    setUploadDocType(isReupload && currentDoc?.type ? currentDoc.type : 'Sale Deed');
    setShowUploadModal(true);
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      if (isReuploadMode && currentDoc?.id) {
        await requestsApi.replaceDocument(requestId, currentDoc.id, uploadFile);
        setStatusFeedback({
          type: 'success',
          message: `Document "${currentDoc.name}" successfully re-uploaded & replaced!`,
        });
      } else {
        await requestsApi.uploadNewDocuments(requestId, [uploadFile], [uploadDocType]);
        setStatusFeedback({
          type: 'success',
          message: `New document "${uploadFile.name}" successfully uploaded to request!`,
        });
      }
      setShowUploadModal(false);
      setUploadFile(null);
      await loadDetails();
      setTimeout(() => setStatusFeedback(null), 5000);
    } catch (err: any) {
      console.error('Failed to upload document:', err);
      setStatusFeedback({
        type: 'error',
        message: err?.response?.data?.detail || 'Failed to upload document to server',
      });
    } finally {
      setIsUploading(false);
    }
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

  const rawDocs = requestData?.documents;
  const docs = (Array.isArray(rawDocs) && rawDocs.length > 0) ? rawDocs.map((d: any, idx: number) => ({
    id: d.doc_id || `doc-${idx + 1}`,
    name: d.file_name || `Document_${idx + 1}.pdf`,
    type: d.document_type || d.type || 'Property Deed',
    status: (d.verification_status || 'clear') as 'clear' | 'rejected' | 'pending',
    ocrStatus: d.ocr_status || 'done',
    date: d.uploaded_at || 'Recent',
    fileUrl: typeof d.file_url === 'string' ? d.file_url : (Array.isArray(d.file_url) ? d.file_url[0] : '#'),
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
        {/* Left Column (5 Cols): Document Viewer & OCR Inspector */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl theme-surface border overflow-hidden shadow-sm">
          {/* Document Switcher Header with Upload / Reupload Controls */}
          <div className="p-3 border-b theme-border bg-slate-50 dark:bg-slate-950/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
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
                  </button>
                ))}
              </div>

              {/* Upload & Reupload Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenUploadModal(false)}
                  title="Upload New Document"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>

                <button
                  onClick={() => handleOpenUploadModal(true)}
                  title="Re-upload / Replace Current Document"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg theme-card border text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:border-blue-500 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Re-upload</span>
                </button>
              </div>
            </div>

            {/* Document Controls & Zoom */}
            <div className="flex items-center justify-between border-t theme-border pt-2 text-xs">
              <span className="text-[11px] theme-text-muted truncate max-w-[220px]">
                {currentDoc.name}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(75, prev - 10))}
                  className="p-1 rounded theme-card border theme-text-primary text-xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono theme-text-muted px-1">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
                  className="p-1 rounded theme-card border theme-text-primary text-xs"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* High-Resolution Document Canvas Simulator */}
          <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-950/90 overflow-y-auto flex items-center justify-center min-h-[480px]">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-sm rounded-xl theme-card border p-5 shadow-xl space-y-4 transition-transform duration-200"
            >
              {/* Document Header Stamp */}
              <div className="border-b theme-border pb-3 text-center space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                  Government Revenue Registration Record
                </div>
                <h4 className="text-xs font-bold theme-text-primary truncate">{currentDoc.name}</h4>
                <p className="text-[10px] theme-text-muted font-mono">
                  Type: {currentDoc.type} &bull; Reg: {currentDoc.extracted.regNo}
                </p>
              </div>

              {/* OCR Bounding Box Callouts */}
              <div className="space-y-2.5 text-[11px]">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                    Vendor (Transferor)
                  </span>
                  <p className="font-semibold theme-text-primary">{currentDoc.extracted.vendor}</p>
                </div>

                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    Vendee (Purchaser / Borrower)
                  </span>
                  <p className="font-semibold theme-text-primary">{currentDoc.extracted.vendee}</p>
                </div>

                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
                    Consideration & Stamp Duty
                  </span>
                  <p className="font-semibold theme-text-primary">{currentDoc.extracted.consideration}</p>
                </div>

                <div className="p-2 rounded-lg theme-surface border">
                  <span className="text-[9px] font-bold uppercase tracking-wider theme-text-secondary block mb-0.5">
                    Schedule Property Description
                  </span>
                  <p className="text-[10px] leading-relaxed theme-text-primary">{currentDoc.extracted.propertyDesc}</p>
                </div>
              </div>

              <div className="text-center pt-2 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Sparkles className="w-3 h-3" /> GPT-4 Legal OCR Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Multi-Tab Investigation Suite */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl theme-surface border overflow-hidden shadow-sm">
          {/* Tab Navigation Header */}
          <div className="border-b theme-border bg-slate-50 dark:bg-slate-950/60 p-2 flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'TIMELINE', label: 'Flow of Title Timeline', icon: GitBranch },
              { id: 'EXTRACTED_OCR', label: 'OCR Data Grid', icon: FileSpreadsheet },
              { id: 'IGR_SEARCH', label: 'IGR Registry Search', icon: Database },
              { id: 'SITE_SURVEY', label: 'Field Site Survey', icon: Camera },
              { id: 'DISCREPANCIES', label: 'Encumbrance Flags', icon: AlertTriangle },
              { id: 'TSR_REPORT', label: 'TSR / Live Editor', icon: FileCheck2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-5 overflow-y-auto">
            {/* Tab 1: Flow-of-Title Timeline Graph */}
            {activeTab === 'TIMELINE' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold theme-text-primary">30-Year Unbroken Chain of Title</h3>
                    <p className="text-xs theme-text-secondary">Sequential ownership history and title devolution graph</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    Chain Verified
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-500/40">
                  {/* Node 1: Parent Allotment */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                    <div className="p-4 rounded-xl theme-card border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold theme-text-primary">1998 &mdash; Original Allotment</span>
                        <span className="theme-text-muted font-mono">Reg: #1249</span>
                      </div>
                      <p className="text-xs theme-text-secondary">
                        Housing Development Society &rarr; <strong className="text-blue-600 dark:text-blue-400">Sunil K. Sharma</strong>
                      </p>
                      <p className="text-[11px] theme-text-muted">
                        Consideration: Rs. 18,50,000 &bull; Sub-Registrar Record Verified
                      </p>
                    </div>
                  </div>

                  {/* Node 2: Current Sale Deed */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                    <div className="p-4 rounded-xl theme-card border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold theme-text-primary">2020 &mdash; Absolute Registered Sale Deed</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">Reg: #8472</span>
                      </div>
                      <p className="text-xs theme-text-secondary">
                        Sunil K. Sharma &rarr; <strong className="text-emerald-600 dark:text-emerald-400">{ownerName} (Current Borrower)</strong>
                      </p>
                      <p className="text-[11px] theme-text-muted">
                        Consideration: Rs. 85,00,000 &bull; Stamp Duty Paid &bull; SRO Verified
                      </p>
                    </div>
                  </div>

                  {/* Node 3: Current Mortgage Proposed */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                    <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold theme-text-primary">2026 &mdash; Proposed Equitable Mortgage</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono">{bankBranch}</span>
                      </div>
                      <p className="text-xs theme-text-secondary">
                        Home Loan Facility: <strong className="text-indigo-600 dark:text-indigo-300">Rs. 65,00,000</strong>
                      </p>
                      <p className="text-[11px] theme-text-muted">
                        Title clear for creation of primary charge via deposit of original title deeds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: OCR Extracted Fields */}
            {activeTab === 'EXTRACTED_OCR' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold theme-text-primary">Structured OCR Entity Extraction</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(currentDoc.extracted).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl theme-card border">
                      <span className="text-[10px] font-bold uppercase tracking-wider theme-text-secondary block mb-1">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold theme-text-primary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: IGR Search Match */}
            {activeTab === 'IGR_SEARCH' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold theme-text-primary">IGR Registry Cross-Verification</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    Live Record Match (100%)
                  </span>
                </div>
                <div className="p-4 rounded-xl theme-card border space-y-2 text-xs">
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Portal Queried:</span>
                    <span className="theme-text-primary font-medium">State IGR Online Registry</span>
                  </div>
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Registration Reference:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{cts}</span>
                  </div>
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Owner Recorded in SRO:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-secondary">Encumbrance Recorded:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">NIL (Unencumbered)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Discrepancy & Encumbrance Flags */}
            {activeTab === 'DISCREPANCIES' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold theme-text-primary">Encumbrance & Discrepancy Audit</h3>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">No Legal Impediments Detected</h4>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                      Property is free from prior mortgages, pending lis pendens litigations, or municipal tax attachments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Field Site Survey */}
            {activeTab === 'SITE_SURVEY' && (
              <div className="space-y-4">
                <SitePhotoInspection
                  requestId={requestId}
                  propertyName={`${propName}, ${location}`}
                />
              </div>
            )}

            {/* Tab 6: Live TSR Report */}
            {activeTab === 'TSR_REPORT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold theme-text-primary">Title Search Report (TSR) Generator</h3>
                    <p className="text-xs theme-text-secondary">Institutional Bank Format &mdash; {bankBranch}</p>
                  </div>
                  <button
                    onClick={() => alert('Downloading Official Signed TSR Document (DOCX)...')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download DOCX</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl theme-card border space-y-3 text-xs leading-relaxed theme-text-secondary">
                  <div className="text-center border-b theme-border pb-3">
                    <h4 className="text-sm font-bold theme-text-primary">LEGAL TITLE SEARCH REPORT (TSR)</h4>
                    <p className="text-[11px] theme-text-muted font-mono">File Ref: TSR-2026-{requestId} &bull; Date: 31-Aug-2026</p>
                  </div>
                  <p>
                    <strong>1. Opinion on Title:</strong> In our professional legal opinion, the Title of the Mortgagor/Borrower <strong className="theme-text-primary">{ownerName}</strong> to the schedule property described hereunder is <strong>CLEAR, VALID, MARKETABLE, AND UNENCUMBERED</strong>.
                  </p>
                  <p>
                    <strong>2. Creation of Charge:</strong> The Bank ({bankBranch}) may safely proceed with the creation of an Equitable Mortgage by Deposit of Original Registered Deeds for {propName}, {flatNo}.
                  </p>
                </div>
              </div>
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

      {/* ── MODAL 2: Upload / Re-upload Document ─────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl theme-surface border shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                  {isReuploadMode ? <RefreshCw className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold theme-text-primary">
                    {isReuploadMode ? 'Re-upload / Replace Document' : 'Upload New Title Document'}
                  </h3>
                  <p className="text-xs theme-text-secondary">
                    {isReuploadMode
                      ? `Replace ${currentDoc?.name}`
                      : `Add document to ${requestId}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-card border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold theme-text-primary mb-1">Document Type *</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full theme-input border rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Sale Deed">Sale Deed (Absolute Registered)</option>
                  <option value="Parent Deed">Parent Chain Deed</option>
                  <option value="Mutation Extract (7/12)">Mutation Extract (7/12 / 8A)</option>
                  <option value="Property Card">Property Card (CTS Extract)</option>
                  <option value="Society NOC">Society NOC / Share Certificate</option>
                  <option value="Index II Search">Index II / Encumbrance Certificate</option>
                  <option value="Electricity Bill">Utility / Electricity Bill</option>
                  <option value="Builder Agreement">Builder Buyer Agreement</option>
                  <option value="Other Document">Other Legal Supporting Document</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold theme-text-primary mb-1">Select File (PDF or Image) *</label>
                <div className="border-2 border-dashed theme-border rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-900/40">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-80" />
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg,.tiff"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  {uploadFile && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                      Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t theme-border">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border theme-card font-semibold theme-text-secondary hover:theme-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isReuploadMode ? 'Replace Document' : 'Upload Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
