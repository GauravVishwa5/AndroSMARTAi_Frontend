'use client';

import React, { useState } from 'react';
import {
  Database,
  Search,
  Building2,
  MapPin,
  Calendar,
  Layers,
  FileCheck2,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Globe,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function IGRSearchPage() {
  const [selectedState, setSelectedState] = useState<'Maharashtra' | 'Delhi'>('Maharashtra');
  const [searchDocNumber, setSearchDocNumber] = useState('');
  const [searchOwner, setSearchOwner] = useState('');
  const [searchCTS, setSearchCTS] = useState('');
  const [searchSRO, setSearchSRO] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  // Mock initial IGR matching records
  const [records] = useState([
    {
      id: 'IGR-MH-2024-88412',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      sro: 'Haveli-04 (Andheri)',
      docNo: '88412/2024',
      docType: 'Sale Deed (खरेदीखत)',
      party1: 'Oberoi Realty Developers Ltd',
      party2: 'Kavitha Thingalaya & Arvind Rao',
      propertyDesc: 'Flat No 1402, 14th Floor, Wings B, Oberoi Springs CHSL, CTS No 104/A, Andheri West',
      status: 'Registered',
      regDate: '14/08/2024',
      matchScore: 98,
    },
    {
      id: 'IGR-MH-2022-31904',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      sro: 'Haveli-02 (Borivali)',
      docNo: '31904/2022',
      docType: 'Development Agreement (विकास करार)',
      party1: 'Sunrise Cooperative Housing Society',
      party2: 'LODHA Green Developers Pvt Ltd',
      propertyDesc: 'CTS No 452, Survey 12, Village Magathane, Borivali East, Mumbai 400066',
      status: 'Registered',
      regDate: '02/03/2022',
      matchScore: 92,
    },
    {
      id: 'IGR-DL-2023-11204',
      state: 'Delhi',
      district: 'North West',
      sro: 'SR VI-A - Pitampura',
      docNo: '11204/2023',
      docType: 'Conveyance Deed',
      party1: 'Delhi Development Authority (DDA)',
      party2: 'Ajay Kumar & Sunita Sharma',
      propertyDesc: 'Plot No. 42, Block C, Deepali Residency, Pitampura, New Delhi 110034',
      status: 'Registered',
      regDate: '19/11/2023',
      matchScore: 95,
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  const filteredRecords = records.filter((r) => {
    if (selectedState && r.state !== selectedState) return false;
    if (searchOwner && !r.party2.toLowerCase().includes(searchOwner.toLowerCase()) && !r.party1.toLowerCase().includes(searchOwner.toLowerCase())) return false;
    if (searchCTS && !r.propertyDesc.toLowerCase().includes(searchCTS.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            Land Registry Search (IGR & DORIS)
          </h1>
          <p className="text-xs theme-text-secondary mt-1">
            Real-time indexed search across Maharashtra IGR (e-Search) and Delhi DORIS property title archives.
          </p>
        </div>

        {/* State Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 theme-surface border rounded-xl">
          <button
            onClick={() => setSelectedState('Maharashtra')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedState === 'Maharashtra'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            🏛️ Maharashtra (IGR e-Search)
          </button>
          <button
            onClick={() => setSelectedState('Delhi')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedState === 'Delhi'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            🏢 Delhi (DORIS Portal)
          </button>
        </div>
      </div>

      {/* Query Filter Box */}
      <div className="p-6 rounded-2xl theme-surface border space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium theme-text-secondary mb-1.5">
              Party / Owner Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOwner}
                onChange={(e) => setSearchOwner(e.target.value)}
                placeholder="e.g. Kavitha, Ajay..."
                className="w-full theme-input border rounded-xl pl-9 pr-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium theme-text-secondary mb-1.5">
              CTS / Survey / Plot No.
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCTS}
                onChange={(e) => setSearchCTS(e.target.value)}
                placeholder="e.g. CTS 104/A, Plot 42..."
                className="w-full theme-input border rounded-xl pl-9 pr-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium theme-text-secondary mb-1.5">
              Registration Year
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full theme-input border rounded-xl pl-9 pr-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2026">2026 (Current Year)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2020-2030">2020 - 2030 (Range)</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute IGR Query</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      {hasSearched && (
        <div className="p-6 rounded-2xl theme-surface border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold theme-text-primary">
                Matched Land Registry Deeds ({filteredRecords.length})
              </h2>
              <p className="text-xs theme-text-secondary">Official 30-year indexed registration entries</p>
            </div>

            <span className="badge-clear px-2.5 py-1 rounded-full text-xs font-semibold">
              Live SRO Bridge Connected
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border theme-border">
            <table className="w-full text-left text-xs theme-text-secondary">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b theme-border">
                <tr>
                  <th className="py-3 px-4">Doc No. & Year</th>
                  <th className="py-3 px-4">SRO & District</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Parties (Transferor / Transferee)</th>
                  <th className="py-3 px-4">Property Description & CTS</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {rec.docNo}
                      <p className="text-[10px] theme-text-muted font-normal">{rec.regDate}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold theme-text-primary">{rec.sro}</p>
                      <p className="text-[11px] theme-text-muted">{rec.district}, {rec.state}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md theme-card border text-[11px] font-medium theme-text-primary">
                        {rec.docType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="theme-text-primary font-medium">P1: {rec.party1}</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400">P2: {rec.party2}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-[11px] theme-text-secondary">
                      {rec.propertyDesc}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="badge-clear px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Opening Index II Search Certificate for Doc #${rec.docNo}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg theme-card border hover:border-blue-500 theme-text-primary text-xs font-medium transition-colors"
                      >
                        <span>Index II</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
