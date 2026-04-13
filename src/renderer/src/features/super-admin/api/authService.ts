import type { AxiosResponse } from 'axios';

// API calls remove kar di gayi hain. 
// Ab ye service local mock data use karegi taake UI development mein rukawat na aaye.
const mockAxiosResponse = <T>(data: T): Promise<AxiosResponse<ApiResponse<T>>> => {
  return Promise.resolve({
    data: { data, success: true, message: 'Mock Success' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  });
};

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
  signup: (data: SignupRequest) => mockAxiosResponse({}),
  login: (data: LoginRequest) => mockAxiosResponse<LoginResponse>({
    accessToken: 'mock_access_token',
    user: {
      id: 'mock_id_123',
      email: data.email,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superAdmin',
      status: 'Active'
    }
  }),
  me: () => mockAxiosResponse({ user: { id: 'mock_id_123', role: 'superAdmin' } }),
  requestForgetPassword: (email: string) => mockAxiosResponse({}),
  sendOTP: (email: string) => mockAxiosResponse({}),
  forgotPassword: (email: string) => mockAxiosResponse({}),
  resendOtp: (data: { email: string }) => mockAxiosResponse({}),
  verifyOTP: (data: { email: string; otp: string }) => mockAxiosResponse({}),
  resetPassword: (data: any) => mockAxiosResponse({}),
  updatePassword: (data: any) => mockAxiosResponse({}),
  forgetAccessCode: (data: any) => mockAxiosResponse({}),
  accessCodeVerification: (data: any) => mockAxiosResponse({}),
  accessCodeSearch: (data: any) => mockAxiosResponse([]),
  validateCriticalFields: (data: any) => mockAxiosResponse({}),
  validateAccessCode: () => mockAxiosResponse({}),
};