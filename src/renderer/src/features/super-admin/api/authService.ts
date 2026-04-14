import axios, { type AxiosResponse } from 'axios';

const API_URL = 'http://10.1.1.72:4000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('beloz_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FcmToken {
  deviceId: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  platform?: 'mobile' | 'web' | 'desktop';
  fcmToken?: FcmToken;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string[];
  role: string;
  platform?: 'mobile' | 'web' | 'desktop';
  fcmToken?: FcmToken;
  enterprise?: string;
  state?: string;
  city?: string;
  facility?: string[];
}

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string[];
  gender?: string;
  role?: string;
  status?: string;
  enterprise?: string;
  city?: string;
  state?: string;
  language?: string[];
  fcmTokens?: FcmToken[];
  [key: string]: any;
}

export interface LoginResponse {
  accessToken?: string;
  chainToken?: string;
  verifyAccessCode?: boolean;
  user?: AuthUser;
  message?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

export const authService = {
  signup: (data: SignupRequest) => api.post('/auth/signup', data), 
  login: (data: LoginRequest) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};