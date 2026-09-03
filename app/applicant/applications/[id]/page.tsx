'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applicantApi, ApplicantApplicationDetail, DeficiencyRequest } from '@/lib/api/applicant';
import { useThemeStore } from '@/lib/store/themeStore';
import {
  ArrowLeft,
  ShieldCheck,
  Building,
  MapPin,
  Clock,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  FileText,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

const DEMO_APPLICATION_DETAILS: Record<string, ApplicantApplicationDetail> = {
  'APP-2026-8941': {
    id: 101,
    application_number: 'APP-2026-8941',
    property_name: 'Sunshine Heights CHSL, Flat 402, 4th Floor',
    applicant_name: 'Rahul Sharma',
    address: 'Wing-B, New Link Road, Borivali West, Mumbai, Maharashtra 400092',
    city: 'Borivali West',
    district: 'Mumbai Suburban',
    bank_name: 'State Bank of India — Nariman Point Branch',
    status: 'In Scrutiny (Stage 3 of 4)',
    created_at: '2026-08-29T10:15:00Z',
    timeline: [
      { id: 1, title: 'Branch Intake & KYC', state: 'completed', description: 'Loan application submitted and borrower Aadhaar/PAN identity verified.' },
      { id: 2, title: 'Title Deed & Gemini Extraction', state: 'completed', description: 'Sale Agreement, Index-II, and 7/12 extracted into structured legal JSON.' },
      { id: 3, title: 'State SRO & Prior Encumbrance', state: 'in_progress', description: 'Cross-verifying 30-year Book-I registrations with Maharashtra IGR e-Search.' },
      { id: 4, title: 'Title Search Report (TSR)', state: 'pending', description: 'Final legal scrutinizer approval and certificate delivery to bank branch.' },
    ],
    deficiency_requests: [
      {
        id: 'def-101',
        document_title: 'Latest Electricity Bill / Society Maintenance Receipt',
        deficiency_note: 'Please provide a utility bill or maintenance receipt dated within the last 3 months to corroborate municipal address and clear title possession.',
        status: 'pending',
        requested_at: '2026-08-30T14:20:00Z',
      },
    ],
    uploaded_documents: [
      { doc_id: 'doc-1', file_name: 'Registered_Agreement_For_Sale_2022.pdf', document_type: 'Agreement for Sale', verification_status: 'Verified Clear', uploaded_at: '29 Aug 2026' },
      { doc_id: 'doc-2', file_name: 'Index_II_Certified_Receipt.pdf', document_type: 'Registration Receipt', verification_status: 'Verified Clear', uploaded_at: '29 Aug 2026' },
      { doc_id: 'doc-3', file_name: 'Society_Share_Certificate.pdf', document_type: 'Share Certificate', verification_status: 'Verified Clear', uploaded_at: '29 Aug 2026' },
    ],
  },
  'APP-2026-7209': {
    id: 102,
    application_number: 'APP-2026-7209',
    property_name: 'Deepali Residency, Unit 104, Deepali Enclave',
    applicant_name: 'Rahul Sharma',
    address: 'Pitampura, North West Delhi, Delhi 110034',
    city: 'Pitampura',
    district: 'North West Delhi',
    bank_name: 'Punjab National Bank — Pitampura Branch',
    status: 'Verified & Clear',
    created_at: '2026-08-27T14:30:00Z',
    timeline: [
      { id: 1, title: 'Branch Intake & KYC', state: 'completed', description: 'Loan application approved and submitted.' },
      { id: 2, title: 'Title Deed & OCR Intelligence', state: 'completed', description: 'Conveyance deed and NOC extracted with zero discrepancies.' },
      { id: 3, title: 'State SRO & DORIS Search', state: 'completed', description: 'Delhi Online Registration Information System search confirmed nil encumbrance.' },
      { id: 4, title: 'Title Search Report (TSR)', state: 'completed', description: 'Legal panel advocate certified clear and marketable title.' },
    ],
    deficiency_requests: [],
    uploaded_documents: [
      { doc_id: 'doc-11', file_name: 'Perpetual_Lease_Deed_1998.pdf', document_type: 'Lease Deed', verification_status: 'Verified Clear', uploaded_at: '27 Aug 2026' },
      { doc_id: 'doc-12', file_name: 'Conveyance_Deed_2015.pdf', document_type: 'Conveyance Deed', verification_status: 'Verified Clear', uploaded_at: '27 Aug 2026' },
      { doc_id: 'doc-13', file_name: 'Property_Tax_Challan_2026.pdf', document_type: 'Tax Receipt', verification_status: 'Verified Clear', uploaded_at: '27 Aug 2026' },
    ],
  },
  'APP-2026-6104': {
    id: 103,
    application_number: 'APP-2026-6104',
    property_name: 'Grand Palm Tower, Flat 802, Wing-A',
    applicant_name: 'Rahul Sharma',
    address: 'Veera Desai Road, Andheri West, Mumbai 400053',
    city: 'Andheri West',
    district: 'Mumbai Suburban',
    bank_name: 'HDFC Bank — Andheri Commercial Branch',
    status: 'Action Required',
    created_at: '2026-08-25T11:00:00Z',
    timeline: [
      { id: 1, title: 'Branch Intake & KYC', state: 'completed', description: 'Intake initiated by branch relationship manager.' },
      { id: 2, title: 'Title Deed & Chain Analysis', state: 'in_progress', description: 'Prior 1998 link deed requires official clarification.' },
      { id: 3, title: 'State SRO Cross-Check', state: 'pending', description: 'Awaiting submission of missing link document.' },
      { id: 4, title: 'Final Legal Opinion', state: 'pending', description: 'Pending resolution of link deed discrepancy.' },
    ],
    deficiency_requests: [
      {
        id: 'def-201',
        document_title: 'Prior Chain Deed (15-03-1998)',
        deficiency_note: 'A 1998 transfer between the original builder and first buyer is cited in recitals but the schedule copy is missing from file.',
        status: 'pending',
        requested_at: '2026-08-26T09:30:00Z',
      },
    ],
    uploaded_documents: [
      { doc_id: 'doc-21', file_name: 'Current_Sale_Agreement_2021.pdf', document_type: 'Sale Agreement', verification_status: 'Under Review', uploaded_at: '25 Aug 2026' },
    ],
  },
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const [detail, setDetail] = useState<ApplicantApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Upload state
  const [uploadingDeficiencyId, setUploadingDeficiencyId] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);

    // Check if ID matches demo items
    const demoItem = DEMO_APPLICATION_DETAILS[id] || Object.values(DEMO_APPLICATION_DETAILS).find((d) => String(d.id) === id);
    if (demoItem) {
      setDetail(demoItem);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    try {
      const res = await applicantApi.getApplicationDetail(id);
      setDetail(res.application);
      setIsDemoMode(false);
    } catch {
      // Fallback to default demo item
      const fallback = DEMO_APPLICATION_DETAILS['APP-2026-8941'];
      setDetail(fallback);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, deficiency: DeficiencyRequest) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploadingDeficiencyId(deficiency.id);
    setUploadSuccessMessage(null);
    setError(null);

    if (isDemoMode) {
      // Simulated upload in demo mode
      setTimeout(() => {
        setUploadSuccessMessage(`'${file.name}' was uploaded successfully! Our legal panel advocate has been notified.`);
        setUploadingDeficiencyId(null);
        if (detail) {
          const updatedDeficiencies = detail.deficiency_requests.filter((d) => d.id !== deficiency.id);
          const updatedUploaded = [
            {
              doc_id: `upload-${Date.now()}`,
              file_name: file.name,
              document_type: deficiency.document_title,
              verification_status: 'Submitted for Scrutiny',
              uploaded_at: 'Just now',
            },
            ...detail.uploaded_documents,
          ];
          setDetail({
            ...detail,
            deficiency_requests: updatedDeficiencies,
            uploaded_documents: updatedUploaded,
          });
        }
      }, 1200);
      return;
    }

    try {
      await applicantApi.uploadDocument(id, file, deficiency.id, deficiency.document_title);
      setUploadSuccessMessage(`'${file.name}' was uploaded successfully! Our legal panel has been notified.`);
      await fetchDetail();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload document. Please try again.');
    } finally {
      setUploadingDeficiencyId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-xs font-medium">Loading application tracking...</p>
      </div>
    );
  }

  const pendingDeficiencies = (detail?.deficiency_requests || []).filter((d) => d.status === 'pending');

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="border-b theme-border bg-[var(--bg-surface)] sticky top-0 z-20 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/applicant/dashboard')}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border theme-border text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
              title="Back to Applications"
              aria-label="Back to Applications"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold theme-text-primary font-mono">{detail?.application_number}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {detail?.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border theme-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button
              onClick={fetchDetail}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border theme-border shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Demo Mode Notice Banner */}
        {isDemoMode && (
          <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Demo Application Preview:</strong> You are viewing institutional applicant tracking for <strong>{detail?.property_name}</strong>. You can test uploading supplementary documents below.
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Application Overview Card */}
        <div className="bg-white dark:bg-[#111827] border theme-border rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b theme-border">
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Property Subject to Legal Scrutiny
              </span>
              <h1 className="text-lg sm:text-xl font-bold theme-text-primary mt-1">{detail?.property_name}</h1>
              <p className="text-xs theme-text-secondary mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{detail?.address || [detail?.city, detail?.district].filter(Boolean).join(', ')}</span>
              </p>
            </div>
            {detail?.bank_name && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border theme-border text-xs theme-text-primary">
                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Lending Bank: <strong className="font-semibold">{detail.bank_name}</strong></span>
              </div>
            )}
          </div>

          {/* 4-Step Milestone Progress */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Title Verification Milestones
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {detail?.timeline.filter((s) => s.state === 'completed').length} of {detail?.timeline.length} Milestones Complete
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {detail?.timeline.map((step) => {
                const isDone = step.state === 'completed';
                const isCurrent = step.state === 'in_progress';

                return (
                  <div
                    key={step.id}
                    className={`relative p-3.5 rounded-xl border transition-colors ${
                      isDone
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : isCurrent
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60'
                        : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                      </div>
                      <h4 className={`text-xs font-bold ${isDone || isCurrent ? 'theme-text-primary' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[11px] theme-text-secondary leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Required: Deficiency Requests Banner */}
        {pendingDeficiencies.length > 0 && (
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold">Action Required: Supplementary Document Requested</h3>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              Our bank panel advocate requires the following documents to complete the Title Search Report (TSR). Please upload clear, official copies.
            </p>

            {uploadSuccessMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {pendingDeficiencies.map((d) => (
                <div
                  key={d.id}
                  className="bg-white dark:bg-[#111827] border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold theme-text-primary">{d.document_title}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono">
                        Required
                      </span>
                    </div>
                    {d.deficiency_note && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">&ldquo;{d.deficiency_note}&rdquo;</p>
                    )}
                  </div>

                  <label className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors shadow-sm shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingDeficiencyId === d.id ? 'Uploading & Encrypting...' : 'Upload Document'}</span>
                    <input
                      type="file"
                      disabled={uploadingDeficiencyId === d.id}
                      onChange={(e) => handleFileUpload(e, d)}
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Documents List */}
        <div className="bg-white dark:bg-[#111827] border theme-border rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono mb-4">
            Uploaded Collateral Documents ({detail?.uploaded_documents.length || 0})
          </h3>
          {(detail?.uploaded_documents || []).length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No supplementary documents have been uploaded through this portal yet.
            </div>
          ) : (
            <div className="divide-y theme-border">
              {detail?.uploaded_documents.map((doc) => (
                <div key={doc.doc_id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold theme-text-primary">{doc.file_name}</h5>
                      <span className="text-[11px] theme-text-secondary">{doc.document_type} • {doc.uploaded_at}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border theme-border">
                    {doc.verification_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
