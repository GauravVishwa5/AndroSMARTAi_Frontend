'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Search,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function RequestsListPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const fallbackRequests = [
    {
      id: 'REQ-349',
      ownerName: 'Ajay Kumar',
      propertyName: 'Deepali Residency',
      location: 'Deepali, Pitampura, New Delhi',
      state: 'Delhi',
      caseType: 'General',
      docCount: 4,
      status: 'Pending',
      date: 'Aug 30, 2026',
    },
    {
      id: 'REQ-345',
      ownerName: 'Rajesh Patil',
      propertyName: 'Sunrise Heights CHSL',
      location: 'Borivali, Mumbai',
      state: 'Maharashtra',
      caseType: 'SRA',
      docCount: 6,
      status: 'Verified',
      date: 'Aug 29, 2026',
    },
    {
      id: 'REQ-320',
      ownerName: 'Suresh Mehta',
      propertyName: 'Grand Palm Tower',
      location: 'Andheri, Mumbai',
      state: 'Maharashtra',
      caseType: 'Resale',
      docCount: 3,
      status: 'Rejected',
      date: 'Aug 28, 2026',
    },
    {
      id: 'REQ-312',
      ownerName: 'Kavitha Thingalaya',
      propertyName: 'Kavitha Thingalaya Villa',
      location: 'Borivali, Mumbai',
      state: 'Maharashtra',
      caseType: 'General',
      docCount: 5,
      status: 'Verified',
      date: 'Aug 27, 2026',
    },
  ];

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getRequestsList();
      if (Array.isArray(data)) {
        setRequests(data);
        setIsLiveConnected(true);
      } else {
        setRequests(fallbackRequests);
        setIsLiveConnected(false);
      }
    } catch (err) {
      console.warn('Could not fetch requests from backend API:', err);
      setRequests(fallbackRequests);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const displayList = isLiveConnected ? requests : (isLoading ? [] : fallbackRequests);

  const filtered = displayList.filter((r) => {
    const rId = String(r.id || `REQ-${r.raw_id || ''}`);
    const rOwner = String(r.ownerName || r.owner_name || '');
    const rProp = String(r.propertyName || r.property_name || '');
    const rLoc = String(r.district || r.city || r.location || r.address || '');

    const matchesSearch =
      rId.toLowerCase().includes(search.toLowerCase()) ||
      rOwner.toLowerCase().includes(search.toLowerCase()) ||
      rProp.toLowerCase().includes(search.toLowerCase()) ||
      rLoc.toLowerCase().includes(search.toLowerCase());

    const rStatus = String(r.status || 'Pending').toUpperCase();
    let matchesStatus = true;
    if (status === 'Pending') {
      matchesStatus = rStatus.includes('INVESTIGATION') || rStatus.includes('PENDING') || rStatus.includes('REVIEW');
    } else if (status === 'Verified') {
      matchesStatus = rStatus.includes('VERIFIED') || rStatus.includes('COMPLETED') || rStatus.includes('CLEAR');
    } else if (status === 'Rejected') {
      matchesStatus = rStatus.includes('REJECTED') || rStatus.includes('CLARIFICATION');
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b theme-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold theme-text-primary tracking-tight">Property Requests Directory</h1>
            {isLiveConnected && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live Database
              </span>
            )}
          </div>
          <p className="text-xs theme-text-secondary mt-1">Master case index across all institutional lending partners and property categories</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRequests}
            disabled={isLoading}
            className="p-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh from server"
            aria-label="Refresh from server"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/requests/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border theme-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, owner, or property name..."
            aria-label="Search requests"
            className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter status"
            className="theme-input border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs theme-text-primary focus:outline-none"
          >
            <option value="ALL">All Requests ({displayList.length})</option>
            <option value="Pending">Pending Scrutiny</option>
            <option value="Verified">Verified Clear</option>
            <option value="Rejected">Rejected / Flagged</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-lg bg-white dark:bg-[#111827] border theme-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs theme-text-secondary">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b theme-border">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Property & Owner</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Raised By / Date</th>
                <th className="py-3 px-4 text-center">Docs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span>Loading institutional requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center theme-text-muted">
                    <p>No matching requests found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const reqId = req.id || `REQ-${req.raw_id || ''}`;
                  const propName = req.propertyName || req.property_name || 'Property Record';
                  const flatNo = req.flatNumber || req.flat_number ? `Flat ${req.flatNumber || req.flat_number}` : '';
                  const owner = req.ownerName || req.owner_name || 'Borrower';
                  const loc = req.district || req.city || req.location || req.address || 'Maharashtra';
                  const stateStr = req.state || 'Maharashtra';
                  const raisedBy = req.raised_by || req.Bank_branch || req.bankBranch || 'Branch User';
                  const dateRaised = req.date_raised || req.date || req.created_at || 'Recent';
                  const statusStr = req.status || 'Pending';
                  const docCount = req.documents
                    ? Array.isArray(req.documents)
                      ? req.documents.length
                      : (req.documents.lsr ? 1 : 0) + (req.documents.scr ? 1 : 0) + (req.documents.sr ? 1 : 0)
                    : req.docCount || 0;

                  return (
                    <tr key={reqId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#1D4ED8] dark:text-blue-400">
                        <Link href={`/requests/${reqId}`} className="hover:underline">
                          {reqId}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold theme-text-primary">
                          {propName} {flatNo && <span className="font-normal text-slate-500">({flatNo})</span>}
                        </p>
                        <p className="text-[11px] text-slate-500">{owner}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="theme-text-primary">{loc}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{stateStr}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="theme-text-primary">{raisedBy}</p>
                        <p className="text-[10px] text-slate-400">{dateRaised}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 border theme-border">
                          {docCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={statusStr} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/requests/${reqId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1D4ED8] dark:text-blue-400 border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors shadow-2xs"
                        >
                          <span>Open File</span>
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
