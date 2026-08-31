'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  Building,
  RefreshCw,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Download,
  SlidersHorizontal,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

export default function BranchDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Sample fallback data if backend is unreachable
  const mockRequests = [
    {
      id: 'REQ-349',
      propertyName: 'Deepali Residency',
      ownerName: 'Ajay Kumar',
      bankBranch: 'Pitampura Branch',
      location: 'Pitampura, New Delhi',
      state: 'Delhi',
      docCount: 4,
      status: 'Pending',
      date: 'Aug 30, 2026',
      ocrDone: true,
      riskScore: 'Low Risk',
      cts: 'CTS-1029',
    },
    {
      id: 'REQ-345',
      propertyName: 'Sunrise Heights CHSL',
      ownerName: 'Rajesh Patil',
      bankBranch: 'Andheri West Branch',
      location: 'Borivali, Mumbai',
      state: 'Maharashtra',
      docCount: 6,
      status: 'Verified',
      date: 'Aug 29, 2026',
      ocrDone: true,
      riskScore: 'Clear',
      cts: 'CTS-482/A',
    },
    {
      id: 'REQ-320',
      propertyName: 'Grand Palm Tower',
      ownerName: 'Suresh Mehta',
      bankBranch: 'Andheri West Branch',
      location: 'Andheri, Mumbai',
      state: 'Maharashtra',
      docCount: 3,
      status: 'Rejected',
      date: 'Aug 28, 2026',
      ocrDone: false,
      riskScore: 'Encumbered',
      cts: 'CTS-991',
    },
    {
      id: 'REQ-312',
      propertyName: 'Kavitha Thingalaya Villa',
      ownerName: 'Kavitha Thingalaya',
      bankBranch: 'Borivali Branch',
      location: 'Borivali, Mumbai',
      state: 'Maharashtra',
      docCount: 5,
      status: 'Verified',
      date: 'Aug 27, 2026',
      ocrDone: true,
      riskScore: 'Clear',
      cts: 'CTS-104',
    },
    {
      id: 'REQ-308',
      propertyName: 'Nirman Park Horizon',
      ownerName: 'Vikram Joshi',
      bankBranch: 'Thane Central Branch',
      location: 'Thane West',
      state: 'Maharashtra',
      docCount: 7,
      status: 'Pending',
      date: 'Aug 26, 2026',
      ocrDone: true,
      riskScore: 'Low Risk',
      cts: 'CTS-562',
    },
  ];

  const fetchLiveRequests = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getRequestsList();
      if (Array.isArray(data) && data.length > 0) {
        setRequests(data);
        setIsLiveConnected(true);
      } else if (Array.isArray(data)) {
        // Backend connected but 0 requests in DB
        setRequests(data);
        setIsLiveConnected(true);
      } else {
        setRequests(mockRequests);
        setIsLiveConnected(false);
      }
    } catch (err) {
      console.warn('Backend API not reachable, using fallback demo data:', err);
      setRequests(mockRequests);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRequests();
  }, []);

  const displayRequests = isLiveConnected ? requests : (isLoading ? [] : mockRequests);

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
      matchesStatus = rStatus.includes('INVESTIGATION') || rStatus.includes('PENDING') || rStatus.includes('REVIEW');
    } else if (statusFilter === 'VERIFIED') {
      matchesStatus = rStatus.includes('VERIFIED') || rStatus.includes('COMPLETED') || rStatus.includes('CLEAR');
    } else if (statusFilter === 'REJECTED') {
      matchesStatus = rStatus.includes('REJECTED') || rStatus.includes('CLARIFICATION');
    }

    return matchesSearch && matchesStatus;
  });

  const totalCasesCount = displayRequests.length;
  const pendingCount = displayRequests.filter(r => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('INVESTIGATION') || s.includes('PENDING') || s.includes('REVIEW');
  }).length;
  const verifiedCount = displayRequests.filter(r => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('VERIFIED') || s.includes('COMPLETED') || s.includes('CLEAR');
  }).length;
  const flaggedCount = displayRequests.filter(r => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('REJECTED') || s.includes('CLARIFICATION');
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Intake Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold theme-text-primary tracking-tight">
              Branch Operations Dashboard
            </h1>
            {isLiveConnected ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Postgres & S3
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Demo Cache
              </span>
            )}
          </div>
          <p className="text-xs theme-text-secondary mt-1">
            Real-time title investigation tracking, OCR queue status, and bank legal clearances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveRequests}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-primary transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Fetching...' : 'Sync Live'}</span>
          </button>

          <Link
            href="/requests/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Title Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Requests */}
        <div className="p-5 rounded-2xl theme-card border transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary">Total Cases</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold theme-text-primary">{totalCasesCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live DB
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full w-full" />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Active loan origination pipeline</p>
        </div>

        {/* Pending Scrutiny */}
        <div className="p-5 rounded-2xl theme-card border transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary">Under Investigation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold theme-text-primary">{pendingCount}</span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">In Progress</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${totalCasesCount ? Math.round((pendingCount / totalCasesCount) * 100) : 0}%` }}
            />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Sent to legal scrutiny</p>
        </div>

        {/* Verified Titles */}
        <div className="p-5 rounded-2xl theme-card border transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary">Verified Titles</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold theme-text-primary">{verifiedCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Clear Title</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${totalCasesCount ? Math.round((verifiedCount / totalCasesCount) * 100) : 0}%` }}
            />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Ready for mortgage disbursement</p>
        </div>

        {/* AI OCR / Flagged */}
        <div className="p-5 rounded-2xl theme-card border transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary">Flagged / Issues</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold theme-text-primary">{flaggedCount}</span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">AI Guardrail</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full w-[99%]" />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">OCR cross-validation engine</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-4 rounded-2xl theme-surface border flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'All Cases', value: 'ALL', count: totalCasesCount },
            { label: 'Under Investigation', value: 'PENDING', count: pendingCount },
            { label: 'Verified Titles', value: 'VERIFIED', count: verifiedCount },
            { label: 'Flagged / Clarification', value: 'REJECTED', count: flaggedCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.value
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar & Export */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by REQ, Owner, City..."
              className="w-full theme-input border rounded-xl pl-8 pr-3 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchLiveRequests}
            title="Refresh list"
            className="p-2 rounded-xl theme-card border theme-text-secondary hover:theme-text-primary transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Modern High-Speed Data Grid Table */}
      <div className="rounded-2xl theme-surface border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs theme-text-secondary">
            <thead className="bg-slate-100/80 dark:bg-slate-950/80 border-b theme-border text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Case ID</th>
                <th className="px-5 py-3.5">Property & Location</th>
                <th className="px-5 py-3.5">Borrower / Owner</th>
                <th className="px-5 py-3.5">Raised By / Branch</th>
                <th className="px-5 py-3.5 text-center">Docs</th>
                <th className="px-5 py-3.5">Date Raised</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                      <span>Loading institutional requests from backend...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>No property requests found.</p>
                      <Link
                        href="/requests/new"
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        + Create your first request now
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const reqId = req.id || `REQ-${req.raw_id || ''}`;
                  const propName = req.propertyName || req.property_name || 'Property Record';
                  const flatNo = req.flatNumber || req.flat_number ? `Flat ${req.flatNumber || req.flat_number}` : '';
                  const location = req.district || req.city || req.location || req.address || 'Maharashtra';
                  const owner = req.ownerName || req.owner_name || 'Borrower';
                  const raisedBy = req.raised_by || req.Bank_branch || req.bankBranch || 'Branch User';
                  const dateRaised = req.date_raised || req.date || req.created_at || 'Today';
                  const statusStr = req.status || 'Sent for Investigation';
                  const docCount = req.documents
                    ? (Array.isArray(req.documents) ? req.documents.length : ((req.documents.lsr ? 1 : 0) + (req.documents.scr ? 1 : 0) + (req.documents.sr ? 1 : 0)))
                    : 0;

                  return (
                    <tr
                      key={reqId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Case ID */}
                      <td className="px-5 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        <Link
                          href={`/requests/${reqId}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {reqId}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>

                      {/* Property & CTS */}
                      <td className="px-5 py-4">
                        <p className="font-semibold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                          {propName} {flatNo && <span className="font-normal theme-text-secondary">({flatNo})</span>}
                        </p>
                        <p className="text-[11px] theme-text-muted mt-0.5">
                          {location}
                        </p>
                      </td>

                      {/* Borrower / Owner */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border theme-border flex items-center justify-center font-bold text-[10px] theme-text-primary">
                            {owner[0] || 'U'}
                          </div>
                          <span className="font-medium theme-text-primary">{owner}</span>
                        </div>
                      </td>

                      {/* Bank Branch / Raised By */}
                      <td className="px-5 py-4 theme-text-secondary text-[11px]">
                        {raisedBy}
                      </td>

                      {/* Deeds Uploaded */}
                      <td className="px-5 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-md theme-card border font-mono text-[11px] theme-text-primary">
                          {docCount} docs
                        </span>
                      </td>

                      {/* Date Raised */}
                      <td className="px-5 py-4 text-[11px] theme-text-secondary">
                        {dateRaised}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {statusStr.toLowerCase().includes('clear') || statusStr.toLowerCase().includes('verified') || statusStr.toLowerCase().includes('completed') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" /> {statusStr}
                          </span>
                        ) : statusStr.toLowerCase().includes('flagged') || statusStr.toLowerCase().includes('rejected') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
                            <AlertTriangle className="w-3.5 h-3.5" /> {statusStr}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" /> {statusStr}
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/requests/${reqId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
                        >
                          <span>Examine</span>
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
