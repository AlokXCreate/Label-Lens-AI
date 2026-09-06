export type NotificationType =
  | 'FILE_DOWNLOADED'
  | 'COMPLAINT_FILED'
  | 'REPORT_READY'
  | 'SCAN_PROCESSING'
  | 'CALL_LOGGED'
  | 'PROFILE_SYNCED'
  | 'DRIVE_SYNCED'
  | 'EXCEL_EXPORTED'
  | 'PERMISSION_GRANTED'
  | 'API_KEY_VERIFIED'
  | 'CUSTOM_INFO';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  durationMs: number;
  meta?: {
    fileName?: string;
    fileFormat?: string;
    fileSizeBytes?: number;
    score?: number;
    status?: string;
    docketId?: string;
    targetDesk?: string;
    latencyMs?: number;
    linkUrl?: string;
  };
  actionLabel?: string;
  onAction?: () => void;
}

type NotificationSubscriber = (notifications: AppNotification[]) => void;

let activeNotifications: AppNotification[] = [];
const subscribers: Set<NotificationSubscriber> = new Set();

const NOTIFICATION_DEFAULTS: Record<NotificationType, { title: string; message: string; durationMs: number }> = {
  FILE_DOWNLOADED: {
    title: "Dossier Exported Successfully",
    message: "Your statutory compliance document has been compiled and saved.",
    durationMs: 5500
  },
  COMPLAINT_FILED: {
    title: "Statutory Complaint Dispatched",
    message: "Official complaint petition prepared under Section 15 & 36 of Legal Metrology Act, 2009.",
    durationMs: 6000
  },
  REPORT_READY: {
    title: "Product Audit Complete",
    message: "5-point statutory parameters and FSSAI checks have been evaluated.",
    durationMs: 5000
  },
  SCAN_PROCESSING: {
    title: "Analyzing Pre-Packaged Commodity",
    message: "Scanning PDP area, Table-I font scaling, and MRP declarations in real time.",
    durationMs: 3500
  },
  CALL_LOGGED: {
    title: "Regulatory Call Logged & Recorded",
    message: "Authority interaction saved with evidentiary docket reference.",
    durationMs: 5000
  },
  PROFILE_SYNCED: {
    title: "Profile Synchronized with Firebase",
    message: "Verified Google complainant identity updated in Cloud Firestore.",
    durationMs: 4000
  },
  DRIVE_SYNCED: {
    title: "Synced to Google Drive Folder",
    message: "Dossier uploaded to your personal Google Drive 'Label Lens AI' repository.",
    durationMs: 5500
  },
  EXCEL_EXPORTED: {
    title: "Directorate Excel Workbook Exported",
    message: "Multi-sheet workbook (.xlsx) with Users, Audits, and Complaints generated.",
    durationMs: 5000
  },
  PERMISSION_GRANTED: {
    title: "Device Access Permission Granted",
    message: "Hardware sensor securely authorized for statutory inspection.",
    durationMs: 3500
  },
  API_KEY_VERIFIED: {
    title: "AI Engine Connected",
    message: "Google Gemini / OpenAI model key verified with active low-latency ping.",
    durationMs: 4000
  },
  CUSTOM_INFO: {
    title: "Label Lens AI Notice",
    message: "Regulatory system status update.",
    durationMs: 4500
  }
};

/**
 * Plays an acoustic Web Audio notification chime tailored to the notification type
 */
export function playNotificationChime(type: NotificationType = 'REPORT_READY'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'COMPLAINT_FILED' || type === 'FILE_DOWNLOADED') {
      // Triad Chime: C5 (523.25 Hz) -> E5 (659.25 Hz) -> G5 (783.99 Hz)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.09, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.3);
      });
    } else {
      // Pleasant Two-Tone Chime: D5 (587.33 Hz) -> A5 (880.00 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.28);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.1);
      gain2.gain.setValueAtTime(0.08, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);
    }
  } catch {
    // Audio playback quietly skipped if browser has not received initial user interaction
  }
}

/**
 * Dispatch an attractive pop-up notification across the application
 */
export function dispatchNotification(config: {
  type: NotificationType;
  title?: string;
  message?: string;
  durationMs?: number;
  meta?: AppNotification['meta'];
  actionLabel?: string;
  onAction?: () => void;
  playSound?: boolean;
}): AppNotification {
  const defaults = NOTIFICATION_DEFAULTS[config.type] || NOTIFICATION_DEFAULTS.CUSTOM_INFO;

  const newNotification: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type: config.type,
    title: config.title || defaults.title,
    message: config.message || defaults.message,
    timestamp: new Date().toISOString(),
    durationMs: config.durationMs || defaults.durationMs,
    meta: config.meta,
    actionLabel: config.actionLabel,
    onAction: config.onAction
  };

  // Play audio chime
  if (config.playSound !== false) {
    playNotificationChime(config.type);
  }

  // Trigger Native OS Notification if permission granted
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(`Label Lens AI: ${newNotification.title}`, {
        body: newNotification.message,
        icon: "/logo.svg"
      });
    } catch {
      // Background notifications skipped
    }
  }

  // Add to active notifications stack (limit to 4 simultaneous toasts)
  activeNotifications = [newNotification, ...activeNotifications.slice(0, 3)];
  notifySubscribers();

  return newNotification;
}

/**
 * Backwards-compatible sendAppNotification method
 */
export function sendAppNotification(
  type: NotificationType,
  playSound: boolean = true,
  customDetails?: {
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    meta?: AppNotification['meta'];
  }
) {
  return dispatchNotification({
    type,
    playSound,
    title: customDetails?.title,
    message: customDetails?.message,
    actionLabel: customDetails?.actionLabel,
    onAction: customDetails?.onAction,
    meta: customDetails?.meta
  });
}

/**
 * Dismiss a specific notification by ID
 */
export function dismissNotification(id: string): void {
  activeNotifications = activeNotifications.filter(n => n.id !== id);
  notifySubscribers();
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  activeNotifications = [];
  notifySubscribers();
}

/**
 * Subscribe to notification state changes
 */
export function subscribeToNotifications(subscriber: NotificationSubscriber): () => void {
  subscribers.add(subscriber);
  subscriber(activeNotifications);
  return () => {
    subscribers.delete(subscriber);
  };
}

function notifySubscribers() {
  subscribers.forEach(sub => {
    try {
      sub([...activeNotifications]);
    } catch (err) {
      console.error("Notification subscriber error:", err);
    }
  });
}

/**
 * Request OS Notification Permission
 */
export function requestNotificationPermission(): void {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
