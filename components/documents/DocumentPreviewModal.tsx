'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Copy,
  Check,
  FileText,
  Search,
  Maximize2,
  FileCheck,
  Sparkles,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  rawText?: string;
  ocrStatus?: string;
  date?: string;
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
  onDownload?: (doc: DocumentItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onDownload,
}) => {
  const [viewMode, setViewMode] = useState<'SPLIT' | 'PREVIEW_ONLY' | 'RAW_TEXT_ONLY'>('SPLIT');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !doc) return null;

  const isPdf = doc.name.toLowerCase().endsWith('.pdf') || doc.fileUrl.toLowerCase().includes('.pdf');
  const isImage =
    doc.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/) ||
    doc.fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp)/);

  const handleCopyRawText = () => {
    if (doc.rawText) {
      navigator.clipboard.writeText(doc.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredRawText = () => {
    if (!doc.rawText) return 'No OCR raw text available for this document yet.';
    if (!searchQuery.trim()) return doc.rawText;

    const lines = doc.rawText.split('\n');
    return lines
      .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
      .join('\n');
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
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                  {doc.type}
                </span>
                {doc.ocrStatus && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      doc.ocrStatus === 'done'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    OCR {doc.ocrStatus.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {doc.ocrMeta?.char_count
                  ? `${doc.ocrMeta.char_count} characters extracted`
                  : doc.rawText
                  ? `${doc.rawText.length} characters extracted`
                  : 'Document preview & raw text inspection'}
              </p>
            </div>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center gap-2">
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

          {/* Right / Bottom: Extracted Raw OCR Text */}
          {(viewMode === 'SPLIT' || viewMode === 'RAW_TEXT_ONLY') && (
            <div
              className={`flex flex-col bg-white dark:bg-slate-900 overflow-hidden ${
                viewMode === 'SPLIT' ? 'md:col-span-5' : 'md:col-span-12'
              }`}
            >
              {/* Raw Text Header Toolbar */}
              <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Extracted Raw OCR Text
                  </span>
                </div>

                <button
                  onClick={handleCopyRawText}
                  disabled={!doc.rawText}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all disabled:opacity-50"
                  title="Copy full extracted text"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Search Inside Raw Text */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords in raw OCR text..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Raw Text Content Box */}
              <div className="flex-1 p-4 overflow-auto bg-slate-50/50 dark:bg-slate-950/40 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text">
                {doc.rawText ? (
                  filteredRawText()
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <FileText className="w-8 h-8 opacity-40" />
                    <p className="text-xs">No raw text extracted for this document yet.</p>
                    <p className="text-[10px] text-slate-500">
                      OCR extraction runs automatically when documents are uploaded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
