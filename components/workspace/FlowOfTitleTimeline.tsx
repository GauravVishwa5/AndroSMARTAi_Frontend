'use client';

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  UserCheck,
  Edit2,
  Check,
  X,
} from 'lucide-react';

export interface TimelineNode {
  id: string;
  year: string;
  date: string;
  deedType: string;
  regNo: string;
  vendor: string;
  vendee: string;
  consideration: string;
  sro: string;
  propertyDesc: string;
  status: 'verified' | 'pending' | 'flagged';
  isCurrentBorrower?: boolean;
  docId?: string;
}

interface FlowOfTitleTimelineProps {
  requestId: string;
  ownerName: string;
  propertyName: string;
  flatNumber: string;
  bankBranch: string;
  docs?: any[];
  onSelectDoc?: (docIndex: number) => void;
}

export const FlowOfTitleTimeline: React.FC<FlowOfTitleTimelineProps> = ({
  requestId,
  ownerName = '',
  propertyName = '',
  flatNumber = '',
  bankBranch = '',
  docs = [],
  onSelectDoc,
}) => {
  const effectiveOwner = ownerName || '';
  const effectiveBank = bankBranch || '';

  // Build authentic chain of title strictly from verified documents/evidence
  const buildInitialNodes = (): TimelineNode[] => {
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
      return [];
    }

    const titleDocs = docs.filter((d: any) => {
      const t = (d.type || d.document_type || d.name || '').toLowerCase();
      return (
        t.includes('sale') ||
        t.includes('conveyance') ||
        t.includes('allotment') ||
        t.includes('title') ||
        t.includes('deed') ||
        t.includes('mortgage') ||
        t.includes('modtd') ||
        t.includes('gift') ||
        t.includes('release')
      );
    });

    if (titleDocs.length === 0) {
      return [];
    }

    return titleDocs.map((d: any, idx: number) => {
      const ext = d.extracted_json || d.extracted_data || d.extracted || {};
      const year = ext.year || ext.execution_year || (d.created_at ? String(new Date(d.created_at).getFullYear()) : (d.date ? String(d.date).slice(0, 4) : ''));
      const vendor = ext.vendor || ext.seller || ext.executant || ext.party1 || 'Extracted Vendor';
      const vendee = ext.vendee || ext.buyer || ext.claimant || ext.party2 || effectiveOwner || 'Extracted Vendee';
      const consideration = ext.consideration || ext.amount || ext.market_value ? `Rs. ${ext.consideration || ext.amount || ext.market_value}` : 'As per deed';

      return {
        id: `node-${d.id || idx}`,
        year: year || 'N/A',
        date: d.created_at || d.date || year || 'N/A',
        deedType: d.type || d.document_type || 'Title Document',
        regNo: ext.registration_number || ext.doc_number || d.id || 'N/A',
        vendor: vendor,
        vendee: vendee,
        consideration: consideration,
        sro: ext.sro || ext.sub_registrar || 'SRO',
        propertyDesc: ext.property_description || propertyName || 'Subject Property',
        status: (d.verification_status === 'Verified' ? 'verified' : 'pending') as any,
        isCurrentBorrower: Boolean(effectiveOwner && vendee.toLowerCase().includes(effectiveOwner.toLowerCase())),
        docIndex: idx,
      };
    }).sort((a, b) => {
      const yA = parseInt(a.year) || 0;
      const yB = parseInt(b.year) || 0;
      return yA - yB;
    });
  };

  const [nodes, setNodes] = useState<TimelineNode[]>(buildInitialNodes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const [nodeForm, setNodeForm] = useState<Partial<TimelineNode>>({
    year: '2020',
    date: '',
    deedType: 'Registered Sale Deed',
    regNo: '',
    vendor: '',
    vendee: '',
    consideration: '',
    sro: '',
    propertyDesc: propertyName,
    status: 'verified',
  });

  // Re-sync nodes whenever docs or case context changes
  useEffect(() => {
    setNodes(buildInitialNodes());
  }, [docs, effectiveOwner, propertyName]);

  const handleOpenAddModal = () => {
    setEditingNodeId(null);
    setNodeForm({
      year: '2010',
      date: '15-May-2010',
      deedType: 'Registered Sale Deed',
      regNo: 'Doc #3210/Book-I',
      vendor: '',
      vendee: '',
      consideration: 'Rs. 45,00,000',
      sro: 'SRO Office',
      propertyDesc: propertyName,
      status: 'verified',
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (node: TimelineNode) => {
    setEditingNodeId(node.id);
    setNodeForm({ ...node });
    setShowAddModal(true);
  };

  const handleSaveNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeForm.vendor || !nodeForm.vendee) return;

    if (editingNodeId) {
      // Edit existing node
      setNodes((prev) =>
        prev
          .map((n) =>
            n.id === editingNodeId
              ? ({
                  ...n,
                  year: nodeForm.year || n.year,
                  date: nodeForm.date || n.date,
                  deedType: nodeForm.deedType || n.deedType,
                  regNo: nodeForm.regNo || n.regNo,
                  vendor: nodeForm.vendor || n.vendor,
                  vendee: nodeForm.vendee || n.vendee,
                  consideration: nodeForm.consideration || n.consideration,
                  sro: nodeForm.sro || n.sro,
                } as TimelineNode)
              : n
          )
          .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      );
    } else {
      // Add new node
      const item: TimelineNode = {
        id: `node-${Date.now()}`,
        year: nodeForm.year || '2015',
        date: nodeForm.date || '01-Jan-2015',
        deedType: nodeForm.deedType || 'Deed',
        regNo: nodeForm.regNo || 'Doc #100/Book-I',
        vendor: nodeForm.vendor,
        vendee: nodeForm.vendee,
        consideration: nodeForm.consideration || 'Consideration Paid',
        sro: nodeForm.sro || 'SRO Record',
        propertyDesc: nodeForm.propertyDesc || propertyName,
        status: (nodeForm.status as any) || 'verified',
      };

      setNodes((prev) => [...prev, item].sort((a, b) => parseInt(a.year) - parseInt(b.year)));
    }

    setShowAddModal(false);
    setEditingNodeId(null);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  // Robust chain link continuity verification
  const continuityGaps: string[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const prevVendee = nodes[i - 1].vendee.toLowerCase().trim();
    const currVendor = nodes[i].vendor.toLowerCase().trim();
    const isProposedMortgage = nodes[i].deedType.toLowerCase().includes('mortgage') || nodes[i].deedType.toLowerCase().includes('modtd');

    // Extract first significant name token for flexible matching
    const prevTokens = prevVendee.split(/[\s,\/()]+/).filter((t) => t.length > 2 && !['mr', 'mrs', 'shri', 'smt', 'dr'].includes(t));
    const currTokens = currVendor.split(/[\s,\/()]+/).filter((t) => t.length > 2 && !['mr', 'mrs', 'shri', 'smt', 'dr'].includes(t));

    const hasMatch = prevTokens.some((t) => currVendor.includes(t)) || currTokens.some((t) => prevVendee.includes(t));

    if (!hasMatch) {
      continuityGaps.push(
        `Potential devolution gap between ${nodes[i - 1].year} (${nodes[i - 1].vendee}) and ${nodes[i].year} (${nodes[i].vendor})`
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Banner & Continuity Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-white dark:bg-slate-900 border theme-border shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold theme-text-primary">
              30-Year Chain of Title Devolution Graph
            </h3>
            <p className="text-[11px] text-slate-500">
              Sequential legal ownership genealogy from parent allotment to current mortgagor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {nodes.length === 0 ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border theme-border">
              <span>No Title Deeds</span>
            </span>
          ) : continuityGaps.length === 0 ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chain Intact (Unbroken)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{continuityGaps.length} Potential Gap(s)</span>
            </span>
          )}

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Title Deed</span>
          </button>
        </div>
      </div>

      {/* Timeline Steps Visualization */}
      {nodes.length > 0 ? (
        <div className="relative pl-6 sm:pl-7 space-y-4 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-300 dark:before:bg-slate-700">
        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;
          const isFirst = index === 0;

          return (
            <div key={node.id} className="relative group">
              {/* Node Bullet Marker */}
              <div
                className={`absolute -left-6 sm:-left-7 top-3 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-2xs ${
                  isLast
                    ? 'bg-[#1D4ED8]'
                    : isFirst
                    ? 'bg-slate-700'
                    : 'bg-emerald-600'
                }`}
              />

              {/* Node Card */}
              <div
                className={`p-3.5 rounded-lg border shadow-2xs transition-colors ${
                  isLast
                    ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">
                      {node.year}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {node.deedType}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span>{node.date}</span>
                    <span>&bull;</span>
                    <span className="text-[#1D4ED8] dark:text-blue-400 font-semibold">{node.regNo}</span>

                    {/* Action Controls: Edit & Delete */}
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleOpenEditModal(node)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit title deed details"
                        aria-label="Edit deed details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {nodes.length > 2 && (
                        <button
                          onClick={() => handleDeleteNode(node.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete deed from chain"
                          aria-label="Delete deed from chain"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parties & Devolution Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5 text-xs">
                  <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                      Grantor / Transferor (Vendor)
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{node.vendor}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      Grantee / Transferee (Vendee)
                    </span>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-300">{node.vendee}</p>
                  </div>
                </div>

                {/* Consideration & Jurisdiction Details */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                  <div>
                    Consideration: <strong className="text-slate-800 dark:text-slate-200">{node.consideration}</strong>
                  </div>
                  <div>
                    SRO: <span className="font-medium text-slate-700 dark:text-slate-300">{node.sro}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div className="p-8 text-center rounded-lg bg-white dark:bg-slate-900 border theme-border shadow-2xs">
          <GitBranch className="w-10 h-10 mx-auto text-slate-400 mb-3 opacity-60" />
          <h4 className="text-sm font-semibold theme-text-primary">No title-chain evidence available</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            No registered sale deeds, conveyance deeds, or chain documents have been uploaded or extracted for this case yet. Upload title instruments or execute an IGR registry search to reconstruct the sequential chain of devolution.
          </p>
        </div>
      )}

      {/* ── MODAL: Add / Edit Chain of Title Node ─────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <GitBranch className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {editingNodeId ? 'Edit Title Devolution Link' : 'Add Title Devolution Link'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNode} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Registration Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={nodeForm.year}
                    onChange={(e) => setNodeForm({ ...nodeForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Execution Date
                  </label>
                  <input
                    type="text"
                    value={nodeForm.date}
                    onChange={(e) => setNodeForm({ ...nodeForm, date: e.target.value })}
                    placeholder="e.g. 14-Aug-2020"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document / Deed Type *
                </label>
                <select
                  required
                  value={nodeForm.deedType}
                  onChange={(e) => setNodeForm({ ...nodeForm, deedType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">-- Select Document / Deed Type --</option>
                  <option value="Parent Allotment / Conveyance Deed">Parent Allotment / Conveyance Deed</option>
                  <option value="Absolute Registered Sale Deed">Absolute Registered Sale Deed (विक्री दस्त)</option>
                  <option value="Agreement for Sale (Registered)">Agreement for Sale / साठेखत (Registered)</option>
                  <option value="Gift Deed">Gift Deed (बक्षीसपत्र / दानपत्र)</option>
                  <option value="Relinquishment / Release Deed">Relinquishment / Release Deed (हक्कसोड पत्र)</option>
                  <option value="Partition Deed">Partition Deed (वाटपपत्र / बंटवारा)</option>
                  <option value="Development Agreement & Power of Attorney">Development Agreement & General POA (विकास करार)</option>
                  <option value="Equitable / Simple Mortgage Deed">Equitable / Simple Mortgage Deed (गहाणखत)</option>
                  <option value="Rectification / Correction Deed">Rectification / Correction Deed (दुरुस्ती पत्र)</option>
                  <option value="Perpetual Lease / Lease Deed">Perpetual Lease / 99-Year Lease Deed (भाडेपट्टा)</option>
                  <option value="Will / Testamentary Succession">Will / Testamentary Succession (मृत्युपत्र)</option>
                  <option value="Legal Heir / Succession Certificate">Legal Heir / Succession Certificate (वारस नोंद)</option>
                  <option value="Society Share Certificate & NOC">Society Share Certificate & Sub-Lease NOC</option>
                  <option value="Declaration / Indemnity Bond">Declaration / Indemnity Bond</option>
                  <option value="Other Property Deed">Other Property Deed</option>
                </select>
                {nodeForm.deedType === 'Other Property Deed' && (
                  <input
                    type="text"
                    required
                    placeholder="Specify Custom Document / Deed Type"
                    value={nodeForm.deedType === 'Other Property Deed' ? '' : nodeForm.deedType}
                    onChange={(e) => setNodeForm({ ...nodeForm, deedType: e.target.value })}
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transferor / Vendor (Seller) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nodeForm.vendor}
                    onChange={(e) => setNodeForm({ ...nodeForm, vendor: e.target.value })}
                    placeholder="Seller / Allotting Authority"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transferee / Vendee (Buyer) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nodeForm.vendee}
                    onChange={(e) => setNodeForm({ ...nodeForm, vendee: e.target.value })}
                    placeholder="Buyer / Transferee Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Consideration Amount
                  </label>
                  <input
                    type="text"
                    value={nodeForm.consideration}
                    onChange={(e) => setNodeForm({ ...nodeForm, consideration: e.target.value })}
                    placeholder="e.g. Rs. 85,00,000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Registration No & SRO
                  </label>
                  <input
                    type="text"
                    value={nodeForm.regNo}
                    onChange={(e) => setNodeForm({ ...nodeForm, regNo: e.target.value })}
                    placeholder="Doc #8472/Book-I"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SRO Office Jurisdiction
                </label>
                <input
                  type="text"
                  value={nodeForm.sro}
                  onChange={(e) => setNodeForm({ ...nodeForm, sro: e.target.value })}
                  placeholder="e.g. SRO VI-A Pitampura"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md active:scale-95 transition-all"
                >
                  {editingNodeId ? 'Save Link Changes' : 'Insert Link into Devolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

