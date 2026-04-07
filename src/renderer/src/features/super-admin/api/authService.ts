import axios, { type AxiosResponse } from 'axios';

const API = axios.create({
  baseURL: 'http://10.1.1.72:4000',
  headers: { 'Content-Type': 'application/json' },
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
  phone?: string;
  role?: string;
  platform?: 'mobile' | 'web' | 'desktop';
  fcmToken?: FcmToken;
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
  signup: (data: SignupRequest): Promise<AxiosResponse<ApiResponse<any>>> => {
    const { fcmToken, platform, ...signupData } = data;  
    const finalData = { 
      ...signupData, 
      role: 'superAdmin', 
      phone: '+1234567890' 
    };
    return API.post('/api/auth/signup', finalData);
  },
  login: (data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => API.post('/api/auth/login', data),
  me: (): Promise<AxiosResponse<ApiResponse<{ user: AuthUser }>>> => API.get('/api/auth/me'),
  requestForgetPassword: (email: string, platform = 'web'): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/request-forget-password', { email, platform }),
  sendOTP: (email: string, platform = 'web'): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/request-forget-password', { email, platform }),
  forgotPassword: (email: string, platform = 'web'): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/request-forget-password', { email, platform }),
  resendOtp: (data: { email: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/resend-otp', data),
  verifyOTP: (data: { email: string; otp: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/otp-verification', data),
  resetPassword: (data: { email: string; otp: string; password: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.patch('/api/auth/reset-password', data),
  updatePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.patch('/api/auth/update-password', data),
  forgetAccessCode: (data: { email: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.patch('/api/auth/forget-access-code', data),
  accessCodeVerification: (data: { accessCode: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/access-code-verification', data),
  accessCodeSearch: (data: { query: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/access-code-search', data),
  validateCriticalFields: (data: { email?: string; phone?: string }): Promise<AxiosResponse<ApiResponse<any>>> => API.post('/api/auth/validate-critical-fields', data),
  validateAccessCode: (): Promise<AxiosResponse<ApiResponse<any>>> => API.get('/api/auth/validate-access-code'),
};