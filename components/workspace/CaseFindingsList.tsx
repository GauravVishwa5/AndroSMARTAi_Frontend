'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ExternalLink,
  Filter,
  RefreshCw,
  Search,
  Check,
  Ban,
  Clock,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CaseFinding, FindingSeverity, FindingStatus } from '@/types/enterprise';
import { requestsApi } from '@/lib/api/requests';

interface CaseFindingsListProps {
  requestId: string;
  findings: CaseFinding[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onJumpToCitation?: (documentId?: string | null, pageNumber?: number | null) => void;
  onFindingStatusChanged?: (findingId: string, newStatus: FindingStatus) => void;
}

export const CaseFindingsList: React.FC<CaseFindingsListProps> = ({
  requestId,
  findings,
  isLoading = false,
  onRefresh,
  onJumpToCitation,
  onFindingStatusChanged,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'CRITICAL_HIGH' | 'RESOLVED' | 'WAIVED'>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Modal state for resolving / waiving
  const [activeModalFinding, setActiveModalFinding] = useState<CaseFinding | null>(null);
  const [actionTargetStatus, setActionTargetStatus] = useState<FindingStatus>('RESOLVED');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Counts
  const totalCount = findings.length;
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL' && f.status === 'OPEN').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH' && f.status === 'OPEN').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM' && f.status === 'OPEN').length;
  const openCount = findings.filter((f) => f.status === 'OPEN').length;
  const resolvedCount = findings.filter((f) => f.status === 'RESOLVED').length;
  const waivedCount = findings.filter((f) => f.status === 'WAIVED').length;

  // Filter logic
  const filteredFindings = findings.filter((f) => {
    // Status filter
    if (filterStatus === 'OPEN' && f.status !== 'OPEN') return false;
    if (filterStatus === 'RESOLVED' && f.status !== 'RESOLVED') return false;
    if (filterStatus === 'WAIVED' && f.status !== 'WAIVED') return false;
    if (filterStatus === 'CRITICAL_HIGH') {
      if (f.status !== 'OPEN') return false;
      if (f.severity !== 'CRITICAL' && f.severity !== 'HIGH') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = f.title?.toLowerCase().includes(q);
      const matchDesc = f.description?.toLowerCase().includes(q);
      const matchCat = f.category?.toLowerCase().includes(q);
      const matchDoc = (f.document_id || f.document_name || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat || matchDoc;
    }

    return true;
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      await requestsApi.syncFindings(requestId);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error('Failed to sync findings:', e);
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenActionModal = (finding: CaseFinding, status: FindingStatus) => {
    setActiveModalFinding(finding);
    setActionTargetStatus(status);
    setResolutionNotes(finding.resolution_notes || '');
    setActionError(null);
  };

  const handleSubmitResolution = async () => {
    if (!activeModalFinding) return;
    setIsSubmittingAction(true);
    setActionError(null);
    try {
      await requestsApi.updateFindingStatus(
        requestId,
        activeModalFinding.id,
        actionTargetStatus,
        resolutionNotes
      );
      if (onFindingStatusChanged) {
        onFindingStatusChanged(activeModalFinding.id, actionTargetStatus);
      }
      setActiveModalFinding(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || 'Failed to update finding status');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const getSeverityBadge = (sev: FindingSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <ShieldAlert className="w-3 h-3" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <AlertTriangle className="w-3 h-3" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Metric Chips Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <div className="p-2.5 rounded-lg theme-surface border shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Defects</span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">{totalCount}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 shadow-sm">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Critical</span>
          <div className="text-xl font-extrabold text-rose-700 dark:text-rose-300">{criticalCount}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 shadow-sm">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">High Priority</span>
          <div className="text-xl font-extrabold text-amber-700 dark:text-amber-300">{highCount}</div>
        </div>
        <div className="p-2.5 rounded-lg theme-surface border shadow-sm">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Medium / Low</span>
          <div className="text-xl font-extrabold text-blue-700 dark:text-blue-300">{mediumCount}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Resolved</span>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{resolvedCount}</div>
        </div>
        <div className="p-2.5 rounded-lg theme-surface border shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Waived</span>
          <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300">{waivedCount}</div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Sync */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl theme-surface border shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('OPEN')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'OPEN'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Open ({openCount})
          </button>
          <button
            onClick={() => setFilterStatus('CRITICAL_HIGH')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'CRITICAL_HIGH'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Critical & High ({criticalCount + highCount})
          </button>
          <button
            onClick={() => setFilterStatus('RESOLVED')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'RESOLVED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
          <button
            onClick={() => setFilterStatus('WAIVED')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'WAIVED'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Waived ({waivedCount})
          </button>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({totalCount})
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          <div className="relative min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings, acts, docs..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            onClick={handleSync}
            disabled={syncing || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer disabled:opacity-50"
            title="Re-extract and sync findings from source documents"
          >
            <Sparkles className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Findings List Matrix */}
      {filteredFindings.length === 0 ? (
        <div className="p-12 text-center rounded-xl theme-surface border shadow-sm space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Findings in this View
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {filterStatus === 'CRITICAL_HIGH'
              ? 'No critical or high severity defects open for this property.'
              : 'All canonical legal and technical findings match the current filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredFindings.map((finding) => {
            const isResolved = finding.status === 'RESOLVED';
            const isWaived = finding.status === 'WAIVED';

            return (
              <div
                key={finding.id}
                className={`p-3.5 rounded-xl theme-surface border shadow-sm transition-all ${
                  finding.severity === 'CRITICAL' && finding.status === 'OPEN'
                    ? 'border-rose-300 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/10'
                    : isResolved
                    ? 'border-emerald-200 dark:border-emerald-900/40 opacity-80'
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  {/* Left content */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getSeverityBadge(finding.severity)}

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                        {finding.category || 'COLLATERAL'}
                      </span>

                      {/* Status indicator */}
                      {isResolved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3 h-3" /> Resolved
                        </span>
                      )}
                      {isWaived && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <Ban className="w-3 h-3" /> Waived
                        </span>
                      )}

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {finding.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {finding.description}
                    </p>

                    {/* Resolution Notes Display */}
                    {(finding.resolution_notes || finding.resolved_by) && (
                      <div className="mt-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                          <MessageSquare className="w-3 h-3" />
                          <span>
                            {isResolved ? 'Resolution Recorded' : 'Waiver Justification'}
                            {finding.resolved_by ? ` by ${finding.resolved_by}` : ''}
                            {finding.resolved_at ? ` on ${new Date(finding.resolved_at).toLocaleDateString()}` : ''}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          &ldquo;{finding.resolution_notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Actions & 1-Click Citation Jump */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                    {/* 1-Click Citation Badge */}
                    {(finding.document_id || finding.document_name || finding.page_number) && (
                      <button
                        onClick={() =>
                          onJumpToCitation &&
                          onJumpToCitation(finding.document_id || finding.document_name, finding.page_number)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer shadow-xs"
                        title="Jump to cited source document and page in viewer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="truncate max-w-[140px]">
                          {finding.document_name || finding.document_id || 'Document'}
                          {finding.page_number ? ` : p.${finding.page_number}` : ''}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </button>
                    )}

                    {/* Action buttons (Resolve / Waive / Reopen) */}
                    <div className="flex items-center gap-1">
                      {finding.status === 'OPEN' ? (
                        <>
                          <button
                            onClick={() => handleOpenActionModal(finding, 'RESOLVED')}
                            className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleOpenActionModal(finding, 'WAIVED')}
                            className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all cursor-pointer"
                          >
                            Waive
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenActionModal(finding, 'OPEN')}
                          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Resolve / Waive / Reopen Finding ──────────────── */}
      {activeModalFinding && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-5 rounded-2xl theme-surface border shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {actionTargetStatus === 'RESOLVED'
                    ? 'Resolve Collateral Defect'
                    : actionTargetStatus === 'WAIVED'
                    ? 'Record Risk Waiver'
                    : 'Reopen Finding'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalFinding(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {activeModalFinding.title}
              </span>
              <p className="text-slate-500 line-clamp-2">{activeModalFinding.description}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {actionTargetStatus === 'RESOLVED'
                  ? 'Legal Justification / Rectification Notes *'
                  : actionTargetStatus === 'WAIVED'
                  ? 'Credit Exception / Waiver Authorization Notes *'
                  : 'Reopening Reason *'}
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder={
                  actionTargetStatus === 'RESOLVED'
                    ? 'Enter how this defect was cured (e.g., supplementary deed registered on 12/04, tax challan verified)...'
                    : 'Enter committee sanction reference, LTV adjustment, or senior management approval details...'
                }
                rows={4}
                className="w-full p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
              <span className="text-[10px] text-slate-400">
                This resolution note will be committed to the immutable audit trail and recalculate the collateral gate.
              </span>
            </div>

            {actionError && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
                {actionError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModalFinding(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResolution}
                disabled={isSubmittingAction || !resolutionNotes.trim()}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shadow-md disabled:opacity-50 ${
                  actionTargetStatus === 'RESOLVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionTargetStatus === 'WAIVED'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmittingAction ? 'Recording...' : `Confirm ${actionTargetStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseFindingsList;
