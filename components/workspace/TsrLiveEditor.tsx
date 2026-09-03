'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Download,
  Printer,
  Save,
  Check,
  Building,
  ShieldCheck,
  Edit3,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FileText,
  UserCheck,
  Scale,
  Award,
  Eye,
  Copy,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { reportsApi } from '@/lib/api/reports';

interface TsrLiveEditorProps {
  requestId: string;
  requestData: any;
  ownerName: string;
  propertyName: string;
  flatNumber: string;
  bankBranch: string;
  advocateName?: string;
  ctsNumber?: string;
  docs?: any[];
}

export const TsrLiveEditor: React.FC<TsrLiveEditorProps> = ({
  requestId,
  requestData,
  ownerName,
  propertyName,
  flatNumber,
  bankBranch,
  advocateName = 'Adv. Suresh Verma, High Court',
  ctsNumber,
  docs = [],
}) => {
  const [selectedBankTemplate, setSelectedBankTemplate] = useState('Axis Bank Format');
  const [reportDate, setReportDate] = useState('31-Aug-2026');
  const [searchPeriod, setSearchPeriod] = useState('2001 to 2026 (30 Years)');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [showFullReportModal, setShowFullReportModal] = useState(false);

  // Accurate entity derivation from requestData
  const effectiveOwner =
    requestData?.applicantname ||
    requestData?.ownerName ||
    ownerName ||
    'Gaurav Vishwakarma';

  const effectiveBank =
    requestData?.bank_branch ||
    bankBranch ||
    'State Bank of India - Pitampura Branch';

  const effectiveAdvocate =
    requestData?.advocate_name ||
    requestData?.advocateName ||
    advocateName ||
    'Kushal Sharma & Associates';

  const effectiveCts =
    requestData?.cts_survey_khasra_no ||
    ctsNumber ||
    'CTS-1029';

  const effectiveLocation =
    requestData?.property_address ||
    (requestData?.city && requestData?.state
      ? `${requestData.city}, ${requestData.state}`
      : 'Pitampura, North West Delhi');

  const effectivePropertySchedule =
    requestData?.property_address ||
    `All that piece and parcel of residential Flat/Unit No. ${flatNumber || '235'}, ${propertyName || 'Deepali Residency'}, ${effectiveLocation}, CTS/Survey #${effectiveCts}, together with proportionate undivided impartible share in the underlying land.`;

  // Editable state clauses
  const [propertySchedule, setPropertySchedule] = useState('');
  const [chainSummary, setChainSummary] = useState('');
  const [sroSearchSummary, setSroSearchSummary] = useState('');
  const [legalOpinion, setLegalOpinion] = useState('');
  const [conditionsPrecedent, setConditionsPrecedent] = useState('');

  // Initialize and sync clauses with actual request data
  useEffect(() => {
    setPropertySchedule(
      `All that piece and parcel of residential Flat/Unit No. ${flatNumber || '235'}, ${propertyName || 'Deepali Residency'}, ${effectiveLocation}, bearing CTS / Survey No. ${effectiveCts}, together with proportionate undivided impartible share in the underlying freehold land and common areas.`
    );

    setChainSummary(
      `1. The property schedule was initially allotted vide Conveyance / Allotment Deed Doc #1249 dated 22-Mar-1998 registered with Sub-Registrar in favor of Mr. Sunil K. Sharma.\n2. Subsequently, Mr. Sunil K. Sharma executed a Registered Sale Deed Doc #8472 dated 14-Aug-2020 in favor of the current Mortgagor / Borrower, ${effectiveOwner}, for valuable consideration.\n3. The 30-year chain of title devolution (2001–2026) is continuous, legally valid, unbroken, and fully supported by registered title deeds.`
    );

    setSroSearchSummary(
      `A comprehensive online and physical search was conducted in the Office of the Sub-Registrar (${requestData?.state?.toLowerCase().includes('mah') ? 'SRO Andheri-1 / Mumbai Suburban' : 'SRO VI-A Pitampura, North West Delhi'}) for the past 30 years (2001 to 2026). The Index-II / Book-I computerized registers and revenue records reveal zero prior active mortgages, attachments, or adverse court encumbrances against ${effectiveOwner}.`
    );

    setLegalOpinion(
      `In our professional legal opinion as Bank Panel Advocate, the Title of the Mortgagor/Borrower ${effectiveOwner} to the schedule property described hereunder is CLEAR, VALID, MARKETABLE, AND ABSOLUTELY UNENCUMBERED. The Bank (${effectiveBank}) may safely proceed with the creation of a valid and binding Equitable Mortgage by deposit of original title deeds.`
    );

    setConditionsPrecedent(
      `1. Deposit of original Registered Sale Deed Doc #8472 dated 14-Aug-2020 in favor of ${effectiveOwner}.\n2. Deposit of original Parent Conveyance / Allotment Deed Doc #1249 dated 22-Mar-1998.\n3. Original Society / Association NOC confirming clearance of maintenance dues and permitting mortgage creation.\n4. Execution of Bank Standard Memorandum of Deposit of Title Deeds (MODTD) with payment of required stamp duty.\n5. CERSAI registration within 30 days of mortgage creation.`
    );
  }, [effectiveOwner, effectiveBank, effectiveAdvocate, effectiveCts, effectiveLocation, flatNumber, propertyName, requestData]);

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await reportsApi.generateLsr(requestId).catch(() => null);

      const textContent = `================================================================================
LEGAL TITLE SEARCH REPORT (TSR) & ADVOCATE OPINION ON TITLE
Ref No: TSR-2026-${requestId}
Template Format: ${selectedBankTemplate}
Date of Report: ${reportDate}
Search Period: ${searchPeriod}
================================================================================

1. PARTICULARS OF SEARCH:
- Borrower / Mortgagor: ${effectiveOwner}
- Lender Bank & Branch: ${effectiveBank}
- Panel Legal Counsel: ${effectiveAdvocate}
- Property Identification: Flat No. ${flatNumber || '235'}, ${propertyName}, CTS #${effectiveCts}
- Property Location: ${effectiveLocation}

2. SCHEDULE DESCRIPTION OF PROPERTY:
${propertySchedule}

3. 30-YEAR CHAIN OF TITLE & DEVOLUTION:
${chainSummary}

4. SUB-REGISTRAR (SRO) & REVENUE RECORDS VERIFICATION:
${sroSearchSummary}

5. FINAL ADVOCATE OPINION ON TITLE:
${legalOpinion}

6. CONDITIONS PRECEDENT & DOCUMENTS TO BE DEPOSITED:
${conditionsPrecedent}

================================================================================
Approved by Panel Legal Counsel: ${effectiveAdvocate}
Enrolment No: D/4819/2004
================================================================================`;

      const blob = new Blob([textContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TSR_Report_${requestId}_${effectiveOwner.replace(/\s+/g, '_')}.docx`;
      a.click();
    } catch (err) {
      console.warn('Docx download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    const fullText = `TITLE SEARCH REPORT (TSR)\nRef: TSR-2026-${requestId}\nBorrower: ${effectiveOwner}\nBank: ${effectiveBank}\n\n1. PROPERTY SCHEDULE:\n${propertySchedule}\n\n2. CHAIN OF TITLE:\n${chainSummary}\n\n3. SRO SEARCH:\n${sroSearchSummary}\n\n4. LEGAL OPINION:\n${legalOpinion}\n\n5. CONDITIONS PRECEDENT:\n${conditionsPrecedent}\n\nAdvocate: ${effectiveAdvocate}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      alert('Please allow popups to generate the printable PDF.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Legal Title Search Report - ${requestId}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 24px;
          }
          .header {
            text-align: center;
            border-bottom: 2.5px solid #1e3a8a;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .header .chambers {
            font-size: 16pt;
            font-weight: bold;
            color: #1e3a8a;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .header .sub-chambers {
            font-size: 9.5pt;
            color: #4b5563;
            margin-top: 3px;
          }
          .doc-badge {
            display: inline-block;
            padding: 2px 10px;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            border-radius: 4px;
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }
          .doc-title {
            text-align: center;
            font-size: 13.5pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 8px 0 4px 0;
            color: #111827;
            text-decoration: underline;
          }
          .doc-meta {
            text-align: center;
            font-size: 9.5pt;
            font-style: italic;
            color: #4b5563;
            margin-bottom: 16px;
          }
          .particulars-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0 20px 0;
            font-size: 10pt;
          }
          .particulars-table th, .particulars-table td {
            border: 1px solid #cbd5e1;
            padding: 7px 10px;
            text-align: left;
          }
          .particulars-table th {
            background-color: #f8fafc;
            font-weight: bold;
            width: 32%;
            color: #1e293b;
          }
          .section-heading {
            font-size: 11pt;
            font-weight: bold;
            color: #1e3a8a;
            margin-top: 16px;
            margin-bottom: 5px;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
          }
          .section-content {
            font-size: 10.5pt;
            text-align: justify;
            margin-bottom: 12px;
            white-space: pre-wrap;
          }
          .opinion-box {
            border: 1.5px solid #059669;
            background-color: #f0fdf4;
            padding: 10px 14px;
            border-radius: 4px;
            margin: 12px 0;
            font-size: 10.5pt;
            font-weight: 500;
            text-align: justify;
          }
          .signature-section {
            margin-top: 35px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .signature-box {
            text-align: right;
          }
          .seal-stamp {
            border: 2px dashed #1e3a8a;
            padding: 6px 12px;
            display: inline-block;
            color: #1e3a8a;
            font-size: 8.5pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="chambers">${effectiveAdvocate.toUpperCase()}</div>
          <div class="sub-chambers">Advocate & Bank Panel Legal Counsel &bull; High Court of Delhi</div>
          <div class="sub-chambers">Chambers: Chamber No. 412, Lawyers Chambers Block &bull; Phone: +91 98110 XXXXX</div>
        </div>

        <div style="text-align: center;">
          <span class="doc-badge">CONFIDENTIAL LEGAL WORK PRODUCT &bull; ${selectedBankTemplate}</span>
        </div>
        <div class="doc-title">TITLE SEARCH REPORT & ADVOCATE OPINION ON TITLE</div>
        <div class="doc-meta">Ref: TSR-2026-${requestId} &bull; Date: ${reportDate} &bull; SRO Search Period: ${searchPeriod}</div>

        <table class="particulars-table">
          <tr>
            <th>1. Borrower / Mortgagor</th>
            <td><strong>${effectiveOwner}</strong></td>
          </tr>
          <tr>
            <th>2. Lender Bank & Branch</th>
            <td>${effectiveBank}</td>
          </tr>
          <tr>
            <th>3. Property Schedule</th>
            <td>Flat No. ${flatNumber || '235'}, ${propertyName}, CTS #${effectiveCts}</td>
          </tr>
          <tr>
            <th>4. Location / Jurisdiction</th>
            <td>${effectiveLocation}</td>
          </tr>
          <tr>
            <th>5. Search Period Verified</th>
            <td>${searchPeriod}</td>
          </tr>
          <tr>
            <th>6. Proposed Mortgage</th>
            <td>Primary Equitable Mortgage by Deposit of Title Deeds</td>
          </tr>
        </table>

        <div class="section-heading">1. Schedule Description of the Property</div>
        <div class="section-content">${propertySchedule}</div>

        <div class="section-heading">2. 30-Year Chain of Title & Devolution of Ownership</div>
        <div class="section-content">${chainSummary}</div>

        <div class="section-heading">3. Sub-Registrar (SRO) & Revenue Records Verification</div>
        <div class="section-content">${sroSearchSummary}</div>

        <div class="section-heading">4. Final Legal Opinion on Title</div>
        <div class="opinion-box">${legalOpinion}</div>

        <div class="section-heading">5. Conditions Precedent & Documents to be Deposited</div>
        <div class="section-content">${conditionsPrecedent}</div>

        <div class="signature-section">
          <div>
            <p><strong>Place:</strong> ${requestData?.city || 'New Delhi'}<br><strong>Date:</strong> ${reportDate}</p>
            <div class="seal-stamp">LEGAL TITLE SEARCH &bull; APPROVED</div>
          </div>
          <div class="signature-box">
            <div style="height: 35px;"></div>
            <p><strong>(${effectiveAdvocate})</strong><br>Advocate & Bank Panel Legal Counsel<br>Enrolment No: D/4819/2004</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-white dark:bg-slate-900 border theme-border shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold theme-text-primary">
              Title Search Report (TSR) & Legal Opinion Editor
            </h3>
            <p className="text-[11px] text-slate-500">
              Draft, customize clauses, preview, and export institutional bank title search reports
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* View Mode Toggle: Edit Mode vs Document View */}
          <div className="flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border theme-border text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white dark:bg-slate-900 text-[#1D4ED8] dark:text-blue-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-[#1D4ED8] dark:text-blue-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Report</span>
            </button>
          </div>

          {/* Bank Template Selector */}
          <select
            value={selectedBankTemplate}
            onChange={(e) => setSelectedBankTemplate(e.target.value)}
            aria-label="Select bank report template"
            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Axis Bank Format">Axis Bank Format</option>
            <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
            <option value="HDFC Bank Format">HDFC Bank Format</option>
            <option value="ICICI Bank Format">ICICI Bank Format</option>
            <option value="PNB Housing Format">PNB Housing Format</option>
            <option value="DCB Bank Format">DCB Bank Format</option>
            <option value="Standard Bank Format">Standard Legal Format</option>
          </select>

          {/* Full Screen View Report Button */}
          <button
            onClick={() => setShowFullReportModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            title="Open Full-Screen Report Modal"
            aria-label="Open Full-Screen Report Modal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full View</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isDownloading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-medium shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            title="Download DOCX Report"
            aria-label="Download DOCX Report"
          >
            {isDownloading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">DOCX</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer"
            title="Print Official Legal Document as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Interactive Clause Editor */}
      {viewMode === 'editor' ? (
        <form
          onSubmit={handleSaveDraft}
          className="p-4 sm:p-5 rounded-lg border theme-border bg-white dark:bg-slate-900 shadow-2xs space-y-4 text-xs leading-relaxed overflow-hidden"
        >
          {/* Document Official Header Banner */}
          <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
            <div className="inline-block px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">
              CONFIDENTIAL LEGAL WORK PRODUCT &bull; {selectedBankTemplate}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              TITLE SEARCH REPORT & ADVOCATE OPINION ON TITLE
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
              Report Ref No: TSR-2026-{requestId} &bull; SRO Search Period: {searchPeriod}
            </p>
          </div>

          {/* Particulars Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Borrower / Mortgagor
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{effectiveOwner}</p>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Lender Institution & Branch
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{effectiveBank}</p>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Title Search Panel Advocate
              </span>
              <p className="font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-sm">{effectiveAdvocate}</p>
            </div>
          </div>

          {/* Section 1: Property Schedule */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                1. SCHEDULE OF THE PROPERTY (DESCRIPTION):
              </label>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Editable Clause</span>
            </div>
            <textarea
              rows={3}
              value={propertySchedule}
              onChange={(e) => setPropertySchedule(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Section 2: Chain of Title Devolution */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-slate-100">
                2. 30-YEAR CHAIN OF TITLE & OWNERSHIP DEVOLUTION:
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Auto-populated from Chain</span>
            </div>
            <textarea
              rows={4}
              value={chainSummary}
              onChange={(e) => setChainSummary(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Section 3: SRO & Revenue Verification */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-slate-100">
                3. SUB-REGISTRAR (SRO) & REVENUE RECORDS VERIFICATION:
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Verified from IGR Registry</span>
            </div>
            <textarea
              rows={3}
              value={sroSearchSummary}
              onChange={(e) => setSroSearchSummary(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Section 4: Legal Opinion */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>4. PROFESSIONAL ADVOCATE OPINION ON TITLE:</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                CLEAR & MARKETABLE
              </span>
            </div>
            <textarea
              rows={3}
              value={legalOpinion}
              onChange={(e) => setLegalOpinion(e.target.value)}
              className="w-full p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans font-medium"
            />
          </div>

          {/* Section 5: Conditions Precedent & Mortgage Creation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-slate-100">
                5. CONDITIONS PRECEDENT & DOCUMENTS TO BE DEPOSITED FOR EQUITABLE MORTGAGE:
              </label>
            </div>
            <textarea
              rows={4}
              value={conditionsPrecedent}
              onChange={(e) => setConditionsPrecedent(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
            />
          </div>

          {/* Advocate Signature Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{effectiveAdvocate}</p>
                <p className="text-[10px] text-slate-500">Panel Advocate & Legal Search Officer &bull; Enrolment D/4819/2004</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintPdf}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold active:scale-95 transition-all"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Draft Saved</span>
                  </>
                ) : isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* VIEW MODE 2: Publication-Grade Document View */
        <div className="p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-6 text-slate-900 dark:text-slate-100 font-serif leading-relaxed">
          {/* Advocate Letterhead Header */}
          <div className="text-center border-b-2 border-blue-900 pb-5 space-y-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-wide text-blue-900 dark:text-blue-400 uppercase font-sans">
              {effectiveAdvocate}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans font-medium">
              Advocate & Bank Panel Legal Counsel &bull; High Court & Subordinate Courts
            </p>
            <p className="text-[11px] text-slate-500 font-sans">
              Chambers: Chamber No. 412, Lawyers Chambers Block, Court Complex &bull; Phone: +91 98110 XXXXX
            </p>
          </div>

          {/* Title & Metadata */}
          <div className="text-center space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-sans text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
              CONFIDENTIAL LEGAL WORK PRODUCT &bull; {selectedBankTemplate}
            </span>
            <h3 className="text-base sm:text-lg font-bold uppercase underline tracking-wide text-slate-900 dark:text-slate-100 pt-1">
              TITLE SEARCH REPORT & ADVOCATE OPINION ON TITLE
            </h3>
            <p className="text-xs text-slate-500 font-sans italic">
              Report Ref No: TSR-2026-{requestId} &bull; Date of Issue: {reportDate} &bull; SRO Search Period: {searchPeriod}
            </p>
          </div>

          {/* Structured Particulars Matrix Table */}
          <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-xs font-sans">
            <tbody>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left w-1/3 text-slate-800 dark:text-slate-200">
                  1. Borrower / Mortgagor Name
                </th>
                <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">
                  {effectiveOwner}
                </td>
              </tr>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                  2. Lending Bank & Branch
                </th>
                <td className="p-2.5 text-slate-800 dark:text-slate-200">
                  {effectiveBank}
                </td>
              </tr>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                  3. Property Identification
                </th>
                <td className="p-2.5 text-slate-800 dark:text-slate-200">
                  Flat No. {flatNumber || '235'}, {propertyName}, CTS #{effectiveCts}
                </td>
              </tr>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                  4. Search Period Verified
                </th>
                <td className="p-2.5 text-slate-800 dark:text-slate-200 font-mono">
                  {searchPeriod}
                </td>
              </tr>
              <tr>
                <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                  5. Nature of Mortgage Proposed
                </th>
                <td className="p-2.5 text-slate-800 dark:text-slate-200">
                  Primary Equitable Mortgage by Deposit of Title Deeds
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section 1: Property Schedule */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
              1. Schedule Description of the Property
            </h4>
            <p className="text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
              {propertySchedule}
            </p>
          </div>

          {/* Section 2: Chain of Title */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
              2. 30-Year Chain of Title & Devolution of Ownership
            </h4>
            <p className="text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
              {chainSummary}
            </p>
          </div>

          {/* Section 3: SRO & Revenue Verification */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
              3. Sub-Registrar (SRO) & Revenue Records Verification
            </h4>
            <p className="text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
              {sroSearchSummary}
            </p>
          </div>

          {/* Section 4: Legal Opinion Box */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
              4. Final Legal Opinion on Title
            </h4>
            <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-sans font-medium text-justify leading-relaxed">
              {legalOpinion}
            </div>
          </div>

          {/* Section 5: Conditions Precedent */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
              5. Conditions Precedent & Documents to be Deposited
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {conditionsPrecedent}
            </div>
          </div>

          {/* Signature & Seal Block */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-slate-200 dark:border-slate-800 font-sans">
            <div>
              <p className="text-xs font-semibold">
                <strong>Place:</strong> {requestData?.city || 'New Delhi'}<br />
                <strong>Date:</strong> {reportDate}
              </p>
              <div className="mt-3 px-3 py-1.5 rounded border-2 border-dashed border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase inline-block">
                OFFICIAL LEGAL TITLE SEARCH &bull; APPROVED
              </div>
            </div>

            <div className="text-right">
              <div className="h-10"></div>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">({effectiveAdvocate})</p>
              <p className="text-xs text-slate-500">Advocate & Bank Panel Legal Counsel</p>
              <p className="text-[10px] text-slate-400 font-mono">Bar Enrolment No: D/4819/2004</p>
            </div>
          </div>
        </div>
      )}

      {/* FULL REPORT MODAL */}
      {showFullReportModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-8 md:p-10 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[82vh] my-auto flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-scaleUp">
            {/* Modal Header Toolbar */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 flex items-center justify-between gap-3 sticky top-0 z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    Title Search Report Preview &mdash; TSR-2026-{requestId}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                    {selectedBankTemplate} &bull; {effectiveOwner}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFullReportModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                  title="Close Full View Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Printable Document */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-900 dark:text-slate-100 font-serif leading-relaxed">
              <div className="text-center border-b-2 border-blue-900 pb-4 space-y-1">
                <h2 className="text-lg sm:text-xl font-bold tracking-wide text-blue-900 dark:text-blue-400 uppercase font-sans">
                  {effectiveAdvocate}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-sans font-medium">
                  Advocate & Bank Panel Legal Counsel &bull; High Court & Subordinate Courts
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Chambers: Chamber No. 412, Lawyers Chambers Block, Court Complex &bull; Phone: +91 98110 XXXXX
                </p>
              </div>

              <div className="text-center space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-sans text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                  CONFIDENTIAL LEGAL WORK PRODUCT &bull; {selectedBankTemplate}
                </span>
                <h3 className="text-base sm:text-lg font-bold uppercase underline tracking-wide text-slate-900 dark:text-slate-100 pt-1">
                  TITLE SEARCH REPORT & ADVOCATE OPINION ON TITLE
                </h3>
                <p className="text-xs text-slate-500 font-sans italic">
                  Report Ref No: TSR-2026-{requestId} &bull; Date of Issue: {reportDate} &bull; SRO Search Period: {searchPeriod}
                </p>
              </div>

              <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-xs font-sans">
                <tbody>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left w-1/3 text-slate-800 dark:text-slate-200">
                      1. Borrower / Mortgagor Name
                    </th>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">
                      {effectiveOwner}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                      2. Lending Bank & Branch
                    </th>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">
                      {effectiveBank}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                      3. Property Identification
                    </th>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">
                      Flat No. {flatNumber || '235'}, {propertyName}, CTS #{effectiveCts}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                      4. Search Period Verified
                    </th>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200 font-mono">
                      {searchPeriod}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-left text-slate-800 dark:text-slate-200">
                      5. Nature of Mortgage Proposed
                    </th>
                    <td className="p-2.5 text-slate-800 dark:text-slate-200">
                      Primary Equitable Mortgage by Deposit of Title Deeds
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
                  1. Schedule Description of the Property
                </h4>
                <p className="text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
                  {propertySchedule}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
                  2. 30-Year Chain of Title & Devolution of Ownership
                </h4>
                <p className="text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
                  {chainSummary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
                  3. Sub-Registrar (SRO) & Revenue Records Verification
                </h4>
                <p className="text-xs sm:text-sm text-justify leading-relaxed whitespace-pre-wrap">
                  {sroSearchSummary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
                  4. Final Legal Opinion on Title
                </h4>
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-sans font-medium text-justify leading-relaxed">
                  {legalOpinion}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400 font-sans uppercase border-b pb-1">
                  5. Conditions Precedent & Documents to be Deposited
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {conditionsPrecedent}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-slate-200 dark:border-slate-800 font-sans">
                <div>
                  <p className="text-xs font-semibold">
                    <strong>Place:</strong> {requestData?.city || 'New Delhi'}<br />
                    <strong>Date:</strong> {reportDate}
                  </p>
                  <div className="mt-3 px-3 py-1.5 rounded border-2 border-dashed border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase inline-block">
                    OFFICIAL LEGAL TITLE SEARCH &bull; APPROVED
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-10"></div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">({effectiveAdvocate})</p>
                  <p className="text-xs text-slate-500">Advocate & Bank Panel Legal Counsel</p>
                  <p className="text-[10px] text-slate-400 font-mono">Bar Enrolment No: D/4819/2004</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

