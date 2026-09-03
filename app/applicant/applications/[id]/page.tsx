'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applicantApi, ApplicantApplicationDetail, DeficiencyRequest } from '@/lib/api/applicant';
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
} from 'lucide-react';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [detail, setDetail] = useState<ApplicantApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [uploadingDeficiencyId, setUploadingDeficiencyId] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicantApi.getApplicationDetail(id);
      setDetail(res.application);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError(err.response?.data?.detail || 'Failed to load application details.');
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-sm">Loading application tracking...</p>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Application Not Found</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-sm">{error}</p>
        <button
          onClick={() => router.push('/applicant/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const pendingDeficiencies = (detail?.deficiency_requests || []).filter((d) => d.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/applicant/dashboard')}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{detail?.application_number}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {detail?.status}
              </span>
            </div>
          </div>

          <button
            onClick={fetchDetail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Application Overview Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Property Details</span>
              <h1 className="text-xl font-bold text-white mt-1">{detail?.property_name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{detail?.address || [detail?.city, detail?.district].filter(Boolean).join(', ')}</p>
            </div>
            {detail?.bank_name && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>Lending Bank: <strong>{detail.bank_name}</strong></span>
              </div>
            )}
          </div>

          {/* 4-Step Milestone Progress */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Verification Milestones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {detail?.timeline.map((step, idx) => {
                const isDone = step.state === 'completed';
                const isCurrent = step.state === 'in_progress';

                return (
                  <div key={step.id} className="relative flex sm:flex-col items-start gap-3 sm:gap-2">
                    <div className="flex items-center sm:justify-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                            : isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                      </div>
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isDone || isCurrent ? 'text-white' : 'text-slate-500'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Required: Deficiency Requests Banner */}
        {pendingDeficiencies.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold tracking-tight">Action Required: Missing Documents Requested</h3>
            </div>
            <p className="text-xs text-amber-300/80">
              Our legal scrutinizer requires the following documents to complete title verification. Please upload clean, official copies.
            </p>

            {uploadSuccessMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {pendingDeficiencies.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{d.document_title}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        Required
                      </span>
                    </div>
                    {d.deficiency_note && (
                      <p className="text-xs text-slate-400 mt-1 italic">&ldquo;{d.deficiency_note}&rdquo;</p>
                    )}
                  </div>

                  <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-all shadow-md shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingDeficiencyId === d.id ? 'Uploading & Queuing...' : 'Upload Document'}</span>
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
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Uploaded Documents</h3>
          {(detail?.uploaded_documents || []).length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No supplementary documents have been uploaded through this portal yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {detail?.uploaded_documents.map((doc) => (
                <div key={doc.doc_id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-white">{doc.file_name}</h5>
                      <span className="text-[11px] text-slate-400">{doc.document_type} • {doc.uploaded_at}</span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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
