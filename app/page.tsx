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
    <div className="min-h-screen theme-canvas flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="h-16 sm:h-20 border-b theme-border theme-surface backdrop-blur-md px-4 sm:px-12 flex items-center justify-between sticky top-0 z-30">
        <div>
          <Logo variant="nobg" size="md" showBadge={true} subtitle="Property Verification & Due-Diligence" href="/" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/branch"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-95 whitespace-nowrap"
          >
            <span>Open Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>


      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 sm:py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Legal Due Diligence for Banks & NBFCs</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold theme-text-primary tracking-tight leading-tight">
            Accelerate Property Title Clearances with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-500 bg-clip-text text-transparent">
              Automated AI Scrutiny.
            </span>
          </h2>

          <p className="text-sm sm:text-base theme-text-secondary leading-relaxed max-w-2xl mx-auto">
            Direct integration with Maharashtra IGR & Delhi DORIS land registries, high-speed multi-page OCR document extraction, and 1-click generation of Legal Search Reports (LSR) & Summary of Charges (SCR).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/branch"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Enter Branch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/requests/new"
              className="flex items-center gap-2 px-6 py-3 rounded-xl theme-card border theme-text-primary font-semibold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Create BankForm Request</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl theme-surface border hover:border-blue-500/50 backdrop-blur-md space-y-3 transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold theme-text-primary tracking-tight">IGR Land Registry Search</h3>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Automated multi-year scraping across Maharashtra IGR and Delhi DORIS portals. Instant dual-language translation (English & Marathi Devanagari).
            </p>
            <Link href="/requests/search" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2">
              <span>Explore IGR Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl theme-surface border hover:border-indigo-500/50 backdrop-blur-md space-y-3 transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold theme-text-primary tracking-tight">Celery OCR & AI Extraction</h3>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Asynchronous Tesseract OCR workers with real-time SSE progress tracking. GPT-4 structured legal JSON parsing for ownership chain and encumbrances.
            </p>
            <Link href="/legal" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2">
              <span>View Scrutiny Queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl theme-surface border hover:border-emerald-500/50 backdrop-blur-md space-y-3 transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold theme-text-primary tracking-tight">WOPI Microsoft Word Studio</h3>
            <p className="text-xs theme-text-secondary leading-relaxed">
              4-stream parallel GPT compilation into polished DOCX reports (LSR / SCR / SR) with embedded Microsoft Office Online live collaborative editing.
            </p>
            <Link href="/requests/REQ-349" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-2">
              <span>Open Report Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Launchpad Links */}
        <div className="p-6 rounded-2xl theme-surface border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl theme-card border flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold theme-text-primary">Direct Workspace Navigation</h4>
              <p className="text-xs theme-text-secondary">Quickly jump into active due-diligence files</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/branch"
              className="px-3.5 py-2 rounded-xl theme-card border hover:border-blue-500 text-xs font-semibold theme-text-primary transition-colors"
            >
              Branch Dashboard
            </Link>
            <Link
              href="/legal"
              className="px-3.5 py-2 rounded-xl theme-card border hover:border-blue-500 text-xs font-semibold theme-text-primary transition-colors"
            >
              Legal Scrutiny
            </Link>
            <Link
              href="/requests"
              className="px-3.5 py-2 rounded-xl theme-card border hover:border-blue-500 text-xs font-semibold theme-text-primary transition-colors"
            >
              All Requests
            </Link>
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl theme-card border hover:border-blue-500 text-xs font-semibold theme-text-primary transition-colors"
            >
              System Health
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t theme-border theme-surface px-6 sm:px-12 py-6 text-center text-xs theme-text-muted">
        <p>&copy; 2026 AndroPVS Platform. Built for Bank Legal Operations & Property Verification.</p>
      </footer>
    </div>
  );
}
