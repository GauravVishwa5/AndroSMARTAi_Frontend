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
  Clock,
  Filter,
  Layers,
  Scale,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function LegalScrutinyPage() {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const scrutinyCases = [
    {
      id: 'REQ-349',
      propertyName: 'Deepali Residency',
      ownerName: 'Ajay Kumar',
      city: 'Pitampura, New Delhi',
      state: 'Delhi',
      cts: 'CTS-1029',
      advocate: 'Adv. Suresh Verma',
      docs: [
        { name: 'Sale_Deed_2020.pdf', status: 'clear' },
        { name: 'Society_NOC.pdf', status: 'pending' },
        { name: 'Index_II.pdf', status: 'clear' },
        { name: 'Electricity_Bill.pdf', status: 'clear' },
      ],
      pendingCount: 1,
      aiMatchScore: 98,
      riskLevel: 'LOW',
      date: 'Aug 30, 2026',
    },
    {
      id: 'REQ-345',
      propertyName: 'Sunrise Heights CHSL',
      ownerName: 'Rajesh Patil',
      city: 'Borivali, Mumbai',
      state: 'Maharashtra',
      cts: 'CTS-482/A',
      advocate: 'Adv. Meenakshi Rao',
      docs: [
        { name: 'Builder_Agreement.pdf', status: 'clear' },
        { name: 'Property_Card.pdf', status: 'clear' },
        { name: '7_12_Extract.pdf', status: 'clear' },
        { name: 'Share_Certificate.pdf', status: 'clear' },
      ],
      pendingCount: 0,
      aiMatchScore: 95,
      riskLevel: 'CLEAR',
      date: 'Aug 29, 2026',
    },
    {
      id: 'REQ-320',
      propertyName: 'Grand Palm Tower',
      ownerName: 'Suresh Mehta',
      city: 'Andheri, Mumbai',
      state: 'Maharashtra',
      cts: 'CTS-991',
      advocate: 'Adv. Prakash Desai',
      docs: [
        { name: 'Chain_Deed_1995.pdf', status: 'rejected' },
        { name: 'Mutation_Entry.pdf', status: 'pending' },
        { name: 'Index_II_Search.pdf', status: 'clear' },
      ],
      pendingCount: 2,
      aiMatchScore: 72,
      riskLevel: 'HIGH',
      date: 'Aug 28, 2026',
    },
    {
      id: 'REQ-308',
      propertyName: 'Nirman Park Horizon',
      ownerName: 'Vikram Joshi',
      city: 'Thane West',
      state: 'Maharashtra',
      cts: 'CTS-562',
      advocate: 'Adv. Anjali Kulkarni',
      docs: [
        { name: 'Deed_of_Conveyance.pdf', status: 'clear' },
        { name: 'Index_II.pdf', status: 'pending' },
        { name: 'Non_Encumbrance_Cert.pdf', status: 'clear' },
      ],
      pendingCount: 1,
      aiMatchScore: 91,
      riskLevel: 'LOW',
      date: 'Aug 26, 2026',
    },
  ];

  const filteredCases = scrutinyCases.filter((c) => {
    const matchesTab =
      activeTab === 'PENDING'
        ? c.pendingCount > 0 && c.riskLevel !== 'HIGH'
        : activeTab === 'VERIFIED'
        ? c.pendingCount === 0
        : c.riskLevel === 'HIGH';

    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              Legal Scrutiny Queue
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              42 Pending
            </span>
          </div>
          <p className="text-xs theme-text-secondary mt-1">
            Side-by-side title tree verification, AI cross-matching against IGR Maharashtra & Delhi DORIS records.
          </p>
        </div>

        {/* Quick Tab Switcher */}
        <div className="flex items-center gap-1.5 theme-surface border p-1 rounded-xl overflow-x-auto max-w-full pb-1 sm:pb-1">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'PENDING'
                ? 'bg-blue-600 text-white shadow-md'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Pending Verification (2)
          </button>
          <button
            onClick={() => setActiveTab('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'VERIFIED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Verified Titles (1)
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'REJECTED'
                ? 'bg-red-600 text-white shadow-md'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            High Risk (1)
          </button>
        </div>
      </div>


      {/* Scrutiny Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl theme-surface border transition-all shadow-sm flex flex-col justify-between group space-y-4"
          >
            <div>
              {/* Card Header: Case ID, Risk Tag, AI Match */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      {item.id}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs theme-text-muted">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors mt-1">
                    {item.propertyName}
                  </h3>
                  <p className="text-xs theme-text-secondary mt-0.5">
                    {item.city} &bull; <span className="font-mono">{item.cts}</span>
                  </p>
                </div>

                {/* AI Score Badge */}
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.aiMatchScore}% Match</span>
                  </div>
                  <p className="text-[10px] theme-text-muted mt-1 font-medium">
                    Advocate: {item.advocate}
                  </p>
                </div>
              </div>

              {/* Deed Checklist */}
              <div className="mt-4 pt-3 border-t theme-border">
                <p className="text-[11px] font-semibold theme-text-secondary uppercase tracking-wider mb-2">
                  Document Chain Verification
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {item.docs.map((doc, idx) => (
                    <div
                      key={idx}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                        doc.status === 'clear'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : doc.status === 'rejected'
                          ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      <span className="truncate max-w-[130px] font-medium">{doc.name}</span>
                      {doc.status === 'clear' && <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />}
                      {doc.status === 'rejected' && <XCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />}
                      {doc.status === 'pending' && <Clock className="w-3.5 h-3.5 shrink-0 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t theme-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.riskLevel === 'CLEAR' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    Title Clean & Clear
                  </span>
                )}
                {item.riskLevel === 'LOW' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                    Low Risk (1 Doc Pending)
                  </span>
                )}
                {item.riskLevel === 'HIGH' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
                    Broken Chain of Title
                  </span>
                )}
              </div>

              <Link
                href={`/requests/${item.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all group"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
