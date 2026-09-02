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
  Activity,
  PlusCircle,
  Sparkles,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useUIStore } from '@/lib/store/uiStore';
import { useAuthStore } from '@/lib/store/authStore';
import { Logo } from '@/components/ui/Logo';

export function Sidebar() {
  const pathname = usePathname();
  const { hasModuleAccess, isAdmin } = useEntitlements();
  const { isMobileMenuOpen, closeMobileMenu, isSidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();

  const isSuperAdmin = Boolean(
    isAdmin ||
    user?.is_admin ||
    (typeof user?.role === 'string' && (user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('dev')))
  );

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
      show: hasModuleAccess('due_diligence') || isSuperAdmin,
    },
    {
      label: 'IGR Scrape Jobs',
      href: '/admin/igr-jobs',
      icon: Activity,
      show: isSuperAdmin,
      badge: 'Admin',
      badgeColor: 'blue',
    },
    {
      label: 'LSR & SCR Reports',
      href: '/requests/reports',
      icon: FileText,
      show: hasModuleAccess('case_analyzer') || isSuperAdmin,
    },
    {
      label: 'System Health & AI',
      href: '/admin',
      icon: ShieldAlert,
      show: isSuperAdmin,
    },
  ];

  const isItemActive = (href: string) => {
    if (pathname === href) return true;
    if (href === '/requests') {
      const sub = pathname?.replace('/requests', '').replace(/^\//, '').split('/')[0];
      const dedicatedRoutes = ['new', 'reports', 'search'];
      return Boolean(pathname?.startsWith('/requests/') && sub && !dedicatedRoutes.includes(sub));
    }
    return Boolean(pathname?.startsWith(href + '/') && href !== '/');
  };

  const renderSidebarContent = (isCollapsed: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo & Collapse Header */}
        <div className={`h-16 border-b theme-border px-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {isCollapsed ? (
            <button
              onClick={toggleSidebarCollapsed}
              title="Click to Expand Sidebar"
              className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <Logo variant="icon" size="sm" showBadge={false} href="/branch" />
            </button>
          ) : (
            <>
              <Logo variant="nobg" size="sm" showBadge={true} href="/branch" />
              {/* Desktop Compress Toggle Button */}
              <button
                onClick={toggleSidebarCollapsed}
                title="Collapse Sidebar"
                className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white theme-card border hover:border-blue-500/50 transition-all active:scale-95 shrink-0 ml-2"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Close button on mobile */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          {isCollapsed ? (
            <Link
              href="/requests/new"
              title="Create New Request"
              className="w-full flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 transition-all group active:scale-95"
            >
              <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
            </Link>
          ) : (
            <Link
              href="/requests/new"
              onClick={closeMobileMenu}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 transition-all group active:scale-95"
            >
              <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Create New Request</span>
            </Link>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="px-2.5 space-y-1 mt-1">
          {!isCollapsed && (
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspaces
            </p>
          )}
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300'
                      }`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Footer Area: User / Logout */}
      <div className="p-3 border-t theme-border space-y-2">
        {/* User Card with Logout Button */}
        <div className={`pt-2 border-t theme-border flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between gap-2'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-400 shrink-0">
              {user?.first_name
                ? user.first_name[0]
                : user?.username?.toLowerCase().includes('admin') || pathname.startsWith('/admin')
                ? 'A'
                : user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden leading-tight text-left">
                <p className="text-xs font-semibold theme-text-primary truncate">
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name || ''}`
                    : user?.username === 'admin' || pathname.startsWith('/admin')
                    ? 'System Admin'
                    : user?.username || 'Branch Officer'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.role
                    ? user.role
                    : pathname.startsWith('/admin') || user?.is_admin
                    ? 'Super Admin'
                    : pathname.startsWith('/legal')
                    ? 'Legal Counsel'
                    : 'Branch Officer'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => logout()}
            title="Log Out (Sign Out)"
            className={`flex items-center gap-1 ${isCollapsed ? 'p-2' : 'px-2.5 py-1.5'} rounded-lg text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all active:scale-95 shrink-0`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (>= 1024px) with dynamic width */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r theme-border theme-surface transition-all duration-300 ease-in-out z-20 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(isSidebarCollapsed)}
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
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
