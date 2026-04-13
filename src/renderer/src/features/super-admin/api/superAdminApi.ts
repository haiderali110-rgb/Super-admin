import { SUPER_ADMIN_ENDPOINTS, buildApiUrl } from './endpoints';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
  _id: string;
  language: string;
  languageGroup: string;
  normalCallRate: number;
  emergencyCallRate: number;
  status: string;
}

export interface LanguageGroup {
  _id: string;
  name: string;
}

export interface LineExtension {
  id: string;
  lineName: string;
  extensionNumber: string;
  assignedTo: string;
  status: string;
}

export interface FetchUsersResult {
  users: SuperAdminUser[];
  ok: boolean;
  statusCode?: number;
  source: 'remote' | 'local';
  message: string;
}

const USER_STORAGE_KEY = 'beloz-super-admin-users';
const DELETED_USER_IDS_KEY = 'beloz-super-admin-users-deleted';

const getLocalStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const readJson = <T>(key: string, fallback: T): T => {
  const storage = getLocalStorage();
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T): void => {
  const storage = getLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore localStorage failures
  }
};

const normalizeUser = (raw: Record<string, unknown>, idx: number): SuperAdminUser => {
  const firstName = (raw.firstName as string) ?? '';
  const lastName = (raw.lastName as string) ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  const rawStatus = raw.status;

  const statusValue =
    typeof rawStatus === 'boolean'
      ? rawStatus
        ? 'Active'
        : 'Inactive'
      : (rawStatus as string) || 'Active';

  return {
    id:
      String(raw.id ?? raw._id ?? raw.userId ?? `api-user-${idx + 1}`),
    name:
      (raw.name as string) ||
      fullName ||
      (raw.username as string) ||
      'Unknown User',
    email: (raw.email as string) || '',
    phone: (raw.phone as string) || (raw.phoneNumber as string) || '',
    role: (raw.role as string) || (raw.userType as string) || (raw.type as string) || 'User',
    extension: (raw.extension as string) || (raw.extensionNumber as string) || (raw.ext as string) || '',
    language: (raw.language as string) || (raw.preferredLanguage as string) || '',
    status: statusValue,
    department: (raw.department as string) || undefined,
    gender: (raw.gender as string) || undefined,
  };
};

const extractUsersArray = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
  }

  if (typeof payload === 'object' && payload !== null) {
    const maybeObj = payload as Record<string, unknown>;

    if (Array.isArray(maybeObj.data)) {
      return maybeObj.data.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
    }

    if (typeof maybeObj.data === 'object' && maybeObj.data !== null && Array.isArray((maybeObj.data as Record<string, unknown>).users)) {
      return ((maybeObj.data as Record<string, unknown>).users as unknown[]).filter(
        (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
      );
    }

    if (Array.isArray(maybeObj.users)) {
      return maybeObj.users.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
    }
  }

  return [];
};

const mergeUsers = (remoteUsers: SuperAdminUser[], localUsers: SuperAdminUser[], deletedIds: string[]): SuperAdminUser[] => {
  const deletedSet = new Set(deletedIds);
  const map = new Map<string, SuperAdminUser>();

  remoteUsers.forEach((user) => {
    if (!deletedSet.has(user.id)) {
      map.set(user.id, user);
    }
  });

  localUsers.forEach((user) => {
    if (!deletedSet.has(user.id)) {
      map.set(user.id, user);
    }
  });

  return Array.from(map.values());
};

