export const API_BASE_URL = 'http://10.1.1.72:4000';

export const SUPER_ADMIN_ENDPOINTS = {
  userGet: '/api/user/get',
} as const;

export const buildApiUrl = (path: string): string => `${API_BASE_URL}${path}`;

