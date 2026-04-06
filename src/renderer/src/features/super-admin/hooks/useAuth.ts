import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { useState } from 'react';

export const useAuth = () => {
  const context = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Email Validation Helper
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // 2. Login Logic
  const executeLogin = async (credentials: any) => {
    setError(null);
    if (!validateEmail(credentials.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const result = await context.login(credentials);
    if (!result.success) {
      setError(result.message || "Login failed. Check your password.");
    }
    return result;
  };

  // 3. Forgot Password / Send OTP
  const executeForgotPassword = async (email: string) => {
    setError(null);
    if (!validateEmail(email)) {
      setError("Valid email is required to send OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await context.forgotPassword(email);
      setLoading(false);
      return res;
    } catch (err) {
      setError("Failed to send OTP. Try again.");
      setLoading(false);
    }
  };

  // 4. Reset Password with Confirmation Check
  const executeResetPassword = async (data: any) => {
    setError(null);
    
    // UI logic: Check if passwords match
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await context.resetPassword(data);
      setLoading(false);
      return res;
    } catch (err) {
      setError("Could not reset password.");
      setLoading(false);
    }
  };

  return {
    ...context, // Context ki saari values (user, isAuthenticated, etc.)
    error,
    setError,
    loading,
    executeLogin,
    executeForgotPassword,
    executeResetPassword,
    validateEmail
  };
};