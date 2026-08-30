'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
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
} from 'lucide-react';
import { useOCRStream } from '@/lib/hooks/useOCRStream';
import { useIGRJobProgress } from '@/lib/hooks/useIGRJobProgress';
import { requestsApi } from '@/lib/api/requests';
import { igrApi } from '@/lib/api/igr';
import { reportsApi } from '@/lib/api/reports';

export default function RequestWorkspacePage() {
  const params = useParams();
  const requestId = (params?.id as string) || 'REQ-349';

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCUMENTS' | 'IGR_SEARCH' | 'REPORTS'>('DOCUMENTS');

  // Request State
  const [requestStatus, setRequestStatus] = useState<'Pending' | 'Verified' | 'Rejected'>('Pending');

  // Documents state
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [docs, setDocs] = useState([
    {
      id: 'doc-1',
      name: 'Registered_Sale_Deed_2020.pdf',
      type: 'Sale Deed',
      status: 'clear' as 'clear' | 'pending' | 'rejected',
      ocrStatus: 'done',
      date: 'Aug 30, 2026',
      extracted: {
        vendor: 'Sunil K. Sharma',
        vendee: 'Ajay Kumar',
        date: '14-Aug-2020',
        consideration: 'Rs. 85,00,000',
        propertyDesc: 'House No. 235, Block-B, Deepali, Pitampura, New Delhi',
        cts: 'CTS-1029',
      },
    },
    {
      id: 'doc-2',
      name: 'Society_NOC.pdf',
      type: 'Others(Society NOC)',
      status: 'pending' as 'clear' | 'pending' | 'rejected',
      ocrStatus: 'done',
      date: 'Aug 30, 2026',
      extracted: {
        issuingAuthority: 'Deepali Residents Welfare Association',
        date: '02-Jul-2020',
        status: 'Unconditional NOC for Mortgage',
      },
    },
    {
      id: 'doc-3',
      name: 'Index_II_Receipt.pdf',
      type: 'Index II',
      status: 'clear' as 'clear' | 'pending' | 'rejected',
      ocrStatus: 'done',
      date: 'Aug 30, 2026',
      extracted: {
        regNo: '9945',
        sro: 'SR VI-A - Pitampura',
        marketValue: 'Rs. 92,00,000',
      },
    },
  ]);

  // IGR Scraped Transactions state
  const [scrapeJobId, setScrapeJobId] = useState<string | null>(null);
  const { jobData: scrapeProgress } = useIGRJobProgress(scrapeJobId);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [igrRecords, setIgrRecords] = useState([
    {
      id: 101,
      year: '2020',
      docType: 'LEASE DEED WITH SECURITY',
      propertyDesc: 'House No. 235, Ground Floor, Deepali, Pitampura',
      seller: 'Ajay Kumar',
      buyer: 'Rahul Gupta',
      regNo: '9945',
      aiScore: 98,
      isExcluded: false,
    },
    {
      id: 102,
      year: '2017',
      docType: 'REGISTERED SALE DEED',
      propertyDesc: 'House No. 235, Block-B, Deepali',
      seller: 'Smt. Kamla Devi',
      buyer: 'Ajay Kumar',
      regNo: '4512',
      aiScore: 95,
      isExcluded: false,
    },
    {
      id: 103,
      year: '2012',
      docType: 'MORTGAGE / CHARGE DEED',
      propertyDesc: 'House No. 99, Shakurpur Village',
      seller: 'Unknown Party',
      buyer: 'State Bank of India',
      regNo: '1022',
      aiScore: 14,
      isExcluded: true,
    },
  ]);

  // Report Generation state
  const [isGeneratingLsr, setIsGeneratingLsr] = useState(false);
  const [lsrReady, setLsrReady] = useState(false);
  const [wopiUrl, setWopiUrl] = useState<string | null>(null);

  // Document Verification handlers
  const handleVerifyDoc = (status: 'clear' | 'rejected') => {
    const updated = [...docs];
    updated[selectedDocIndex].status = status;
    setDocs(updated);

    const allClear = updated.every((d) => d.status === 'clear');
    const anyRejected = updated.some((d) => d.status === 'rejected');
    if (allClear) setRequestStatus('Verified');
    else if (anyRejected) setRequestStatus('Rejected');
    else setRequestStatus('Pending');
  };

  const handleVerifyAll = () => {
    const updated = docs.map((d) => ({ ...d, status: 'clear' as const }));
    setDocs(updated);
    setRequestStatus('Verified');
  };

  // Scraper Trigger
  const handleTriggerScrape = async () => {
    try {
      const res = await igrApi.scrapeDelhiV2(requestId);
      setScrapeJobId(res.job_id);
    } catch (e) {
      setScrapeJobId('mock-job-id-349');
    }
  };

  // Report Generation Trigger
  const handleGenerateLsr = async () => {
    setIsGeneratingLsr(true);
    try {
      await reportsApi.generateLsr(requestId);
      setLsrReady(true);
    } catch (e) {
      setLsrReady(true);
    } finally {
      setIsGeneratingLsr(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
              {requestId}
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Deepali Residency — Flat 235-GF</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                requestStatus === 'Verified'
                  ? 'badge-clear'
                  : requestStatus === 'Rejected'
                  ? 'badge-rejected'
                  : 'badge-pending'
              }`}
            >
              {requestStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Owner: <span className="text-white font-medium">Ajay Kumar</span> | Bank: Axis Bank (Pitampura) | State: Delhi (DORIS IGR)
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Verify All Clear</span>
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Report Studio</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'DOCUMENTS', label: '1. Documents & OCR Scrutiny', icon: FileCheck2 },
          { id: 'IGR_SEARCH', label: '2. IGR Land Registry (SCR)', icon: Database },
          { id: 'REPORTS', label: '3. LSR & WOPI Studio', icon: FileText },
          { id: 'OVERVIEW', label: '4. Property Metadata', icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-xs transition-all ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Documents & OCR Scrutiny */}
      {activeTab === 'DOCUMENTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Document File Selector (Left list 3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Attached Documents ({docs.length})</h3>
            {docs.map((doc, idx) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocIndex(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedDocIndex === idx
                    ? 'bg-blue-600/15 border-blue-500/40 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate max-w-[170px]">{doc.name}</span>
                  {doc.status === 'clear' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : doc.status === 'rejected' ? (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[11px] text-indigo-400 mt-1">{doc.type}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                  <span>OCR: {doc.ocrStatus}</span>
                  <span>•</span>
                  <span>{doc.status.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Dual-Pane Viewer & Scrutiny Workspace (9 cols) */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Viewer (7 cols) */}
            <div className="md:col-span-7 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between min-h-[500px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-white font-mono">{docs[selectedDocIndex].name}</span>
                <span className="badge-clear px-2 py-0.5 rounded text-[10px] font-semibold">Searchable PDF Ready</span>
              </div>

              {/* Simulated High-Res PDF Page */}
              <div className="my-auto p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-serif leading-relaxed text-slate-300 space-y-3">
                <p className="font-bold text-center text-white border-b border-slate-800 pb-2">DEED OF ABSOLUTE SALE</p>
                <p>
                  THIS INDENTURE is made this 14th day of August, 2020 BETWEEN Mr. Sunil K. Sharma (Vendor) and Mr. Ajay Kumar (Vendee).
                </p>
                <p>
                  WHEREAS the Vendor is the sole and absolute owner of residential premises situated at House No. 235, Block-B, Deepali, Pitampura, New Delhi (CTS-1029).
                </p>
                <p>
                  AND WHEREAS for total agreed sale consideration of Rs. 85,00,000 (Eighty Five Lakhs), the vendor conveys all right, title and interest to the purchaser free from all encumbrances.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                <span>Page 1 of 8</span>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200">Previous</button>
                  <button className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200">Next</button>
                </div>
              </div>
            </div>

            {/* Right Legal Extraction & Verdict Action Bar (5 cols) */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Structured Extraction</h4>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 text-[11px]">Vendor / Executant:</span>
                    <p className="font-semibold text-white">{docs[selectedDocIndex].extracted.vendor || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Vendee / Claimant:</span>
                    <p className="font-semibold text-white">{docs[selectedDocIndex].extracted.vendee || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Consideration Amount:</span>
                    <p className="font-semibold text-emerald-400">{docs[selectedDocIndex].extracted.consideration || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Property Description:</span>
                    <p className="text-slate-300 text-[11px]">{docs[selectedDocIndex].extracted.propertyDesc || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Scrutiny Verdict Actions */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400">Legal Scrutiny Verdict:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVerifyDoc('clear')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Clear</span>
                  </button>

                  <button
                    onClick={() => handleVerifyDoc('rejected')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Doc</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IGR Land Registry (SCR) */}
      {activeTab === 'IGR_SEARCH' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">IGR Land Registry Search (Years 2001–2026)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Scraped government registration records & encumbrance summary</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all font-serif ${
                    language === 'mr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मराठी
                </button>
              </div>

              <button
                onClick={handleTriggerScrape}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Scrape Job</span>
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Deed Type</th>
                  <th className="py-3 px-4">Property Description</th>
                  <th className="py-3 px-4">First Party (Seller)</th>
                  <th className="py-3 px-4">Second Party (Buyer)</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">AI Relevance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {igrRecords.map((r) => (
                  <tr key={r.id} className={`hover:bg-slate-800/40 ${r.isExcluded ? 'opacity-50' : ''}`}>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">{r.year}</td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-300">{r.docType}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{r.propertyDesc}</td>
                    <td className="py-3.5 px-4 text-white font-medium">{r.seller}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.buyer}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-400">{r.regNo}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.aiScore > 80 ? 'badge-clear' : 'badge-rejected'}`}>
                        {r.aiScore}% Match
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          const updated = igrRecords.map((item) => (item.id === r.id ? { ...item, isExcluded: !item.isExcluded } : item));
                          setIgrRecords(updated);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                          r.isExcluded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {r.isExcluded ? 'Include' : 'Exclude'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LSR Report Studio & WOPI Live Editor */}
      {activeTab === 'REPORTS' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                AI 4-Stream Report Assembly
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">Legal Search Report (LSR) & WOPI Studio</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateLsr}
                disabled={isGeneratingLsr}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
              >
                {isGeneratingLsr ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI LSR Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Embedded WOPI Word Live Editor Container */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden min-h-[500px] flex flex-col justify-between">
            {/* Editor Action Bar */}
            <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">LSR_REQ-349_Title_Clearance.docx</span>
                <span className="badge-clear px-2 py-0.5 rounded text-[10px]">Office Online Active</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download S3 DOCX</span>
                </button>
              </div>
            </div>

            {/* Rendered Live Document Preview */}
            <div className="p-8 max-w-3xl mx-auto my-6 bg-slate-900/90 border border-slate-800 rounded-xl font-serif text-xs leading-relaxed text-slate-200 space-y-4 shadow-2xl">
              <div className="text-center border-b border-slate-800 pb-4 space-y-1">
                <h3 className="text-base font-bold text-white tracking-wide">LEGAL SEARCH REPORT (TITLE INVESTIGATION)</h3>
                <p className="text-[11px] text-slate-400 font-sans">Ref No: LSR/2026/08/349 | Date: August 30, 2026</p>
                <p className="text-[11px] text-slate-300 font-sans">To: The Branch Manager, Axis Bank, Pitampura Branch</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white font-sans text-xs">1. PROPERTY DESCRIPTION:</h4>
                <p className="text-slate-300">
                  Residential Unit No. 235-GF, Ground Floor, Deepali Residency, Block-B, Deepali, Pitampura, New Delhi - 110034 (CTS-1029).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white font-sans text-xs">2. DOCUMENTS SCRUTINIZED:</h4>
                <div className="border border-slate-800 rounded-lg overflow-hidden font-sans text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400">
                      <tr>
                        <th className="p-2">Sr.</th>
                        <th className="p-2">Document Type</th>
                        <th className="p-2">Executant</th>
                        <th className="p-2">Claimant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-2">1</td>
                        <td className="p-2">Registered Sale Deed (14-Aug-2020)</td>
                        <td className="p-2">Sunil K. Sharma</td>
                        <td className="p-2">Ajay Kumar</td>
                      </tr>
                      <tr>
                        <td className="p-2">2</td>
                        <td className="p-2">Society NOC (02-Jul-2020)</td>
                        <td className="p-2">Deepali RWA</td>
                        <td className="p-2">Ajay Kumar</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white font-sans text-xs">3. CHRONOLOGICAL NARRATION OF TITLE:</h4>
                <p className="text-slate-300">
                  We have perused the parent deeds and government search records from the year 2001 to 2026. The vendor Sunil K. Sharma acquired clear title vide registered deed No. 4512 in 2017. All municipal taxes and society dues are cleared.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-sans text-xs font-semibold">
                TITLE CERTIFICATE: In our opinion, the title of Mr. Ajay Kumar to the aforementioned property is CLEAR, MARKETABLE AND FREE FROM ALL ENCUMBRANCES.
              </div>
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-500">
              Live Collaborative WOPI Session • Changes Auto-Saved to S3 Bucket
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Property Metadata */}
      {activeTab === 'OVERVIEW' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Full Bank Intake Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Owner Name</span>
              <p className="font-semibold text-white mt-1">Ajay Kumar</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">CTS Number</span>
              <p className="font-semibold text-white mt-1">CTS-1029</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Case Type</span>
              <p className="font-semibold text-white mt-1">General Resale</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">From Year</span>
              <p className="font-semibold text-white mt-1">2001 (25 Years)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
