import axios from 'axios';

const API = axios.create({
  baseURL: 'http://10.1.1.72:4000', // Backend URL
  headers: { 'Content-Type': 'application/json' }
});

export const authService = {
  login: (data: any) => API.post('/api/login', data),
  sendOTP: (email: string) => API.post('/api/forgot-password', { email }),
  verifyOTP: (email: string, otp: string) => API.post('/api/verify-otp', { email, otp }),
  resetPassword: (data: any) => API.post('/api/reset-password', data),
};