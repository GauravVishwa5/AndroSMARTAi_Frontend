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
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            Legal Scrutiny & Title Search Reports Hub
          </h1>
          <p className="text-xs theme-text-secondary mt-1">
            Generated Institutional Legal Scrutiny Reports (LSR) & Title Search Certificates (SCR) for bank credit clearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/requests"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl theme-card border theme-text-primary text-xs font-semibold hover:border-blue-500 transition-all shadow-sm active:scale-95"
          >
            <Building className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Select File to Scrutinize</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl theme-card border">
          <p className="text-xs theme-text-secondary font-medium">Total Reports Generated</p>
          <h3 className="text-2xl font-bold theme-text-primary mt-1">128 Files</h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">100% Audit Verified</p>
        </div>
        <div className="p-4 rounded-xl theme-card border">
          <p className="text-xs theme-text-secondary font-medium">Avg Assembly Time</p>
          <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">3.2 Seconds</h3>
          <p className="text-[11px] theme-text-muted mt-0.5">Automated docxtpl Word Engine</p>
        </div>
        <div className="p-4 rounded-xl theme-card border">
          <p className="text-xs theme-text-secondary font-medium">Clear Title Ratio</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.8%</h3>
          <p className="text-[11px] theme-text-muted mt-0.5">Direct Registry Validated</p>
        </div>
      </div>

      {/* Table & Controls */}
      <div className="p-6 rounded-2xl theme-surface border space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by ID, request, or borrower..."
              className="w-full theme-input border rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs theme-text-secondary">Report Category:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="theme-input border rounded-xl px-3 py-1.5 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Reports</option>
              <option value="LSR">LSR (Legal Scrutiny Report)</option>
              <option value="SCR">SCR (Title Search Certificate)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border theme-border">
          <table className="w-full text-left text-xs theme-text-secondary">
            <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b theme-border">
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
            <tbody className="divide-y theme-border">
              {filtered.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      {rep.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold theme-text-primary">{rep.propertyName}</p>
                    <Link
                      href={`/requests/${rep.reqId}`}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-mono"
                    >
                      {rep.reqId}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md theme-card border font-mono text-[11px] theme-text-primary">
                      {rep.reportType.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="theme-text-primary">{rep.borrower}</p>
                    <p className="text-[11px] theme-text-muted">{rep.advocate}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold badge-clear">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {rep.clearanceStatus.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono theme-text-muted text-[11px]">
                    {rep.generatedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading ${rep.id} (DOCX/PDF)...`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
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
