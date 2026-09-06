import { AppPermissionStatus, AppPermissionType } from '../types/user';

export const STATUTORY_PERMISSIONS: AppPermissionStatus[] = [
  {
    type: 'camera',
    label: 'Camera & Optical Viewfinder',
    description: 'Required for real-time scanning of Principal Display Panels (PDP), barcodes, and MRP stickers.',
    state: 'prompt',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Rule 5 & 6 of Legal Metrology (Packaged Commodities) Rules, 2011 require visual verification of font heights, MRP, and net quantity.'
  },
  {
    type: 'files',
    label: 'File Storage & Spec Document Upload',
    description: 'Allows uploading packaging images, laboratory test certificates, and specification documents.',
    state: 'granted',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Enables documentary evidence attachment under Section 15 of Legal Metrology Act, 2009.'
  },
  {
    type: 'microphone',
    label: 'Microphone & Audio Capture',
    description: 'Used for speech-to-text observation dictation and recording calls with food safety authorities.',
    state: 'prompt',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Records statutory consumer grievance logs under Section 28 of FSS Act, 2006.'
  },
  {
    type: 'geolocation',
    label: 'GPS Location & Territorial Jurisdiction',
    description: 'Automatically determines district jurisdiction to identify nearest Controller of Legal Metrology and FSSAI labs.',
    state: 'prompt',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Enforcement jurisdiction is strictly territorial under Section 13 of Legal Metrology Act, 2009.'
  },
  {
    type: 'calling',
    label: 'Telephone Dialer (Native Call Intent)',
    description: 'Enables one-touch calling to National FSSAI 1800-11-2100 and state enforcement controllers.',
    state: 'supported',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Provides immediate consumer escalation path to designated regulatory helplines.'
  },
  {
    type: 'email',
    label: 'Statutory Mail Dispatch (Mailto Intent)',
    description: 'Automates dispatch of pre-filled legal petitions to compliance@fssai.gov.in and controllers.',
    state: 'supported',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Standardized digital grievance transmission under the Consumer Protection Act, 2019.'
  },
  {
    type: 'download',
    label: 'Automated Document & PDF Export',
    description: 'Permits direct downloading and local caching of 5-format dossiers and court petitions.',
    state: 'granted',
    lastChecked: new Date().toISOString(),
    statutoryReason: 'Guarantees citizen access to evidentiary files for court filings and portal submissions.'
  }
];

const PERMISSIONS_CACHE_KEY = 'label_lens_permissions_state';

export function getCachedPermissions(): AppPermissionStatus[] {
  try {
    const raw = localStorage.getItem(PERMISSIONS_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback to defaults
  }
  return STATUTORY_PERMISSIONS;
}

export function saveCachedPermissions(perms: AppPermissionStatus[]): void {
  try {
    localStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify(perms));
  } catch (e) {
    console.error("Failed to save permissions cache:", e);
  }
}

/**
 * Probes browser permissions API and tests hardware availability
 */
export async function checkAllPermissions(): Promise<AppPermissionStatus[]> {
  const current = getCachedPermissions();
  const updated: AppPermissionStatus[] = [];

  for (const perm of current) {
    let state = perm.state;

    try {
      if (perm.type === 'camera' && navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: 'camera' as any });
        state = status.state as any;
      } else if (perm.type === 'microphone' && navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: 'microphone' as any });
        state = status.state as any;
      } else if (perm.type === 'geolocation' && navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: 'geolocation' as any });
        state = status.state as any;
      } else if (perm.type === 'files' || perm.type === 'download') {
        state = 'granted';
      } else if (perm.type === 'calling' || perm.type === 'email') {
        state = 'supported';
      }
    } catch {
      // Browser permissions query not universally supported for all devices
    }

    updated.push({
      ...perm,
      state,
      lastChecked: new Date().toISOString()
    });
  }

  saveCachedPermissions(updated);
  return updated;
}

/**
 * Interactively prompts user for Camera access
 */
export async function requestCameraAccess(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(t => t.stop());
    updateSinglePermission('camera', 'granted');
    return true;
  } catch (err) {
    console.warn("Camera permission denied:", err);
    updateSinglePermission('camera', 'denied');
    return false;
  }
}

/**
 * Interactively prompts user for Microphone access
 */
export async function requestMicrophoneAccess(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    updateSinglePermission('microphone', 'granted');
    return true;
  } catch (err) {
    console.warn("Microphone permission denied:", err);
    updateSinglePermission('microphone', 'denied');
    return false;
  }
}

/**
 * Interactively prompts user for Geolocation access
 */
export async function requestGeolocationAccess(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      updateSinglePermission('geolocation', 'denied');
      return resolve(null);
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateSinglePermission('geolocation', 'granted');
        resolve(pos);
      },
      (err) => {
        console.warn("Geolocation permission denied:", err);
        updateSinglePermission('geolocation', 'denied');
        resolve(null);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  });
}

function updateSinglePermission(type: AppPermissionType, state: 'granted' | 'denied' | 'prompt' | 'supported') {
  const current = getCachedPermissions();
  const updated = current.map(p => p.type === type ? { ...p, state, lastChecked: new Date().toISOString() } : p);
  saveCachedPermissions(updated);
}
