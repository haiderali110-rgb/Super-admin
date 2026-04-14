import { SUPER_ADMIN_ENDPOINTS } from './endpoints';
import { api } from './authService';


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

export interface UserFetchParams {
  roles?: string[];
  activityStatus?: string;
  enterprise?: string;
  languageGroups?: string[];
  language?: string;
  recordPerPage?: number;
  pageNumber?: number;
}
   

const USER_STORAGE_KEY = 'beloz-super-admin-users';
const DELETED_USER_IDS_KEY = 'beloz-super-admin-users-deleted';

 
const DEFAULT_USERS: SuperAdminUser[] = [
  { id: 'seed-1', name: 'Jane Cooper', email: 'jane.cooper@beloz.com', phone: '+1 555-0101', role: 'Interpreter', extension: '101', language: 'English', status: 'Active' },
  { id: 'seed-2', name: 'Wade Warren', email: 'wade.warren@beloz.com', phone: '+1 555-0102', role: 'CSR', extension: '102', language: 'Spanish', status: 'Active' },
  { id: 'seed-3', name: 'Esther Howard', email: 'esther.howard@beloz.com', phone: '+1 555-0103', role: 'Manager', extension: '103', language: 'Arabic', status: 'Active' },
  { id: 'seed-4', name: 'Cameron Williamson', email: 'cameron.williamson@beloz.com', phone: '+1 555-0104', role: 'Customer', extension: '104', language: 'Urdu', status: 'Inactive' },
  { id: 'seed-5', name: 'Brooklyn Simmons', email: 'brooklyn.simmons@beloz.com', phone: '+1 555-0105', role: 'Interpreter', extension: '105', language: 'French', status: 'Active' },
];
 
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
    // ignore
  }
};
 
