'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Building2,
  ShieldCheck,
  FileCheck2,
  Database,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
  Lock,
  ChevronRight,
  Layers,
  Cpu,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';


export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, initializeFromStorage } = useAuthStore();

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between sticky top-0 z-30">
        <div>
          <Logo variant="nobg" size="lg" showBadge={true} subtitle="Property Verification & Due-Diligence" href="/" />
        </div>


        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/branch"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
          >
            <span>Open Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 sm:py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Legal Due Diligence for Banks & NBFCs</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Accelerate Property Title Clearances with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
              Automated AI Scrutiny.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Direct integration with Maharashtra IGR & Delhi DORIS land registries, high-speed multi-page OCR document extraction, and 1-click generation of Legal Search Reports (LSR) & Summary of Charges (SCR).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/branch"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Enter Branch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/requests/new"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-blue-400" />
              <span>Create BankForm Request</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 backdrop-blur-md space-y-3 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">IGR Land Registry Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated multi-year scraping across Maharashtra IGR and Delhi DORIS portals. Instant dual-language translation (English & Marathi Devanagari).
            </p>
            <Link href="/requests/search" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline pt-2">
              <span>Explore IGR Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 backdrop-blur-md space-y-3 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Celery OCR & AI Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Asynchronous Tesseract OCR workers with real-time SSE progress tracking. GPT-4 structured legal JSON parsing for ownership chain and encumbrances.
            </p>
            <Link href="/legal" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:underline pt-2">
              <span>View Scrutiny Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 backdrop-blur-md space-y-3 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">WOPI Microsoft Word Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              4-stream parallel GPT compilation into polished DOCX reports (LSR / SCR / SR) with embedded Microsoft Office Online live collaborative editing.
            </p>
            <Link href="/requests/REQ-349" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline pt-2">
              <span>Open Report Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Launchpad Links */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Workspace Navigation</h4>
              <p className="text-xs text-slate-400">Quickly jump into active due-diligence files</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/branch"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Branch Dashboard
            </Link>
            <Link
              href="/legal"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Legal Scrutiny
            </Link>
            <Link
              href="/requests"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              All Requests
            </Link>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              System Health
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 sm:px-12 py-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 AndroPVS Platform. Built for Bank Legal Operations & Property Verification.</p>
      </footer>
    </div>
  );
}
