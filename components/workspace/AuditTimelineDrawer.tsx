'use client';

import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  User,
  Clock,
  Filter,
  RefreshCw,
  FileCheck2,
  AlertTriangle,
  Lock,
  ChevronRight,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { CaseAuditEvent } from '@/types/enterprise';
import { requestsApi } from '@/lib/api/requests';

interface AuditTimelineDrawerProps {
  requestId: string;
  events: CaseAuditEvent[];
  totalEvents?: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const AuditTimelineDrawer: React.FC<AuditTimelineDrawerProps> = ({
  requestId,
  events,
  totalEvents = 0,
  isLoading = false,
  onRefresh,
}) => {
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (selectedEventType === 'ALL') return true;
    return ev.event_type === selectedEventType;
  });

  const getEventBadge = (eventType: string) => {
    if (eventType.includes('APPROVE')) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    }
    if (eventType.includes('REJECT')) {
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
    }
    if (eventType.includes('RETURN') || eventType.includes('DISCREPANCY')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    }
    if (eventType.includes('FINDING') || eventType.includes('OPINION')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
    }
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
  };

  return (
    <div className="space-y-4">
      {/* Immutability Banner */}
      <div className="p-3 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Institutional Forensic Audit Trail
            </span>
            <p className="text-[11px] text-slate-400">
              Append-only ledger enforced by PostgreSQL immutability triggers. Zero edits or deletions allowed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
            {totalEvents || events.length} Recorded Events
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh audit timeline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Event Type Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1">Filter:</span>
        {['ALL', 'OPINION_SUBMITTED', 'CHECKER_APPROVED', 'CHECKER_REJECTED', 'CHECKER_RETURNED', 'FINDING_STATUS_CHANGED'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedEventType(t)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer shrink-0 ${
              selectedEventType === t
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'theme-surface border text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t === 'ALL' ? 'All Events' : t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Chronological Event Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 text-center rounded-xl theme-surface border text-slate-500 text-xs">
          No audit events found matching the selected filter.
        </div>
      ) : (
        <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredEvents.map((ev, i) => {
            const isExpanded = expandedEventId === ev.id;
            return (
              <div key={ev.id || i} className="relative group">
                {/* Node circle */}
                <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-xs ring-2 ring-blue-100 dark:ring-blue-950" />

                <div className="p-3.5 rounded-xl theme-surface border shadow-sm space-y-2 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${getEventBadge(
                          ev.event_type
                        )}`}
                      >
                        {ev.event_type}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {ev.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ev.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actor details */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {ev.actor_name || 'System / Staff'}
                      </span>
                      {ev.actor_role && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {ev.actor_role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable JSON / Details */}
                  {ev.details && Object.keys(ev.details).length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer pt-1"
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        <span>{isExpanded ? 'Hide Payload Details' : 'View Payload Details'}</span>
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-48">
                          {JSON.stringify(ev.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuditTimelineDrawer;
