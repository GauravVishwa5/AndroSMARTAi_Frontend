import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// If running in browser on HTTPS (e.g. Vercel) and backend is plain HTTP, use relative proxy to avoid Mixed Content block
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:' && process.env.NEXT_PUBLIC_API_URL?.startsWith('http://')) {
      return ''; // Uses Next.js rewrites proxy automatically
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('andropvs_token');
      if (storedToken) {
        try {
          let accessToken: string | null = null;
          try {
            const token = JSON.parse(storedToken);
            accessToken = typeof token === 'string' ? token : token?.access_token || token?.token;
          } catch {
            accessToken = storedToken;
          }
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (e) {
          // ignore
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized or server errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear invalid token if unauthorized and not on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('andropvs_token');
          localStorage.removeItem('andropvs_user');
          localStorage.removeItem('andropvs_modules');
          window.location.href = '/login?error=session_expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
