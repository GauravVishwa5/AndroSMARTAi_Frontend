'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function RequestWorkspacePage() {
  const params = useParams();
  const requestId = (params?.id as string) || 'REQ-349';

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<
    'TIMELINE' | 'EXTRACTED_OCR' | 'IGR_SEARCH' | 'DISCREPANCIES' | 'TSR_REPORT'
  >('TIMELINE');

  // Request State
  const [requestStatus, setRequestStatus] = useState<'Pending' | 'Verified' | 'Rejected'>('Pending');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Documents state
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const docs = [
    {
      id: 'doc-1',
      name: 'Registered_Sale_Deed_2020.pdf',
      type: 'Sale Deed',
      status: 'clear' as const,
      ocrStatus: 'done',
      date: 'Aug 30, 2026',
      extracted: {
        vendor: 'Sunil K. Sharma',
        vendee: 'Ajay Kumar',
        date: '14-Aug-2020',
        consideration: 'Rs. 85,00,000',
        propertyDesc: 'House No. 235, Block-B, Deepali, Pitampura, New Delhi',
        cts: 'CTS-1029',
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
      extracted: {
        vendor: 'DDA / DLF Housing Ltd',
        vendee: 'Sunil K. Sharma',
        date: '22-Mar-1998',
        consideration: 'Rs. 18,50,000',
        propertyDesc: 'Plot No. 235, Deepali Co-op Society, Delhi',
        cts: 'CTS-1029',
        sro: 'SRO VI Delhi',
        regNo: 'Doc #1249/Book-I',
      },
    },
    {
      id: 'doc-3',
      name: 'Society_NOC_ShareCert.pdf',
      type: 'Society NOC',
      status: 'clear' as const,
      ocrStatus: 'done',
      date: 'Aug 28, 2026',
      extracted: {
        vendor: 'Deepali Residency CHSL',
        vendee: 'Ajay Kumar',
        date: '02-Sep-2020',
        consideration: 'N/A',
        propertyDesc: 'Flat 235, Deepali Residency',
        cts: 'CTS-1029',
        sro: 'N/A',
        regNo: 'NOC/2020/094',
      },
    },
  ];

  const currentDoc = docs[selectedDocIndex];

  return (
    <div className="space-y-5">
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {requestId}
              </span>
              <span className="text-slate-400">&bull;</span>
              <h1 className="text-base font-bold theme-text-primary">
                Deepali Residency &mdash; Flat 235
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                CTS-1029
              </span>
            </div>
            <p className="text-xs theme-text-secondary mt-0.5">
              Borrower: <strong className="theme-text-primary">Ajay Kumar</strong> &bull; Pitampura, New Delhi &bull; Axis Bank Pitampura Branch
            </p>
          </div>
        </div>

        {/* Quick Review Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setRequestStatus('Verified')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              requestStatus === 'Verified'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Clear Title (Approve)</span>
          </button>

          <button
            onClick={() => setRequestStatus('Rejected')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              requestStatus === 'Rejected'
                ? 'bg-red-600 text-white'
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25 hover:bg-red-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Flag Discrepancy</span>
          </button>

          <button
            onClick={() => setActiveTab('TSR_REPORT')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all"
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
          {/* Document Switcher Header */}
          <div className="p-3 border-b theme-border bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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

            {/* Zoom Controls */}
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

          {/* High-Resolution Document Canvas Simulator */}
          <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-950/90 overflow-y-auto flex items-center justify-center">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-sm rounded-xl theme-card border p-5 shadow-xl space-y-4 transition-transform duration-200"
            >
              {/* Document Header Stamp */}
              <div className="border-b theme-border pb-3 text-center space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                  Government of NCT of Delhi &mdash; Revenue Dept
                </div>
                <h4 className="text-xs font-bold theme-text-primary">{currentDoc.name}</h4>
                <p className="text-[10px] theme-text-muted font-mono">
                  Reg No: {currentDoc.extracted.regNo} &bull; SRO: {currentDoc.extracted.sro}
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

              <div className="text-center pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Sparkles className="w-3 h-3" /> GPT-4 Legal OCR Verified
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
                        <span className="font-bold theme-text-primary">1998 &mdash; Original Allotment (DDA)</span>
                        <span className="theme-text-muted font-mono">Reg: #1249</span>
                      </div>
                      <p className="text-xs theme-text-secondary">
                        DLF Housing Development &rarr; <strong className="text-blue-600 dark:text-blue-400">Sunil K. Sharma</strong>
                      </p>
                      <p className="text-[11px] theme-text-muted">
                        Consideration: Rs. 18,50,000 &bull; SRO VI Delhi
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
                        Sunil K. Sharma &rarr; <strong className="text-emerald-600 dark:text-emerald-400">Ajay Kumar (Current Borrower)</strong>
                      </p>
                      <p className="text-[11px] theme-text-muted">
                        Consideration: Rs. 85,00,000 &bull; Stamp Duty Paid: Rs. 5,10,000 &bull; SRO VI-A Pitampura
                      </p>
                    </div>
                  </div>

                  {/* Node 3: Current Mortgage Proposed */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                    <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold theme-text-primary">2026 &mdash; Proposed Equitable Mortgage</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono">Axis Bank</span>
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
                    <span className="theme-text-primary font-medium">Delhi DORIS / SRO Pitampura</span>
                  </div>
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Index II Registration No:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">8472 / 2020</span>
                  </div>
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Owner Recorded in SRO:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ajay Kumar</span>
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

            {/* Tab 5: Live TSR / WOPI Word Editor */}
            {activeTab === 'TSR_REPORT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold theme-text-primary">Title Search Report (TSR) Generator</h3>
                    <p className="text-xs theme-text-secondary">Institutional Bank Format &mdash; Axis Bank Standard</p>
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
                    <p className="text-[11px] theme-text-muted font-mono">File Ref: TSR-2026-DL-349 &bull; Date: 30-Aug-2026</p>
                  </div>
                  <p>
                    <strong>1. Opinion on Title:</strong> In our professional legal opinion, the Title of the Mortgagor/Borrower <strong className="theme-text-primary">Mr. Ajay Kumar</strong> to the schedule property described hereunder is <strong>CLEAR, VALID, MARKETABLE, AND UNENCUMBERED</strong>.
                  </p>
                  <p>
                    <strong>2. Creation of Charge:</strong> The Bank may safely proceed with the creation of an Equitable Mortgage by Deposit of Original Registered Sale Deed No. 8472 dated 14-Aug-2020 along with parent allotment deed of 1998.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
