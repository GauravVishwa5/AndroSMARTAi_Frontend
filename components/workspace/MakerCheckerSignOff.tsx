'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  FileCheck2,
  Award,
  Lock,
  UserCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Fingerprint,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { AdvocateReview, AdvocateReviewStatus } from '@/types/enterprise';
import { requestsApi } from '@/lib/api/requests';

interface MakerCheckerSignOffProps {
  requestId: string;
  advocateReview: AdvocateReview | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  currentUserId?: string;
  currentUserName?: string;
}

export const MakerCheckerSignOff: React.FC<MakerCheckerSignOffProps> = ({
  requestId,
  advocateReview,
  isLoading = false,
  onRefresh,
  currentUserId,
  currentUserName,
}) => {
  // Maker Form State
  const [barCouncilId, setBarCouncilId] = useState(
    advocateReview?.maker_bar_council_id || ''
  );
  const [legalOpinion, setLegalOpinion] = useState(
    advocateReview?.opinion_summary || ''
  );
  const [makerNotes, setMakerNotes] = useState(advocateReview?.maker_notes || '');
  const [isSubmittingMaker, setIsSubmittingMaker] = useState(false);
  const [makerError, setMakerError] = useState<string | null>(null);

  // Checker Form State
  const [checkerNotes, setCheckerNotes] = useState('');
  const [isSubmittingChecker, setIsSubmittingChecker] = useState(false);
  const [checkerError, setCheckerError] = useState<string | null>(null);

  const status: AdvocateReviewStatus = advocateReview?.status || 'MAKER_PENDING';

  const statusConfig = {
    MAKER_PENDING: {
      label: 'Maker Opinion Pending',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Clock,
      desc: 'Empanelled Advocate (Maker) must review title devolution and submit preliminary opinion with Bar Council ID.',
    },
    CHECKER_PENDING: {
      label: 'Checker Approval Required',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      icon: ShieldAlert,
      desc: 'Dual Control: Senior Legal Counsel (Checker) must review Maker opinion and verify collateral sanction.',
    },
    APPROVED: {
      label: 'Title Legally Approved',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: ShieldCheck,
      desc: 'Dual-control sign-off complete. Digital seal generated and title clearance certified for institutional lending.',
    },
    REJECTED: {
      label: 'Title Legally Rejected',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      icon: XCircle,
      desc: 'Legal title rejected by Senior Counsel. Uncurable title defects or encumbrance present.',
    },
    RETURNED: {
      label: 'Returned for Rectification',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      icon: RotateCcw,
      desc: 'Checker returned case to Maker with queries. Missing documents or clarifications required.',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  // Check if current user is maker
  const isCurrentUserMaker = Boolean(
    currentUserId &&
      advocateReview?.maker_user_id &&
      currentUserId.toLowerCase() === advocateReview.maker_user_id.toLowerCase()
  );

  const handleSubmitMaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barCouncilId.trim() || !legalOpinion.trim()) {
      setMakerError('Bar Council Enrollment ID and Legal Opinion Summary are required.');
      return;
    }
    setMakerError(null);
    setIsSubmittingMaker(true);
    try {
      await requestsApi.submitAdvocateMaker(requestId, {
        bar_council_id: barCouncilId.trim(),
        legal_opinion: legalOpinion.trim(),
        maker_notes: makerNotes.trim() || undefined,
      });
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setMakerError(err?.response?.data?.detail || 'Failed to submit advocate maker review.');
    } finally {
      setIsSubmittingMaker(false);
    }
  };

  const handleActionChecker = async (action: 'APPROVE' | 'REJECT' | 'RETURN') => {
    if ((action === 'REJECT' || action === 'RETURN') && !checkerNotes.trim()) {
      setCheckerError(`Please enter remarks explaining why the title is being ${action.toLowerCase()}ed.`);
      return;
    }
    setCheckerError(null);
    setIsSubmittingChecker(true);
    try {
      await requestsApi.actionAdvocateChecker(requestId, {
        action,
        checker_notes: checkerNotes.trim() || undefined,
      });
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setCheckerError(err?.response?.data?.detail || `Failed to ${action.toLowerCase()} title.`);
    } finally {
      setIsSubmittingChecker(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Workflow Status Header */}
      <div className={`p-4 rounded-xl border shadow-sm ${statusConfig.bg} ${statusConfig.border}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-xs`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Advocate Maker-Checker Workflow:
                </span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {statusConfig.desc}
              </p>
            </div>
          </div>

          {/* Tamper-Evident Digital Seal Badge */}
          {advocateReview?.digital_seal_hash && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
              <Fingerprint className="w-4 h-4 text-violet-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Tamper-Evident SHA-256 Seal
                </div>
                <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                  {advocateReview.digital_seal_hash}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed State: Institutional Dual Sign-off Certificate */}
      {status === 'APPROVED' && (
        <div className="p-5 rounded-xl theme-surface border border-emerald-300 dark:border-emerald-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Institutional Certificate of Title Clearance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Maker Card */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase text-[10px]">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Primary Investigating Advocate (Maker)</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {advocateReview?.maker_name || 'Advocate'}
              </p>
              <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                Bar Council ID: {advocateReview?.maker_bar_council_id || 'N/A'}
              </p>
              {advocateReview?.maker_submitted_at && (
                <p className="text-[10px] text-slate-400">
                  Certified on: {new Date(advocateReview.maker_submitted_at).toLocaleString()}
                </p>
              )}
              {advocateReview?.opinion_summary && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic">
                  &ldquo;{advocateReview.opinion_summary}&rdquo;
                </div>
              )}
            </div>

            {/* Checker Card */}
            <div className="p-3.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold uppercase text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Approving Senior Legal Counsel (Checker)</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {advocateReview?.checker_name || 'Senior Counsel'}
              </p>
              <p className="text-emerald-600 font-semibold">
                Action: Clear Marketable Title Approved
              </p>
              {advocateReview?.checker_action_at && (
                <p className="text-[10px] text-slate-400">
                  Approved on: {new Date(advocateReview.checker_action_at).toLocaleString()}
                </p>
              )}
              {advocateReview?.checker_notes && (
                <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 italic">
                  &ldquo;{advocateReview.checker_notes}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage 1: Maker Form (Active when MAKER_PENDING or RETURNED) */}
      {(status === 'MAKER_PENDING' || status === 'RETURNED') && (
        <form
          onSubmit={handleSubmitMaker}
          className="p-5 rounded-xl theme-surface border shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 1: Advocate Due Diligence & Opinion Submission (Maker)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Section 24 Dual Control</span>
          </div>

          {status === 'RETURNED' && advocateReview?.checker_notes && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                Returned with Checker Queries:
              </span>
              <p className="text-amber-900 dark:text-amber-200">{advocateReview.checker_notes}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Bar Council Enrollment ID *
              </label>
              <input
                type="text"
                value={barCouncilId}
                onChange={(e) => setBarCouncilId(e.target.value)}
                placeholder="e.g. D/1420/2014 or MAH/8492/2011"
                className="w-full p-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                required
              />
              <span className="text-[10px] text-slate-400">
                Official enrollment ID with Bar Council of State
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Submitting Advocate Name
              </label>
              <input
                type="text"
                value={currentUserName || 'Empanelled Advocate'}
                disabled
                className="w-full p-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Legal Title Opinion Summary *
            </label>
            <textarea
              value={legalOpinion}
              onChange={(e) => setLegalOpinion(e.target.value)}
              placeholder="Record legal finding on title devolution (e.g. 'Vendor holds clear, continuous, marketable and unencumbered title pursuant to registered Sale Deed dated 12/03/2018...')"
              rows={3}
              className="w-full p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Physical Verification & Registry Notes (Optional)
            </label>
            <textarea
              value={makerNotes}
              onChange={(e) => setMakerNotes(e.target.value)}
              placeholder="Notes on physical inspection, original deed verification, or SRO volume inspection..."
              rows={2}
              className="w-full p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {makerError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
              {makerError}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>Generates cryptographically sealed submission for checker verification.</span>
            </div>
            <button
              type="submit"
              disabled={isSubmittingMaker || !barCouncilId.trim() || !legalOpinion.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingMaker ? 'Sealing Opinion...' : 'Submit for Senior Checker Sign-Off'}
            </button>
          </div>
        </form>
      )}

      {/* Stage 2: Checker Form (Active when CHECKER_PENDING) */}
      {status === 'CHECKER_PENDING' && (
        <div className="p-5 rounded-xl theme-surface border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Step 2: Senior Counsel Verification & Title Clearance Sign-off (Checker)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-600 font-bold">
              Dual Control Active
            </span>
          </div>

          {/* Maker Summary Card for Checker Review */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  Investigating Advocate: {advocateReview?.maker_name || 'Advocate'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  BCI: {advocateReview?.maker_bar_council_id || 'N/A'}
                </span>
              </div>
              {advocateReview?.maker_submitted_at && (
                <span className="text-[10px] text-slate-400">
                  Submitted: {new Date(advocateReview.maker_submitted_at).toLocaleString()}
                </span>
              )}
            </div>

            <div className="pt-1 text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-500 text-[11px]">Submitted Opinion: </span>
              <p className="mt-0.5 italic">&ldquo;{advocateReview?.opinion_summary}&rdquo;</p>
            </div>

            {advocateReview?.maker_notes && (
              <div className="pt-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <span className="font-semibold">Notes: </span>
                {advocateReview.maker_notes}
              </div>
            )}
          </div>

          {/* Dual Control Self-Approval Warning */}
          {isCurrentUserMaker && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Dual Control Invariant: </span>
                You submitted this case as Maker. To guarantee institutional integrity, bank policies require a different Senior Counsel to act as Checker.
              </div>
            </div>
          )}

          {/* Checker Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Checker Evaluation Remarks & Sanction Conditions
            </label>
            <textarea
              value={checkerNotes}
              onChange={(e) => setCheckerNotes(e.target.value)}
              placeholder="Enter senior counsel concurrence, title observations, or reasons for return/rejection..."
              rows={3}
              className="w-full p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {checkerError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
              {checkerError}
            </div>
          )}

          {/* 3 Checker Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              onClick={() => handleActionChecker('RETURN')}
              disabled={isSubmittingChecker || isCurrentUserMaker}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              Return for Rectification
            </button>
            <button
              onClick={() => handleActionChecker('REJECT')}
              disabled={isSubmittingChecker || isCurrentUserMaker}
              className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Reject Title
            </button>
            <button
              onClick={() => handleActionChecker('APPROVE')}
              disabled={isSubmittingChecker || isCurrentUserMaker}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingChecker ? 'Certifying...' : 'Approve Marketable Title'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakerCheckerSignOff;
