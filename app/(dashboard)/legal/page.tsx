'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  AlertOctagon,
  ShieldCheck,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function LegalScrutinyPage() {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');

  const scrutinyCases = [
    {
      id: 'REQ-349',
      propertyName: 'Deepali Residency',
      ownerName: 'Ajay Kumar',
      city: 'Pitampura, New Delhi',
      state: 'Delhi',
      docs: [
        { name: 'Sale_Deed_2020.pdf', status: 'clear' },
        { name: 'Society_NOC.pdf', status: 'pending' },
        { name: 'Index_II.pdf', status: 'clear' },
      ],
      pendingCount: 1,
      aiMatchScore: 98,
      riskLevel: 'LOW',
    },
    {
      id: 'REQ-345',
      propertyName: 'Sunrise Heights CHSL',
      ownerName: 'Rajesh Patil',
      city: 'Borivali, Mumbai',
      state: 'Maharashtra',
      docs: [
        { name: 'Builder_Agreement.pdf', status: 'clear' },
        { name: 'Property_Card.pdf', status: 'clear' },
        { name: '7_12_Extract.pdf', status: 'clear' },
      ],
      pendingCount: 0,
      aiMatchScore: 95,
      riskLevel: 'CLEAR',
    },
    {
      id: 'REQ-320',
      propertyName: 'Grand Palm Tower',
      ownerName: 'Suresh Mehta',
      city: 'Andheri, Mumbai',
      state: 'Maharashtra',
      docs: [
        { name: 'Chain_Deed_1995.pdf', status: 'rejected' },
        { name: 'Mutation_Entry.pdf', status: 'pending' },
      ],
      pendingCount: 2,
      aiMatchScore: 42,
      riskLevel: 'HIGH_RISK',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Legal Scrutiny & Investigation Engine
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
            Document Clearance & Title Scrutiny Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review extracted property chains, scrutinize deeds, and generate verified Legal Search Reports (LSR).
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Cases Pending Scrutiny</span>
          <p className="text-2xl font-bold text-amber-400 mt-2">42</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires advocate review</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">High Risk Encumbrances</span>
          <p className="text-2xl font-bold text-red-400 mt-2">6</p>
          <p className="text-[11px] text-red-400/90 mt-1">Mortgage / Dispute flagged</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">AI Confidence &gt; 95%</span>
          <p className="text-2xl font-bold text-indigo-400 mt-2">88%</p>
          <p className="text-[11px] text-slate-400 mt-1">Fast-track eligible</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">LSRs Generated (Today)</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">24</p>
          <p className="text-[11px] text-emerald-400/90 mt-1">Ready for Bank Branch</p>
        </div>
      </div>

      {/* Scrutiny Queue Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Active Scrutiny Queue</h2>
          <div className="flex items-center gap-2">
            {(['PENDING', 'VERIFIED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {scrutinyCases.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-400 text-sm">{c.id}</span>
                  <span className="text-xs font-semibold text-white">— {c.propertyName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.riskLevel === 'CLEAR'
                        ? 'badge-clear'
                        : c.riskLevel === 'HIGH_RISK'
                        ? 'badge-rejected'
                        : 'badge-pending'
                    }`}
                  >
                    {c.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Owner: <span className="text-slate-200">{c.ownerName}</span> | Location:{' '}
                  <span className="text-slate-200">{c.city}</span> ({c.state})
                </p>

                {/* Docs pill preview */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {c.docs.map((doc, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 ${
                        doc.status === 'clear'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : doc.status === 'rejected'
                          ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {doc.status === 'clear' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : doc.status === 'rejected' ? (
                        <XCircle className="w-3 h-3 text-red-400" />
                      ) : (
                        <FileText className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{doc.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/requests/${c.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Review & Verify Docs</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
