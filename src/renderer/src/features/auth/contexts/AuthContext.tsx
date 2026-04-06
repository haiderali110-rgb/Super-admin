import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  setAuthToken,
  setAuthUser,
  clearAuthData,
  authAPI,  
  type LoginRequest,
  type AuthUser,
  type ApiResult,
  type LoginResponse,
} from '../api/authApi';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<ApiResult<LoginResponse>>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_TOKEN_KEY = 'beloz_auth_token';
const AUTH_USER_KEY = 'beloz_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
  });

  // Initialization: Check for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await getCurrentUser();
          if (response.success) {
            setState({
              user: response.user,
              token,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            });
            setAuthUser(response.user);
          } else {
            throw new Error("Invalid session");
          }
        } catch {
          clearAuthData();
          setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
      }
    };
    initializeAuth();
  }, []);

  // --- ACTIONS ---

  const login = useCallback(async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true }));
    const response = await apiLogin(credentials);
    if (response.success) {
      setAuthToken(response.token);
      setAuthUser(response.user);
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
    return response;
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {}
    clearAuthData();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    });
  }, []);

  // Naye Functions jo OTP Flow ke liye chahiye
  const forgotPassword = async (email: string) => {
    return await authAPI.sendOTP(email); // backend call
  };

  const verifyOtp = async (email: string, otp: string) => {
    return await authAPI.verifyOTP(email, otp); // backend call
  };

  const resetPassword = async (data: any) => {
    return await authAPI.resetPassword(data); // backend call
  };

  const updateUser = useCallback((user: AuthUser) => {
    setAuthUser(user);
    setState(prev => ({ ...prev, user }));
  }, []);

  const contextValue: AuthContextValue = {
    ...state,
    login,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!state.isInitialized ? (
        <div className="flex h-screen items-center justify-center">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;