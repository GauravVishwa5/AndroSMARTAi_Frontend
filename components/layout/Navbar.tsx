'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  LogOut,
  Building2,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  Command,
} from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const pathname = usePathname();

  // Generate dynamic breadcrumb segments
  const getBreadcrumbs = () => {
    if (!pathname || pathname === '/') return [{ label: 'Overview', href: '/' }];
    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === 'branch') label = 'Branch Operations';
      if (segment === 'legal') label = 'Legal Scrutiny Queue';
      if (segment === 'requests') label = 'Property Requests';
      if (segment === 'new') label = 'New Request Wizard';
      if (segment === 'reports') label = 'LSR / SCR Reports';
      if (segment === 'search') label = 'IGR Land Registry';
      if (segment === 'admin') label = 'System Health';
      if (segment.startsWith('REQ-')) label = `Case ${segment}`;

      crumbs.push({ label, href: currentPath });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Breadcrumbs & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        {/* Dynamic Breadcrumbs */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Link href="/" className="hover:text-slate-200 transition-colors">
            Portal
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <Link
                href={crumb.href}
                className={`${
                  idx === breadcrumbs.length - 1
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                } transition-colors`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by REQ-#, Owner, CTS No, Property..."
            className="w-full bg-slate-800/60 dark:bg-slate-900/80 border border-slate-700/60 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-700/50 border border-slate-600/50 text-[10px] text-slate-400 font-mono pointer-events-none">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active Branch Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 shadow-sm">
          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate max-w-[180px]">Axis Bank &mdash; Andheri West</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 transition-all"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-blue-400" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>

        {/* User Profile Menu */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-blue-500/20">
            {user?.first_name ? user.first_name[0] : user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-semibold text-slate-200">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {user?.is_admin ? 'Super Admin' : 'Legal Investigator'}
            </p>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
