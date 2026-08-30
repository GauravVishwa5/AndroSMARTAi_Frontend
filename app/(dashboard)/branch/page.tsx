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
} from 'lucide-react';

export default function BranchDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sample data mirroring backend BankForm model
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
    },
  ];

  const filteredRequests = mockRequests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div>
          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
            Branch Operations Portal
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
            Branch Due-Diligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track title verification pipelines, multi-page OCR extraction, and legal clearance reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/requests/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Property Request</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Requests</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">1,248</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>↑ 12%</span>
            <span className="text-slate-400">vs last month</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">42</p>
          <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
            <span>8 urgent review</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">OCR in Queue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">18</p>
          <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1 font-medium">
            <span>Celery workers active</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">LSR Reports Ready</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3">1,188</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>95.2% clear title rate</span>
          </p>
        </div>
      </div>

      {/* Requests Explorer Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        {/* Table Header Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by REQ-#, property, owner..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Property & Owner</th>
                <th className="py-3.5 px-4">Location / State</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date Raised</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                    <Link href={`/requests/${req.id}`} className="hover:underline flex items-center gap-1">
                      {req.id}
                      <ArrowUpRight className="w-3 h-3 text-slate-500" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{req.propertyName}</p>
                    <p className="text-[11px] text-slate-400">{req.ownerName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-300">{req.location}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{req.state}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                      {req.docCount} Files
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        req.status === 'Verified'
                          ? 'badge-clear'
                          : req.status === 'Rejected'
                          ? 'badge-rejected'
                          : 'badge-pending'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{req.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/requests/${req.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      <span>Open Workspace</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
