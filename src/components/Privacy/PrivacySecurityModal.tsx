import React from 'react';
import { ShieldCheck, Lock, Cloud, HardDrive, CheckCircle2, X, Key, Award } from 'lucide-react';

interface PrivacySecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySecurityModal: React.FC<PrivacySecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-900/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Enterprise Data Protection & Privacy Charter
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  DPDPA 2023 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Security Guarantee Powered by Google Cloud, Firebase & Google Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          
          {/* Executive Assurance Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                100% Safe to Log In & Create Inspection Profiles
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                Label Lens AI is built for Smart India Hackathon (SIH 2026, Problem Statement 26034) under the statutory framework of the Department of Consumer Affairs (MoCAF&PD). All authentication is performed via official Google OAuth 2.0 protocols and Firebase Auth. Your personal passwords or confidential data are never exposed or sold.
              </p>
            </div>
          </div>

          {/* Core Security Pillars */}
          <div className="space-y-3">
            
            {/* Pillar 1 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Key className="w-4 h-4 text-brand-600" />
                <span>1. Google OAuth 2.0 & Firebase Authentication</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                When you sign in using your Gmail account, authentication is brokered directly through Google's identity servers. The application only accesses your verified name and email address to populate legal petitions before statutory consumer courts and food safety officers.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <span>2. Isolated Storage by Google UID (Firebase & Google Drive)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                All evidence photos, PDF dossiers, and call recordings are segregated under strict per-user cloud paths: <code className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">/users/&#123;google_uid&#125;/audits/&#123;audit_id&#125;/...</code>. With one click, users can export all dossiers directly to their personal Google Drive folder.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>3. Forensic SHA-256 Evidentiary Integrity</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                To guarantee tamper-proof validity in consumer forums under the Indian Evidence Act, each scanned label generates an immutable cryptographic SHA-256 hash stamp, verifying that image evidence has not been altered post-capture.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                <span>4. Digital Personal Data Protection Act (DPDPA 2023) Alignment</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Users retain full right to erasure, correction, and document export. The Directorate Admin Panel allows administrators to inspect compliance audits while respecting citizen privacy guidelines.
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with TLS 1.3 & AES-256 GCM</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs transition active:scale-95 shadow-sm"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
