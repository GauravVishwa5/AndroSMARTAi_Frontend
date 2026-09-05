'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
  Plus,
  ArrowUpCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReupload?: boolean;
  currentDocName?: string;
  onUpload: (files: File[], docTypes: string[]) => Promise<void>;
}

const COMMON_DOC_TYPES = [
  '✨ Auto-Detect by AI (Recommended)',
  'Sale Deed',
  'Parent Deed / Chain Deed',
  '7/12 Extract (Mutation Entry)',
  'Property Card (PR Card)',
  'Society NOC / Share Certificate',
  'Index II Search Copy',
  'Sanction Plan / Building Approval',
  'Encumbrance Certificate',
  'Mortgage Deed',
  'Other Legal Record',
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  isReupload = false,
  currentDocName,
  onUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; docType: string; previewUrl?: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string; isImage: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesAdded = (files: FileList | null) => {
    if (!files) return;
    setError(null);

    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
    const newItems: { file: File; docType: string; previewUrl?: string }[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowed.includes(ext)) {
        setError(`Unsupported file "${file.name}". Allowed types: PDF, JPG, PNG, DOCX`);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds maximum allowed size of 50 MB.`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        file,
        docType: COMMON_DOC_TYPES[0], // Defaults to '✨ Auto-Detect by AI (Recommended)'
        previewUrl,
      });
    });

    if (isReupload && newItems.length > 0) {
      setSelectedFiles([newItems[0]]);
    } else {
      setSelectedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const item = prev[index];
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
    if (previewFile) {
      setPreviewFile(null);
    }
  };

  const handleDocTypeChange = (index: number, newType: string) => {
    setSelectedFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, docType: newType } : item))
    );
  };

  const handlePreview = (item: { file: File; previewUrl?: string }) => {
    if (!item.previewUrl) return;
    const isImage = item.file.type.startsWith('image/');
    setPreviewFile({
      name: item.file.name,
      url: item.previewUrl,
      isImage,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one document file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const files = selectedFiles.map((s) => s.file);
      const docTypes = selectedFiles.map((s) =>
        s.docType.includes('Auto-Detect') ? 'Auto-Detect' : s.docType
      );
      await onUpload(files, docTypes);
      setSelectedFiles([]);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isReupload ? 'Re-upload / Replace Document' : 'Upload Property Documents'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isReupload && currentDocName
                  ? `Replacing "${currentDocName}"`
                  : 'Files are uploaded and automatically classified & extracted by AI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-7 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10 scale-[0.99]'
                : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={!isReupload}
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              className="hidden"
              onChange={(e) => handleFilesAdded(e.target.files)}
            />
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Click to choose files or drag and drop
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports PDF, Scanned Deeds (JPG, PNG), and DOCX (Up to 50 MB each)
            </p>
          </div>

          {/* Selected Files List with Preview & Delete Actions */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Selected Documents ({selectedFiles.length})</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400">Preview or delete items below</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.file.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {(item.file.size / (1024 * 1024)).toFixed(2)} MB • {item.file.type || 'Document'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Document Type Dropdown */}
                      <select
                        value={item.docType}
                        onChange={(e) => handleDocTypeChange(idx, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {COMMON_DOC_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => handlePreview(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        title="Preview document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete / Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Modal Document Preview Drawer */}
          {previewFile && (
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Preview: {previewFile.name}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Open Full <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-black max-h-64 flex items-center justify-center">
                {previewFile.isImage ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="max-h-60 object-contain mx-auto"
                  />
                ) : (
                  <iframe
                    src={previewFile.url}
                    title={previewFile.name}
                    className="w-full h-60 border-0"
                  />
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || selectedFiles.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading & Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isReupload ? 'Replace Document' : `Upload ${selectedFiles.length} File(s)`}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
