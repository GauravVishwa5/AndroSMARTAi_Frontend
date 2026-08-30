import apiClient from './client';
import { LoginResponse, SignupResponse, User } from '@/types/auth';

export const authApi = {
  login: async (email: string, password: string):Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/login', { email, password });
    return response.data;
  },

  signup: async (data: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/api/signup', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.get('/api/verify-email', { params: { token } });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/api/password/forgot', { email });
    return response.data;
  },

  resetPassword: async (token: string, new_password: string): Promise<User> => {
    const response = await apiClient.post('/api/password/reset', { token, new_password });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/api/me');
    return response.data;
  },

  getMyEntitlements: async () => {
    const response = await apiClient.get('/api/me/entitlements');
    return response.data;
  },

  getSSOProviders: async (): Promise<{ success: boolean; providers: string[] }> => {
    const response = await apiClient.get('/api/sso/providers');
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/logout');
    } catch (e) {
      // ignore
    }
  },
};