const normalizeUser = (raw: Record<string, unknown>, idx: number): SuperAdminUser => {
  const firstName = (raw.firstName as string) ?? '';
  const lastName  = (raw.lastName  as string) ?? '';
  const fullName  = `${firstName} ${lastName}`.trim();

   const activityStatus = (raw.activityStatus as string) || '';
  const statusValue =
    activityStatus === 'no recent status' || activityStatus === ''
      ? 'Active'
      : activityStatus.charAt(0).toUpperCase() + activityStatus.slice(1);

   let phone = '';
  if (Array.isArray(raw.phone)) {
    phone = (raw.phone as string[]).join(', ');
  } else if (typeof raw.phone === 'string') {
    phone = raw.phone;
  }

  let language = '';
  if (Array.isArray(raw.language)) {
    language = (raw.language as string[]).join(', ');
  } else if (typeof raw.language === 'string') {
    language = raw.language;
  }
 
  const ext = raw.extension ?? raw.extensionNumber ?? raw.ext ?? '';
  const extension = String(ext !== null && ext !== undefined ? ext : '');

  return {
    id:        String(raw.id ?? raw._id ?? raw.userId ?? `api-user-${idx + 1}`),
    name:      fullName || (raw.name as string) || (raw.username as string) || 'Unknown User',
    email:     (raw.email as string) || '',
    phone,
    role:      (raw.role as string) || (raw.userType as string) || 'User',
    extension,
    language,
    status:    statusValue,
    department: (raw.department as string) || undefined,
    gender:    (raw.gender as string) || undefined,
  };
};

 
const extractUsersArray = (payload: unknown): Record<string, unknown>[] => {
  const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

  const filterObjs = (arr: unknown[]): Record<string, unknown>[] =>
    arr.filter((item): item is Record<string, unknown> => isObj(item));

  if (Array.isArray(payload)) return filterObjs(payload);

  if (isObj(payload)) {
    if (Array.isArray(payload.users))                                             return filterObjs(payload.users as unknown[]);
    if (Array.isArray(payload.data))                                              return filterObjs(payload.data as unknown[]);
    if (isObj(payload.data) && Array.isArray((payload.data as Record<string,unknown>).users))  return filterObjs(((payload.data as Record<string,unknown>).users) as unknown[]);
    if (Array.isArray(payload.result))                                            return filterObjs(payload.result as unknown[]);
    if (Array.isArray(payload.records))                                           return filterObjs(payload.records as unknown[]);
  }

  return [];
};

 
const mergeUsers = (
  remoteUsers: SuperAdminUser[],
  localUsers: SuperAdminUser[],
  deletedIds: string[]
): SuperAdminUser[] => {
  const deletedSet = new Set(deletedIds);
  const map = new Map<string, SuperAdminUser>();
  remoteUsers.forEach((u) => { if (!deletedSet.has(u.id)) map.set(u.id, u); });
  localUsers.forEach((u)  => { if (!deletedSet.has(u.id)) map.set(u.id, u); });
  return Array.from(map.values());
};

  
export const fetchUsersWithStatus = async (
  params: Partial<UserFetchParams> = {}
): Promise<FetchUsersResult> => {
  const localUsers = readJson<SuperAdminUser[]>(USER_STORAGE_KEY, []);
  const deletedIds = readJson<string[]>(DELETED_USER_IDS_KEY, []);

 const requestPayload: Record<string, unknown> = {
    recordPerPage: params.recordPerPage || 500,
    pageNumber:    params.pageNumber    || 1,
    ...(params.roles           && params.roles.length > 0           ? { roles: params.roles }                   : {}),
    ...(params.activityStatus                                        ? { activityStatus: params.activityStatus } : {}),
    ...(params.enterprise                                            ? { enterprise: params.enterprise }         : {}),
    ...(params.language                                              ? { language: params.language }             : {}),
    ...(params.languageGroups  && params.languageGroups.length > 0  ? { languageGroups: params.languageGroups } : {}),
  };

   
  console.group('%c[Users API] 🚀 Firing Request', 'color: #6366f1; font-weight: bold;');
  console.log('Endpoint  :', SUPER_ADMIN_ENDPOINTS.userGet);
  console.log('Payload   :', requestPayload);
  console.log('Auth Token:', localStorage.getItem('beloz_auth_token') ? '✅ Present' : '❌ Missing');
  console.groupEnd();

  try {
    const response = await api.post(SUPER_ADMIN_ENDPOINTS.userGet, requestPayload);
 
    console.group('%c[Users API] 📦 Raw Response', 'color: #0ea5e9; font-weight: bold;');
    console.log('Status     :', response.status, response.statusText);
    console.log('Data       :', response.data);
    console.groupEnd();

    if (response.status !== 200) {
      console.warn(`%c[Users API] ⚠️ Non-200 (${response.status})`, 'color: #f59e0b; font-weight: bold;');
      return {
        users: mergeUsers(DEFAULT_USERS, localUsers, deletedIds),
        ok: false,
        statusCode: response.status,
        source: 'local',
        message: `API returned ${response.status}. Using fallback data.`,
      };
    }

    const rawArray = extractUsersArray(response.data);
    const users    = rawArray.map((u, i) => normalizeUser(u, i));

     
    console.group('%c[Users API] ✅ SUCCESS', 'color: #22c55e; font-weight: bold;');
    console.log('Total from server :', rawArray.length);
    console.log('After normalize   :', users.length);
    console.table(users.slice(0, 10).map(({ id, name, role, status, phone }) => ({ id, name, role, status, phone })));
    if (users.length > 10) console.log(`... and ${users.length - 10} more`);
    console.groupEnd();

    return {
      users: mergeUsers(users, localUsers, deletedIds),
      ok: true,
      statusCode: response.status,
      source: 'remote',
      message: `✅ ${users.length} users loaded from server.`,
    };

  } catch (error: unknown) {
     
    console.group('%c[Users API] ❌ FAILED', 'color: #ef4444; font-weight: bold;');

    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as { response: { status: number; statusText: string; data: unknown }; message: string };
      console.error('HTTP Status :', e.response.status, e.response.statusText);
      console.error('Server Says :', e.response.data);
      console.error('Axios Msg   :', e.message);
      const s = e.response.status;
      const reason =
        s === 401 ? '🔑 Unauthorized — token missing or expired' :
        s === 403 ? '🚫 Forbidden — no permission' :
        s === 404 ? '🔍 Not Found — no users match the filter' :
        s === 422 ? '📋 Unprocessable — invalid field value in payload' :
        s === 500 ? '💥 Server Error — backend crashed' : 'Unknown error';
      console.error('Reason      :', reason);
    } else if (error && typeof error === 'object' && 'request' in error) {
      console.error('Network Error — no response received');
      console.error('Causes: server down | CORS | timeout | wrong IP/port');
    } else {
      console.error('Unexpected:', error instanceof Error ? error.message : error);
    }

    console.warn('📁 Falling back to DEFAULT_USERS + localUsers');
    console.groupEnd();

    return {
      users: mergeUsers(DEFAULT_USERS, localUsers, deletedIds),
      ok: false,
      source: 'local',
      message: '❌ Could not connect to Users API. Showing fallback data.',
    };
  }
};

 
export const fetchUsers = async (): Promise<SuperAdminUser[]> =>
  (await fetchUsersWithStatus()).users;

export const fetchUser = async (id: string): Promise<SuperAdminUser> => {
  const users = await fetchUsers();
  return users.find((u) => u.id === id) || users[0] || DEFAULT_USERS[0];
};

export const createUser = async (user: Omit<SuperAdminUser, 'id'>): Promise<SuperAdminUser> => {
  const created: SuperAdminUser = { id: `local-${Date.now()}`, ...user };
  appendPersistedUser(created);
  return created;
};

