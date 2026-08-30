'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { ModuleKey, SessionAccessScope } from '@/types/auth';

export function useEntitlements() {
  const { user, moduleAccess } = useAuthStore();

  const hasModuleAccess = (module: ModuleKey): boolean => {
    if (user?.is_admin) return true;
    return Boolean(moduleAccess?.[module]?.is_active);
  };

  const getSessionScope = (module: ModuleKey): SessionAccessScope => {
    if (user?.is_admin) return 'global';
    return moduleAccess?.[module]?.session_access || 'personal';
  };

  return {
    user,
    isAdmin: Boolean(user?.is_admin),
    hasModuleAccess,
    getSessionScope,
  };
}
