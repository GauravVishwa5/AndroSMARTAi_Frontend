'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { requestsApi } from '@/lib/api/requests';
import { documentsApi } from '@/lib/api/documents';
import {
  Building,
  MapPin,
  FileText,
  Upload,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Search,
  RefreshCw,
  Edit3,
  Layers,
  Landmark,
} from 'lucide-react';
import { DocumentTypesResponse, DelhiSRO, DelhiLocality, GeographicState, District, Taluka, Village } from '@/types/pms';

export default function NewRequestPage() {
  const router = useRouter();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    ownerName: '',
    applicantName: '',
    propertyName: '',
    bankName: 'Axis Bank',
    Bank_branch: 'Andheri West Branch',
    flatNumber: '',
    address: '',
    state: 'Maharashtra', // Default to Maharashtra
    district_id: '',
    district: 'Mumbai Suburban',
    district_mr: 'मुंबई उपनगर',
    taluka_id: '',
    taluka: '',
    taluka_mr: '',
    city: '',
    village: '',
    village_mr: '',
    pinCode: '',
    ctsNumber: '',
    propertyNumbers: ['235-GF'], // Chip input
    from_year: 2001,
    caseType: 'General',
    transactionType: 'Resale',
    advocateName: 'Kushal Sharma & Associates',
    searchName: 'Title Search 2026',
    category: 'Residential',
    sro_id: '',
  });

  // Multi-unit Chip Input Helper
  const [chipInput, setChipInput] = useState('');

  // Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; docType: string }[]>([]);
  const [docTypesData, setDocTypesData] = useState<DocumentTypesResponse | null>(null);

  // Geographic dropdowns state
  const [states, setStates] = useState<GeographicState[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [delhiSros, setDelhiSros] = useState<DelhiSRO[]>([]);
  const [delhiLocalities, setDelhiLocalities] = useState<DelhiLocality[]>([]);

  // Search & custom village toggle
  const [villageSearch, setVillageSearch] = useState('');
  const [delhiLocalitySearch, setDelhiLocalitySearch] = useState('');
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Fetch initial masters
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [docTypes, st] = await Promise.all([
          requestsApi.getDocumentTypes().catch(() => ({
            document_types: [
              { id: 1, name: 'Sale Deed', code: 'SD' },
              { id: 2, name: 'Parent Deed', code: 'PD' },
              { id: 3, name: 'Mutation Extract (7/12)', code: 'ME' },
              { id: 4, name: 'Property Card', code: 'PC' },
              { id: 5, name: 'Society NOC / Share Certificate', code: 'NOC' },
              { id: 6, name: 'Index II Search', code: 'IDX' },
            ],
          })),
          requestsApi.getStates().catch(() => [
            { id: 1, state_name: 'Maharashtra' },
            { id: 2, state_name: 'Delhi' },
          ]),
        ]);
        setDocTypesData(docTypes as any);
        setStates(st);
      } catch (err) {
        console.warn('Using local fallback masters', err);
      }
    };
    loadMasters();
  }, []);

  // When state changes to Delhi or Maharashtra
  useEffect(() => {
    if (formData.state === 'Delhi') {
      setIsLoadingLocations(true);
      requestsApi
        .getDelhiSROs()
        .then((sros) => {
          const arr = Array.isArray(sros) ? sros : (sros as any)?.items || [];
          setDelhiSros(arr);
          const initialSro = formData.sro_id || '95';
          const matched = arr.find((s: any) => String(s.sro_id) === String(initialSro)) || arr[0];
          setFormData((prev) => ({
            ...prev,
            sro_id: matched ? String(matched.sro_id) : '95',
          }));
        })
        .catch(() => {
          setDelhiSros([
            { sro_id: '95', sro_name: 'North West-Rohini (SR VIC)' },
            { sro_id: '78', sro_name: 'North West Model Town (SR VIA)' },
          ]);
        })
        .finally(() => setIsLoadingLocations(false));
    } else if (formData.state === 'Maharashtra') {
      setIsLoadingLocations(true);
      requestsApi
        .getDistricts()
        .then((dist) => {
          const distList = Array.isArray(dist) ? dist : [];
          setDistricts(distList);
          // If a district is already set or default to first
          const defaultDist = distList.find((d: any) => (d.district_name || d.name || d.name_en) === 'Mumbai Suburban') || distList[0];
          if (defaultDist) {
            const dName = (defaultDist as any).district_name || (defaultDist as any).name_en || (defaultDist as any).name;
            const dNameMr = (defaultDist as any).name_mr || (defaultDist as any).district_name_mr || dName;
            setFormData((prev) => ({
              ...prev,
              district_id: String(defaultDist.id),
              district: dName,
              district_mr: dNameMr,
            }));
            handleDistrictChange(String(defaultDist.id), dName, dNameMr);
          }
        })
        .catch((err) => {
          console.warn('Failed to load districts from API', err);
        })
        .finally(() => setIsLoadingLocations(false));
    }
  }, [formData.state]);

  // Handle District Change
  const handleDistrictChange = async (districtId: string, districtName?: string, districtNameMr?: string) => {
    const selectedDist = districts.find((d: any) => String(d.id || d.district_id) === String(districtId));
    const dName = districtName || (selectedDist as any)?.district_name || (selectedDist as any)?.name_en || (selectedDist as any)?.name || '';
    const dNameMr = districtNameMr || (selectedDist as any)?.name_mr || (selectedDist as any)?.district_name_mr || dName;

    setFormData((prev) => ({
      ...prev,
      district_id: districtId,
      district: dName,
      district_mr: dNameMr,
      taluka_id: '',
      taluka: '',
      taluka_mr: '',
      village: '',
      village_mr: '',
    }));
    setVillageSearch('');

    if (districtId) {
      setIsLoadingLocations(true);
      try {
        const [talukaList, villageList] = await Promise.all([
          requestsApi.getTalukas(districtId).catch(() => []),
          requestsApi.getVillages(undefined, districtId).catch(() => []),
        ]);
        setTalukas(talukaList);
        setVillages(villageList);
      } catch (e) {
        console.warn('Failed to load talukas/villages for district', e);
      } finally {
        setIsLoadingLocations(false);
      }
    } else {
      setTalukas([]);
      setVillages([]);
    }
  };

  // Handle Taluka Change
  const handleTalukaChange = async (talukaId: string) => {
    const selectedTaluka = talukas.find((t: any) => String(t.id || t.taluk_id) === String(talukaId));
    const tName = (selectedTaluka as any)?.taluka_name || (selectedTaluka as any)?.name_en || (selectedTaluka as any)?.name || '';
    const tNameMr = (selectedTaluka as any)?.name_mr || (selectedTaluka as any)?.taluka_name_mr || tName;

    setFormData((prev) => ({
      ...prev,
      taluka_id: talukaId,
      taluka: tName,
      taluka_mr: tNameMr,
      village: '',
      village_mr: '',
    }));
    setVillageSearch('');

    if (talukaId) {
      setIsLoadingLocations(true);
      try {
        const villageList = await requestsApi.getVillages(talukaId, formData.district_id).catch(() => []);
        setVillages(villageList);
      } catch (e) {
        console.warn('Failed to load villages for taluka', e);
      } finally {
        setIsLoadingLocations(false);
      }
    } else if (formData.district_id) {
      // Fall back to district villages
      requestsApi.getVillages(undefined, formData.district_id).then(setVillages).catch(() => []);
    }
  };

  // When Delhi SRO selected, fetch Localities
  useEffect(() => {
    if (formData.state === 'Delhi' && formData.sro_id) {
      setIsLoadingLocations(true);
      requestsApi
        .getDelhiLocalities(formData.sro_id)
        .then((locs) => {
          const arr = Array.isArray(locs) ? locs : (locs as any)?.items || [];
          setDelhiLocalities(arr);
          if (arr.length > 0) {
            const hasCurrent = arr.some((l: any) => l.locality_name === formData.village);
            if (!hasCurrent) {
              const defLoc = arr.find((l: any) => l.locality_name.toLowerCase().includes('deepali')) || arr[0];
              setFormData((prev) => ({
                ...prev,
                village: defLoc?.locality_name || '',
              }));
            }
          }
        })
        .catch(() => {
          setDelhiLocalities([
            { locality_name: 'Deepali' },
            { locality_name: 'Block-H-4-5 Pitampura' },
            { locality_name: 'Begumpur' },
          ]);
        })
        .finally(() => setIsLoadingLocations(false));
    }
  }, [formData.state, formData.sro_id]);

  // Chip input handlers
  const addPropertyChip = () => {
    if (chipInput.trim() && !formData.propertyNumbers.includes(chipInput.trim())) {
      setFormData({
        ...formData,
        propertyNumbers: [...formData.propertyNumbers, chipInput.trim()],
      });
      setChipInput('');
    }
  };

  const removePropertyChip = (chip: string) => {
    setFormData({
      ...formData,
      propertyNumbers: formData.propertyNumbers.filter((c) => c !== chip),
    });
  };

  // Document upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        docType: 'Auto-Detect',
      }));
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create BankForm Request
      // For Maharashtra, send Marathi values in district, taluka, village so Lambda receives the exact Marathi portal strings:
      const isMaha = formData.state === 'Maharashtra';
      const payload = {
        ownerName: formData.ownerName,
        applicantName: formData.applicantName || formData.ownerName,
        propertyName: formData.propertyName,
        bankName: formData.bankName,
        Bank_branch: formData.Bank_branch,
        flatNumber: formData.flatNumber,
        address: formData.address,
        state: formData.state,
        district: isMaha && formData.district_mr ? formData.district_mr : formData.district,
        district_id: formData.district_id,
        district_eng: formData.district,
        taluka: isMaha && formData.taluka_mr ? formData.taluka_mr : formData.taluka,
        taluka_id: formData.taluka_id,
        taluka_eng: formData.taluka,
        city: formData.city,
        village: isMaha && formData.village_mr ? formData.village_mr : formData.village,
        village_eng: formData.village,
        pinCode: formData.pinCode,
        ctsNumber: formData.ctsNumber,
        propertyNumbers: formData.propertyNumbers,
        from_year: Number(formData.from_year) || 2001,
        caseType: formData.caseType,
        transactionType: formData.transactionType,
        advocateName: formData.advocateName,
        searchName: formData.searchName,
        category: formData.category,
      };

      const res = await requestsApi.createRequest(payload);
      const reqId = res.id || `REQ-${res.raw_id || '1'}`;

      // 2. Upload Documents to S3 & Postgres
      if (uploadedFiles.length > 0) {
        const files = uploadedFiles.map((u) => u.file);
        const docTypes = uploadedFiles.map((u) => u.docType);
        try {
          await requestsApi.uploadNewDocuments(reqId, files, docTypes);
        } catch (uploadErr) {
          console.warn('Upload via uploadNewDocuments failed, falling back to queueOcrAndUpload:', uploadErr);
          await documentsApi.queueOcrAndUpload(reqId, files, docTypes).catch(() => null);
        }
      }

      router.push(`/requests/${reqId}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit property request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Title & Step Indicator */}
      <div className="p-4 sm:p-5 rounded-lg theme-surface border shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold theme-text-primary tracking-tight">Create Property Verification Request</h1>
            <p className="text-xs theme-text-secondary mt-0.5">Initiate banking due-diligence intake, land registry search, and document OCR queue</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[#1D4ED8] dark:text-blue-400 border theme-border font-semibold w-fit">
            Step {currentStep} of 3
          </span>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { step: 1, title: '1. Applicant & Loan' },
            { step: 2, title: '2. Property & Geography' },
            { step: 3, title: '3. Documents & Priority' },
          ].map((s) => (
            <div key={s.step} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentStep >= s.step ? 'bg-[#1D4ED8]' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
              <p className={`text-[11px] truncate ${currentStep === s.step ? 'text-[#1D4ED8] dark:text-blue-400 font-semibold' : 'text-slate-500'}`}>
                {s.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Bank & Case Details */}
      {currentStep === 1 && (
        <div className="p-5 sm:p-6 rounded-lg theme-surface border space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold theme-text-primary flex items-center gap-2 pb-2 border-b theme-border">
            <Building className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Applicant & Case Intake Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
                Property Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Ajay Kumar"
                className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">Applicant Name</label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Ajay Kumar (leave empty if same as owner)"
                className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">Bank Branch</label>
              <input
                type="text"
                value={formData.Bank_branch}
                onChange={(e) => setFormData({ ...formData, Bank_branch: e.target.value })}
                className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">Case Type</label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="General">General / Standard</option>
                <option value="SRA">SRA (Slum Rehabilitation Authority)</option>
                <option value="Resale">Resale</option>
                <option value="Builder Purchase">Builder Purchase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">From Year (Search Range)</label>
              <input
                type="number"
                value={formData.from_year}
                onChange={(e) => setFormData({ ...formData, from_year: parseInt(e.target.value) || 2000 })}
                className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t theme-border">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!formData.ownerName}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>Next: Property & Geography</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Geography & Property */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl theme-surface border space-y-4 shadow-sm">
          <h2 className="text-sm font-bold theme-text-primary flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Property & Land Registry Geography</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi (DORIS IGR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter City Name"
                className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">Pin Code</label>
              <input
                type="text"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                placeholder="Enter Pin Code"
                className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conditional Delhi SRO & Locality vs Maharashtra Cascading */}
          {formData.state === 'Delhi' ? (
            <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5" />
                  Delhi DORIS Land Registry Fields (22 SROs • 6,632 Localities)
                </span>
                {delhiLocalities.length > 0 && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {delhiLocalities.length} Localities in Selected SRO
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold theme-text-secondary">
                      Sub-Registrar Office (SR. Office) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                      {delhiSros.length} SROs
                    </span>
                  </div>
                  <select
                    value={formData.sro_id}
                    onChange={(e) => {
                      const newSro = e.target.value;
                      setFormData({ ...formData, sro_id: newSro, village: '' });
                      setDelhiLocalitySearch('');
                    }}
                    className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Delhi SRO --</option>
                    {(Array.isArray(delhiSros) ? delhiSros : []).map((s: any) => (
                      <option key={s.sro_id} value={s.sro_id}>
                        {s.sro_name} {s.locality_count ? `(${s.locality_count} localities)` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold theme-text-secondary">
                      Locality Name <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomVillage(!isCustomVillage)}
                      className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>{isCustomVillage ? 'Choose from List' : 'Type Custom'}</span>
                    </button>
                  </div>

                  {isCustomVillage ? (
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Deepali / Pitampura"
                      className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="space-y-1.5">
                      <select
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        disabled={!formData.sro_id || delhiLocalities.length === 0}
                        className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="">
                          {!formData.sro_id
                            ? '-- Select SRO first --'
                            : delhiLocalities.length === 0
                            ? '-- Loading Localities... --'
                            : `-- Select Locality (${delhiLocalities.length} available) --`}
                        </option>
                        {(delhiLocalitySearch.trim()
                          ? delhiLocalities.filter((l: any) =>
                              (l.locality_name || '').toLowerCase().includes(delhiLocalitySearch.toLowerCase())
                            )
                          : delhiLocalities
                        ).map((l: any, i: number) => (
                          <option key={i} value={l.locality_name}>
                            {l.locality_name} {l.archival ? '(Archival)' : ''}
                          </option>
                        ))}
                      </select>

                      {delhiLocalities.length > 15 && (
                        <div className="relative">
                          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={delhiLocalitySearch}
                            onChange={(e) => setDelhiLocalitySearch(e.target.value)}
                            placeholder={`Filter ${delhiLocalities.length} localities in dropdown...`}
                            className="w-full bg-slate-100 dark:bg-slate-900 border theme-border rounded-lg pl-7 pr-2.5 py-1 text-[11px] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. District Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold theme-text-secondary">
                      District <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                      {districts.length} Districts
                    </span>
                  </div>
                  <select
                    value={formData.district_id}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select District --</option>
                    {districts.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.district_name || d.name_en || d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Taluka Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold theme-text-secondary">
                      Taluka / Sub-District
                    </label>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                      {talukas.length > 0 ? `${talukas.length} Talukas` : 'Select District'}
                    </span>
                  </div>
                  <select
                    value={formData.taluka_id}
                    onChange={(e) => handleTalukaChange(e.target.value)}
                    disabled={!formData.district_id || talukas.length === 0}
                    className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">
                      {talukas.length > 0 ? '-- Select Taluka --' : '-- No Taluka Split (Urban) --'}
                    </option>
                    {talukas.map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.taluka_name || t.name_en || t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Village / Locality Dropdown & Switcher */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold theme-text-secondary">
                      Village / Locality <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomVillage(!isCustomVillage)}
                      className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>{isCustomVillage ? 'Choose from List' : 'Type Custom'}</span>
                    </button>
                  </div>

                  {isCustomVillage ? (
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Borivali / Bandra East"
                      className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="space-y-1.5">
                      <select
                        value={formData.village}
                        onChange={(e) => {
                          const vName = e.target.value;
                          const selectedVillage = villages.find(
                            (v: any) => (v.village_name || v.name_en || v.name) === vName
                          );
                          const vNameMr = (selectedVillage as any)?.name_mr || (selectedVillage as any)?.village_name_mr || vName;
                          setFormData({
                            ...formData,
                            village: vName,
                            village_mr: vNameMr,
                          });
                        }}
                        disabled={villages.length === 0}
                        className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="">
                          {isLoadingLocations
                            ? 'Loading villages...'
                            : villages.length > 0
                            ? `-- Select Village (${villages.length} available) --`
                            : '-- Select District / Taluka first --'}
                        </option>
                        {(villageSearch.trim()
                          ? villages.filter((v: any) =>
                              (v.village_name || v.name_en || v.name || '')
                                .toLowerCase()
                                .includes(villageSearch.toLowerCase())
                            )
                          : villages.slice(0, 400)
                        ).map((v: any, idx: number) => {
                          const vName = v.village_name || v.name_en || v.name;
                          return (
                            <option key={`${v.id || idx}-${vName}`} value={vName}>
                              {vName} {v.pincode ? `(${v.pincode})` : ''}
                            </option>
                          );
                        })}
                      </select>

                      {/* Quick Filter Search Bar for Village Dropdown if many villages */}
                      {villages.length > 15 && (
                        <div className="relative">
                          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={villageSearch}
                            onChange={(e) => setVillageSearch(e.target.value)}
                            placeholder={`Filter ${villages.length} villages in dropdown...`}
                            className="w-full bg-slate-100 dark:bg-slate-900 border theme-border rounded-lg pl-7 pr-2.5 py-1 text-[11px] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status info bar */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border theme-border flex items-center justify-between text-[11px] theme-text-secondary">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    Selected: <strong>{formData.district || 'None'}</strong> &rarr;{' '}
                    <strong>{formData.taluka || 'All'}</strong> &rarr;{' '}
                    <strong className="text-blue-600 dark:text-blue-400">{formData.village || 'Not selected'}</strong>
                  </span>
                </div>
                {isLoadingLocations && (
                  <span className="inline-flex items-center gap-1 text-blue-600 animate-pulse text-[10px]">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Loading location data...
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Property Identity & Multi-unit Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
                Property / Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                placeholder="e.g. Deepali Residency / Sunrise Heights"
                className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold theme-text-secondary mb-1.5">CTS / Survey Number</label>
              <input
                type="text"
                value={formData.ctsNumber}
                onChange={(e) => setFormData({ ...formData, ctsNumber: e.target.value })}
                placeholder="e.g. CTS-1284"
                className="w-full theme-input border rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold theme-text-secondary mb-1.5">
              Property Units / Flat Numbers (Multi-unit Support)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl theme-input border">
              {formData.propertyNumbers.map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-mono flex items-center gap-1.5"
                >
                  <span>{chip}</span>
                  <button type="button" onClick={() => removePropertyChip(chip)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <input
                  type="text"
                  value={chipInput}
                  onChange={(e) => setChipInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPropertyChip())}
                  placeholder="Type unit (e.g. 235-FF) & press Enter"
                  className="bg-transparent border-none text-xs theme-text-primary placeholder-slate-400 focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={addPropertyChip}
                  className="p-1 rounded-md theme-card border theme-text-primary hover:border-blue-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t theme-border">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={!formData.propertyName}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>Next: Upload Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Upload with Sub-type Hierarchy */}
      {currentStep === 3 && (
        <div className="p-5 sm:p-6 rounded-lg theme-surface border space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold theme-text-primary flex items-center gap-2 pb-2 border-b theme-border">
            <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Document Intake & Sub-Type Classification</span>
          </h2>

          {/* Upload Dropzone */}
          <div className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-lg p-6 text-center transition-colors bg-slate-50/50 dark:bg-slate-900/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold theme-text-primary">Drag & drop scanned title deeds, NOCs, or Index-II PDFs</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Supports PDF, JPG, PNG, DOCX (up to 50MB per file)</p>
            <label className="mt-3 inline-block px-3.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs transition-colors">
              <span>Browse Files</span>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Uploaded Documents List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold theme-text-secondary">Classify Attached Documents ({uploadedFiles.length})</h3>
              {uploadedFiles.map((item, idx) => {
                const isOther = item.docType.startsWith('Others(') || item.docType === 'Other';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl theme-card border flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold theme-text-primary">{item.file.name}</p>
                        <p className="text-[10px] theme-text-muted font-mono">
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Main Doc Type Dropdown */}
                      <select
                        value={isOther ? 'Other' : item.docType}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = [...uploadedFiles];
                          if (val === 'Other') {
                            updated[idx].docType =
                              docTypesData?.other_document_types?.[0]?.document_type || 'Others(Society NOC)';
                          } else {
                            updated[idx].docType = val;
                          }
                          setUploadedFiles(updated);
                        }}
                        className="theme-input border rounded-lg px-2.5 py-1.5 text-xs theme-text-primary focus:outline-none font-medium"
                      >
                        <option value="Auto-Detect">✨ Auto-Detect by AI (Recommended)</option>
                        {docTypesData?.document_types?.map((d) => (
                          <option key={d.id} value={d.document_type}>
                            {d.document_type}
                          </option>
                        ))}
                      </select>

                      {/* Secondary Sub-Type Dropdown for "Other" */}
                      {isOther && (
                        <select
                          value={item.docType}
                          onChange={(e) => {
                            const updated = [...uploadedFiles];
                            updated[idx].docType = e.target.value;
                            setUploadedFiles(updated);
                          }}
                          className="bg-indigo-500/10 border border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-indigo-700 dark:text-indigo-200"
                        >
                          {docTypesData?.other_document_types?.map((o) => (
                            <option key={o.id} value={o.document_type}>
                              {o.document_type.replace(/^Others\((.*)\)$/, '$1')}
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={() => removeUploadedFile(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-3 border-t theme-border">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Queue Verification</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
