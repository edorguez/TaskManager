import apiClient from './client';
import type { ApiResponse, AuthResponse } from '../types';

export const authApi = {
  register: (email: string, password: string, confirmPassword: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', { email, password, confirmPassword }),
  
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password }),
  
  me: () =>
    apiClient.get<ApiResponse<{ email: string }>>('/api/auth/me'),
};
