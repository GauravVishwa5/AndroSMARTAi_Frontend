'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';
import { useUIStore } from '@/lib/store/uiStore';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  LogOut,
  Building2,
  Sun,
  Moon,
  ChevronRight,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { toggleMobileMenu } = useUIStore();
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
    <header className="h-14 sm:h-16 border-b theme-border theme-surface px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Toggle + Dynamic Breadcrumbs & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        {/* Mobile Hamburger (< lg) */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border theme-border"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo (< lg) */}
        <div className="lg:hidden shrink-0">
          <Logo variant="icon" size="sm" showBadge={false} href="/branch" />
        </div>

        {/* Dynamic Breadcrumbs (Desktop) */}
        <nav aria-label="Breadcrumb" className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
            Portal
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              <Link
                href={crumb.href}
                className={`${
                  idx === breadcrumbs.length - 1
                    ? 'text-[#1D4ED8] dark:text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                } transition-colors`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search REQ-#, Owner, CTS..."
            aria-label="Global search"
            className="w-full theme-input border border-slate-300 dark:border-slate-700 rounded-md pl-8 pr-12 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <div className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 items-center px-1 rounded bg-slate-100 dark:bg-slate-800 border theme-border text-[10px] text-slate-500 font-mono pointer-events-none">
            Ctrl K
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Context / Branch Indicator (Desktop only) */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/70 dark:bg-slate-800/60 border theme-border text-xs text-slate-700 dark:text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {pathname.startsWith('/admin') ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200">System Admin</span>
          ) : pathname.startsWith('/legal') ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200">Legal Scrutiny Cell</span>
          ) : (
            <span className="truncate max-w-[160px]">Axis Bank — Andheri West</span>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
          className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border theme-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          title="Notifications"
          aria-label="Notifications"
          className="relative p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border theme-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1D4ED8] rounded-full" />
        </button>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l theme-border">
          <div className="w-7 h-7 rounded-md bg-[#1D4ED8] flex items-center justify-center font-bold text-xs text-white shrink-0 select-none">
            {user?.first_name
              ? user.first_name[0]
              : user?.username?.toLowerCase().includes('admin') || pathname.startsWith('/admin')
              ? 'A'
              : user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <p className="text-xs font-semibold theme-text-primary truncate max-w-[130px]">
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ''}`
                : user?.username === 'admin' || pathname.startsWith('/admin')
                ? 'System Admin'
                : user?.username || 'Branch Officer'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[130px]">
              {user?.role || (pathname.startsWith('/admin') ? 'Super Admin' : pathname.startsWith('/legal') ? 'Legal Counsel' : 'Officer')}
            </p>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex items-center gap-1 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
