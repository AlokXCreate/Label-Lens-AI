export interface CallLogEntry {
  id: string;
  auditId?: string;
  timestamp: string;
  authorityName: string;
  department: string;
  phoneNumber: string;
  state: string;
  docketNumber?: string;
  officerName?: string;
  officerDesignation?: string;
  callDurationSeconds?: number;
  outcomeStatus: 'docket_issued' | 'inspection_scheduled' | 'advisory_issued' | 'unanswered' | 'transferred' | 'in_progress';
  notes: string;
  audioRecordingBlobUrl?: string;
  audioRecordingBlob?: Blob;
  firebaseStorageUri?: string;
  googleDriveLink?: string;
}

export type IndianLanguageCode =
  | 'en' // English (India)
  | 'hi' // हिन्दी (Hindi)
  | 'mr' // मराठी (Marathi)
  | 'ta' // தமிழ் (Tamil)
  | 'te' // తెలుగు (Telugu)
  | 'bn' // বাংলা (Bengali)
  | 'gu' // ગુજરાતી (Gujarati)
  | 'kn' // ಕನ್ನಡ (Kannada)
  | 'ml' // മലയാളം (Malayalam)
  | 'pa'; // ਪੰਜਾਬੀ (Punjabi)

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  photoURL?: string;
  avatarPreset?: string;
  phone?: string;
  address?: string;
  state?: string;
  district?: string;
  currentLocation?: string;
  institutionName?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  role?: 'admin' | 'inspector' | 'consumer';
  preferredLanguage?: IndianLanguageCode;
  profileCompleted?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  authProvider?: 'google' | 'password' | 'guest';
  status?: 'active' | 'suspended';
}

export interface ArchivedDocument {
  id: string;
  title: string;
  documentType: 'audit_report' | 'complaint_petition' | 'call_recording';
  format: 'pdf' | 'docx' | 'html' | 'json' | 'txt' | 'webm';
  fileName: string;
  fileSizeBytes: number;
  downloadedAt: string;
  storageUrl?: string;
  userId: string;
  userEmail: string;
  auditId?: string;
  complaintId?: string;
}

export type AppPermissionType = 'camera' | 'microphone' | 'geolocation' | 'files' | 'calling' | 'email' | 'download';

export interface AppPermissionStatus {
  type: AppPermissionType;
  label: string;
  description: string;
  state: 'granted' | 'denied' | 'prompt' | 'supported';
  lastChecked: string;
  statutoryReason: string;
}

export type AIProvider = 'gemini' | 'openai' | 'openrouter';

export interface AppSettings {
  aiProvider: AIProvider;
  geminiApiKey: string;
  openaiApiKey?: string;
  openrouterApiKey?: string;
  customEndpointUrl?: string;
  googleMapsApiKey?: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  preferredModel: string;
  autoRecordAuthorityCalls: boolean;
  saveToGoogleDrive: boolean;
  enableGeoTaggingConfirmation: boolean;
  soundAlertsEnabled: boolean;
  language?: IndianLanguageCode;
}


