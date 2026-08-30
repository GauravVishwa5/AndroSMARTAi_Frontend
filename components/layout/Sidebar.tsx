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
  PlusCircle,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useUIStore } from '@/lib/store/uiStore';
import { Logo } from '@/components/ui/Logo';

export function Sidebar() {
  const pathname = usePathname();
  const { hasModuleAccess, isAdmin } = useEntitlements();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

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
      badgeColor: 'amber',
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
      label: 'System Health & AI',
      href: '/admin',
      icon: ShieldAlert,
      show: isAdmin,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo Header */}
        <div className="h-16 border-b theme-border px-5 flex items-center justify-between">
          <Logo variant="nobg" size="sm" showBadge={true} href="/branch" />
          {/* Close button on mobile */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3.5">
          <Link
            href="/requests/new"
            onClick={closeMobileMenu}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 transition-all group active:scale-95"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create New Request</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 space-y-1 mt-1">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspaces
          </p>
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* AI Copilot & Status Pill at Bottom */}
      <div className="p-3.5 border-t theme-border">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 dark:from-indigo-950/40 dark:to-slate-900/60 border border-indigo-500/20 flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-200">AI Title Scrutiny</p>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">GPT-4 Extraction Active</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex lg:w-64 border-r theme-border theme-surface flex-col justify-between shrink-0 h-screen sticky top-0 transition-colors z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer (< 1024px) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />

          {/* Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full theme-surface border-r theme-border h-full shadow-2xl z-50 animate-slideInLeft">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