export const fetchUsersWithStatus = async (): Promise<FetchUsersResult> => {
  const localUsers = readJson<SuperAdminUser[]>(USER_STORAGE_KEY, []);
  const deletedIds = readJson<string[]>(DELETED_USER_IDS_KEY, []);
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('beloz_auth_token') : null;
  const storedAuthUser = typeof window !== 'undefined' ? window.localStorage.getItem('beloz_auth_user') : null;

  let requesterRole = 'superAdmin';
  const roleMap: Record<string, string> = {
    superadmin: 'superAdmin',
    'web-manager': 'web-manager',
    manager: 'web-manager',
    'mobile-manager': 'mobile-manager',
    customer: 'customer',
    'mobile-customer': 'mobile-customer',
    interpreter: 'web-interpreter',
    'web-interpreter': 'web-interpreter',
    'mobile-interpreter': 'mobile-interpreter',
    csr: 'csr',
  };
  try {
    if (storedAuthUser) {
      const parsed = JSON.parse(storedAuthUser) as { role?: string };
      if (parsed?.role && typeof parsed.role === 'string') {
        const normalizedRole = parsed.role.toLowerCase();
        requesterRole = roleMap[normalizedRole] || 'superAdmin';
      }
    }
  } catch {
    // fallback to default role
  }

  const payload = {
    role: requesterRole,
    activityStatus: 'active',
    recordPerPage: 500,
    pageNumber: 1,
    sort: { createdAt: -1 },
  };
  const requestUrl = buildApiUrl(SUPER_ADMIN_ENDPOINTS.userGet);

  console.log('[Users API] Request start', {
    url: requestUrl,
    method: 'POST',
    hasToken: Boolean(token),
    payload,
  });

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    console.log('[Users API] Response received', {
      url: requestUrl,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      return {
        users: mergeUsers([], localUsers, deletedIds),
        ok: false,
        statusCode: response.status,
        source: 'local',
        message: `Users API failed (${response.status}). Showing local data.`,
      };
    }

    const payload: unknown = await response.json();
    const users = extractUsersArray(payload).map((user, idx) => normalizeUser(user, idx));

    return {
      users: mergeUsers(users, localUsers, deletedIds),
      ok: true,
      statusCode: response.status,
      source: 'remote',
      message: 'Users loaded successfully from server.',
    };
  } catch (error) {
    console.error('[Users API] Network/Fetch error', {
      url: requestUrl,
      error,
    });
    return {
      users: mergeUsers([], localUsers, deletedIds),
      ok: false,
      source: 'local',
      message: 'Could not connect to Users API. Showing local data.',
    };
  }
};

export const fetchUsers = async (): Promise<SuperAdminUser[]> => {
  const result = await fetchUsersWithStatus();
  return result.users;
};

export const fetchUser = async (id: string): Promise<SuperAdminUser> => {
  const users = await fetchUsers();
  return (
    users.find((u) => u.id === id) ||
    users[0] || {
      id: 'fallback-user',
      name: 'Unknown User',
      email: '',
      phone: '',
      role: 'User',
      extension: '',
      language: '',
      status: 'Active',
    }
  );
};

export const createUser = async (user: Omit<SuperAdminUser, 'id'>): Promise<SuperAdminUser> => {
  const created: SuperAdminUser = {
    id: `local-${Date.now()}`,
    ...user,
  };

  appendPersistedUser(created);
  return created;
};

export const updateUser = async (id: string, user: Partial<SuperAdminUser>): Promise<SuperAdminUser> => {
  const users = loadPersistedUsers();
  const existing = users.find((u) => u.id === id);

  const updated: SuperAdminUser = {
    id,
    name: user.name ?? existing?.name ?? 'Unknown User',
    email: user.email ?? existing?.email ?? '',
    phone: user.phone ?? existing?.phone ?? '',
    role: user.role ?? existing?.role ?? 'User',
    extension: user.extension ?? existing?.extension ?? '',
    language: user.language ?? existing?.language ?? '',
    status: user.status ?? existing?.status ?? 'Active',
    department: user.department ?? existing?.department,
    gender: user.gender ?? existing?.gender,
  };

  const next = users.filter((u) => u.id !== id);
  next.unshift(updated);
  savePersistedUsers(next);

  return updated;
};

export const deleteUser = async (id: string): Promise<void> => {
  removePersistedUser(id);
};

export const requestOtp = async (_phone: string) => ({ otpRequestId: 'mock_otp_123' });
export const verifyOtp = async (_id: string, _code: string) => ({ verified: true });

