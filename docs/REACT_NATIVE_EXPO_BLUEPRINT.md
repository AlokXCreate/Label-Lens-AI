# REACT NATIVE + EXPO MASTER ARCHITECTURE: LABEL LENS AI
**Universal Cross-Platform Architecture: Android APK & Responsive Web Application**

---

## 1. STACK & ENVIRONMENT SPECIFICATION

*   **Framework:** React Native 0.76+ / Expo SDK 52 (Universal Cross-Platform: Web, Android, iOS).
*   **Web Engine:** `@expo/metro-runtime` & `react-native-web` (Compiles React Native components into responsive HTML/CSS for web browsers).
*   **Styling:** NativeWind v4 (Tailwind CSS for React Native) / StyleSheet with Material Design 3 tokens.
*   **Authentication:** Firebase Auth strictly restricted to **Google Sign-In** (`expo-auth-session/providers/google` and Firebase JS SDK).
*   **Cloud Storage Architecture:**
    - **Firebase Cloud Storage:** Bucket path structured by Google UID:
      `/users/{google_uid}/audits/{audit_id}/[evidence_photos | reports | call_recordings]`
    - **One-Click Google Drive Export:** Direct OAuth2 integration using Google Drive REST API v3 to upload compiled PDF, HTML, and audio evidence into a dedicated `"Label Lens AI Compliance"` folder in the user's Google Drive.
*   **Calling Flow & Telephony Subsystem:**
    - **Native Dialer Intent:** `Linking.openURL('tel:1800112100')` or Android `Intent.ACTION_DIAL` routing to FSSAI National and State Food Safety Desks.
    - **In-App Post-Call Logs:** Captures call recipient authority, timestamp, call status, user notes, and linked product report.
    - **Local Audio Recording:** `expo-av` audio recording module capturing compliance phone interactions, saving locally, and uploading to the user's Firebase Cloud Storage / Google Drive folder.
*   **Google Maps Platform Integration:**
    - `expo-location` for device GPS coordinates (`latitude`, `longitude`, `accuracy`).
    - Google Maps Geocoding API for reverse geocoding (street, district, state, PIN code).
    - Google Maps Static API / Embed API for geo-tagged evidence previews inside formal legal complaints.
    - Pre-filing confirmation modal: *"Would you like to include your current live location in this official complaint?"*

---

## 2. PROJECT FOLDER STRUCTURE (REACT NATIVE + EXPO)

```
c:\Users\Alok\Desktop\SIH 2026\
├── app.json (Expo configuration: Android package, permissions, plugins)
├── package.json (Expo SDK, React Native, Firebase, Expo-AV, Lucide Native)
├── babel.config.js (Babel configuration with NativeWind)
├── tailwind.config.js (Tailwind color tokens)
├── tsconfig.json (TypeScript configuration for Expo)
│
├── docs/
│   ├── LEGAL_METROLOGY_COMPLIANCE_MASTER_REPORT.md (Statutory Master Reference)
│   ├── regulatory_rules_dataset.json (Machine-readable statutory rule base)
│   ├── LABEL_LENS_AI_SYSTEM_ARCHITECTURE.md (System Architecture)
│   └── REACT_NATIVE_EXPO_BLUEPRINT.md (This document)
│
└── src/
    ├── api/
    │   ├── gemini.ts (Google Gemini Multimodal API client with encrypted user key)
    │   ├── googleMaps.ts (Google Maps Platform Geocoding & Places client)
    │   └── googleDrive.ts (Google Drive v3 REST API upload connector)
    ├── config/
    │   ├── firebase.ts (Firebase Auth & Cloud Storage configuration)
    │   └── authorities.ts (FSSAI National & 28 States Food Safety directory)
    ├── services/
    │   ├── rulesEngine.ts (Table-I font scaling, USP math, MPE schedule, FSSAI checks)
    │   ├── complaintService.ts (Statutory complaint drafter with geo-tagging)
    │   ├── exportService.ts (5-format exporter: PDF, HTML, JSON, DOCX, TXT)
    │   ├── callManager.ts (Dialer intent, post-call logs, expo-av recording)
    │   └── storageManager.ts (Firebase Cloud Storage + local offline SQLite/AsyncStorage)
    ├── types/
    │   ├── rules.ts (Statutory rule interfaces & 16 violation categories)
    │   ├── audit.ts (5-point parameter schema & audit report)
    │   ├── complaint.ts (Legal complaint dossier schema)
    │   └── user.ts (User profile, call log, and app settings)
    └── components/
        ├── common/ (Header, Badge, Button, Modal, Card)
        ├── scanner/ (CameraScanner, VoiceInput, Dropzone)
        ├── audit/ (ScoreCard, ParameterFindingsList)
        ├── complaint/ (ComplaintDrawer, LocationPromptModal)
        ├── authority/ (AuthorityCallingModal, PostCallLogModal)
        └── settings/ (ApiKeyVaultModal, UserProfileModal)
```

