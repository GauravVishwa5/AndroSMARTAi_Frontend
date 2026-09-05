'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuthStore } from '@/lib/store/authStore';
import { DEMO_SHOWCASE_REQUESTS } from '@/lib/demoData';

/** Returns true only for demo/investor presentation sessions — never for real bank users. */
function isDemoSession(tokenValue: string | null | undefined, username: string | null | undefined): boolean {
  if (tokenValue === 'demo-investor-token-pvs-2026') return true;
  if (username && (username.startsWith('demo.') || username === 'demo')) return true;
  return false;
}

export default function BranchDashboardPage() {
  const { token, user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const fetchLiveRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getRequestsList(true);
      if (Array.isArray(data)) {
        setRequests(data);
        setIsLiveConnected(true);
      } else {
        setRequests([]);
        setIsLiveConnected(false);
      }
    } catch (err) {
      console.warn('Branch dashboard: API fetch failed', err);
      setRequests([]);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const tokenValue = token?.access_token ?? null;
    const username = user?.username ?? null;
    const demo = isDemoSession(tokenValue, username);
    setIsDemo(demo);

    if (demo) {
      // Demo / investor session — show curated showcase cases instantly, no API call
      setRequests(DEMO_SHOWCASE_REQUESTS as any[]);
      setIsLiveConnected(true);
      setIsLoading(false);
    } else {
      // Real authenticated user — always fetch live data from backend
      fetchLiveRequests();
    }
  }, [token, user, fetchLiveRequests]);

  // ── Filter logic ────────────────────────────────────────────────────────
  const displayRequests = requests;

  const filteredRequests = displayRequests.filter((req) => {
    const rId = String(req.id || `REQ-${req.raw_id || ''}`);
    const rProp = String(req.propertyName || req.property_name || '');
    const rOwner = String(req.ownerName || req.owner_name || '');
    const rLoc = String(req.district || req.city || req.location || req.address || '');

    const matchesSearch =
      rId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rProp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rLoc.toLowerCase().includes(searchQuery.toLowerCase());

    const rStatus = String(req.status || 'Pending').toUpperCase();
    let matchesStatus = true;
    if (statusFilter === 'PENDING') {
      matchesStatus =
        rStatus.includes('INVESTIGATION') ||
        rStatus.includes('PENDING') ||
        rStatus.includes('REVIEW') ||
        rStatus.includes('IN PROGRESS') ||
        rStatus.includes('IN_PROGRESS') ||
        rStatus.includes('PROGRESS');
    } else if (statusFilter === 'VERIFIED') {
      matchesStatus =
        rStatus.includes('VERIFIED') ||
        rStatus.includes('COMPLETED') ||
        rStatus.includes('CLEAR');
    } else if (statusFilter === 'FLAGGED') {
      matchesStatus =
        rStatus.includes('REJECTED') ||
        rStatus.includes('CLARIFICATION') ||
        rStatus.includes('CRITICAL') ||
        rStatus.includes('FLAG');
    }

    return matchesSearch && matchesStatus;
  });

  const totalCasesCount = displayRequests.length;
  const pendingCount = displayRequests.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    return (
      s.includes('INVESTIGATION') ||
      s.includes('PENDING') ||
      s.includes('REVIEW') ||
      s.includes('IN PROGRESS') ||
      s.includes('IN_PROGRESS') ||
      s.includes('PROGRESS')
    );
  }).length;
  const verifiedCount = displayRequests.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('VERIFIED') || s.includes('COMPLETED') || s.includes('CLEAR');
  }).length;
  const flaggedCount = displayRequests.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    return (
      s.includes('REJECTED') ||
      s.includes('CLARIFICATION') ||
      s.includes('CRITICAL') ||
      s.includes('FLAG')
    );
  }).length;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Top Header & Intake Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b theme-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold theme-text-primary tracking-tight">
              Branch Operations Dashboard
            </h1>
            {isDemo ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Demo Mode
              </span>
            ) : isLiveConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Database
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Offline
              </span>
            )}
          </div>
          <p className="text-xs theme-text-secondary mt-1">
            Institutional title verification pipeline, legal scrutiny queue, and bank mortgage clearances.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (isDemo) return;
              fetchLiveRequests();
            }}
            disabled={isLoading || isDemo}
            title={isDemo ? 'Refresh is disabled in demo mode' : 'Refresh from live database'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <Link
            href="/requests/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pending Scrutiny */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#111827] border border-amber-300 dark:border-amber-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Pending Scrutiny
            </span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold theme-text-primary">{pendingCount}</span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Under Review</span>
          </div>
          <p className="text-[11px] theme-text-muted mt-2">Active cases with legal panel advocates</p>
        </div>

        {/* Verified Titles */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#111827] border border-emerald-300 dark:border-emerald-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Verified Titles
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold theme-text-primary">{verifiedCount}</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Clear Title</span>
          </div>
          <p className="text-[11px] theme-text-muted mt-2">Ready for loan disbursement</p>
        </div>

        {/* Flagged / Issues */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#111827] border border-rose-300 dark:border-rose-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Flagged / Issues
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold theme-text-primary">{flaggedCount}</span>
            <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">Action Required</span>
          </div>
          <p className="text-[11px] theme-text-muted mt-2">Title conflict or missing documents</p>
        </div>

        {/* Total Pipeline */}
        <div className="p-4 rounded-lg bg-white dark:bg-[#111827] border theme-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary uppercase tracking-wider">
              Total Pipeline
            </span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold theme-text-primary">{totalCasesCount}</span>
            <span className="text-xs theme-text-muted font-medium">All Branches</span>
          </div>
          <p className="text-[11px] theme-text-muted mt-2">Historical and active applications</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { label: 'All Cases',        value: 'ALL',     count: totalCasesCount },
            { label: 'Pending Scrutiny', value: 'PENDING', count: pendingCount },
            { label: 'Verified Titles',  value: 'VERIFIED',count: verifiedCount },
            { label: 'Flagged',          value: 'FLAGGED', count: flaggedCount },
          ].map((tab) => {
            const isSelected = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 rounded text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter cases by ID, Owner, City..."
            aria-label="Filter cases"
            className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md pl-8 pr-3 py-1 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Case Table */}
      <div className="rounded-lg bg-white dark:bg-[#111827] border theme-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs theme-text-secondary">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b theme-border text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Property Schedule</th>
                <th className="px-4 py-3">Borrower / Applicant</th>
                <th className="px-4 py-3">Originating Branch &amp; Officer</th>
                <th className="px-4 py-3 text-center">Docs</th>
                <th className="px-4 py-3">Date Raised</th>
                <th className="px-4 py-3">Legal Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span>Loading case queue from live database…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {!isLiveConnected
                          ? 'Unable to connect to the database. Check your network or API configuration.'
                          : 'No property cases found matching the current filters.'}
                      </p>
                      {isLiveConnected && (
                        <Link
                          href="/requests/new"
                          className="text-[#1D4ED8] dark:text-blue-400 font-medium hover:underline text-xs"
                        >
                          + Create a new title verification request
                        </Link>
                      )}
                      {!isLiveConnected && (
                        <button
                          onClick={fetchLiveRequests}
                          className="mt-1 text-[#1D4ED8] dark:text-blue-400 font-medium hover:underline text-xs flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry connection
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const reqId = req.id || `REQ-${req.raw_id || ''}`;
                  const propName = req.propertyName || req.property_name || 'Property Unit';
                  const flatNo =
                    req.flatNumber || req.flat_number
                      ? `Flat ${req.flatNumber || req.flat_number}`
                      : '';
                  const location =
                    req.district || req.city || req.location || req.address || 'Maharashtra';
                  const owner = req.ownerName || req.owner_name || 'Borrower';
                  const branchName =
                    req.bankBranch || req.bank_branch || req.Bank_branch || '—';
                  const officerName = req.branchOfficer || req.raised_by || '—';
                  const dateRaised = req.date_raised || req.date || req.created_at || '—';
                  const statusStr = req.status || 'Pending';
                  const docCount = req.documents
                    ? Array.isArray(req.documents)
                      ? req.documents.length
                      : (req.documents.lsr ? 1 : 0) +
                        (req.documents.scr ? 1 : 0) +
                        (req.documents.sr ? 1 : 0)
                    : req.docCount ?? 0;

                  return (
                    <tr
                      key={reqId}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-[#1D4ED8] dark:text-blue-400">
                        <Link href={`/requests/${reqId}`} className="hover:underline">
                          {reqId}
                        </Link>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold theme-text-primary">
                          {propName}{' '}
                          {flatNo && (
                            <span className="font-normal theme-text-secondary">({flatNo})</span>
                          )}
                        </p>
                        <p className="text-[11px] theme-text-muted mt-0.5">{location}</p>
                      </td>

                      <td className="px-4 py-3 font-medium theme-text-primary">{owner}</td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-xs theme-text-primary">{branchName}</p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                          {officerName}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 border theme-border">
                          {docCount}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-[11px] text-slate-500">{dateRaised}</td>

                      <td className="px-4 py-3">
                        <StatusBadge status={statusStr} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/requests/${reqId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1D4ED8] dark:text-blue-400 border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-2xs"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
