import { create } from 'zustand';
import { User, AuthToken, ModuleAccessMap } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: AuthToken | null;
  moduleAccess: ModuleAccessMap;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: AuthToken, moduleAccess?: ModuleAccessMap) => void;
  setModuleAccess: (moduleAccess: ModuleAccessMap) => void;
  logout: () => void;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  moduleAccess: {},
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token, moduleAccess = {}) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('andropvs_token', JSON.stringify(token));
      localStorage.setItem('andropvs_user', JSON.stringify(user));
      localStorage.setItem('andropvs_modules', JSON.stringify(moduleAccess));
    }
    set({
      user,
      token,
      moduleAccess,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setModuleAccess: (moduleAccess) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('andropvs_modules', JSON.stringify(moduleAccess));
    }
    set({ moduleAccess });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('andropvs_token');
      localStorage.removeItem('andropvs_user');
      localStorage.removeItem('andropvs_modules');
      window.location.href = '/login';
    }
    set({
      user: null,
      token: null,
      moduleAccess: {},
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeFromStorage: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    try {
      const storedToken = localStorage.getItem('andropvs_token');
      const storedUser = localStorage.getItem('andropvs_user');
      const storedModules = localStorage.getItem('andropvs_modules');

      if (storedToken && storedUser) {
        const token: AuthToken = JSON.parse(storedToken);
        const user: User = JSON.parse(storedUser);
        const moduleAccess: ModuleAccessMap = storedModules ? JSON.parse(storedModules) : {};

        set({
          user,
          token,
          moduleAccess,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.error('Error loading stored auth session', e);
    }

    set({ isLoading: false });
  },
}));
