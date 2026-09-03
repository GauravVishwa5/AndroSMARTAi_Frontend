'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  AlertOctagon,
  FileText,
  Search,
  ArrowRight,
  RefreshCw,
  Scale,
  Building,
  User,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { requestsApi } from '@/lib/api/requests';
import { StatusBadge } from '@/components/ui/StatusBadge';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b theme-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <span>Legal Scrutiny Queue</span>
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
            Advocate title scrutiny queue: unbroken chain of title review, IGR registration cross-match, and legal opinion sign-off.
          </p>
        </div>

        {/* Status Tab Switcher & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLegalCases}
            disabled={isLoading}
            className="p-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh queue"
            aria-label="Refresh queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-md border theme-border">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'PENDING'
                  ? 'bg-white dark:bg-slate-900 text-[#1D4ED8] dark:text-blue-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab('VERIFIED')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'VERIFIED'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Verified ({verifiedList.length})
            </button>
            <button
              onClick={() => setActiveTab('REJECTED')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'REJECTED'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-semibold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Flagged ({rejectedList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Scrutiny Case Docket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {isLoading ? (
          <div className="col-span-2 py-12 text-center theme-text-muted">
            <div className="flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-xs">Loading legal scrutiny files from database...</p>
            </div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="col-span-2 py-10 text-center theme-text-muted bg-white dark:bg-[#111827] rounded-lg border theme-border p-6">
            <p className="text-xs font-medium">No legal scrutiny cases found in this category.</p>
          </div>
        ) : (
          filteredCases.map((item) => {
            const reqId = item.id || `REQ-${item.raw_id || ''}`;
            const propName = item.propertyName || item.property_name || 'Property Unit';
            const flatNo = item.flatNumber || item.flat_number ? `Flat ${item.flatNumber || item.flat_number}` : '';
            const location = item.district || item.city || item.location || item.address || 'Maharashtra';
            const owner = item.ownerName || item.owner_name || 'Borrower';
            const advocate = item.advocateName || item.advocate || 'Assigned Legal Scrutinizer';
            const dateStr = item.date_raised || item.date || item.created_at || 'Recent';
            const statusStr = item.status || 'Pending';

            return (
              <div
                key={reqId}
                className="p-4 rounded-lg bg-white dark:bg-[#111827] border theme-border flex flex-col justify-between shadow-2xs space-y-3"
              >
                <div>
                  {/* Docket Header */}
                  <div className="flex items-start justify-between gap-3 pb-2.5 border-b theme-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1D4ED8] dark:text-blue-400">
                          {reqId}
                        </span>
                        <span className="text-[11px] text-slate-400">&bull;</span>
                        <span className="text-[11px] text-slate-500">{dateStr}</span>
                      </div>
                      <h3 className="text-sm font-bold theme-text-primary mt-1">
                        {propName} {flatNo && <span className="font-normal text-slate-500">({flatNo})</span>}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {location}
                      </p>
                    </div>

                    <StatusBadge status={statusStr} />
                  </div>

                  {/* Scrutiny Metadata */}
                  <div className="pt-2 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Borrower / Mortgagor:</span>
                      <span className="font-medium theme-text-primary">{owner}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Advocate:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{advocate}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2.5 border-t theme-border flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Source: Registered Land Records
                  </span>

                  <Link
                    href={`/requests/${reqId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>Scrutinize Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
