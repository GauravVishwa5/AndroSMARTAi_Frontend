'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  Database,
  FileText,
  ShieldAlert,
  Settings,
  PlusCircle,
  Sparkles,
  Building,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

export function Sidebar() {
  const pathname = usePathname();
  const { hasModuleAccess, isAdmin } = useEntitlements();

  const navItems = [
    {
      label: 'Branch Dashboard',
      href: '/branch',
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: 'Legal Scrutiny Queue',
      href: '/legal',
      icon: FileCheck2,
      show: true,
      badge: '42',
    },
    {
      label: 'Property Requests',
      href: '/requests',
      icon: FileSpreadsheet,
      show: true,
    },
    {
      label: 'New Request Wizard',
      href: '/requests/new',
      icon: PlusCircle,
      show: true,
      highlight: true,
    },
    {
      label: 'IGR Land Registry',
      href: '/requests/search',
      icon: Database,
      show: hasModuleAccess('due_diligence') || isAdmin,
    },
    {
      label: 'LSR & SCR Reports',
      href: '/requests/reports',
      icon: FileText,
      show: hasModuleAccess('case_analyzer') || isAdmin,
    },
    {
      label: 'System Health & Scrapers',
      href: '/admin',
      icon: ShieldAlert,
      show: isAdmin,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand logo & title */}
      <div>
        <div className="h-16 border-b border-slate-800 px-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
              AndroPVS
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Property Verification</p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <Link
            href="/requests/new"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all group"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create New Request</span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* AI Status Badge at bottom */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-indigo-200">AI Title Scrutiny</p>
            <p className="text-[11px] text-slate-400 mt-0.5">GPT-4 OCR Extraction Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
