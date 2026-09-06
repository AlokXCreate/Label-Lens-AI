import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileWarning,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  UserCheck,
  Cloud,
  ShieldCheck,
  KeyRound,
  Bell,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  AppNotification,
  NotificationType,
  subscribeToNotifications,
  dismissNotification
} from '../../services/notificationService';
import { LabelLensLogo } from '../common/LabelLensLogo';

interface TypeStyle {
  badgeText: string;
  badgeBg: string;
  badgeTextCol: string;
  badgeBorder: string;
  iconBg: string;
  progressBarCol: string;
  borderColor: string;
  glowColor: string;
}

const TYPE_STYLES: Record<NotificationType, TypeStyle> = {
  FILE_DOWNLOADED: {
    badgeText: 'FILE EXPORTED',
    badgeBg: 'bg-emerald-50',
    badgeTextCol: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconBg: 'bg-emerald-600 text-white',
    progressBarCol: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/10'
  },
  COMPLAINT_FILED: {
    badgeText: 'LEGAL PETITION',
    badgeBg: 'bg-rose-50',
    badgeTextCol: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    iconBg: 'bg-rose-600 text-white',
    progressBarCol: 'bg-rose-600',
    borderColor: 'border-rose-500/30',
    glowColor: 'shadow-rose-500/10'
  },
  REPORT_READY: {
    badgeText: 'AUDIT VERIFIED',
    badgeBg: 'bg-teal-50',
    badgeTextCol: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    iconBg: 'bg-teal-600 text-white',
    progressBarCol: 'bg-teal-500',
    borderColor: 'border-teal-500/30',
    glowColor: 'shadow-teal-500/10'
  },
  SCAN_PROCESSING: {
    badgeText: 'ANALYZING PDP',
    badgeBg: 'bg-indigo-50',
    badgeTextCol: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    iconBg: 'bg-indigo-600 text-white',
    progressBarCol: 'bg-indigo-500',
    borderColor: 'border-indigo-500/30',
    glowColor: 'shadow-indigo-500/10'
  },
  CALL_LOGGED: {
    badgeText: 'HELPLINE CALL',
    badgeBg: 'bg-blue-50',
    badgeTextCol: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    iconBg: 'bg-blue-600 text-white',
    progressBarCol: 'bg-blue-500',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/10'
  },
  PROFILE_SYNCED: {
    badgeText: 'FIREBASE SYNC',
    badgeBg: 'bg-purple-50',
    badgeTextCol: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    iconBg: 'bg-purple-600 text-white',
    progressBarCol: 'bg-purple-500',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/10'
  },
  DRIVE_SYNCED: {
    badgeText: 'GOOGLE DRIVE',
    badgeBg: 'bg-sky-50',
    badgeTextCol: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    iconBg: 'bg-sky-600 text-white',
    progressBarCol: 'bg-sky-500',
    borderColor: 'border-sky-500/30',
    glowColor: 'shadow-sky-500/10'
  },
  EXCEL_EXPORTED: {
    badgeText: 'DIRECTORATE EXCEL',
    badgeBg: 'bg-emerald-50',
    badgeTextCol: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconBg: 'bg-emerald-600 text-white',
    progressBarCol: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/10'
  },
  PERMISSION_GRANTED: {
    badgeText: 'ACCESS GRANTED',
    badgeBg: 'bg-amber-50',
    badgeTextCol: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    iconBg: 'bg-amber-600 text-white',
    progressBarCol: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/10'
  },
  API_KEY_VERIFIED: {
    badgeText: 'AI CONNECTED',
    badgeBg: 'bg-indigo-50',
    badgeTextCol: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    iconBg: 'bg-indigo-600 text-white',
    progressBarCol: 'bg-indigo-500',
    borderColor: 'border-indigo-500/30',
    glowColor: 'shadow-indigo-500/10'
  },
  CUSTOM_INFO: {
    badgeText: 'SYSTEM NOTICE',
    badgeBg: 'bg-slate-50',
    badgeTextCol: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    iconBg: 'bg-slate-800 text-white',
    progressBarCol: 'bg-slate-700',
    borderColor: 'border-slate-300',
    glowColor: 'shadow-slate-500/10'
  }
};

