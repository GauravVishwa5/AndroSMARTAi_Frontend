'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileText,
  Sparkles,
  ExternalLink,
  Target,
  X,
  Eye,
  CheckCircle2,
  Layers,
  FileCode,
  Languages,
  Loader2,
  Globe,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

export interface ActiveHighlightEntity {
  key: string;
  label: string;
  value: string;
  category?: string;
  page?: number;
}

interface DocumentViewerProps {
  doc: {
    id: string;
    name: string;
    type: string;
    fileUrl?: string;
    rawText?: string;
    translated_text?: string;
    extracted?: any;
  };
  activeHighlight: ActiveHighlightEntity | null;
  onClearHighlight: () => void;
  onSelectEntityFromDoc?: (entityKey: string, entityValue: string) => void;
  onOpenRawTextTab?: () => void;
  onDocumentTranslated?: (translatedText: string, extractedEntities?: any) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  doc,
  activeHighlight,
  onClearHighlight,
  onSelectEntityFromDoc,
  onOpenRawTextTab,
  onDocumentTranslated,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'DOCUMENT' | 'PDF_EMBED'>('DOCUMENT');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string | null>(doc.translated_text || null);
  const [translationMethod, setTranslationMethod] = useState<string>('');

  const highlightTargetRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to highlighted entity when it changes
  useEffect(() => {
    if (activeHighlight && highlightTargetRef.current) {
      setTimeout(() => {
        highlightTargetRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [activeHighlight]);

  // Handle live translation via backend API
  const handleToggleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedText) {
      setIsTranslated(true);
      return;
    }

    const textToTranslate = doc.rawText || getDocumentLines().join('\n');
    if (!textToTranslate.trim()) return;

    try {
      setIsTranslating(true);
      const res = await requestsApi.translateText(textToTranslate, 'auto', 'en', doc.type);
      if (res && res.translated_text) {
        setTranslatedText(res.translated_text);
        setTranslationMethod(res.method || 'Auto');
        setIsTranslated(true);
        if (onDocumentTranslated) {
          onDocumentTranslated(res.translated_text, res.extracted_entities);
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Clean document text lines or structured fallback text
  const getDocumentLines = () => {
    if (isTranslated && translatedText) {
      return translatedText.split('\n');
    }

    if (doc.rawText && doc.rawText.trim()) {
      return doc.rawText.split('\n');
    }

    // Default template representation for visual clarity
    return [
      `MORTGAGE DEED AGREEMENT`,
      `This Deed of Mortgage is made on ${doc.extracted?.date || '31st August 2026'}.`,
      `Between Borrower: ${doc.extracted?.vendee || 'Mr. Rahul Sharma'}, Residing at Flat 402, Sunshine Heights, Mumbai.`,
      `And Lender: ${doc.extracted?.vendor || 'State Bank of India, Nariman Point Branch, Mumbai'}.`,
      `Property Description: ${doc.extracted?.propertyDesc || 'Flat No 402, 4th Floor, Survey No 142/3, CTS No 589, Village Borivali'}.`,
      `Loan Amount: ${doc.extracted?.consideration || 'Rs. 75,00,000/- (Rupees Seventy Five Lakhs Only)'}.`,
      `Registration No: ${doc.extracted?.regNo || '4589/2026'} dated ${doc.extracted?.date || '31/08/2026'}.`,
      `Sub-Registrar Office: ${doc.extracted?.sro || 'SRO Borivali, Mumbai Suburban'}.`,
      `Stamp Duty Status: ${doc.extracted?.stampDuty || 'Stamp Duty & Registration Fee Paid'}.`,
    ];
  };

  const lines = getDocumentLines();

  // Extract candidate sub-phrases and key search tokens from highlighted value
  const getCandidatePhrases = (highlightVal: string): string[] => {
    if (!highlightVal || !highlightVal.trim()) return [];
    const candidates: string[] = [highlightVal.trim()];

    // Remove common prefixes
    const stripped = highlightVal
      .replace(/^(?:Member|Borrower|Lender|Vendor|CTS|City Survey|Reg under|Property situated at|Property at|Village|Place|Date)\s*[:\-–]?\s*/i, '')
      .replace(/^(?:Mr\.|Mrs\.|Ms\.|Shri|Smt\.|Rs\.?|Flat\s+No\.?)\s*/i, '')
      .trim();
    if (stripped && stripped.length >= 2) {
      candidates.push(stripped);
    }

    // Split compound slash/comma phrases (e.g. "ESTO Co-op / HTH Taey Taras")
    const subparts = stripped.split(/[\/\|,;]/).map((p) => p.trim()).filter((p) => p.length >= 3);
    candidates.push(...subparts);

    // Extract numerical & survey tokens (e.g. "#43", "14341", "31/05/2007", "9(1)")
    const numTokens = stripped.match(/(?:#[0-9]+|[0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4}|[0-9]+(?:\([0-9]+\))?|[0-9,]{3,})/g);
    if (numTokens) {
      candidates.push(...numTokens.map((n) => n.trim()).filter((n) => n.length >= 2));
    }

    // Extract significant name words (> 2 chars)
    const wordTokens = stripped.match(/[A-Za-z\u0900-\u097F]{3,}/g);
    if (wordTokens) {
      candidates.push(...wordTokens.map((w) => w.trim()).filter((w) => !/^(and|the|for|under|per|paid|act|reg)$/i.test(w)));
    }

    return Array.from(new Set(candidates)).sort((a, b) => b.length - a.length);
  };

  // Helper to test if a line contains the highlighted search text
  const doesLineMatchHighlight = (line: string, highlightVal: string): boolean => {
    if (!line || !highlightVal) return false;
    const cleanLine = line.toLowerCase();
    const candidates = getCandidatePhrases(highlightVal);
    return candidates.some((cand) => cand.length >= 2 && cleanLine.includes(cand.toLowerCase()));
  };

  // Render line with interactive highlight spans
  const renderLineWithHighlight = (line: string, lineIndex: number) => {
    if (!activeHighlight || !activeHighlight.value) {
      return (
        <span className="text-slate-800 dark:text-slate-200 select-text leading-relaxed">
          {line}
        </span>
      );
    }

    const highlightVal = activeHighlight.value.trim();
    if (!doesLineMatchHighlight(line, highlightVal)) {
      return (
        <span className="text-slate-800 dark:text-slate-200 select-text leading-relaxed">
          {line}
        </span>
      );
    }

    const candidates = getCandidatePhrases(highlightVal).filter(
      (c) => c.length >= 2 && line.toLowerCase().includes(c.toLowerCase())
    );

    if (candidates.length === 0) {
      return (
        <span className="text-slate-800 dark:text-slate-200 select-text leading-relaxed">
          {line}
        </span>
      );
    }

    const regexPattern = new RegExp(`(${candidates.map(escapeRegExp).join('|')})`, 'gi');
    const parts = line.split(regexPattern);

    return (
      <div
        ref={highlightTargetRef}
        className="relative my-1 p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/40 shadow-xs transition-all duration-300 ring-2 ring-blue-500/30"
      >
        {/* Floating Pinpoint Tag */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-1 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-xs animate-bounce">
          <Target className="w-3 h-3" />
          <span>{activeHighlight.label || 'Highlighted Entity'}</span>
        </div>

        <div className="text-slate-900 dark:text-slate-100 font-medium select-text leading-relaxed">
          {parts.map((part, idx) => {
            const isMatch = candidates.some((c) => c.toLowerCase() === part.toLowerCase());
            if (isMatch) {
              return (
                <mark
                  key={idx}
                  className="bg-amber-300 dark:bg-yellow-400 text-slate-950 font-bold px-1.5 py-0.5 rounded shadow-sm ring-2 ring-amber-400/80 animate-pulse inline-block mx-0.5"
                >
                  {part}
                </mark>
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      </div>
    );
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return (
    <div className="flex-1 flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      {/* Top Document Toolbar */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-xl text-[11px] font-semibold">
          <button
            onClick={() => setViewMode('DOCUMENT')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'DOCUMENT'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Doc</span>
          </button>

          {doc.fileUrl && doc.fileUrl !== '#' && (
            <button
              onClick={() => setViewMode('PDF_EMBED')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'PDF_EMBED'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Native PDF</span>
            </button>
          )}
        </div>

        {/* Middle: Active Highlighting Banner or Translation Toggle */}
        <div className="flex items-center gap-2">
          {/* Translate Button */}
          <button
            onClick={handleToggleTranslate}
            disabled={isTranslating}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isTranslated
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
            }`}
            title="Translate regional language text to English"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Translating...</span>
              </>
            ) : isTranslated ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>English (Translated)</span>
                <span className="text-[10px] text-slate-400 font-normal">| Show Original</span>
              </>
            ) : (
              <>
                <Languages className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Translate to English</span>
              </>
            )}
          </button>

          {activeHighlight && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-medium animate-fadeIn">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>
                Target: <strong>{activeHighlight.label}</strong> ({activeHighlight.value})
              </span>
              <button
                onClick={onClearHighlight}
                className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
                title="Clear Highlight"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Zoom & Orientation Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(60, prev - 15))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1 font-semibold">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(200, prev + 15))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
            title="Rotate 90deg"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Canvas Viewport */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 sm:p-6 overflow-auto bg-slate-100 dark:bg-slate-950 flex justify-center items-start min-h-[450px]"
      >
        {viewMode === 'PDF_EMBED' && doc.fileUrl && doc.fileUrl !== '#' ? (
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
                className="max-w-full h-auto max-h-[85vh] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 bg-white object-contain"
              />
            ) : (
              <iframe
                src={`${doc.fileUrl}#toolbar=1&navpanes=0`}
                title={doc.name}
                className="w-full h-[75vh] min-h-[550px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-xl"
              />
            )}
          </div>
        ) : (
          /* High-Fidelity Interactive Document Paper */
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
            }}
            className="w-full max-w-2xl bg-white text-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-10 font-sans transition-transform duration-200 relative min-h-[550px]"
          >
            {/* Top Document Header Stamp */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono block">
                  Official Legal Record • Book 1 Registration
                </span>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                  {doc.type || 'Mortgage Deed Agreement'}
                </h2>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-300">
                  {doc.extracted?.regNo || 'Doc #4589/2026'}
                </span>
                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                  Page 1 of 1
                </span>
              </div>
            </div>

            {/* Document Body Lines */}
            <div className="space-y-4 text-xs sm:text-sm font-serif leading-relaxed">
              {lines.map((line, idx) => (
                <div key={idx} className="transition-all">
                  {renderLineWithHighlight(line, idx)}
                </div>
              ))}
            </div>

            {/* Bottom Verification & Signature Footnote */}
            <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-[10px] text-slate-500 font-sans">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Execution Authority</span>
                <span>Sub-Registrar Office, Mumbai Jurisdiction</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-700 block mb-1">Digital Extraction</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified & Indexed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span>Mode: {viewMode === 'DOCUMENT' ? 'Interactive Layer' : 'Native Viewer'}</span>
          <span>•</span>
          <span>{lines.length} Document Blocks</span>
        </div>

        {activeHighlight && (
          <button
            onClick={onClearHighlight}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear Highlight</span>
          </button>
        )}
      </div>
    </div>
  );
};
