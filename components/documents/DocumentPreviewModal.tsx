import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Search,
  Maximize2,
  FileCheck,
  Sparkles,
  Layers,
  AlertCircle,
  Play,
  Globe,
  Braces,
  Code,
  FileJson,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  rawText?: string;
  ocrStatus?: string;
  date?: string;
  extracted?: any;
  extracted_json?: any;
  ocrMeta?: {
    total_pages?: number;
    char_count?: number;
    source?: string;
  };
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  requestId?: string;
  onDownload?: (doc: DocumentItem) => void;
  onRetryOcr?: (doc: DocumentItem) => Promise<void> | void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  requestId,
  onDownload,
  onRetryOcr,
}) => {
  const [viewMode, setViewMode] = useState<'SPLIT' | 'PREVIEW_ONLY' | 'RAW_TEXT_ONLY'>('SPLIT');
  const [activeTab, setActiveTab] = useState<'RAW_TEXT' | 'ENTITIES' | 'TRANSLATION'>('RAW_TEXT');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [entityViewMode, setEntityViewMode] = useState<'JSON' | 'CARDS'>('JSON');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRetryingOcr, setIsRetryingOcr] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [localRawText, setLocalRawText] = useState<string>('');
  const [localOcrStatus, setLocalOcrStatus] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleCopyJson = (jsonObj: any) => {
    if (!jsonObj) return;
    navigator.clipboard.writeText(JSON.stringify(jsonObj, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  useEffect(() => {
    if (doc) {
      setLocalRawText(doc.rawText || '');
      setLocalOcrStatus(doc.ocrStatus || (doc.rawText ? 'done' : 'pending'));
    }
  }, [doc]);

  const handleTranslate = async () => {
    const textToTranslate = localRawText || doc?.rawText;
    if (!textToTranslate?.trim() || !doc) return;
    try {
      setIsTranslating(true);
      const res = await requestsApi.translateText(textToTranslate, 'auto', 'en', doc.type);
      if (res?.translated_text) {
        setTranslatedText(res.translated_text);
      }
    } catch (err) {
      console.error('Translation error in modal:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!isOpen || !doc) return null;

  const isPdf = doc.name.toLowerCase().endsWith('.pdf') || doc.fileUrl.toLowerCase().includes('.pdf');
  const isImage =
    doc.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/) ||
    doc.fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp)/);

  const handleCopyRawText = () => {
    const textToCopy = localRawText || doc.rawText;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentRawText = localRawText || doc.rawText || '';

  const filteredRawText = () => {
    if (!currentRawText) return 'No OCR raw text available for this document yet.';
    if (!searchQuery.trim()) return currentRawText;

    const lines = currentRawText.split('\n');
    return lines
      .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
      .join('\n');
  };

  const handleTriggerOcr = async () => {
    setIsRetryingOcr(true);
    setFeedbackMsg(null);
    try {
      if (requestId) {
        const res = await requestsApi.retryDocumentOcr(requestId, doc.id);
        const extracted = res?.document?.raw_text || res?.document?.rawText || '';
        if (extracted) {
          setLocalRawText(extracted);
          setLocalOcrStatus('done');
          setFeedbackMsg('OCR extraction completed successfully!');
        } else {
          setFeedbackMsg('OCR extraction triggered.');
        }
      }
      if (onRetryOcr) {
        await onRetryOcr(doc);
      }
    } catch (err: any) {
      console.error('Failed to trigger OCR:', err);
      setFeedbackMsg(err?.response?.data?.detail || 'Failed to run OCR. Please try again.');
    } finally {
      setIsRetryingOcr(false);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                  {doc.type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                    localOcrStatus === 'done' || (currentRawText && currentRawText.length > 0)
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : isRetryingOcr
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isRetryingOcr ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>OCR RUNNING...</span>
                    </>
                  ) : localOcrStatus === 'done' || (currentRawText && currentRawText.length > 0) ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>OCR DONE</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      <span>OCR PENDING</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {currentRawText
                  ? `${currentRawText.length} characters extracted`
                  : doc.ocrMeta?.char_count
                  ? `${doc.ocrMeta.char_count} characters extracted`
                  : 'Document preview & raw text inspection'}
                {feedbackMsg && (
                  <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                    • {feedbackMsg}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center gap-2">
            {/* Retry / Run OCR Button */}
            <button
              onClick={handleTriggerOcr}
              disabled={isRetryingOcr}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all disabled:opacity-50"
              title="Run or retry OCR extraction on this document"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingOcr ? 'animate-spin' : ''}`} />
              <span>{isRetryingOcr ? 'Extracting...' : currentRawText ? 'Retry OCR' : 'Run OCR'}</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center p-0.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setViewMode('SPLIT')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'SPLIT'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('PREVIEW_ONLY')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'PREVIEW_ONLY'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Document
              </button>
              <button
                onClick={() => setViewMode('RAW_TEXT_ONLY')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === 'RAW_TEXT_ONLY'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Raw Text
              </button>
            </div>

            {/* Direct Link / Download */}
            {doc.fileUrl && doc.fileUrl !== '#' && (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left / Top: Document Viewer */}
          {(viewMode === 'SPLIT' || viewMode === 'PREVIEW_ONLY') && (
            <div
              className={`flex flex-col border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/90 overflow-hidden ${
                viewMode === 'SPLIT' ? 'md:col-span-7' : 'md:col-span-12'
              }`}
            >
              {/* Document Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Rotate 90deg"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {isPdf ? 'PDF Document Viewer' : isImage ? 'Image Scan Viewer' : 'Document File'}
                </div>
              </div>

              {/* Viewport Canvas */}
              <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                {doc.fileUrl && doc.fileUrl !== '#' ? (
                  isPdf ? (
                    <div
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'top center',
                      }}
                      className="w-full h-full min-h-[500px] transition-transform duration-200"
                    >
                      <iframe
                        src={`${doc.fileUrl}#toolbar=1&navpanes=0`}
                        title={doc.name}
                        className="w-full h-full min-h-[550px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white shadow-lg"
                      />
                    </div>
                  ) : isImage ? (
                    <div
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                      className="transition-transform duration-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.fileUrl}
                        alt={doc.name}
                        className="max-h-[650px] max-w-full rounded-xl object-contain shadow-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
                      <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{doc.name}</h4>
                      <p className="text-xs text-slate-500">Document ready for review & download</p>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md hover:bg-blue-500 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Original Document</span>
                      </a>
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center space-y-2 text-slate-500">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs">No file URL attached to this document record.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right / Bottom: Extracted Raw OCR Text & Multi-Tabs */}
          {(viewMode === 'SPLIT' || viewMode === 'RAW_TEXT_ONLY') && (
            <div
              className={`flex flex-col bg-white dark:bg-slate-900 overflow-hidden ${
                viewMode === 'SPLIT' ? 'md:col-span-5' : 'md:col-span-12'
              }`}
            >
              {/* Right Panel Tab Switcher */}
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('RAW_TEXT')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'RAW_TEXT'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Raw OCR Text
                  </button>
                  <button
                    onClick={() => setActiveTab('ENTITIES')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'ENTITIES'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ✨ Structured Data
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('TRANSLATION');
                      if (!translatedText) handleTranslate();
                    }}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      activeTab === 'TRANSLATION'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>English</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyRawText}
                    disabled={!currentRawText}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all disabled:opacity-50"
                    title="Copy full text"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab 1: Raw OCR Text with Search */}
              {activeTab === 'RAW_TEXT' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter keywords in extracted text..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-auto bg-slate-50/50 dark:bg-slate-950/40 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text">
                    {currentRawText ? (
                      filteredRawText()
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 border border-indigo-100 dark:border-indigo-900/50">
                          <Sparkles className="w-8 h-8 opacity-80" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No raw text extracted yet.</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs">
                            Click below to run OCR text extraction immediately.
                          </p>
                        </div>
                        <button
                          onClick={handleTriggerOcr}
                          disabled={isRetryingOcr}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRetryingOcr ? 'animate-spin' : ''}`} />
                          <span>{isRetryingOcr ? 'Extracting OCR Text...' : 'Run OCR Extraction'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Structured Entities / Extracted JSON */}
              {activeTab === 'ENTITIES' && (() => {
                const rawJsonToDisplay =
                  (doc.extracted_json && typeof doc.extracted_json === 'object' && Object.keys(doc.extracted_json).length > 0)
                    ? doc.extracted_json
                    : (doc.extracted && typeof doc.extracted === 'object' && Object.values(doc.extracted).some(Boolean))
                    ? doc.extracted
                    : null;

                const jsonKeyCount = rawJsonToDisplay ? Object.keys(rawJsonToDisplay).length : 0;

                return (
                  <div className="flex-1 p-4 overflow-auto space-y-3 bg-slate-50/40 dark:bg-slate-950/30 flex flex-col">
                    {/* Header with Extracted JSON vs Cards Switcher & Copy Button */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                          <span>Gemini Extracted Fields</span>
                        </span>
                        {jsonKeyCount > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                            {jsonKeyCount} fields
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* View Switcher: JSON vs Cards */}
                        <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold">
                          <button
                            onClick={() => setEntityViewMode('JSON')}
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
                              entityViewMode === 'JSON'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                            title="View Extracted JSON"
                          >
                            <Braces className="w-3 h-3" />
                            <span>Extracted JSON</span>
                          </button>
                          <button
                            onClick={() => setEntityViewMode('CARDS')}
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
                              entityViewMode === 'CARDS'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                            title="View Summary Cards"
                          >
                            <Layers className="w-3 h-3" />
                            <span>Cards</span>
                          </button>
                        </div>

                        {/* Copy JSON Button */}
                        {rawJsonToDisplay && (
                          <button
                            onClick={() => handleCopyJson(rawJsonToDisplay)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-all"
                            title="Copy Extracted JSON to Clipboard"
                          >
                            {copiedJson ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copy JSON</span>
                              </>
                            )}
                          </button>
                        )}

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Content View 1: Extracted JSON View (Default) */}
                    {entityViewMode === 'JSON' && (
                      <div className="flex-1 flex flex-col overflow-hidden space-y-2">
                        {rawJsonToDisplay ? (
                          <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-3.5 font-mono text-[11px] leading-relaxed overflow-auto select-text shadow-inner max-h-[500px]">
                            <pre className="whitespace-pre-wrap break-words">
                              {JSON.stringify(rawJsonToDisplay, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 border border-blue-100 dark:border-blue-900/50">
                              <Braces className="w-8 h-8 opacity-80" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                No extracted JSON available yet.
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs">
                                OCR text must be extracted first to produce structured Gemini JSON.
                              </p>
                            </div>
                            <button
                              onClick={handleTriggerOcr}
                              disabled={isRetryingOcr}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingOcr ? 'animate-spin' : ''}`} />
                              <span>{isRetryingOcr ? 'Extracting...' : 'Run Extraction'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content View 2: Formatted Field Cards View */}
                    {entityViewMode === 'CARDS' && (
                      <div className="space-y-2.5 text-xs overflow-auto flex-1">
                        {doc.extracted?.documentTitle && (
                          <div className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs space-y-1">
                            <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 font-mono">
                              Document Title & Category
                            </span>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {doc.extracted.documentTitle} ({doc.type || 'Legal Document'})
                            </p>
                          </div>
                        )}

                        {/* Authority / Issuing Body (for SRC, Certificates, NOCs) */}
                        {doc.extracted?.authority && (
                          <div className="p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-slate-900 shadow-xs space-y-1">
                            <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 font-mono">
                              Issuing Authority / Society Office
                            </span>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {doc.extracted.authority}
                            </p>
                          </div>
                        )}

                        <div className="p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-900 shadow-xs space-y-1">
                          <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 font-mono">
                            Vendor / Transferor
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.extracted?.vendor || 'Not Specified (Regulatory / Certificate Document)'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-slate-900 shadow-xs space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 font-mono">
                            Vendee / Purchaser / Beneficiary
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.extracted?.vendee || 'Not Specified'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-white dark:bg-slate-900 shadow-xs space-y-1">
                          <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 font-mono">
                            Consideration & Stamp Duty
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.extracted?.consideration || 'Institutional / Legal Terms'}
                            {doc.extracted?.stampDuty ? ` (Stamp Duty: ${doc.extracted.stampDuty})` : ''}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">
                            Property Schedule & CTS
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.extracted?.propertyDesc || 'Property Schedule'}{' '}
                            {doc.extracted?.cts ? `(CTS: ${doc.extracted.cts})` : ''}
                            {doc.extracted?.sro ? ` — ${doc.extracted.sro}` : ''}
                          </p>
                        </div>

                        {doc.extracted?.remarks && (
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">
                              Statutory Remarks & Provisions
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {doc.extracted.remarks}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <span className="text-[9px] font-bold uppercase text-slate-500 font-mono block">
                              Document No
                            </span>
                            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {doc.extracted?.regNo || 'DOC-REG'}
                            </p>
                          </div>
                          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <span className="text-[9px] font-bold uppercase text-slate-500 font-mono block">
                              Execution / Issue Date
                            </span>
                            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {doc.extracted?.date || 'Recorded'}
                            </p>
                          </div>
                        </div>

                        {/* Expandable Raw JSON Accordion inside Cards view */}
                        {rawJsonToDisplay && (
                          <div className="pt-2">
                            <button
                              onClick={() => setEntityViewMode('JSON')}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:bg-blue-100/50 transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <Braces className="w-3.5 h-3.5" />
                                <span>View Full Extracted JSON Tree ({jsonKeyCount} fields)</span>
                              </span>
                              <span className="text-[10px] uppercase font-mono tracking-wider">Expand &rarr;</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Tab 3: English Translation */}
              {activeTab === 'TRANSLATION' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                      <Globe className="w-4 h-4" />
                      <span>Legal English Translation</span>
                    </div>
                    <button
                      onClick={handleTranslate}
                      disabled={isTranslating}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {isTranslating ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                      <span>{isTranslating ? 'Translating...' : 'Re-translate'}</span>
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-auto bg-slate-50/50 dark:bg-slate-950/40 font-serif text-xs leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap select-text">
                    {isTranslating ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-indigo-600">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                        <p className="text-xs font-semibold">Translating legal document to English...</p>
                      </div>
                    ) : translatedText ? (
                      translatedText
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                        <p className="text-xs">Click Re-translate to generate full English translation.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
