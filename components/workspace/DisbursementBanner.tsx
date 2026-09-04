'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { DisbursementReadiness, ConditionPrecedent } from '@/types/enterprise';

interface DisbursementBannerProps {
  readiness: DisbursementReadiness | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onJumpToCitation?: (documentId?: string | null, pageNumber?: number | null) => void;
}

export const DisbursementBanner: React.FC<DisbursementBannerProps> = ({
  readiness,
  isLoading = false,
  onRefresh,
  onJumpToCitation,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!readiness) {
    return null;
  }

  const status = readiness.status || 'BLOCKED';
  const collateral_risk_score = readiness.collateral_risk_score ?? 0;
  const blockers = Array.isArray(readiness.blockers) ? readiness.blockers : [];
  const conditions_precedent = Array.isArray(readiness.conditions_precedent)
    ? readiness.conditions_precedent
    : [];
  const policy_violations = Array.isArray(readiness.policy_violations)
    ? readiness.policy_violations
    : [];

  // Visual status config
  const statusConfig = {
    READY: {
      label: 'CLEAR FOR DISBURSEMENT',
      sublabel: 'Zero fatal blockers. Collateral integrity verified across institutional dimensions.',
      badgeClass:
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      glowClass: 'border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20',
      icon: ShieldCheck,
      iconClass: 'text-emerald-600 dark:text-emerald-400',
    },
    CONDITIONAL: {
      label: 'CONDITIONAL DISBURSEMENT',
      sublabel: `${conditions_precedent.length} Condition(s) Precedent must be satisfied before final loan drawdown.`,
      badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
      glowClass: 'border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20',
      icon: ShieldAlert,
      iconClass: 'text-amber-600 dark:text-amber-400',
    },
    BLOCKED: {
      label: 'DISBURSEMENT BLOCKED',
      sublabel: `${blockers.length} Fatal legal or collateral blocker(s) detected. Title cannot be mortgaged.`,
      badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
      glowClass: 'border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20',
      icon: AlertOctagon,
      iconClass: 'text-rose-600 dark:text-rose-400',
    },
  }[status] || {
    label: 'DISBURSEMENT BLOCKED',
    sublabel: `${blockers.length} Fatal legal or collateral blocker(s) detected. Title cannot be mortgaged.`,
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    glowClass: 'border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20',
    icon: AlertOctagon,
    iconClass: 'text-rose-600 dark:text-rose-400',
  };

  const StatusIcon = statusConfig.icon;

  // Grade determination for display
  const getGrade = (score: number) => {
    if (score <= 25) return { grade: 'A', text: 'Low Risk', color: 'text-emerald-600' };
    if (score <= 55) return { grade: 'B', text: 'Moderate Risk', color: 'text-blue-600' };
    if (score <= 75) return { grade: 'C', text: 'High Risk', color: 'text-amber-600' };
    return { grade: 'D', text: 'Critical Defect', color: 'text-rose-600' };
  };

  const riskMeta = getGrade(collateral_risk_score ?? 0);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden shadow-sm ${statusConfig.glowClass}`}
    >
      {/* Primary Banner Header */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800 shrink-0">
            <StatusIcon className={`w-6 h-6 ${statusConfig.iconClass}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Institutional Disbursement Gate:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wide uppercase ${statusConfig.badgeClass}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
              {statusConfig.sublabel}
            </p>
          </div>
        </div>

        {/* Right Action & Risk Score Pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Collateral Risk Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                Collateral Risk
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {collateral_risk_score ?? 0}
                <span className="text-[10px] font-normal text-slate-500"> / 100</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <span className={`text-xs font-extrabold ${riskMeta.color}`}>
                Grade {riskMeta.grade}
              </span>
              <div className="text-[9px] text-slate-500">{riskMeta.text}</div>
            </div>
          </div>

          {/* Recalculate Gate Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
              title="Re-evaluate institutional disbursement rules"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          {/* Expand Details Toggle */}
          {(blockers.length > 0 ||
            conditions_precedent.length > 0 ||
            (policy_violations && policy_violations.length > 0)) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Requirements'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Requirements Details */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 space-y-3 animate-fadeIn">
          {/* Fatal Blockers */}
          {blockers.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Fatal Disbursement Blockers ({blockers.length})</span>
              </div>
              <div className="space-y-1">
                {blockers.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-md bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-200"
                  >
                    <span className="font-mono font-bold text-rose-600">[{i + 1}]</span>
                    <span className="flex-1 font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditions Precedent (CPs) */}
          {conditions_precedent.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Conditions Precedent for Sanction / Drawdown ({conditions_precedent.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {conditions_precedent.map((cp: ConditionPrecedent, i: number) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex flex-col justify-between text-xs text-amber-900 dark:text-amber-100 gap-1.5"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="font-mono font-bold text-amber-600 text-[11px] shrink-0">
                        CP-{i + 1}
                      </span>
                      <p className="font-medium text-slate-800 dark:text-slate-200 flex-1">
                        {cp.description}
                      </p>
                    </div>
                    {/* Citation Jump Badge if doc/page attached */}
                    {(cp.document_id || cp.page_number) && (
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() =>
                            onJumpToCitation && onJumpToCitation(cp.document_id, cp.page_number)
                          }
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/50 hover:bg-amber-300 text-amber-900 dark:text-amber-200 text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>
                            {cp.document_id ? `Doc: ${cp.document_id}` : 'Document'}
                            {cp.page_number ? ` (p. ${cp.page_number})` : ''}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policy Violations if any */}
          {policy_violations && policy_violations.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Policy Evaluation Exceptions ({policy_violations.length})</span>
              </div>
              <div className="space-y-1">
                {policy_violations.map((pv: any, i: number) => (
                  <div
                    key={i}
                    className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between"
                  >
                    <span>{pv.rule_name || pv.rule_code || JSON.stringify(pv)}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {pv.severity || 'HIGH'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisbursementBanner;
