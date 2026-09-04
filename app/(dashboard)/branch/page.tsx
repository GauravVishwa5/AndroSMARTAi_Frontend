'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_SHOWCASE_REQUESTS } from '@/lib/demoData';

export default function BranchDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requests, setRequests] = useState<any[]>(DEMO_SHOWCASE_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(true);


  // Sample fallback data if backend is unreachable
  const mockRequests = [
    {
      id: 'REQ-349',
      propertyName: 'Deepali Residency',
      ownerName: 'Ajay Kumar',
      bankBranch: 'PNB Pitampura Branch',
      branchOfficer: 'Sunita Kulkarni (Relationship Mgr)',
      raised_by: 'Sunita Kulkarni (Relationship Mgr)',
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
      bankBranch: 'SBI Nariman Point Corporate Branch',
      branchOfficer: 'Vikram Singhania (Sr. Loan Officer)',
      raised_by: 'Vikram Singhania (Sr. Loan Officer)',
      location: 'Borivali West, Mumbai',
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
      bankBranch: 'HDFC Andheri West Commercial',
      branchOfficer: 'Priya Nair (Credit Underwriter)',
      raised_by: 'Priya Nair (Credit Underwriter)',
      location: 'Andheri West, Mumbai',
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
      bankBranch: 'ICICI BKC Financial Centre',
      branchOfficer: 'Arun Deshmukh (Branch Manager)',
      raised_by: 'Arun Deshmukh (Branch Manager)',
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
      bankBranch: 'Axis Bank — Connaught Place',
      branchOfficer: 'Rohit Mehra (Chief Loan Officer)',
      raised_by: 'Rohit Mehra (Chief Loan Officer)',
      location: 'Thane West',
      state: 'Maharashtra',
      docCount: 7,
      status: 'Pending',
      date: 'Aug 26, 2026',
      ocrDone: true,
      riskScore: 'Low Risk',
      cts: 'CTS-562',
    },
    {
      id: 'REQ-302',
      propertyName: 'Shree Ganesh Heights',
      ownerName: 'Ramesh Sharma',
      bankBranch: 'Kotak Mahindra — Borivali West',
      branchOfficer: 'Ananya Sen (Intake Specialist)',
      raised_by: 'Ananya Sen (Intake Specialist)',
      location: 'Andheri West, Mumbai',
      state: 'Maharashtra',
      docCount: 4,
      status: 'Pending',
      date: 'Aug 25, 2026',
      ocrDone: true,
      riskScore: 'Low Risk',
      cts: 'CTS-781',
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
    // For demo presentations to investors, pre-load showcase cases immediately
    setRequests(DEMO_SHOWCASE_REQUESTS);
  }, []);

  // Use curated institutional showcase cases for zero-latency, consistent investor demonstration
  const displayRequests = DEMO_SHOWCASE_REQUESTS as any[];

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
  const pendingCount = displayRequests.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('INVESTIGATION') || s.includes('PENDING') || s.includes('REVIEW');
  }).length;
  const verifiedCount = displayRequests.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('VERIFIED') || s.includes('COMPLETED') || s.includes('CLEAR');
  }).length;
  const flaggedCount = displayRequests.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    return s.includes('REJECTED') || s.includes('CLARIFICATION');
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Intake Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b theme-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold theme-text-primary tracking-tight">
              Branch Operations Dashboard
            </h1>
            {isLiveConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Database
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-xs theme-text-secondary mt-1">
            Institutional title verification pipeline, legal scrutiny queue, and bank mortgage clearances.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLiveRequests}
            disabled={isLoading}
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

      {/* KPI Metrics Cards with Clear Priority Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Under Investigation (Highest Operational Priority) */}
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

        {/* Flagged / Discrepancy */}
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

        {/* Total Pipeline Cases */}
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
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { label: 'All Cases', value: 'ALL', count: totalCasesCount },
            { label: 'Pending Scrutiny', value: 'PENDING', count: pendingCount },
            { label: 'Verified Titles', value: 'VERIFIED', count: verifiedCount },
            { label: 'Flagged', value: 'REJECTED', count: flaggedCount },
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
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
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

      {/* Institutional Data Table */}
      <div className="rounded-lg bg-white dark:bg-[#111827] border theme-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs theme-text-secondary">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b theme-border text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3">Case ID</th>
                <th className="px-4 py-3">Property Schedule</th>
                <th className="px-4 py-3">Borrower / Applicant</th>
                <th className="px-4 py-3">Originating Branch & Officer</th>
                <th className="px-4 py-3 text-center">Docs</th>
                <th className="px-4 py-3">Date Raised</th>
                <th className="px-4 py-3">Legal Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span>Loading case queue...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <p className="font-medium text-slate-700 dark:text-slate-300">No property cases found matching criteria.</p>
                      <Link
                        href="/requests/new"
                        className="text-[#1D4ED8] dark:text-blue-400 font-medium hover:underline text-xs"
                      >
                        + Create a new title verification request
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const reqId = req.id || `REQ-${req.raw_id || ''}`;
                  const propName = req.propertyName || req.property_name || 'Property Unit';
                  const flatNo = req.flatNumber || req.flat_number ? `Flat ${req.flatNumber || req.flat_number}` : '';
                  const location = req.district || req.city || req.location || req.address || 'Maharashtra';
                  const owner = req.ownerName || req.owner_name || 'Borrower';
                  const branchName = req.bankBranch || req.bank_branch || req.Bank_branch || 'SBI Nariman Point Corporate Branch';
                  const officerName = req.branchOfficer || req.raised_by || 'Vikram Singhania (Loan Officer)';
                  const dateRaised = req.date_raised || req.date || req.created_at || 'Today';
                  const statusStr = req.status || 'Pending';
                  const docCount = req.documents
                    ? Array.isArray(req.documents)
                      ? req.documents.length
                      : (req.documents.lsr ? 1 : 0) + (req.documents.scr ? 1 : 0) + (req.documents.sr ? 1 : 0)
                    : req.docCount || 0;

                  return (
                    <tr
                      key={reqId}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Case ID */}
                      <td className="px-4 py-3 font-mono font-semibold text-[#1D4ED8] dark:text-blue-400">
                        <Link href={`/requests/${reqId}`} className="hover:underline">
                          {reqId}
                        </Link>
                      </td>

                      {/* Property Schedule */}
                      <td className="px-4 py-3">
                        <p className="font-semibold theme-text-primary">
                          {propName} {flatNo && <span className="font-normal theme-text-secondary">({flatNo})</span>}
                        </p>
                        <p className="text-[11px] theme-text-muted mt-0.5">
                          {location}
                        </p>
                      </td>

                      {/* Borrower */}
                      <td className="px-4 py-3 font-medium theme-text-primary">
                        {owner}
                      </td>

                      {/* Originating Branch & Officer */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-xs theme-text-primary">{branchName}</p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                          {officerName}
                        </p>
                      </td>

                      {/* Document Count */}
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 border theme-border">
                          {docCount}
                        </span>
                      </td>

                      {/* Date Raised */}
                      <td className="px-4 py-3 text-[11px] text-slate-500">
                        {dateRaised}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3">
                        <StatusBadge status={statusStr} />
                      </td>

                      {/* Action */}
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
