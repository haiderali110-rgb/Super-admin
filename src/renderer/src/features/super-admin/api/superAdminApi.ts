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

// Mock implementations to sync with Figma design without backend errors
export const fetchUsers = async (): Promise<SuperAdminUser[]> => [
  { id: '1', name: 'Jane Cooper', email: 'jane@example.com', phone: '555-0110', role: 'Interpreter', extension: '492', language: 'French', status: 'Active' },
  { id: '2', name: 'Wade Warren', email: 'wade@example.com', phone: '555-0111', role: 'CSR', extension: '798', language: 'English', status: 'Inactive' },
  { id: '3', name: 'Esther Howard', email: 'esther@example.com', phone: '555-0112', role: 'Interpreter', extension: '877', language: 'German', status: 'Active' },
  { id: '4', name: 'Cameron Williamson', email: 'cameron@example.com', phone: '555-0113', role: 'Manager', extension: '122', language: 'Urdu', status: 'Active' },
];

export const fetchUser = async (id: string): Promise<SuperAdminUser> => {
  const users = await fetchUsers();
  return users.find(u => u.id === id) || users[0];
};

export const createUser = async (user: any) => ({ id: Date.now().toString(), ...user });
export const updateUser = async (id: string, user: any) => ({ id, ...user });
export const deleteUser = async (_id: string) => Promise.resolve();

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
    ]
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

export const createLanguage = async (l: any) => ({ _id: Date.now().toString(), ...l });
export const updateLanguage = async (id: string, l: any) => ({ _id: id, ...l });
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

export const loadPersistedUsers = () => [];
export const savePersistedUsers = (_u: any) => {};
export const appendPersistedUser = (_u: any) => {};
export const removePersistedUser = (_id: string) => {};
