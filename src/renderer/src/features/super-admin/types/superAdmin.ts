export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  extension: string;
  language: string;
  status: 'Active' | 'Inactive' | string;
}

export interface HistoryRow {
  id: string;
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
