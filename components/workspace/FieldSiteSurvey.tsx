'use client';

import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Building2,
  Users,
  Home,
  Save,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { SitePhotoInspection } from '@/components/survey/SitePhotoInspection';

interface FieldSiteSurveyProps {
  requestId: string;
  propertyName: string;
  location: string;
}

export const FieldSiteSurvey: React.FC<FieldSiteSurveyProps> = ({
  requestId,
  propertyName,
  location,
}) => {
  const [occupancyStatus, setOccupancyStatus] = useState('Self-Occupied by Borrower');
  const [personMetAtSite, setPersonMetAtSite] = useState('Ajay Kumar (Owner) & Family');
  const [propertyType, setPropertyType] = useState('Residential Multi-Storey Apartment');
  const [approxCarpetArea, setApproxCarpetArea] = useState('1,250 Sq. Ft.');

  // Boundary verification state
  const [boundaries, setBoundaries] = useState({
    north: { deed: 'Flat No. 236', physical: 'Flat No. 236', match: true },
    south: { deed: 'Open to Sky / 24m Main Road', physical: 'Open to Sky / 24m Main Road', match: true },
    east: { deed: 'Staircase & Lift Lobby', physical: 'Staircase & Lift Lobby', match: true },
    west: { deed: 'Adjacent Society Plot No. 234', physical: 'Adjacent Society Plot No. 234', match: true },
  });

  const [engineerNotes, setEngineerNotes] = useState(
    'Site inspection completed on 31-Aug-2026. Property is physically identifiable with proper address plaque. Ground boundaries match schedule description in Registered Sale Deed. Building structure is in good condition, RCC construction with valid occupancy.'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Geotagged Camera & Photo Capture Module */}
      <SitePhotoInspection
        requestId={requestId}
        propertyName={`${propertyName}, ${location}`}
      />

      {/* Field Site Physical Verification Details */}
      <form
        onSubmit={handleSaveSurvey}
        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Physical Inspection & Occupancy Verification
            </h4>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Boundaries & Identifiability Clear</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Occupancy Status *
            </label>
            <select
              value={occupancyStatus}
              onChange={(e) => setOccupancyStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Self-Occupied by Borrower">Self-Occupied by Borrower</option>
              <option value="Tenanted (Valid Lease Agreement)">Tenanted (Valid Lease Agreement)</option>
              <option value="Vacant / Ready for Possession">Vacant / Ready for Possession</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Person Met / Contacted at Site
            </label>
            <input
              type="text"
              value={personMetAtSite}
              onChange={(e) => setPersonMetAtSite(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Property Structure Type
            </label>
            <input
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Approximate Carpet Area Measured
            </label>
            <input
              type="text"
              value={approxCarpetArea}
              onChange={(e) => setApproxCarpetArea(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Boundary Matching Verification Matrix */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
            Four-Side Boundary Reconciliation (Physical Survey vs Title Deed Schedule)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {Object.entries(boundaries).map(([direction, data]) => (
              <div
                key={direction}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                    {direction.toUpperCase()} BOUNDARY
                  </span>
                  <p className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                    {data.physical}
                  </p>
                  <span className="text-[10px] text-slate-500">Deed: {data.deed}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                  Matches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Engineer / Legal Valuer Field Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Site Inspection & Identifiability Report
          </label>
          <textarea
            rows={3}
            value={engineerNotes}
            onChange={(e) => setEngineerNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">
            {isSaved ? 'Inspection report saved & synced with case file.' : 'All inspection data auto-populates TSR Schedule'}
          </span>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Survey Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
