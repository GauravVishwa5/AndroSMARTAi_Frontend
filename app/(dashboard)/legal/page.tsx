'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';

export default function LegalScrutinyPage() {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const fallbackCases = [
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
      status: 'Pending',
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
      status: 'Verified',
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
      status: 'Rejected',
    },
  ];

  const fetchLegalCases = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getRequestsList();
      if (Array.isArray(data) && data.length > 0) {
        setCases(data);
        setIsLiveConnected(true);
      } else if (Array.isArray(data)) {
        setCases(data);
        setIsLiveConnected(true);
      } else {
        setCases(fallbackCases);
        setIsLiveConnected(false);
      }
    } catch (err) {
      console.warn('Could not load legal cases from backend:', err);
      setCases(fallbackCases);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLegalCases();
  }, []);

  const displayCases = cases.length > 0 ? cases : (isLoading ? [] : fallbackCases);

  const pendingList = displayCases.filter((c) => {
    const s = String(c.status || '').toUpperCase();
    return s.includes('INVESTIGATION') || s.includes('PENDING') || s.includes('REVIEW');
  });

  const verifiedList = displayCases.filter((c) => {
    const s = String(c.status || '').toUpperCase();
    return s.includes('VERIFIED') || s.includes('COMPLETED') || s.includes('CLEAR');
  });

  const rejectedList = displayCases.filter((c) => {
    const s = String(c.status || '').toUpperCase();
    return s.includes('REJECTED') || s.includes('CLARIFICATION') || s.includes('FLAGGED');
  });

  const currentTabList =
    activeTab === 'PENDING'
      ? pendingList
      : activeTab === 'VERIFIED'
      ? verifiedList
      : rejectedList;

  const filteredCases = currentTabList.filter((c) => {
    const cId = String(c.id || `REQ-${c.raw_id || ''}`);
    const cProp = String(c.propertyName || c.property_name || '');
    const cOwner = String(c.ownerName || c.owner_name || '');
    const cCity = String(c.district || c.city || c.location || c.address || '');

    return (
      cId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cProp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cCity.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
            {isLiveConnected ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live DB
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs theme-text-secondary mt-1">
            Side-by-side title tree verification, AI cross-matching against IGR Maharashtra & Delhi DORIS records.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLegalCases}
            disabled={isLoading}
            className="p-2 rounded-xl theme-card border theme-text-secondary hover:theme-text-primary transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

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
              Pending ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab('VERIFIED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'VERIFIED'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Verified ({verifiedList.length})
            </button>
            <button
              onClick={() => setActiveTab('REJECTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'REJECTED'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'theme-text-secondary hover:theme-text-primary'
              }`}
            >
              Flagged ({rejectedList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Scrutiny Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 py-16 text-center theme-text-muted">
            <div className="flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <p>Loading legal verification cases from backend...</p>
            </div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="col-span-2 py-12 text-center theme-text-muted theme-surface rounded-2xl border p-8">
            <p>No legal scrutiny cases found in this category.</p>
          </div>
        ) : (
          filteredCases.map((item) => {
            const reqId = item.id || `REQ-${item.raw_id || ''}`;
            const propName = item.propertyName || item.property_name || 'Property Record';
            const flatNo = item.flatNumber || item.flat_number ? `Flat ${item.flatNumber || item.flat_number}` : '';
            const location = item.district || item.city || item.location || item.address || 'Maharashtra';
            const owner = item.ownerName || item.owner_name || 'Borrower';
            const advocate = item.advocateName || item.advocate || 'Assigned Legal Investigator';
            const searchName = item.searchName || 'Title Search 2026';
            const dateStr = item.date_raised || item.date || item.created_at || 'Recent';
            const statusStr = item.status || 'Sent for Investigation';

            return (
              <div
                key={reqId}
                className="p-5 rounded-2xl theme-surface border transition-all shadow-sm flex flex-col justify-between group space-y-4"
              >
                <div>
                  {/* Card Header: Case ID, Risk Tag, AI Match */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                          {reqId}
                        </span>
                        <span className="text-xs text-slate-400">&bull;</span>
                        <span className="text-xs theme-text-muted">{dateStr}</span>
                      </div>
                      <h3 className="text-base font-bold theme-text-primary group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors mt-1">
                        {propName} {flatNo && <span className="font-normal text-slate-400">({flatNo})</span>}
                      </h3>
                      <p className="text-xs theme-text-secondary mt-0.5">
                        {location} &bull; Borrower: <strong className="theme-text-primary">{owner}</strong>
                      </p>
                    </div>

                    {/* AI Score Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Cross-Verified</span>
                      </div>
                      <p className="text-[10px] theme-text-muted mt-1 font-medium">
                        {searchName}
                      </p>
                    </div>
                  </div>

                  {/* Details summary */}
                  <div className="mt-4 pt-3 border-t theme-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="theme-text-secondary">Assigned Advocate:</span>
                      <span className="font-medium theme-text-primary">{advocate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="theme-text-secondary">Current Stage:</span>
                      <span className="font-mono font-semibold theme-text-primary">{statusStr}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t theme-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {statusStr.toLowerCase().includes('clear') || statusStr.toLowerCase().includes('verified') ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        Title Clean & Clear
                      </span>
                    ) : statusStr.toLowerCase().includes('flagged') || statusStr.toLowerCase().includes('rejected') ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
                        Attention Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                        Scrutiny in Progress
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/requests/${reqId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all group"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
