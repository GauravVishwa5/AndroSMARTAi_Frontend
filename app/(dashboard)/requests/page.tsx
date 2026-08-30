'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function RequestsListPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const requests = [
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

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      r.propertyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'ALL' || r.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Property Requests Explorer</h1>
          <p className="text-xs text-slate-400 mt-1">Manage institutional due diligence requests and title files</p>
        </div>
        <Link
          href="/requests/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Property Request</span>
        </Link>
      </div>

      {/* Table & Filter Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, owner, or property name..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="ALL">All Requests</option>
              <option value="Pending">Pending Review</option>
              <option value="Verified">Verified Clear</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Property & Owner</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Case Type</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((req) => (
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
                      {req.docCount} Docs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{req.caseType}</td>
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
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/requests/${req.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                    >
                      Open File
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
