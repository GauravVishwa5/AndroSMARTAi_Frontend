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
    city: 'Mumbai',
    village: '',
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


  // When state changes to Delhi, fetch Delhi SROs
  useEffect(() => {
    if (formData.state === 'Delhi') {
      requestsApi
        .getDelhiSROs()
        .then((sros) => setDelhiSros(sros))
        .catch(() => {
          setDelhiSros([
            { sro_id: '95', sro_name: 'SR VI-A - Pitampura' },
            { sro_id: '96', sro_name: 'SR VI-B - Rohini' },
          ]);
        });
    } else if (formData.state === 'Maharashtra') {
      requestsApi
        .getDistricts()
        .then((dist) => setDistricts(dist))
        .catch(() => {
          setDistricts([
            { id: 1, district_name: 'Mumbai Suburban', state_id: 1 },
            { id: 2, district_name: 'Pune', state_id: 1 },
            { id: 3, district_name: 'Thane', state_id: 1 },
          ]);
        });
    }
  }, [formData.state]);

  // When Delhi SRO selected, fetch Localities
  useEffect(() => {
    if (formData.state === 'Delhi' && formData.sro_id) {
      requestsApi
        .getDelhiLocalities(formData.sro_id)
        .then((locs) => setDelhiLocalities(locs))
        .catch(() => {
          setDelhiLocalities([{ locality_name: 'Deepali' }, { locality_name: 'Shakurpur' }, { locality_name: 'Pitampura' }]);
        });
    }
  }, [formData.state, formData.sro_id]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newItems = filesArray.map((file) => ({
        file,
        docType: docTypesData?.document_types?.[0]?.document_type || 'builder agreement',
      }));
      setUploadedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create BankForm
      const payload: any = {
        ownerName: formData.ownerName,
        applicantName: formData.applicantName || formData.ownerName,
        propertyName: formData.propertyName,
        bankName: formData.bankName,
        Bank_branch: formData.Bank_branch,
        flatNumber: formData.flatNumber,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        village: formData.village,
        pinCode: formData.pinCode,
        ctsNumber: formData.ctsNumber,
        propertyNumber: formData.propertyNumbers,
        from_year: formData.from_year,
        caseType: formData.caseType,
        transactionType: formData.transactionType,
        advocateName: formData.advocateName,
        searchName: formData.searchName,
        category: formData.category,
      };

      const created = await requestsApi.createRequest(payload);
      const reqId = created.id; // e.g. "REQ-349"

      // 2. Upload Documents & Enqueue Celery OCR if files attached
      if (uploadedFiles.length > 0) {
        const files = uploadedFiles.map((u) => u.file);
        const docTypes = uploadedFiles.map((u) => u.docType);
        await documentsApi.queueOcrAndUpload(reqId, files, docTypes);
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
      <div className="p-6 rounded-2xl theme-surface border backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold theme-text-primary tracking-tight">Create Property Request (BankForm)</h1>
            <p className="text-xs theme-text-secondary mt-1">Initiate property title investigation and document OCR queue</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
            Step {currentStep} of 3
          </span>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {[
            { step: 1, title: '1. Bank & Case Details' },
            { step: 2, title: '2. Geography & Property' },
            { step: 3, title: '3. Document Upload' },
          ].map((s) => (
            <div
              key={s.step}
              className={`h-2 rounded-full transition-all ${
                currentStep >= s.step ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
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
        <div className="p-6 rounded-2xl theme-surface border space-y-4">
          <h2 className="text-sm font-bold theme-text-primary flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Bank & Case Intake Details</span>
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Property Owner Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Ajay Kumar"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Applicant Name</label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Ajay Kumar (leave empty if same as owner)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bank Branch</label>
              <input
                type="text"
                value={formData.Bank_branch}
                onChange={(e) => setFormData({ ...formData, Bank_branch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Case Type</label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General / Standard</option>
                <option value="SRA">SRA (Slum Rehabilitation Authority)</option>
                <option value="Resale">Resale</option>
                <option value="Builder Purchase">Builder Purchase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">From Year (Search Range)</label>
              <input
                type="number"
                value={formData.from_year}
                onChange={(e) => setFormData({ ...formData, from_year: parseInt(e.target.value) || 2000 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!formData.ownerName}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              <span>Next: Geography & Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Geography & Property */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl theme-surface border space-y-4">
          <h2 className="text-sm font-bold theme-text-primary flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Property & Land Registry Geography</span>
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi (DORIS IGR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai / New Delhi"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pin Code</label>
              <input
                type="text"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                placeholder="110034"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conditional Delhi SRO & Locality vs Maharashtra Cascading */}
          {formData.state === 'Delhi' ? (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-3">
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                Delhi DORIS Land Registry Fields
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sub-Registrar Office (SR. Office) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.sro_id}
                    onChange={(e) => setFormData({ ...formData, sro_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select SRO</option>
                    {delhiSros.map((s) => (
                      <option key={s.sro_id} value={s.sro_id}>
                        {s.sro_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Locality Name <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Locality</option>
                    {delhiLocalities.map((l, i) => (
                      <option key={i} value={l.locality_name}>
                        {l.locality_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">District</label>
                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.district_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Village / Locality</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Borivali / Andheri"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Property Identity & Multi-unit Chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Property / Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                placeholder="e.g. Deepali Residency / Sunrise Heights"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CTS / Survey Number</label>
              <input
                type="text"
                value={formData.ctsNumber}
                onChange={(e) => setFormData({ ...formData, ctsNumber: e.target.value })}
                placeholder="e.g. CTS-1284"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Property Units / Flat Numbers (Multi-unit Support)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-700">
              {formData.propertyNumbers.map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-mono flex items-center gap-1.5"
                >
                  <span>{chip}</span>
                  <button type="button" onClick={() => removePropertyChip(chip)} className="hover:text-red-400">
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
                  className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={addPropertyChip}
                  className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={!formData.propertyName}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
            >
              <span>Next: Upload Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Upload with Sub-type Hierarchy */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl theme-surface border space-y-5">
          <h2 className="text-sm font-bold theme-text-primary flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Document Intake & Sub-Type Classification</span>
          </h2>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed theme-border hover:border-blue-500/60 rounded-2xl p-8 text-center transition-all theme-card">
            <Upload className="w-10 h-10 text-blue-500 dark:text-blue-400 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-semibold theme-text-primary">Drag & drop scanned title deeds, NOCs, or Index-II PDFs</p>
            <p className="text-xs theme-text-secondary mt-1">Supports PDF, JPG, PNG, DOCX (up to 50MB per file)</p>
            <label className="mt-4 inline-block px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md">
              <span>Browse Files</span>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>


          {/* Uploaded Documents List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300">Classify Attached Documents ({uploadedFiles.length})</h3>
              {uploadedFiles.map((item, idx) => {
                const isOther = item.docType.startsWith('Others(') || item.docType === 'Other';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-white">{item.file.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
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
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
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
                          className="bg-indigo-950 border border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-indigo-200"
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
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
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Queue OCR Extraction</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