export const fetchHistory = async (type: string): Promise<HistoryRow[]> => {
  const mockRecords: Record<string, HistoryRow[]> = {
    interpreter: [
      { id: '1', enterprise: 'Global Connect', datetime: '05 Aug, 2023 / 10:15 am', accessCode: '882104', language: 'Spanish', duration: '00:15:00' },
      { id: '2', enterprise: 'Direct Services', datetime: '06 Aug, 2023 / 02:30 pm', accessCode: '119042', language: 'French', duration: '00:45:12' },
      { id: '3', enterprise: 'Health First', datetime: '07 Aug, 2023 / 09:00 am', accessCode: '334455', language: 'Arabic', duration: '00:10:00' },
    ],
    csr: [
      { id: '1', enterprise: 'Business Dev', datetime: '03 Aug, 2023 / 09:45 am', accessCode: '943359', phone: '(480) 555-0103', duration: '00:17:35' },
      { id: '2', enterprise: 'Tech Solutions', datetime: '04 Aug, 2023 / 11:20 am', accessCode: '228491', phone: '(205) 555-0125', duration: '00:05:12' },
    ],
    customer: [
      { id: '1', enterprise: 'Retail Hub', datetime: '10 Aug, 2023 / 08:10 am', accessCode: '441233', phone: '(321) 555-0173', duration: '00:22:10' },
      { id: '2', enterprise: 'Online Mart', datetime: '11 Aug, 2023 / 01:05 pm', accessCode: '910334', phone: '(608) 555-0187', duration: '00:11:42' },
    ],
    'web-manager': [
      { id: '1', enterprise: 'Admin Portal', datetime: '12 Aug, 2023 / 09:12 am', accessCode: '772211', duration: '00:28:46' },
      { id: '2', enterprise: 'Support Console', datetime: '13 Aug, 2023 / 03:50 pm', accessCode: '554433', duration: '00:19:05' },
    ],
  };
  return mockRecords[type] || mockRecords.interpreter;
};

export const fetchLanguages = async (): Promise<LanguageRate[]> => [
  { _id: '1', language: 'English', languageGroup: 'Europe', normalCallRate: 10, emergencyCallRate: 15, status: 'Active' },
  { _id: '2', language: 'Spanish', languageGroup: 'Europe', normalCallRate: 12, emergencyCallRate: 18, status: 'Active' },
  { _id: '3', language: 'Arabic', languageGroup: 'Middle East', normalCallRate: 14, emergencyCallRate: 20, status: 'Active' },
  { _id: '4', language: 'Urdu', languageGroup: 'Asia', normalCallRate: 11, emergencyCallRate: 16, status: 'Active' },
  { _id: '5', language: 'German', languageGroup: 'Europe', normalCallRate: 13, emergencyCallRate: 19, status: 'Inactive' },
];

export const createLanguage = async (l: unknown) => ({ _id: Date.now().toString(), ...((l as object) || {}) });
export const updateLanguage = async (id: string, l: unknown) => ({ _id: id, ...((l as object) || {}) });
export const deleteLanguage = async (_id: string) => Promise.resolve();

export const fetchLanguageGroups = async (): Promise<LanguageGroup[]> => [
  { _id: '1', name: 'Europe' },
  { _id: '2', name: 'Middle East' },
  { _id: '3', name: 'Asia' },
];

export const fetchLines = async (): Promise<LineExtension[]> => [
  { id: '1', lineName: 'Sales Line', extensionNumber: '1219', assignedTo: 'CSR Team', status: 'Active' },
  { id: '2', lineName: 'Support Line', extensionNumber: '1324', assignedTo: 'Interpreter Team', status: 'Active' },
  { id: '3', lineName: 'Billing Line', extensionNumber: '1047', assignedTo: 'Finance', status: 'Inactive' },
];

export const loadPersistedUsers = (): SuperAdminUser[] => {
  return readJson<SuperAdminUser[]>(USER_STORAGE_KEY, []);
};

export const savePersistedUsers = (users: SuperAdminUser[]): void => {
  writeJson(USER_STORAGE_KEY, users);
};

export const appendPersistedUser = (user: SuperAdminUser): void => {
  const users = loadPersistedUsers();
  const next = [user, ...users.filter((u) => u.id !== user.id)];
  savePersistedUsers(next);
};

export const removePersistedUser = (id: string): void => {
  const users = loadPersistedUsers().filter((u) => u.id !== id);
  savePersistedUsers(users);

  const deleted = readJson<string[]>(DELETED_USER_IDS_KEY, []);
  if (!deleted.includes(id)) {
    writeJson(DELETED_USER_IDS_KEY, [...deleted, id]);
  }
};