const getFormatBadgeStyle = (format?: string) => {
  if (!format) return 'bg-slate-100 text-slate-700 border-slate-300';
  const fmt = format.toUpperCase();
  switch (fmt) {
    case 'PDF':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'DOCX':
    case 'WORD':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'XLSX':
    case 'EXCEL':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'JSON':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'HTML':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'TXT':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const renderTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'FILE_DOWNLOADED':
      return <Download className="w-5 h-5" />;
    case 'COMPLAINT_FILED':
      return <FileWarning className="w-5 h-5" />;
    case 'REPORT_READY':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'SCAN_PROCESSING':
      return <Sparkles className="w-5 h-5 animate-spin" />;
    case 'CALL_LOGGED':
      return <PhoneCall className="w-5 h-5" />;
    case 'PROFILE_SYNCED':
      return <UserCheck className="w-5 h-5" />;
    case 'DRIVE_SYNCED':
      return <Cloud className="w-5 h-5" />;
    case 'EXCEL_EXPORTED':
      return <FileSpreadsheet className="w-5 h-5" />;
    case 'PERMISSION_GRANTED':
      return <ShieldCheck className="w-5 h-5" />;
    case 'API_KEY_VERIFIED':
      return <KeyRound className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

interface ToastCardProps {
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ notification, onDismiss }) => {
  const [remainingTime, setRemainingTime] = useState<number>(notification.durationMs);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  const style = TYPE_STYLES[notification.type] || TYPE_STYLES.CUSTOM_INFO;

  useEffect(() => {
    const stepMs = 50;
    timerRef.current = window.setInterval(() => {
      if (!isHovered) {
        setRemainingTime((prev) => Math.max(0, prev - stepMs));
      }
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  useEffect(() => {
    if (remainingTime <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      onDismiss(notification.id);
    }
  }, [remainingTime, notification.id, onDismiss]);

  const progressPercent = Math.max(0, Math.min(100, (remainingTime / notification.durationMs) * 100));

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border ${style.borderColor} shadow-xl ${style.glowColor} pointer-events-auto transform transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-2xl animate-in slide-in-from-bottom-5 fade-in`}
    >
      {/* Top Header Strip with Official Brand Logo & Name */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-100/80 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <LabelLensLogo size="sm" showText={false} />
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs tracking-tight bg-gradient-to-r from-brand-700 via-indigo-800 to-emerald-700 bg-clip-text text-transparent">
              Label Lens AI
            </span>
            <span className="px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-emerald-100 text-emerald-800 rounded border border-emerald-300 hidden sm:inline-block">
              SIH 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Category Tag */}
          <span
            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${style.badgeBg} ${style.badgeTextCol} ${style.badgeBorder}`}
          >
            {style.badgeText}
          </span>

          {/* Dismiss Button */}
          <button
            onClick={() => onDismiss(notification.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Notification Content */}
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Category Themed Icon Squircle */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${style.iconBg}`}
        >
          {renderTypeIcon(notification.type)}
        </div>

        {/* Content & Metadata */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug">
            {notification.title}
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
            {notification.message}
          </p>

          {/* Optional Rich Metadata Badges */}
          {notification.meta && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {notification.meta.fileFormat && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-black uppercase rounded border ${getFormatBadgeStyle(
                    notification.meta.fileFormat
                  )}`}
                >
                  .{notification.meta.fileFormat}
                </span>
              )}
              {notification.meta.fileSizeBytes !== undefined && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded border border-slate-200">
                  {(notification.meta.fileSizeBytes / 1024).toFixed(1)} KB
                </span>
              )}
              {notification.meta.docketId && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                  Docket: {notification.meta.docketId}
                </span>
              )}
              {notification.meta.score !== undefined && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-50 text-teal-700 rounded border border-teal-200">
                  Score: {notification.meta.score}/100
                </span>
              )}
              {notification.meta.targetDesk && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {notification.meta.targetDesk}
                </span>
              )}
            </div>
          )}

          {/* Interactive Call-to-Action Button */}
          {notification.actionLabel && notification.onAction && (
            <div className="mt-2.5">
              <button
                onClick={() => {
                  notification.onAction?.();
                  onDismiss(notification.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>{notification.actionLabel}</span>
                {notification.meta?.linkUrl ? (
                  <ExternalLink className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated Countdown Progress Bar */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${style.progressBarCol} transition-all duration-75 ease-linear`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export const NotificationToastContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((updated) => {
      setNotifications(updated);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col-reverse gap-3 max-w-md w-[calc(100vw-2.5rem)] sm:w-[420px] pointer-events-none"
      aria-live="polite"
      aria-label="System Notifications"
    >
      {notifications.map((notif) => (
        <ToastCard key={notif.id} notification={notif} onDismiss={dismissNotification} />
      ))}
    </div>
  );
};

export default NotificationToastContainer;
