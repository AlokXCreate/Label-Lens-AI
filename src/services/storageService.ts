import { ProductAuditReport } from '../types/audit';
import { LegalComplaint } from '../types/complaint';
import { UserProfile, AppSettings } from '../types/user';

const REPORTS_KEY = 'label_lens_reports';
const COMPLAINTS_KEY = 'label_lens_complaints';
const USER_PROFILE_KEY = 'label_lens_user_profile';
const APP_SETTINGS_KEY = 'label_lens_app_settings';

export const DEFAULT_USER_PROFILE: UserProfile = {
  uid: 'usr_guest_google_01',
  email: 'alok.consumer.safety@gmail.com',
  displayName: 'Alok Kumar',
  phone: '+91 98200 12345',
  address: 'Flat 402, Shivam Enclave, Senapati Bapat Road, Pune',
  currentLocation: 'Pune, Maharashtra',
  institutionName: 'Symbiosis Law & Technology Institute',
  linkedInUrl: 'https://linkedin.com/in/alok-kumar-safety',
  githubUrl: 'https://github.com/alok-safety',
  portfolioUrl: 'https://labellens.gov.in'
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  aiProvider: 'gemini',
  geminiApiKey: '',
  openaiApiKey: '',
  openrouterApiKey: '',
  preferredModel: 'gemini-2.0-flash',
  autoRecordAuthorityCalls: true,
  saveToGoogleDrive: true,
  enableGeoTaggingConfirmation: true,
  soundAlertsEnabled: true
};


export function getStoredReports(): ProductAuditReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReportLocally(report: ProductAuditReport): void {
  const existing = getStoredReports();
  const updated = [report, ...existing.filter(r => r.id !== report.id)];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated.slice(0, 50)));
}

export function getStoredComplaints(): LegalComplaint[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveComplaintLocally(complaint: LegalComplaint): void {
  const existing = getStoredComplaints();
  const updated = [complaint, ...existing.filter(c => c.complaint_id !== complaint.complaint_id)];
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated.slice(0, 50)));
}

export function getUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
    const fbUser = localStorage.getItem('label_lens_current_user');
    return fbUser ? JSON.parse(fbUser) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem('label_lens_current_user', JSON.stringify(profile));
}

export function clearUserSession(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem('label_lens_current_user');
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(APP_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_APP_SETTINGS;
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
}
