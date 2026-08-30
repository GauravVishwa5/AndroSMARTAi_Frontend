'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  FileCheck2,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building,
  Calendar,
  Eye,
} from 'lucide-react';

export default function ReportsHubPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const reports = [
    {
      id: 'LSR-2026-0881',
      reqId: 'REQ-349',
      reportType: 'LSR (Legal Scrutiny Report)',
      propertyName: 'Deepali Residency, Pitampura',
      borrower: 'Ajay Kumar',
      advocate: 'Adv. Suresh Kulkarni',
      clearanceStatus: 'Clear Title (No Encumbrance)',
      generatedDate: 'Aug 30, 2026',
      fileSize: '2.4 MB',
      format: 'DOCX / PDF',
    },
    {
      id: 'SCR-2026-0412',
      reqId: 'REQ-345',
      reportType: 'SCR (Title Search Certificate)',
      propertyName: 'Sunrise Heights CHSL, Borivali',
      borrower: 'Rajesh Patil',
      advocate: 'Adv. Meenakshi Joshi',
      clearanceStatus: 'Conditional (NOC Required)',
      generatedDate: 'Aug 29, 2026',
      fileSize: '1.8 MB',
      format: 'DOCX / PDF',
    },
    {
      id: 'LSR-2026-0799',
      reqId: 'REQ-312',
      reportType: 'LSR (Legal Scrutiny Report)',
      propertyName: 'Kavitha Thingalaya Villa, Borivali',
      borrower: 'Kavitha Thingalaya',
      advocate: 'Adv. R. Venkatraman',
      clearanceStatus: 'Clear Title (No Encumbrance)',
      generatedDate: 'Aug 27, 2026',
      fileSize: '3.1 MB',
      format: 'DOCX / PDF',
    },
  ];

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.reqId.toLowerCase().includes(search.toLowerCase()) ||
      r.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      r.borrower.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || r.reportType.includes(filterType);
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Legal Scrutiny & Title Search Reports Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generated Institutional Legal Scrutiny Reports (LSR) & Title Search Certificates (SCR) for bank credit clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/requests"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Building className="w-4 h-4 text-blue-400" />
            <span>Select File to Scrutinize</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Total Reports Generated</p>
          <h3 className="text-2xl font-bold text-white mt-1">128 Files</h3>
          <p className="text-[11px] text-emerald-400 mt-0.5">100% Audit Verified</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Avg Assembly Time</p>
          <h3 className="text-2xl font-bold text-indigo-400 mt-1">3.2 Seconds</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Automated docxtpl Word Engine</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">Clear Title Ratio</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">94.8%</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Direct Registry Validated</p>
        </div>
      </div>

      {/* Table & Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by ID, request, or borrower..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Report Category:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Reports</option>
              <option value="LSR">LSR (Legal Scrutiny Report)</option>
              <option value="SCR">SCR (Title Search Certificate)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Request & Property</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Borrower / Advocate</th>
                <th className="py-3 px-4">Clearance Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      {rep.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{rep.propertyName}</p>
                    <Link
                      href={`/requests/${rep.reqId}`}
                      className="text-[11px] text-blue-400 hover:underline font-mono"
                    >
                      {rep.reqId}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {rep.reportType.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-200">{rep.borrower}</p>
                    <p className="text-[10px] text-slate-400">{rep.advocate}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        rep.clearanceStatus.includes('Clear')
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {rep.clearanceStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {rep.generatedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/requests/${rep.reqId}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Workbench</span>
                    </Link>
                    <button
                      onClick={() => alert(`Downloading signed ${rep.id} (.docx)...`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>DOCX</span>
                    </button>
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
