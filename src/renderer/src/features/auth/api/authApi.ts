 

const API_BASE_URL = 'http://10.1.1.72:4000';

const OFFLINE_MODE = import.meta.env.VITE_API_OFFLINE === 'true';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'super_admin' | 'manager' | 'interpreter' | 'csr' | 'customer';
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  otpRequestId?: string;
}

export interface VerifyOtpRequest {
  otpRequestId: string;
  code: string;
  type: 'email_verification' | 'password_reset' | 'login_verification';
}

export interface VerifyOtpResponse {
  success: boolean;
  verified: boolean;
  message: string;
  expiresIn?: number;
}

export interface ResetPasswordRequest {
  otpRequestId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  expiresIn: number;
}

// ============================================
// API Helper Functions
// ============================================

interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}

type ApiResult<T> = T | ApiError;

async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  useAuthHeader: boolean = false
): Promise<ApiResult<T>> {
  if (OFFLINE_MODE) {
    return {
      success: false,
      message: 'Offline mode is active. Please connect to the server.',
      statusCode: 503,
    } as ApiError;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from storage if needed
  let token: string | null = null;
  if (useAuthHeader) {
    token = localStorage.getItem('beloz_auth_token');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        statusCode: response.status,
      } as ApiError;
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Unable to connect to server. Please check your connection.',
        statusCode: 0,
      } as ApiError;
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 500,
    } as ApiError;
  }
}

 
export const login = async (credentials: LoginRequest): Promise<ApiResult<LoginResponse>> => {
  return authFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

 
export const register = async (userData: RegisterRequest): Promise<ApiResult<RegisterResponse>> => {
  return authFetch<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

 
export const logout = async (): Promise<ApiResult<{ success: boolean; message: string }>> => {
  return authFetch<{ success: boolean; message: string }>('/api/auth/logout', {
    method: 'POST',
  }, true);
};

 
export const getCurrentUser = async (): Promise<ApiResult<{ success: boolean; user: AuthUser }>> => {
  return authFetch<{ success: boolean; user: AuthUser }>('/api/auth/me', {
    method: 'GET',
  }, true);
};

 
export const refreshToken = async (): Promise<ApiResult<RefreshTokenResponse>> => {
  return authFetch<RefreshTokenResponse>('/api/auth/refresh-token', {
    method: 'POST',
  }, true);
};

 
export const forgotPassword = async (email: string): Promise<ApiResult<ForgotPasswordResponse>> => {
  return authFetch<ForgotPasswordResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

 
export const verifyOtp = async (data: VerifyOtpRequest): Promise<ApiResult<VerifyOtpResponse>> => {
  return authFetch<VerifyOtpResponse>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

 
export const resendOtp = async (otpRequestId: string): Promise<ApiResult<{ success: boolean; message: string; newOtpRequestId?: string }>> => {
  return authFetch<{ success: boolean; message: string; newOtpRequestId?: string }>('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ otpRequestId }),
  });
};


export const resetPassword = async (data: ResetPasswordRequest): Promise<ApiResult<ResetPasswordResponse>> => {
  return authFetch<ResetPasswordResponse>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
 
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResult<ChangePasswordResponse>> => {
  return authFetch<ChangePasswordResponse>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
};
 
export const sendVerificationEmail = async (): Promise<ApiResult<{ success: boolean; message: string }>> => {
  return authFetch<{ success: boolean; message: string }>('/api/auth/send-verification-email', {
    method: 'POST',
  }, true);
};

 
export const verifyEmail = async (token: string): Promise<ApiResult<{ success: boolean; message: string }>> => {
  return authFetch<{ success: boolean; message: string }>(`/api/auth/verify-email/${token}`, {
    method: 'GET',
  });
};

 
export const googleLogin = (): void => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};


export const facebookLogin = (): void => {
  window.location.href = `${API_BASE_URL}/api/auth/facebook`;
};


export const handleGoogleCallback = async (code: string): Promise<ApiResult<LoginResponse>> => {
  return authFetch<LoginResponse>('/api/auth/google/callback', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
};
 
export const setAuthToken = (token: string): void => {
  localStorage.setItem('beloz_auth_token', token);
};

 
export const getAuthToken = (): string | null => {
  return localStorage.getItem('beloz_auth_token');
};

 
export const removeAuthToken = (): void => {
  localStorage.removeItem('beloz_auth_token');
};

 
export const setAuthUser = (user: AuthUser): void => {
  localStorage.setItem('beloz_auth_user', JSON.stringify(user));
};

 
export const getAuthUser = (): AuthUser | null => {
  const userData = localStorage.getItem('beloz_auth_user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
};

 
export const removeAuthUser = (): void => {
  localStorage.removeItem('beloz_auth_user');
};

 
export const clearAuthData = (): void => {
  removeAuthToken();
  removeAuthUser();
  sessionStorage.clear();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true, message: 'Password is strong' };
};

 
export const mockLogin = async (credentials: LoginRequest): Promise<LoginResponse> => {
   
  await new Promise(resolve => setTimeout(resolve, 1000));

   
  if (credentials.email === 'admin@beloz.com' && credentials.password === 'Admin123!') {
    return {
      success: true,
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@beloz.com',
        phone: '+1234567890',
        role: 'super_admin',
        status: 'active',
      },
      message: 'Login successful',
    };
  }

  throw new Error('Invalid email or password');
};
