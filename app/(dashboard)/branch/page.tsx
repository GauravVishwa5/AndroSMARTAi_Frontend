'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function BranchDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sample real-time requests mirroring backend BankForm model
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

  const filteredRequests = mockRequests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      req.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Intake Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold theme-text-primary tracking-tight">
              Branch Operations Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              Live Intake
            </span>
          </div>
          <p className="text-xs theme-text-secondary mt-1">
            Real-time title investigation tracking, OCR queue status, and bank legal clearances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-primary transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
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
            <span className="text-2xl font-extrabold theme-text-primary">1,248</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full w-[78%]" />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Active loan origination pipeline</p>
        </div>

        {/* Pending Scrutiny */}
        <div className="p-5 rounded-2xl theme-card border transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary">Pending Scrutiny</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold theme-text-primary">42</span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Action Required</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full w-[45%]" />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Avg scrutiny queue: ~4.2 hrs</p>
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
            <span className="text-2xl font-extrabold theme-text-primary">1,188</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">95.2% Clear</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full w-[95%]" />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Ready for mortgage disbursement</p>
        </div>

        {/* OCR & AI Efficiency */}
        <div className="p-5 rounded-2xl theme-card border transition-all shadow-sm group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-secondary">AI OCR Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold theme-text-primary">99.8%</span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">GPT-4 Engine</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full w-[99%]" />
          </div>
          <p className="text-[10px] theme-text-muted mt-2">Multi-page Deed & Index II parser</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="p-4 rounded-2xl theme-surface border flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'All Cases', value: 'ALL', count: mockRequests.length },
            { label: 'Pending Scrutiny', value: 'PENDING', count: 2 },
            { label: 'Verified Titles', value: 'VERIFIED', count: 2 },
            { label: 'Rejected', value: 'REJECTED', count: 1 },
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
              placeholder="Filter by REQ, Owner, CTS..."
              className="w-full theme-input border rounded-xl pl-8 pr-3 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            title="Download CSV"
            className="p-2 rounded-xl theme-card border theme-text-secondary hover:theme-text-primary transition-colors"
          >
            <Download className="w-4 h-4" />
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
                <th className="px-5 py-3.5">Branch</th>
                <th className="px-5 py-3.5 text-center">Deeds</th>
                <th className="px-5 py-3.5">OCR Status</th>
                <th className="px-5 py-3.5">Risk & Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center theme-text-muted">
                    No property requests found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Case ID */}
                    <td className="px-5 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      <Link
                        href={`/requests/${req.id}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        {req.id}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>

                    {/* Property & CTS */}
                    <td className="px-5 py-4">
                      <p className="font-semibold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {req.propertyName}
                      </p>
                      <p className="text-[11px] theme-text-muted mt-0.5">
                        {req.location} &bull; <span className="font-mono">{req.cts}</span>
                      </p>
                    </td>

                    {/* Borrower / Owner */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border theme-border flex items-center justify-center font-bold text-[10px] theme-text-primary">
                          {req.ownerName[0]}
                        </div>
                        <span className="font-medium theme-text-primary">{req.ownerName}</span>
                      </div>
                    </td>

                    {/* Bank Branch */}
                    <td className="px-5 py-4 theme-text-secondary text-[11px]">
                      {req.bankBranch}
                    </td>

                    {/* Deeds Uploaded */}
                    <td className="px-5 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-md theme-card border font-mono text-[11px] theme-text-primary">
                        {req.docCount} docs
                      </span>
                    </td>

                    {/* OCR Status */}
                    <td className="px-5 py-4">
                      {req.ocrDone ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          <Sparkles className="w-3.5 h-3.5" /> Extracted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> Processing...
                        </span>
                      )}
                    </td>

                    {/* Risk & Verification Status */}
                    <td className="px-5 py-4">
                      {req.status === 'Verified' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3.5 h-3.5" /> Clear
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" /> Pending Scrutiny
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/requests/${req.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
                      >
                        <span>Examine</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
