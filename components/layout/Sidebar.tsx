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
  Plus,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useUIStore } from '@/lib/store/uiStore';
import { useAuthStore } from '@/lib/store/authStore';
import { Logo } from '@/components/ui/Logo';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  show: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

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

  // Grouped task structure for institutional banking/legal workflows
  const navSections: NavSection[] = [
    {
      title: 'OPERATIONS',
      items: [
        {
          label: 'Branch Dashboard',
          href: '/branch',
          icon: LayoutDashboard,
          show: true,
        },
        {
          label: 'Property Requests',
          href: '/requests',
          icon: FileSpreadsheet,
          show: true,
        },
      ],
    },
    {
      title: 'LEGAL',
      items: [
        {
          label: 'Legal Scrutiny',
          href: '/legal',
          icon: FileCheck2,
          show: true,
          badge: '42',
        },
        {
          label: 'Reports (TSR / LSR)',
          href: '/requests/reports',
          icon: FileText,
          show: hasModuleAccess('case_analyzer') || isSuperAdmin,
        },
      ],
    },
    {
      title: 'VERIFICATION',
      items: [
        {
          label: 'IGR Land Registry',
          href: '/requests/search',
          icon: Database,
          show: hasModuleAccess('due_diligence') || isSuperAdmin,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          label: 'System Health',
          href: '/admin',
          icon: ShieldAlert,
          show: isSuperAdmin,
        },
        {
          label: 'IGR Scrape Jobs',
          href: '/admin/igr-jobs',
          icon: Activity,
          show: isSuperAdmin,
          badge: 'Ops',
        },
      ],
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
    <div className="flex flex-col justify-between h-full bg-white dark:bg-[#111827]">
      <div className="overflow-y-auto">
        {/* Brand Logo & Collapse Header */}
        <div className={`h-16 border-b theme-border px-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {isCollapsed ? (
            <button
              onClick={toggleSidebarCollapsed}
              title="Expand Sidebar"
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Logo variant="icon" size="sm" showBadge={false} href="/branch" />
            </button>
          ) : (
            <>
              <Logo variant="nobg" size="sm" showBadge={true} href="/branch" />
              <button
                onClick={toggleSidebarCollapsed}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
                className="hidden lg:flex p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors shrink-0 ml-2"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Close button on mobile */}
          <button
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Intake Action */}
        <div className="p-3">
          {isCollapsed ? (
            <Link
              href="/requests/new"
              title="Create New Verification Request"
              className="w-full flex items-center justify-center p-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/requests/new"
              onClick={closeMobileMenu}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </Link>
          )}
        </div>

        {/* Task-Categorized Navigation Sections */}
        <nav className="px-2 space-y-4 mt-1 pb-4">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((i) => i.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-2.5 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none">
                    {section.title}
                  </p>
                )}

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center ${isCollapsed ? 'justify-center p-2 rounded-md' : 'justify-between px-2.5 py-1.5 rounded-md'} text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-blue-400 font-semibold border-l-2 border-[#1D4ED8] rounded-l-none'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? 'text-[#1D4ED8] dark:text-blue-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: User Profile & Logout */}
      <div className="p-3 border-t theme-border bg-slate-50/50 dark:bg-[#111827]">
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between gap-2'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-md bg-[#1D4ED8] flex items-center justify-center font-bold text-xs text-white shrink-0 select-none">
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
                    : pathname.startsWith('/legal')
                    ? 'Adv. Kushal Verma'
                    : user?.username || 'Rajesh Sharma'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.role
                    ? user.role
                    : pathname.startsWith('/admin') || user?.is_admin
                    ? 'Super Admin'
                    : pathname.startsWith('/legal')
                    ? 'Panel Advocate'
                    : 'Branch Officer'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex items-center gap-1 p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (>= 1024px) */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r theme-border transition-all duration-200 z-20 ${
          isSidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {renderSidebarContent(isSidebarCollapsed)}
      </aside>

      {/* Mobile Slide-over Drawer (< 1024px) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={closeMobileMenu}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full theme-surface border-r theme-border h-full shadow-lg z-50 animate-fadeIn">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
