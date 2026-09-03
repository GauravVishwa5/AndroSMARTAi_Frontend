import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Route requests to configured API URL
// In browser on HTTPS (e.g. Vercel), use relative URLs '' so Next.js server proxies to EC2 backend without Mixed Content browser blocks
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:') {
      return '';
    }
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  const rawUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:8000';
  return rawUrl.replace(/\/+$/, '');
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
        const pathname = window.location.pathname;
        const isApplicantRoute = pathname.startsWith('/applicant');
        const isLoginRoute = pathname.includes('/login');
        const skipRedirect = (error.config?.headers as any)?.['X-Skip-Auth-Redirect'] === 'true';

        // Clear invalid token and redirect only if not on public/demo/applicant routes
        if (!isLoginRoute && !isApplicantRoute && !skipRedirect) {
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
