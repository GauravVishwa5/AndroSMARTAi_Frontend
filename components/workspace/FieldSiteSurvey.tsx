'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  Edit2,
} from 'lucide-react';
import { SitePhotoInspection, SurveyPhoto } from '@/components/survey/SitePhotoInspection';
import { requestsApi } from '@/lib/api/requests';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [occupancyStatus, setOccupancyStatus] = useState('Self-Occupied by Borrower');
  const [personMetAtSite, setPersonMetAtSite] = useState('');
  const [propertyType, setPropertyType] = useState('Residential Multi-Storey Apartment');
  const [approxCarpetArea, setApproxCarpetArea] = useState('');
  const [surveyorName, setSurveyorName] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');

  // Boundary verification state
  const [boundaries, setBoundaries] = useState<Record<string, { deed: string; physical: string; match: boolean }>>({
    north: { deed: 'Adjacent Flat / Boundary', physical: '', match: true },
    south: { deed: 'Open to Sky / Main Road', physical: '', match: true },
    east: { deed: 'Staircase / Lift Lobby', physical: '', match: true },
    west: { deed: 'Adjacent Society Plot', physical: '', match: true },
  });

  const [engineerNotes, setEngineerNotes] = useState('');
  const [photos, setPhotos] = useState<SurveyPhoto[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  // Load live survey data on mount
  const loadSurvey = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await requestsApi.getSurvey(requestId);
      const data = res?.survey || {};

      if (data.occupancy_status) setOccupancyStatus(data.occupancy_status);
      if (data.person_met) setPersonMetAtSite(data.person_met);
      if (data.property_type) setPropertyType(data.property_type);
      if (data.carpet_area) setApproxCarpetArea(data.carpet_area);
      if (data.surveyor_name) setSurveyorName(data.surveyor_name);
      if (data.inspection_date) setInspectionDate(data.inspection_date);
      if (data.engineer_notes) setEngineerNotes(data.engineer_notes);
      if (data.boundaries && typeof data.boundaries === 'object') {
        setBoundaries((prev) => ({ ...prev, ...data.boundaries }));
      }
      if (Array.isArray(data.photos)) {
        setPhotos(data.photos);
      }
      if (data.updated_at) {
        setLastUpdatedAt(data.updated_at);
      }
    } catch (err: any) {
      console.warn('Could not load survey data (using defaults):', err);
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  const handleSaveSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        occupancy_status: occupancyStatus,
        person_met: personMetAtSite.trim() || undefined,
        property_type: propertyType.trim() || undefined,
        carpet_area: approxCarpetArea.trim() || undefined,
        surveyor_name: surveyorName.trim() || undefined,
        inspection_date: inspectionDate || undefined,
        boundaries,
        engineer_notes: engineerNotes.trim() || undefined,
      };

      const res = await requestsApi.saveSurvey(requestId, payload);
      setIsSaved(true);
      if (res?.survey?.updated_at) {
        setLastUpdatedAt(res.survey.updated_at);
      }
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err: any) {
      console.error('Failed to save survey details:', err);
      setErrorMessage(err?.response?.data?.detail || 'Failed to save survey details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBoundaryChange = (direction: string, field: 'physical' | 'deed', value: string) => {
    setBoundaries((prev) => ({
      ...prev,
      [direction]: {
        ...prev[direction],
        [field]: value,
      },
    }));
  };

  const toggleBoundaryMatch = (direction: string) => {
    setBoundaries((prev) => ({
      ...prev,
      [direction]: {
        ...prev[direction],
        match: !prev[direction]?.match,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Geotagged Camera & Photo Capture Module */}
      <SitePhotoInspection
        requestId={requestId}
        propertyName={`${propertyName}, ${location}`}
        existingPhotos={photos}
        onPhotosUpdated={(newPhotos) => setPhotos(newPhotos)}
      />

      {/* Field Site Physical Verification Details Form */}
      <form
        onSubmit={handleSaveSurvey}
        className="p-5 rounded-lg theme-surface border space-y-4 shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b theme-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border theme-border">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold theme-text-primary">
                Physical Inspection & Occupancy Verification
              </h4>
              <p className="text-[11px] text-slate-500">
                On-site field findings, structural assessment, and registered deed boundary matching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lastUpdatedAt && (
              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated: {lastUpdatedAt}
              </span>
            )}
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Identifiability Verified</span>
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
              Occupancy Status *
            </label>
            <select
              value={occupancyStatus}
              onChange={(e) => setOccupancyStatus(e.target.value)}
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Self-Occupied by Borrower">Self-Occupied by Borrower</option>
              <option value="Tenanted (Valid Lease Agreement)">Tenanted (Valid Lease Agreement)</option>
              <option value="Vacant / Ready for Possession">Vacant / Ready for Possession</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Occupied by Third Party / Encroached">Occupied by Third Party / Encroached</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
              Person Met / Contacted at Site
            </label>
            <input
              type="text"
              value={personMetAtSite}
              onChange={(e) => setPersonMetAtSite(e.target.value)}
              placeholder="e.g. Borrower & Family / Society Secretary"
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
              Property Structure Type
            </label>
            <input
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              placeholder="e.g. Residential Multi-Storey RCC"
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
              Carpet Area Measured (Approx)
            </label>
            <input
              type="text"
              value={approxCarpetArea}
              onChange={(e) => setApproxCarpetArea(e.target.value)}
              placeholder="e.g. 1,250 Sq. Ft. (Built-up: 1,500)"
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
              Field Valuer / Engineer Name
            </label>
            <input
              type="text"
              value={surveyorName}
              onChange={(e) => setSurveyorName(e.target.value)}
              placeholder="e.g. Er. Rajesh Sharma (Panel Engineer)"
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
              Date of Field Inspection
            </label>
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              className="w-full theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Boundary Matching Verification Matrix */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold theme-text-primary uppercase tracking-wider">
              Four-Side Boundary Reconciliation (Physical Observation vs Title Deed Schedule)
            </label>
            <span className="text-[11px] theme-text-muted">Click badge to toggle match status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(boundaries).map(([direction, data]) => (
              <div
                key={direction}
                className="p-3.5 rounded-xl border theme-border theme-card space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {direction.toUpperCase()} BOUNDARY
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleBoundaryMatch(direction)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                      data.match
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {data.match ? '✓ Matches Deed' : '⚠ Mismatch'}
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold theme-text-secondary uppercase">
                    Physical Ground Observation
                  </label>
                  <input
                    type="text"
                    value={data.physical}
                    onChange={(e) => handleBoundaryChange(direction, 'physical', e.target.value)}
                    placeholder={`e.g. Observation for ${direction} side`}
                    className="w-full theme-input border rounded-lg px-2.5 py-1.5 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold theme-text-muted uppercase">
                    Title Deed Schedule (Reference)
                  </label>
                  <input
                    type="text"
                    value={data.deed}
                    onChange={(e) => handleBoundaryChange(direction, 'deed', e.target.value)}
                    placeholder="e.g. Schedule description in registered deed"
                    className="w-full bg-slate-500/5 border theme-border rounded-lg px-2.5 py-1.5 text-[11px] theme-text-secondary focus:outline-none mt-0.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineer / Legal Valuer Field Notes */}
        <div>
          <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
            Site Inspection & Identifiability Report Summary
          </label>
          <textarea
            rows={3}
            value={engineerNotes}
            onChange={(e) => setEngineerNotes(e.target.value)}
            placeholder="Document physical accessibility, building condition, road width, and any site encumbrances..."
            className="w-full p-3.5 rounded-xl theme-input border text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t theme-border">
          <span className="text-xs theme-text-muted">
            {isSaved
              ? '✓ Field inspection observations saved & attached to TSR report schedule.'
              : 'All survey data & geotagged photos automatically sync with the legal report.'}
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Survey...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved to Case File</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Field Survey Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FieldSiteSurvey;
