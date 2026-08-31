'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Search,
  ArrowUpRight,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

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

  const displayList = requests.length > 0 ? requests : (isLoading ? [] : fallbackRequests);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold theme-text-primary tracking-tight">Property Requests Explorer</h1>
            {isLiveConnected && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Live DB
              </span>
            )}
          </div>
          <p className="text-xs theme-text-secondary mt-1">Manage institutional due diligence requests and title files</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            disabled={isLoading}
            className="p-2.5 rounded-xl theme-card border theme-text-secondary hover:theme-text-primary transition-colors disabled:opacity-50"
            title="Refresh from server"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/requests/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Property Request</span>
          </Link>
        </div>
      </div>

      {/* Table & Filter Card */}
      <div className="p-6 rounded-2xl theme-surface border backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, owner, or property name..."
              className="w-full theme-input border rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs theme-text-secondary">Filter Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="theme-input border rounded-xl px-3 py-1.5 text-xs theme-text-primary focus:outline-none"
            >
              <option value="ALL">All Requests ({displayList.length})</option>
              <option value="Pending">Pending / In Investigation</option>
              <option value="Verified">Verified Clear</option>
              <option value="Rejected">Rejected / Needs Clarification</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border theme-border">
          <table className="w-full text-left text-xs theme-text-secondary">
            <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b theme-border">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Property & Owner</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Raised By / Date</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center theme-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                      <span>Loading institutional requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center theme-text-muted">
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
                  const statusStr = req.status || 'Sent for Investigation';
                  const docCount = req.documents
                    ? (Array.isArray(req.documents) ? req.documents.length : ((req.documents.lsr ? 1 : 0) + (req.documents.scr ? 1 : 0) + (req.documents.sr ? 1 : 0)))
                    : 0;

                  return (
                    <tr key={reqId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        <Link href={`/requests/${reqId}`} className="hover:underline flex items-center gap-1">
                          {reqId}
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold theme-text-primary">
                          {propName} {flatNo && <span className="font-normal text-slate-400">({flatNo})</span>}
                        </p>
                        <p className="text-[11px] theme-text-muted">{owner}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="theme-text-primary">{loc}</p>
                        <span className="text-[10px] theme-text-muted font-mono">{stateStr}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="theme-text-primary">{raisedBy}</p>
                        <p className="text-[10px] theme-text-muted">{dateRaised}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md theme-card border font-mono theme-text-primary">
                          {docCount} Docs
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {statusStr.toLowerCase().includes('clear') || statusStr.toLowerCase().includes('verified') || statusStr.toLowerCase().includes('completed') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3" /> {statusStr}
                          </span>
                        ) : statusStr.toLowerCase().includes('flagged') || statusStr.toLowerCase().includes('rejected') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
                            <AlertTriangle className="w-3 h-3" /> {statusStr}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> {statusStr}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/requests/${reqId}`}
                          className="px-3 py-1.5 rounded-lg theme-card border hover:border-blue-500/50 theme-text-primary text-xs font-medium transition-all inline-block"
                        >
                          Open File
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