---

## 3. CORE IMPLEMENTATION MODULES

### 3.1 Firebase Cloud Storage Linked to Google UID & Google Drive Sync

```typescript
/**
 * Firebase Cloud Storage Path Hierarchy:
 * /users/{googleUid}/audits/{reportId}/report.pdf
 * /users/{googleUid}/audits/{reportId}/interactive.html
 * /users/{googleUid}/audits/{reportId}/evidence_01.jpg
 * /users/{googleUid}/audits/{reportId}/calls/call_record_{timestamp}.m4a
 */
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../config/firebase';

export async function uploadAuditEvidence(
  reportId: string,
  fileName: string,
  blob: Blob
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be signed in with Google to upload evidence.");

  const storageRef = ref(storage, `users/${user.uid}/audits/${reportId}/${fileName}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}

/**
 * 1-Click Export to Google Drive via Google Drive REST API v3
 */
export async function exportToGoogleDrive(
  googleAccessToken: string,
  fileName: string,
  mimeType: string,
  fileBlob: Blob
): Promise<{ fileId: string; webViewLink: string }> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: "Exported from Label Lens AI - Legal Metrology Compliance System"
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', fileBlob);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${googleAccessToken}`
    },
    body: form
  });

  if (!response.ok) {
    throw new Error(`Google Drive Export failed: ${response.statusText}`);
  }

  return await response.json();
}
```

---

### 3.2 Native Dialer Intent, State-Wise Directory, Post-Call Logs & Call Recording

```typescript
import { Linking, Platform } from 'react-native';
import { Audio } from 'expo-av';

export interface CallLogEntry {
  id: string;
  timestamp: string;
  authorityName: string;
  phoneNumber: string;
  state: string;
  notes?: string;
  audioRecordingUri?: string;
}

// 1. Native Dialer Intent
export function dialAuthorityIntent(phoneNumber: string): void {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  const url = Platform.OS === 'android' ? `tel:${cleanNumber}` : `telprompt:${cleanNumber}`;
  Linking.openURL(url).catch(err => console.error("Dialer intent failed:", err));
}

// 2. Audio Recording Subsystem via expo-av
export class ExpoCallRecorder {
  private recording: Audio.Recording | null = null;
  public isRecording: boolean = false;

  async startRecording(): Promise<boolean> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return false;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error("Failed to start audio recording:", err);
      return false;
    }
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recording) return null;
    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;
      return uri; // Local audio file URI on device
    } catch (err) {
      console.error("Failed to stop recording:", err);
      return null;
    }
  }
}
```

---

### 3.3 Google Maps MCP & Platform Integration

```typescript
import * as Location from 'expo-location';

export interface GeoTaggedIncidentLocation {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  state: string;
  district: string;
  mapsUrl: string;
}

export async function captureLiveLocation(): Promise<GeoTaggedIncidentLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error("Location permission denied.");
  }

  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  const [reverseGeocoded] = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  });

  const formattedAddress = reverseGeocoded 
    ? `${reverseGeocoded.name || ''}, ${reverseGeocoded.street || ''}, ${reverseGeocoded.subregion || ''}, ${reverseGeocoded.city || ''}, ${reverseGeocoded.region || ''} ${reverseGeocoded.postalCode || ''}`.trim()
    : `Coordinates: ${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}`;

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    formattedAddress,
    state: reverseGeocoded?.region || "Maharashtra",
    district: reverseGeocoded?.subregion || reverseGeocoded?.city || "Pune",
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`
  };
}
```

---

## 4. ANDROID APK BUILD & RUNTIME PERMISSIONS (`app.json`)

```json
{
  "expo": {
    "name": "Label Lens AI",
    "slug": "label-lens-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "labellens",
    "android": {
      "package": "gov.in.doca.labellens",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "RECORD_AUDIO",
        "CALL_PHONE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      [
        "expo-camera",
        { "cameraPermission": "Allow Label Lens AI to scan packaged commodity labels and barcodes." }
      ],
      [
        "expo-location",
        { "locationAlwaysAndWhenInUsePermission": "Allow Label Lens AI to attach your live location to legal complaints." }
      ],
      [
        "expo-av",
        { "microphonePermission": "Allow Label Lens AI to record voice observations and compliance helpline calls." }
      ]
    ]
  }
}
```
