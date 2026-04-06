const DEFAULT_API_BASE_URL = 'http://localhost:4000';
const PRIMARY_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
const FALLBACK_API_BASE_URLS = [
  PRIMARY_API_BASE_URL,
  'http://10.1.1.72:4000',
  'http://10.1.1.195:4000',
].filter((url) => !!url);

export const API_BASE_URL = PRIMARY_API_BASE_URL;
console.debug('[superAdminApi] API_BASE_URL', API_BASE_URL);
console.debug('[superAdminApi] FALLBACK_API_BASE_URLS', FALLBACK_API_BASE_URLS);

const OFFLINE_MODE = import.meta.env.VITE_API_OFFLINE === 'true';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (OFFLINE_MODE) {
    throw new Error('Offline mode active');
  }

  
  let lastError: Error | null = null;

  for (const base of FALLBACK_API_BASE_URLS) {
    const url = `${base}${path}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        if (response.status === 404 && options.method === undefined) {
          // GET 404 indicates API path not available; try next fallback and then local data.
          lastError = new Error(`404 not found at ${url}`);
          continue;
        }

        const text = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${text}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }
  }

  const message = lastError ? lastError.message : 'unknown error';
  throw new Error(`API request failed: all base URLs failed. ${message}`);
}

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  extension: string;
  language: string;
  status: 'Active' | 'Inactive' | string;
  department?: string;
  gender?: string;
}

export interface HistoryRow {
  id?: string;
  enterprise: string;
  datetime: string;
  accessCode: string;
  phone?: string;
  language?: string;
  duration: string;
}

export interface LanguageRate {
  id: string;
  language: string;
  ratePerMinute: string;
  status: string;
}

export interface LineExtension {
  id: string;
  lineName: string;
  extensionNumber: string;
  assignedTo: string;
  status: string;
}

const STORAGE_KEYS = {
  users: 'beloz-super-admin-users',
  languages: 'beloz-super-admin-languages',
  lines: 'beloz-super-admin-lines',
  history: (type: string) => `beloz-super-admin-history-${type}`,
};

const loadFromStorage = <T>(key: string, defaultData: T): T => {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    if (Array.isArray(defaultData)) {
      return Array.isArray(parsed) ? (parsed as T) : defaultData;
    }
    return (parsed as T) ?? defaultData;
  } catch {
    return defaultData;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
};

export const fetchUsers = async (): Promise<SuperAdminUser[]> => {
  const fallback = loadFromStorage<SuperAdminUser[]>(STORAGE_KEYS.users, []);
  try {
    const data = await apiFetch<SuperAdminUser[]>('/users');
    saveToStorage(STORAGE_KEYS.users, data);
    return data;
  } catch {
    return fallback;
  }
};

export const fetchUser = async (id: string): Promise<SuperAdminUser> => {
  const users = await fetchUsers();
  const found = users.find((user) => user.id === id);
  if (!found) {
    throw new Error('User not found');
  }
  return found;
};

export const createUser = async (user: Omit<SuperAdminUser, 'id'>): Promise<SuperAdminUser> => {
  try {
    const created = await apiFetch<SuperAdminUser>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    const current = loadFromStorage<SuperAdminUser[]>(STORAGE_KEYS.users, []);
    saveToStorage(STORAGE_KEYS.users, [created, ...current]);
    return created;
  } catch {
    const localCreated: SuperAdminUser = { id: Date.now().toString(), ...user };
    const current = loadFromStorage<SuperAdminUser[]>(STORAGE_KEYS.users, []);
    saveToStorage(STORAGE_KEYS.users, [localCreated, ...current]);
    return localCreated;
  }
};

export const updateUser = async (id: string, user: Partial<SuperAdminUser>): Promise<SuperAdminUser> => {
  try {
    const updated = await apiFetch<SuperAdminUser>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    });
    const current = loadFromStorage<SuperAdminUser[]>(STORAGE_KEYS.users, []);
    saveToStorage(
      STORAGE_KEYS.users,
      current.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    );
    return updated;
  } catch {
    const current = loadFromStorage<SuperAdminUser[]>(STORAGE_KEYS.users, []);
    const updatedUser = current.find((item) => item.id === id);
    if (!updatedUser) {
      throw new Error('User not found locally');
    }
    const merged = { ...updatedUser, ...user };
    saveToStorage(
      STORAGE_KEYS.users,
      current.map((item) => (item.id === id ? merged : item)),
    );
    return merged;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiFetch<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  } catch {
    // no-op when server unavailable
  }
  const current = loadFromStorage<SuperAdminUser[]>(STORAGE_KEYS.users, []);
  saveToStorage(STORAGE_KEYS.users, current.filter((item) => item.id !== id));
};

export const requestOtp = async (phone: string): Promise<{ otpRequestId: string }> =>
  apiFetch<{ otpRequestId: string }>('/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });

export const verifyOtp = async (otpRequestId: string, code: string): Promise<{ verified: boolean }> =>
  apiFetch<{ verified: boolean }>('/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ otpRequestId, code }),
  });

export const fetchHistory = async (type: 'interpreter' | 'csr' | 'customer' | 'web-manager'): Promise<HistoryRow[]> => {
  const fallback = loadFromStorage<HistoryRow[]>(STORAGE_KEYS.history(type), []);
  try {
    const data = await apiFetch<HistoryRow[]>(`/history/${type}`);
    saveToStorage(STORAGE_KEYS.history(type), data);
    return data;
  } catch {
    return fallback;
  }
};

export const fetchLanguages = async (): Promise<LanguageRate[]> => {
  const fallback = loadFromStorage<LanguageRate[]>(STORAGE_KEYS.languages, []);
  try {
    const data = await apiFetch<LanguageRate[]>('/languages');
    saveToStorage(STORAGE_KEYS.languages, data);
    return data;
  } catch {
    return fallback;
  }
};

export const fetchLines = async (): Promise<LineExtension[]> => {
  const fallback = loadFromStorage<LineExtension[]>(STORAGE_KEYS.lines, []);
  try {
    const data = await apiFetch<LineExtension[]>('/lines');
    saveToStorage(STORAGE_KEYS.lines, data);
    return data;
  } catch {
    return fallback;
  }
};

const USER_STORAGE_KEY = 'beloz-super-admin-users';

export const loadPersistedUsers = (): SuperAdminUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as SuperAdminUser[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const savePersistedUsers = (users: SuperAdminUser[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
};

export const appendPersistedUser = (user: SuperAdminUser) => {
  const current = loadPersistedUsers();
  savePersistedUsers([user, ...current]);
};

export const removePersistedUser = (id: string) => {
  const current = loadPersistedUsers();
  const updated = current.filter((user) => user.id !== id);
  savePersistedUsers(updated);
};
