'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileSpreadsheet,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Check,
  X,
  Loader2,
  ArrowUpDown,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { igrApi } from '@/lib/api/igr';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface IgrJobItem {
  job_id: string;
  state: 'Maharashtra' | 'Delhi';
  request_id?: string;
  district?: string;
  village?: string;
  property_number?: string;
  year_from?: number | string;
  year_to?: number | string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | string;
  created_at?: string;
  total_units?: number;
  records_inserted?: number;
  error_message?: string;
}

export default function AdminIgrJobsPage() {
  const [jobs, setJobs] = useState<IgrJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<'all' | 'Maharashtra' | 'Delhi'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Modals state
  const [editingJob, setEditingJob] = useState<IgrJobItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    property_number: '',
    village: '',
    district: '',
    year_from: '',
    year_to: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingJob, setDeletingJob] = useState<IgrJobItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [retryingJobId, setRetryingJobId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchJobs = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await igrApi.getAllIgrJobs({
        state: selectedState === 'all' ? undefined : selectedState,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchQuery ? searchQuery.trim() : undefined,
        limit: 100,
      });

      const fetchedItems: IgrJobItem[] = res?.items || [];
      setJobs(fetchedItems);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error('Failed to fetch IGR jobs:', err);
      if (!quiet) showToast('Failed to load IGR scrape jobs', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedState, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Auto-refresh interval (every 12 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchJobs(true);
    }, 12000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchJobs]);

  // Handle Edit Action
  const openEditModal = (job: IgrJobItem) => {
    setEditingJob(job);
    setEditFormData({
      status: job.status,
      property_number: job.property_number !== '-' ? (job.property_number || '') : '',
      village: job.village || '',
      district: job.district || '',
      year_from: job.year_from ? String(job.year_from) : '',
      year_to: job.year_to ? String(job.year_to) : '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setIsSavingEdit(true);
    try {
      const payload: Record<string, any> = {
        status: editFormData.status,
        property_number: editFormData.property_number || undefined,
        village: editFormData.village || undefined,
        district: editFormData.district || undefined,
        year_from: editFormData.year_from ? parseInt(editFormData.year_from, 10) : undefined,
        year_to: editFormData.year_to ? parseInt(editFormData.year_to, 10) : undefined,
      };

      await igrApi.updateIgrJob(editingJob.job_id, payload);
      showToast(`Job ${editingJob.job_id.slice(0, 8)} updated successfully`);
      setEditingJob(null);
      fetchJobs(true);
    } catch (err: any) {
      console.error('Failed to edit job:', err);
      showToast(err?.response?.data?.detail || 'Failed to update job', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete Action
  const handleDeleteJob = async () => {
    if (!deletingJob) return;

    setIsDeleting(true);
    try {
      await igrApi.deleteIgrJob(deletingJob.job_id);
      showToast(`Job ${deletingJob.job_id.slice(0, 8)} deleted successfully`);
      setDeletingJob(null);
      fetchJobs(true);
    } catch (err: any) {
      console.error('Failed to delete job:', err);
      showToast(err?.response?.data?.detail || 'Failed to delete job', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Retry Action
  const handleRetryJob = async (jobId: string) => {
    setRetryingJobId(jobId);
    try {
      await igrApi.retryIgrJob(jobId);
      showToast(`Job ${jobId.slice(0, 8)} re-queued for processing`);
      fetchJobs(true);
    } catch (err: any) {
      console.error('Failed to retry job:', err);
      showToast(err?.response?.data?.detail || 'Failed to retry job', 'error');
    } finally {
      setRetryingJobId(null);
    }
  };

  // Metrics computation
  const totalJobs = jobs.length;
  const inProgressJobs = jobs.filter((j) => ['PROCESSING', 'RUNNING', 'IN_PROGRESS', 'QUEUED'].includes(j.status)).length;
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED').length;
  const failedJobs = jobs.filter((j) => ['FAILED', 'ERROR', 'CANCELLED'].includes(j.status)).length;
  const totalRecordsScraped = jobs.reduce((acc, curr) => acc + (curr.records_inserted || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Completed
          </span>
        );
      case 'PROCESSING':
      case 'RUNNING':
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            Processing
          </span>
        );
      case 'QUEUED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Queued
          </span>
        );
      case 'FAILED':
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold theme-card border theme-text-secondary">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'super admin', 'developer', 'dev']}>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
              toastMessage.type === 'success'
                ? 'theme-surface border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                : 'theme-surface border-rose-500/40 text-rose-600 dark:text-rose-300'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold theme-text-primary tracking-tight">IGR Scrape Jobs & Telemetry</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs theme-text-secondary mt-1">
              Real-time monitor, edit, and control multi-year IGR registry scrape jobs across Maharashtra & Delhi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                autoRefresh
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'theme-card border theme-text-secondary hover:theme-text-primary'
              }`}
              title="Toggle 12s live auto-refresh"
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => fetchJobs(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl theme-surface border shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold theme-text-secondary uppercase tracking-wider">Total Scrape Jobs</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold theme-text-primary">{totalJobs}</div>
            <div className="mt-1 text-xs theme-text-muted">Maharashtra & Delhi registries</div>
          </div>

          <div className="p-4 rounded-2xl theme-surface border shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold theme-text-secondary uppercase tracking-wider">In-Progress / Queued</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgressJobs}</div>
            <div className="mt-1 text-xs text-blue-500/80">Active background scrapers</div>
          </div>

          <div className="p-4 rounded-2xl theme-surface border shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold theme-text-secondary uppercase tracking-wider">Completed Jobs</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedJobs}</div>
            <div className="mt-1 text-xs text-emerald-500/80">{totalRecordsScraped} records indexed</div>
          </div>

          <div className="p-4 rounded-2xl theme-surface border shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold theme-text-secondary uppercase tracking-wider">Failed / Cancelled</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{failedJobs}</div>
            <div className="mt-1 text-xs text-rose-500/80">Action required (retry/edit)</div>
          </div>
        </div>

        {/* Table & Filter Card */}
        <div className="p-6 rounded-2xl theme-surface border backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* State Switcher Tabs */}
              <div className="flex items-center theme-card p-1 rounded-xl border text-xs font-medium">
                {(['all', 'Maharashtra', 'Delhi'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedState === st
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'theme-text-secondary hover:theme-text-primary'
                    }`}
                  >
                    {st === 'all' ? 'All States' : st}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="theme-input border rounded-xl px-3 py-2 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="QUEUED">Queued</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Job ID, Request, Village, Property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full theme-input border rounded-xl pl-9 pr-4 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border theme-border overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center theme-text-secondary flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm">Fetching IGR Scrape Jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center theme-text-secondary flex flex-col items-center justify-center gap-3">
                <FileSpreadsheet className="w-10 h-10 theme-text-muted" />
                <p className="text-base font-semibold theme-text-primary">No IGR Scrape Jobs found</p>
                <p className="text-xs theme-text-muted max-w-sm">
                  Try adjusting your search query or state filters, or initiate a new multi-year scrape from a property request.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b theme-border bg-slate-500/5 theme-text-secondary uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Job ID & State</th>
                      <th className="py-3 px-4">Target Request</th>
                      <th className="py-3 px-4">Location & Property</th>
                      <th className="py-3 px-4">Years</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Progress / Records</th>
                      <th className="py-3 px-4">Created At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y theme-border theme-text-primary">
                    {jobs.map((job) => (
                      <tr key={job.job_id} className="hover:bg-slate-500/5 transition-colors group">
                        {/* Job ID & State */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-semibold theme-text-primary group-hover:text-blue-500 transition-colors">
                              {job.job_id.slice(0, 13)}...
                            </span>
                            <span
                              className={`inline-block w-fit mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                                job.state === 'Maharashtra'
                                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                                  : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                              }`}
                            >
                              {job.state}
                            </span>
                          </div>
                        </td>

                        {/* Request ID */}
                        <td className="py-3 px-4 font-mono font-medium theme-text-secondary">
                          {job.request_id || '-'}
                        </td>

                        {/* Location & Property */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium theme-text-primary">
                              {job.village || job.district || 'All Localities'}
                            </span>
                            <span className="text-[11px] theme-text-muted">
                              {job.district} {job.property_number && job.property_number !== '-' ? `• Prop #${job.property_number}` : ''}
                            </span>
                          </div>
                        </td>

                        {/* Year Range */}
                        <td className="py-3 px-4 font-mono theme-text-secondary">
                          {job.year_from && job.year_to
                            ? job.year_from === job.year_to
                              ? job.year_from
                              : `${job.year_from} - ${job.year_to}`
                            : '-'}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">{getStatusBadge(job.status)}</td>

                        {/* Progress / Records */}
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{job.records_inserted || 0}</span>
                            <span className="theme-text-muted">records</span>
                            {job.total_units && job.total_units > 1 && (
                              <span className="text-[10px] theme-text-muted theme-card border px-1.5 py-0.5 rounded">
                                {job.total_units} units
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Created At */}
                        <td className="py-3 px-4 theme-text-secondary">
                          {job.created_at ? new Date(job.created_at).toLocaleDateString() : '-'}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Retry button */}
                            <button
                              onClick={() => handleRetryJob(job.job_id)}
                              disabled={retryingJobId === job.job_id}
                              title="Retry / Re-queue Scrape Job"
                              className="p-1.5 rounded-lg theme-card border theme-text-secondary hover:theme-text-primary transition-colors disabled:opacity-50"
                            >
                              <RotateCcw
                                className={`w-3.5 h-3.5 ${retryingJobId === job.job_id ? 'animate-spin text-blue-500' : ''}`}
                              />
                            </button>

                            {/* Edit button */}
                            <button
                              onClick={() => openEditModal(job)}
                              title="Edit Job Parameters"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => setDeletingJob(job)}
                              title="Delete Scrape Job"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="theme-surface border theme-border rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b theme-border">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold theme-text-primary">Edit Scrape Job</h2>
                    <p className="text-xs theme-text-muted font-mono">Job: {editingJob.job_id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingJob(null)}
                  className="p-1.5 theme-text-secondary hover:theme-text-primary rounded-lg hover:bg-slate-500/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
                    Job Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full theme-input border rounded-xl px-3 py-2 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="QUEUED">QUEUED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
                      Year From
                    </label>
                    <input
                      type="number"
                      value={editFormData.year_from}
                      onChange={(e) => setEditFormData({ ...editFormData, year_from: e.target.value })}
                      placeholder="e.g. 2000"
                      className="w-full theme-input border rounded-xl px-3 py-2 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
                      Year To
                    </label>
                    <input
                      type="number"
                      value={editFormData.year_to}
                      onChange={(e) => setEditFormData({ ...editFormData, year_to: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full theme-input border rounded-xl px-3 py-2 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
                    Property Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.property_number}
                    onChange={(e) => setEditFormData({ ...editFormData, property_number: e.target.value })}
                    placeholder="e.g. 1029, Flat 402, CTS 120"
                    className="w-full theme-input border rounded-xl px-3 py-2 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
                      Village / Locality
                    </label>
                    <input
                      type="text"
                      value={editFormData.village}
                      onChange={(e) => setEditFormData({ ...editFormData, village: e.target.value })}
                      placeholder="e.g. Andheri, Vasant Kunj"
                      className="w-full theme-input border rounded-xl px-3 py-2 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-1.5">
                      District / SRO
                    </label>
                    <input
                      type="text"
                      value={editFormData.district}
                      onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                      placeholder="e.g. Mumbai Suburban, SRO-I"
                      className="w-full theme-input border rounded-xl px-3 py-2 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t theme-border">
                  <button
                    type="button"
                    onClick={() => setEditingJob(null)}
                    className="px-4 py-2.5 theme-card border rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    {isSavingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="theme-surface border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-rose-500 mb-3">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold theme-text-primary">Delete Scrape Job?</h3>
              </div>
              <p className="text-sm theme-text-secondary">
                Are you sure you want to delete job <span className="font-mono theme-text-primary font-semibold">{deletingJob.job_id}</span>?
                All associated scrape units and progress records will be permanently removed.
              </p>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingJob(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 theme-card border rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteJob}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
