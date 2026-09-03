'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { applicantApi, ApplicantApplicationSummary } from '@/lib/api/applicant';
import {
  FileText,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Building,
  MapPin,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export default function ApplicantDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicantApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicantApi.getApplications();
      setApplications(data.applications || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError(err.response?.data?.detail || 'Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('andropvs_user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUserEmail(u.email || u.username || '');
        } catch {
          // ignore
        }
      }
    }
    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('andropvs_token');
    localStorage.removeItem('andropvs_user');
    localStorage.removeItem('andropvs_modules');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-[#111827]/90 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#1D4ED8]/20 border border-[#1D4ED8]/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">PVS</span>
              <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Applicant Title Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                Logged in as <strong className="text-slate-200 font-medium">{userEmail}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Your Loan Applications</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track the legal title verification and document status of your submitted properties.
            </p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/30 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mb-2.5 text-blue-500" />
            <p className="text-xs">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-10 text-center max-w-md mx-auto shadow-2xs">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2.5" />
            <h3 className="text-sm font-semibold text-white">No Applications Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              No active property verification requests are currently associated with your email address.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => router.push(`/applicant/applications/${app.application_number || app.id}`)}
                className="group relative bg-[#111827] hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-lg p-5 transition-colors cursor-pointer shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-800">
                        {app.application_number}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                        {app.property_name || 'Property Verification'}
                      </h3>
                    </div>

                    <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800">
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-5">
                    {app.bank_name && (
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Lending Bank: <strong className="text-slate-200">{app.bank_name}</strong></span>
                      </div>
                    )}
                    {(app.city || app.district) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Location: <strong className="text-slate-200">{[app.city, app.district].filter(Boolean).join(', ')}</strong></span>
                      </div>
                    )}
                    {app.created_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  {app.pending_deficiencies_count > 0 ? (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                      <span>{app.pending_deficiencies_count} Action Required</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500">All requested documents submitted</span>
                  )}

                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-400">
                    <span>View Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
