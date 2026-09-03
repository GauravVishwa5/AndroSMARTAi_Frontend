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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">AndroPVS</span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Applicant Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                Logged in as <strong className="text-slate-200">{userEmail}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your Loan Applications</h1>
            <p className="text-sm text-slate-400 mt-1">
              Track the legal title verification and document status of your submitted properties.
            </p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
            <p className="text-sm">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center max-w-md mx-auto">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No Applications Found</h3>
            <p className="text-sm text-slate-400 mt-1">
              No active property verification requests are currently associated with your email address.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => router.push(`/applicant/applications/${app.application_number || app.id}`)}
                className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {app.application_number}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                        {app.property_name || 'Property Verification'}
                      </h3>
                    </div>

                    <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 mb-6">
                    {app.bank_name && (
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Lending Bank: <strong className="text-slate-300">{app.bank_name}</strong></span>
                      </div>
                    )}
                    {(app.city || app.district) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Location: <strong className="text-slate-300">{[app.city, app.district].filter(Boolean).join(', ')}</strong></span>
                      </div>
                    )}
                    {app.created_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Submitted on: {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  {app.pending_deficiencies_count > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{app.pending_deficiencies_count} Action Required</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No documents pending</span>
                  )}

                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>View Tracking</span>
                    <ChevronRight className="w-4 h-4" />
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
