import React, { useState } from 'react';
import { Lock, ExternalLink, X } from 'lucide-react';

interface PrivacyNoticeBannerProps {
  onOpenPrivacyModal: () => void;
}

export const PrivacyNoticeBanner: React.FC<PrivacyNoticeBannerProps> = ({ onOpenPrivacyModal }) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('label_lens_privacy_banner_dismissed') === 'true';
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('label_lens_privacy_banner_dismissed', 'true');
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2.5 border-b border-indigo-900/60 text-xs shadow-xs animate-in fade-in">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="leading-snug">
            <span className="font-bold text-emerald-300 mr-1.5">
              Enterprise Security & Privacy Notice:
            </span>
            <span className="text-slate-300">
              Supported by Google Cloud, Firebase & Google Drive. Your legal metrology audits, evidence scans, and Gmail login credentials are end-to-end encrypted. You are safe to create an account and file complaints.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={onOpenPrivacyModal}
            className="text-[11px] font-bold text-brand-300 hover:text-white underline underline-offset-2 flex items-center gap-1 transition"
          >
            <span>Read Privacy Policy</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition ml-2"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
