'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Languages,
  Loader2,
  Layers,
  X,
  Target,
  FileCheck2,
  Calendar,
  Building2,
  User,
  DollarSign,
  MapPin,
  Globe,
  ExternalLink,
  ChevronRight,
  BookOpen,
  FileCode,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category?: string;
  created_at?: string;
  status?: string;
  fileUrl?: string;
  ocrStatus?: 'pending' | 'processing' | 'done' | 'failed' | string;
  rawText?: string;
  translated_text?: string;
  extracted?: {
    date?: string;
    regNo?: string;
    vendor?: string;
    vendee?: string;
    cts?: string;
    propertyDesc?: string;
    consideration?: string;
    sro?: string;
  };
}

export interface ActiveHighlightEntity {
  key: string;
  label: string;
  value: string;
}

interface DocumentViewerProps {
  doc: DocumentItem | null;
  activeHighlight?: ActiveHighlightEntity | null;
  onClearHighlight?: () => void;
  onSelectEntityFromDoc?: (key: string, value: string) => void;
  onDocumentTranslated?: (translatedText: string, translatedEntities?: Record<string, string>) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  doc,
  activeHighlight,
  onClearHighlight,
  onSelectEntityFromDoc,
  onDocumentTranslated,
}) => {
  const [viewMode, setViewMode] = useState<'DOCUMENT' | 'PDF_EMBED' | 'RAW_TEXT'>('DOCUMENT');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const highlightedLineRef = useRef<HTMLDivElement>(null);

  // If document has a valid native PDF/fileUrl and no text, default to PDF_EMBED
  useEffect(() => {
    if (doc?.fileUrl && doc.fileUrl !== '#' && !doc?.rawText && !doc?.extracted?.vendor) {
      setViewMode('PDF_EMBED');
    }
  }, [doc?.id, doc?.fileUrl, doc?.rawText, doc?.extracted]);

  // Handle translation
  const handleToggleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedText) {
      setIsTranslated(true);
      return;
    }

    if (!doc?.rawText) return;

    setIsTranslating(true);
    try {
      const res = await requestsApi.translateText(doc.rawText, 'auto', 'en', doc.type);
      if (res?.translated_text) {
        setTranslatedText(res.translated_text);
        setIsTranslated(true);
        if (onDocumentTranslated) {
          onDocumentTranslated(res.translated_text, res.extracted_entities);
        }
      }
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayText = useMemo(() => {
    if (isTranslated && translatedText) return translatedText;
    if (doc?.translated_text && isTranslated) return doc.translated_text;
    return doc?.rawText || '';
  }, [doc?.rawText, doc?.translated_text, isTranslated, translatedText]);

  // Clean lines for transcript view
  const lines = useMemo(() => {
    if (!displayText) return [];
    return displayText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }, [displayText]);

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center theme-text-secondary h-full min-h-[450px]">
        <FileText className="w-12 h-12 theme-text-muted mb-2 opacity-60" />
        <p className="text-sm font-semibold theme-text-primary">No Document Selected</p>
        <p className="text-xs theme-text-muted mt-1">Select a document from the list above to view its contents.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full rounded-2xl theme-surface border overflow-hidden shadow-xs">
      {/* Sleek Document Header & Control Bar */}
      <div className="px-3.5 py-2.5 border-b theme-border bg-slate-500/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: View Mode Pills */}
        <div className="flex items-center gap-1 theme-card p-1 rounded-xl border text-xs font-semibold">
          <button
            onClick={() => setViewMode('DOCUMENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'DOCUMENT'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Doc</span>
          </button>

          {doc.fileUrl && doc.fileUrl !== '#' && (
            <button
              onClick={() => setViewMode('PDF_EMBED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'PDF_EMBED'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Native PDF / File</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('RAW_TEXT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'RAW_TEXT'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw OCR</span>
          </button>
        </div>

        {/* Right: Actions (Translate, Highlights, Zoom) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Translate Button */}
          {doc.rawText && (
            <button
              onClick={handleToggleTranslate}
              disabled={isTranslating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isTranslated
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'theme-card border theme-text-secondary hover:theme-text-primary'
              }`}
              title="Translate vernacular Marathi/Hindi text to English"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>Translating...</span>
                </>
              ) : isTranslated ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>English (Translated)</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5 text-blue-500" />
                  <span>Translate to English</span>
                </>
              )}
            </button>
          )}

          {/* Active Highlight Pill */}
          {activeHighlight && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>{activeHighlight.label}</span>
              <button
                onClick={onClearHighlight}
                className="p-0.5 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 theme-card p-1 rounded-xl border">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(60, prev - 15))}
              className="p-1 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 text-xs"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono theme-text-secondary px-1 font-semibold">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(200, prev + 15))}
              className="p-1 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 text-xs"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 text-xs"
              title="Rotate"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 sm:p-6 overflow-auto bg-slate-500/5 flex justify-center items-start min-h-[480px]"
      >
        {/* VIEW 1: Raw Searchable Text */}
        {viewMode === 'RAW_TEXT' ? (
          <div className="w-full max-w-3xl flex flex-col rounded-2xl theme-surface border shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-3 border-b theme-border bg-slate-500/5 flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={rawSearchQuery}
                  onChange={(e) => setRawSearchQuery(e.target.value)}
                  placeholder="Filter keywords in extracted text..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl theme-input border text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  const text = doc.rawText || '';
                  if (text) {
                    navigator.clipboard.writeText(text);
                    setCopiedRaw(true);
                    setTimeout(() => setCopiedRaw(false), 2000);
                  }
                }}
                disabled={!doc.rawText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold theme-card border theme-text-secondary hover:theme-text-primary transition-all disabled:opacity-50"
              >
                {copiedRaw ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed theme-text-primary whitespace-pre-wrap select-text">
              {doc.rawText ? (
                rawSearchQuery.trim() ? (
                  doc.rawText
                    .split('\n')
                    .filter((line: string) => line.toLowerCase().includes(rawSearchQuery.toLowerCase()))
                    .join('\n') || 'No matching lines found for search term.'
                ) : (
                  doc.rawText
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                  <Sparkles className="w-7 h-7 text-blue-500 opacity-60" />
                  <p className="text-xs font-semibold theme-text-primary">No Raw OCR Text Available</p>
                  <p className="text-[11px] theme-text-muted max-w-xs">
                    OCR extraction has not yet generated transcript text for this document.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'PDF_EMBED' && doc.fileUrl && doc.fileUrl !== '#' ? (
          /* VIEW 2: Native PDF or Image */
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
            }}
            className="w-full flex justify-center transition-transform duration-200"
          >
            {/\.(jpe?g|png|webp|gif|bmp)$/i.test(doc.fileUrl || '') || /\.(jpe?g|png|webp|gif|bmp)$/i.test(doc.name || '') ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={doc.fileUrl}
                alt={doc.name}
                className="max-w-full h-auto max-h-[85vh] rounded-2xl shadow-xl border theme-border theme-surface object-contain"
              />
            ) : (
              <iframe
                src={`${doc.fileUrl}#toolbar=1&navpanes=0`}
                title={doc.name}
                className="w-full h-[75vh] min-h-[550px] rounded-2xl border theme-border theme-surface shadow-xl"
              />
            )}
          </div>
        ) : (
          /* VIEW 3: Clean Institutional Document Paper */
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
            }}
            className="w-full max-w-3xl theme-surface theme-text-primary shadow-xl rounded-2xl border theme-border p-6 sm:p-8 font-sans transition-transform duration-200 relative min-h-[550px] space-y-6"
          >
            {/* Document Header */}
            <div className="border-b theme-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono uppercase tracking-wider">
                    {doc.category || 'Land Revenue Registry Record'}
                  </span>
                  {doc.ocrStatus === 'done' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      AI Verified
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold theme-text-primary tracking-tight">
                  {doc.type || 'Legal Deed / Agreement'}
                </h2>
                <p className="text-xs theme-text-muted font-mono">{doc.name}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-xl theme-card border text-xs font-mono font-bold theme-text-primary">
                  {doc.extracted?.regNo || 'Doc Registered'}
                </span>
                <span className="block text-[11px] theme-text-secondary mt-1">
                  {doc.extracted?.date ? `Execution Date: ${doc.extracted.date}` : doc.created_at || 'Case Record'}
                </span>
              </div>
            </div>

            {/* Structured Extracted Legal Summary (Only shown if entities exist) */}
            {(doc.extracted?.vendor || doc.extracted?.vendee || doc.extracted?.propertyDesc || doc.extracted?.consideration) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl border theme-border theme-card space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                    Parties of Deed
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] theme-text-muted block">Transferor / Vendor / Seller:</span>
                      <p className="font-semibold theme-text-primary">{doc.extracted?.vendor || '—'}</p>
                    </div>
                    <div className="pt-1.5 border-t theme-border">
                      <span className="text-[10px] theme-text-muted block">Transferee / Vendee / Purchaser:</span>
                      <p className="font-semibold theme-text-primary">{doc.extracted?.vendee || '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border theme-border theme-card space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    Property & Consideration
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] theme-text-muted block">Property / CTS Description:</span>
                      <p className="font-semibold theme-text-primary truncate">
                        {doc.extracted?.propertyDesc || '—'} {doc.extracted?.cts ? `(${doc.extracted.cts})` : ''}
                      </p>
                    </div>
                    <div className="pt-1.5 border-t theme-border">
                      <span className="text-[10px] theme-text-muted block">Consideration / Loan Amount:</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {doc.extracted?.consideration || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document Transcript & Indexed Clauses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b theme-border">
                <span className="text-xs font-bold uppercase tracking-wider theme-text-secondary font-mono">
                  Document Transcript & Clauses
                </span>
                <span className="text-[10px] theme-text-muted font-mono">
                  {lines.length} Clauses Indexed
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed theme-text-primary max-h-[380px] overflow-y-auto pr-2">
                {lines.length > 0 ? (
                  lines.map((line, idx) => {
                    const isPageDivider = line.startsWith('---') || line.toLowerCase().includes('[page');
                    if (isPageDivider) {
                      return (
                        <div key={idx} className="my-3 flex items-center gap-3">
                          <div className="flex-1 border-t theme-border" />
                          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full theme-card border theme-text-muted uppercase">
                            {line.replace(/[-[\]]/g, '').trim()}
                          </span>
                          <div className="flex-1 border-t theme-border" />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl hover:bg-slate-500/5 transition-colors border border-transparent hover:border-slate-500/10"
                      >
                        <p>{line}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center space-y-2">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-400 opacity-40" />
                    <p className="text-xs font-semibold theme-text-primary">Transcript Ready in Native PDF</p>
                    <p className="text-xs theme-text-muted max-w-sm mx-auto">
                      Switch to the &quot;Native PDF / File&quot; tab in the toolbar above to view the high-resolution original file.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Verification Seal */}
            <div className="pt-4 border-t theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs theme-text-muted">
              <span>Authority: {doc.extracted?.sro || 'Competent Sub-Registrar Office'}</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI Verified & Encrypted
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
