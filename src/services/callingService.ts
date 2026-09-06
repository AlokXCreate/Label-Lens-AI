import { CallLogEntry } from '../types/user';

export interface AuthorityHelpline {
  state: string;
  department: string;
  tollFree: string;
  directPhone: string;
  email: string;
  workingHours?: string;
  headquarters?: string;
}

export const STATE_AUTHORITY_DIRECTORY: Record<string, AuthorityHelpline> = {
  "National": {
    state: "National (Central FSSAI)",
    department: "Food Safety and Standards Authority of India (FSSAI HQ)",
    tollFree: "1800-11-2100",
    directPhone: "+91-11-23236975",
    email: "compliance@fssai.gov.in",
    workingHours: "09:00 AM - 05:30 PM (Mon-Fri)",
    headquarters: "FDA Bhawan, Kotla Road, New Delhi"
  },
  "Maharashtra": {
    state: "Maharashtra",
    department: "Food and Drug Administration (FDA) Maharashtra",
    tollFree: "1800-222-365",
    directPhone: "022-26592200",
    email: "comm.fda-mah@nic.in",
    workingHours: "09:45 AM - 06:15 PM (Mon-Sat, 2nd/4th Sat Off)",
    headquarters: "Bandra-Kurla Complex (BKC), Mumbai"
  },
  "Maharashtra-LM": {
    state: "Maharashtra",
    department: "Legal Metrology Department (Vaidhanik Mapan Shastra)",
    tollFree: "1800-222-365",
    directPhone: "022-22886666",
    email: "clmmh@gov.in",
    workingHours: "09:45 AM - 06:15 PM",
    headquarters: "Barrack No. 7, Free Church Compound, Mumbai"
  },
  "Delhi": {
    state: "Delhi",
    department: "Department of Food Safety, Govt of NCT of Delhi",
    tollFree: "1800-11-0440",
    directPhone: "011-23869162",
    email: "foodsafety-delhi@nic.in",
    workingHours: "09:30 AM - 06:00 PM (Mon-Fri)",
    headquarters: "A-Block, Vikas Bhawan-II, Civil Lines, Delhi"
  },
  "Karnataka": {
    state: "Karnataka",
    department: "Food Safety and Standards Authority, Karnataka",
    tollFree: "1800-425-3777",
    directPhone: "080-22255764",
    email: "cfskarnataka@gmail.com",
    workingHours: "10:00 AM - 05:30 PM",
    headquarters: "Anand Rao Circle, Bengaluru"
  },
  "Tamil Nadu": {
    state: "Tamil Nadu",
    department: "Food Safety and Drug Administration, Tamil Nadu",
    tollFree: "9444042322",
    directPhone: "044-24335075",
    email: "commr.fssatn@gmail.com",
    workingHours: "10:00 AM - 05:45 PM",
    headquarters: "DMS Complex, Teynampet, Chennai"
  },
  "Gujarat": {
    state: "Gujarat",
    department: "Food and Drugs Control Administration (FDCA) Gujarat",
    tollFree: "1800-233-5500",
    directPhone: "079-23253417",
    email: "comfdca@gujarat.gov.in",
    workingHours: "10:30 AM - 06:10 PM",
    headquarters: "Block 8, Dr. Jivraj Mehta Bhavan, Gandhinagar"
  },
  "Uttar Pradesh": {
    state: "Uttar Pradesh",
    department: "Food Safety and Drug Administration (FSDA) Uttar Pradesh",
    tollFree: "1800-180-5533",
    directPhone: "0522-2287234",
    email: "fsda.up@nic.in",
    workingHours: "09:30 AM - 06:00 PM",
    headquarters: "Swasthya Bhawan, Kaiserbagh, Lucknow"
  },
  "West Bengal": {
    state: "West Bengal",
    department: "Department of Health & Family Welfare (Food Safety Wing)",
    tollFree: "1800-345-3220",
    directPhone: "033-23576000",
    email: "foodsafety-wb@nic.in",
    workingHours: "10:00 AM - 05:30 PM",
    headquarters: "Swasthya Sathi Building, Salt Lake, Kolkata"
  },
  "Telangana": {
    state: "Telangana",
    department: "Institute of Preventive Medicine, Public Health Labs & Food (Health) Administration",
    tollFree: "1800-425-0087",
    directPhone: "040-27560144",
    email: "ipm-tg@nic.in",
    workingHours: "10:30 AM - 05:00 PM",
    headquarters: "Narayanaguda, Hyderabad"
  }
};

const CALL_LOGS_KEY = 'label_lens_call_logs';

/**
 * Initiates direct native phone dialer intent
 */
export function callAuthorityDirectly(phoneNumber: string): void {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  window.location.href = `tel:${cleanNumber}`;
}

/**
 * Retrieves all stored post-call logs, optionally filtered by audit ID
 */
export function getStoredCallLogs(auditId?: string): CallLogEntry[] {
  try {
    const raw = localStorage.getItem(CALL_LOGS_KEY);
    const list: CallLogEntry[] = raw ? JSON.parse(raw) : [];
    if (auditId) {
      return list.filter(c => c.auditId === auditId);
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Saves or updates a post-call log entry
 */
export function saveCallLogInStorage(callLog: CallLogEntry): void {
  const existing = getStoredCallLogs();
  const updated = [callLog, ...existing.filter(c => c.id !== callLog.id)];
  localStorage.setItem(CALL_LOGS_KEY, JSON.stringify(updated.slice(0, 100)));
}

/**
 * Deletes a post-call log entry
 */
export function deleteCallLogFromStorage(callLogId: string): void {
  const existing = getStoredCallLogs();
  const updated = existing.filter(c => c.id !== callLogId);
  localStorage.setItem(CALL_LOGS_KEY, JSON.stringify(updated));
}

/**
 * In-App Call Recording Module via MediaRecorder with duration tracking
 */
export class CallRecordingManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  public isRecording: boolean = false;

  async startRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error("Audio recording permission denied or unsupported:", err);
      return false;
    }
  }

  stopRecording(): Promise<{ blob: Blob; durationSeconds: number } | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.isRecording = false;
        resolve(null);
        return;
      }

      const duration = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        this.isRecording = false;
        // Stop all tracks to release microphone
        this.mediaRecorder?.stream.getTracks().forEach(t => t.stop());
        resolve({ blob: audioBlob, durationSeconds: duration });
      };

      this.mediaRecorder.stop();
    });
  }
}

export const callRecorder = new CallRecordingManager();