export const updateUser = async (id: string, user: Partial<SuperAdminUser>): Promise<SuperAdminUser> => {
  const users    = loadPersistedUsers();
  const existing = users.find((u) => u.id === id);
  const updated: SuperAdminUser = {
    id,
    name:       user.name       ?? existing?.name       ?? 'Unknown User',
    email:      user.email      ?? existing?.email      ?? '',
    phone:      user.phone      ?? existing?.phone      ?? '',
    role:       user.role       ?? existing?.role       ?? 'User',
    extension:  user.extension  ?? existing?.extension  ?? '',
    language:   user.language   ?? existing?.language   ?? '',
    status:     user.status     ?? existing?.status     ?? 'Active',
    department: user.department ?? existing?.department,
    gender:     user.gender     ?? existing?.gender,
  };
  const next = users.filter((u) => u.id !== id);
  next.unshift(updated);
  savePersistedUsers(next);
  return updated;
};

export const deleteUser = async (id: string): Promise<void> => {
  removePersistedUser(id);
};

 
export const loadPersistedUsers = (): SuperAdminUser[] =>
  readJson<SuperAdminUser[]>(USER_STORAGE_KEY, []);

export const savePersistedUsers = (users: SuperAdminUser[]): void =>
  writeJson(USER_STORAGE_KEY, users);

export const appendPersistedUser = (user: SuperAdminUser): void => {
  const users = loadPersistedUsers();
  savePersistedUsers([user, ...users.filter((u) => u.id !== user.id)]);
};

export const removePersistedUser = (id: string): void => {
  savePersistedUsers(loadPersistedUsers().filter((u) => u.id !== id));
  const deleted = readJson<string[]>(DELETED_USER_IDS_KEY, []);
  if (!deleted.includes(id)) writeJson(DELETED_USER_IDS_KEY, [...deleted, id]);
};

// ─────────────────────────────────────────────
//  Mock / Static helpers
// ─────────────────────────────────────────────

export const requestOtp = async (_phone: string) => ({ otpRequestId: 'mock_otp_123' });
export const verifyOtp  = async (_id: string, _code: string) => ({ verified: true });

export const fetchHistory = async (type: string): Promise<HistoryRow[]> => {
  const mock: Record<string, HistoryRow[]> = {
    interpreter:  [{ id: '1', enterprise: 'Global Connect',  datetime: '05 Aug, 2023 / 10:15 am', accessCode: '882104', language: 'Spanish', duration: '00:15:00' }],
    csr:          [{ id: '1', enterprise: 'Business Dev',    datetime: '03 Aug, 2023 / 09:45 am', accessCode: '943359', phone: '(480) 555-0103', duration: '00:17:35' }],
    customer:     [{ id: '1', enterprise: 'Retail Hub',      datetime: '10 Aug, 2023 / 08:10 am', accessCode: '441233', phone: '(321) 555-0173', duration: '00:22:10' }],
    'web-manager':[{ id: '1', enterprise: 'Admin Portal',    datetime: '12 Aug, 2023 / 09:12 am', accessCode: '772211', duration: '00:28:46' }],
  };
  return mock[type] || mock.interpreter;
};

export const fetchLanguages = async (): Promise<LanguageRate[]> => [
  { _id: '1', language: 'English', languageGroup: 'Europe',      normalCallRate: 10, emergencyCallRate: 15, status: 'Active' },
  { _id: '2', language: 'Spanish', languageGroup: 'Europe',      normalCallRate: 12, emergencyCallRate: 18, status: 'Active' },
  { _id: '3', language: 'Arabic',  languageGroup: 'Middle East', normalCallRate: 14, emergencyCallRate: 20, status: 'Active' },
  { _id: '4', language: 'Urdu',    languageGroup: 'Asia',        normalCallRate: 11, emergencyCallRate: 16, status: 'Active' },
];

export const createLanguage  = async (l: unknown) => ({ _id: Date.now().toString(), ...((l as object) || {}) });
export const updateLanguage  = async (id: string, l: unknown) => ({ _id: id, ...((l as object) || {}) });
export const deleteLanguage  = async (_id: string) => Promise.resolve();

export const fetchLanguageGroups = async (): Promise<LanguageGroup[]> => [
  { _id: '1', name: 'Europe' },
  { _id: '2', name: 'Middle East' },
  { _id: '3', name: 'Asia' },
];

export const fetchLines = async (): Promise<LineExtension[]> => [
  { id: '1', lineName: 'Sales Line',   extensionNumber: '1219', assignedTo: 'CSR Team',         status: 'Active' },
  { id: '2', lineName: 'Support Line', extensionNumber: '1324', assignedTo: 'Interpreter Team', status: 'Active' },
  { id: '3', lineName: 'Billing Line', extensionNumber: '1047', assignedTo: 'Finance',          status: 'Inactive' },
];