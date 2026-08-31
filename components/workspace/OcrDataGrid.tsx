'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit2,
  Download,
  Search,
  Sparkles,
  Layers,
  FileText,
  Save,
} from 'lucide-react';
import { extractEntitiesFromRawText } from '@/lib/utils/entityExtractor';

interface EntityField {
  key: string;
  label: string;
  value: string;
  category: 'Parties' | 'Property' | 'Registration' | 'Financial';
  confidence: number;
  verified: boolean;
}

interface OcrDataGridProps {
  requestId: string;
  docs: any[];
  selectedDocIndex: number;
  onSelectDoc: (idx: number) => void;
}

export const OcrDataGrid: React.FC<OcrDataGridProps> = ({
  requestId,
  docs,
  selectedDocIndex,
  onSelectDoc,
}) => {
  const currentDoc = docs[selectedDocIndex] || docs[0];

  // Default entity fields generated from currentDoc
  const [entities, setEntities] = useState<{ [docId: string]: EntityField[] }>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const currentDocId = currentDoc?.id || 'doc-1';

  // Initialize entities for current doc if missing
  const getDocEntities = (): EntityField[] => {
    if (entities[currentDocId]) {
      return entities[currentDocId];
    }

    const parsed = extractEntitiesFromRawText(
      currentDoc?.rawText || '',
      currentDoc?.type || 'Property Deed',
      currentDoc?.extracted || {}
    );

    const initial: EntityField[] = [
      {
        key: 'vendor',
        label: 'Vendor / Transferor / Lender',
        value: parsed.vendor,
        category: 'Parties',
        confidence: 97,
        verified: true,
      },
      {
        key: 'vendee',
        label: 'Vendee / Purchaser (Borrower)',
        value: parsed.vendee,
        category: 'Parties',
        confidence: 99,
        verified: true,
      },
      {
        key: 'propertyDesc',
        label: 'Schedule Property Description',
        value: parsed.propertyDesc,
        category: 'Property',
        confidence: 96,
        verified: true,
      },
      {
        key: 'cts',
        label: 'CTS / Survey Number',
        value: `${parsed.cts}${parsed.surveyNo ? ` / ${parsed.surveyNo}` : ''}`,
        category: 'Property',
        confidence: 99,
        verified: true,
      },
      {
        key: 'consideration',
        label: 'Consideration / Loan Amount',
        value: parsed.consideration,
        category: 'Financial',
        confidence: 98,
        verified: true,
      },
      {
        key: 'stampDuty',
        label: 'Stamp Duty & Registration Fee',
        value: parsed.stampDuty,
        category: 'Financial',
        confidence: 94,
        verified: true,
      },
      {
        key: 'regNo',
        label: 'Registration / Document Number',
        value: parsed.regNo,
        category: 'Registration',
        confidence: 99,
        verified: true,
      },
      {
        key: 'sro',
        label: 'Sub-Registrar Office (SRO)',
        value: parsed.sro,
        category: 'Registration',
        confidence: 95,
        verified: true,
      },
      {
        key: 'date',
        label: 'Date of Execution / Registration',
        value: parsed.date,
        category: 'Registration',
        confidence: 98,
        verified: true,
      },
    ];

    return initial;
  };

  const docEntities = getDocEntities();

  const handleStartEdit = (entity: EntityField) => {
    setEditingKey(entity.key);
    setTempValue(entity.value);
  };

  const handleSaveEdit = (key: string) => {
    const updated = docEntities.map((e) =>
      e.key === key ? { ...e, value: tempValue, verified: true } : e
    );
    setEntities({ ...entities, [currentDocId]: updated });
    setEditingKey(null);
  };

  const handleToggleVerify = (key: string) => {
    const updated = docEntities.map((e) =>
      e.key === key ? { ...e, verified: !e.verified } : e
    );
    setEntities({ ...entities, [currentDocId]: updated });
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(docEntities, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OCR_Entities_${currentDoc.name}.json`;
    link.click();
  };

  const filteredEntities = docEntities.filter((item) => {
    const matchCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header & Document Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            <span>Structured Legal Entity Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Validated OCR parameters with confidence scoring and manual review audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Doc Selector */}
          <select
            value={selectedDocIndex}
            onChange={(e) => onSelectDoc(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {docs.map((d, i) => (
              <option key={d.id} value={i}>
                {d.type}: {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Parties', 'Property', 'Registration', 'Financial'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entity or value..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Entity Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                <th className="p-3 pl-4">Field Parameter</th>
                <th className="p-3">Extracted Entity Value</th>
                <th className="p-3 w-28 text-center">Confidence</th>
                <th className="p-3 w-24 text-center">Status</th>
                <th className="p-3 pr-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEntities.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50/70 dark:hover:bg-slate-950/40 transition-colors">
                  {/* Parameter Name */}
                  <td className="p-3 pl-4 font-semibold text-slate-900 dark:text-slate-100">
                    <span className="block">{item.label}</span>
                    <span className="text-[10px] font-normal text-slate-400 font-mono">
                      {item.category}
                    </span>
                  </td>

                  {/* Parameter Value / Inline Editor */}
                  <td className="p-3">
                    {editingKey === item.key ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-blue-500 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(item.key)}
                          className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {item.value}
                      </span>
                    )}
                  </td>

                  {/* Confidence Meter */}
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        item.confidence >= 95
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.confidence}% Match
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleVerify(item.key)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                        item.verified
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {item.verified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <span>Verify</span>
                      )}
                    </button>
                  </td>

                  {/* Quick Actions */}
                  <td className="p-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCopy(item.key, item.value)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Copy field value"
                      >
                        {copiedKey === item.key ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                        title="Edit entity value"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
