import React, { useState } from 'react';
import { X, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { signInWithGoogle } from '../../services/firebaseService';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

const PRESET_GOOGLE_ACCOUNTS = [
  {
    name: 'Masira Mulani',
    email: 'masira.consumer.safety@gmail.com',
    roleLabel: 'Citizen Complainant / Consumer Lead',
    avatarBg: 'bg-blue-600',
    initial: 'M'
  },
  {
    name: 'Shreya Ombale',
    email: 'shreya.lm.inspector@maharashtra.gov.in',
    roleLabel: 'LMPC Legal Metrology Officer',
    avatarBg: 'bg-emerald-600',
    initial: 'S'
  },
  {
    name: 'Nikita Shravani',
    email: 'nikita.directorate@doca.gov.in',
    roleLabel: 'Director (DoCA / MoCAF&PD)',
    avatarBg: 'bg-purple-600',
    initial: 'N'
  }
];

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = async (email: string, name?: string) => {
    setLoadingEmail(email);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle(email, name);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      setErrorMsg(err?.message || "Failed to sign in with Google account. Please try again.");
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setErrorMsg("Please enter a valid Gmail / Google email address.");
      return;
    }
    const derivedName = customName.trim() || customEmail.split('@')[0];
    handleSelectAccount(customEmail.trim(), derivedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          title="Close Google Sign-in"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="p-6 pb-4 border-b border-slate-100 text-center flex flex-col items-center">
          {/* Official Colorful Google G */}
          <svg className="w-10 h-10 mb-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>

          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            Choose an account
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            to continue to <span className="font-semibold text-brand-600">Label Lens AI</span>
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 pt-4 space-y-2">
          {!isCustomMode ? (
            <>
              {/* Preset Google Accounts */}
              <div className="space-y-1.5">
                {PRESET_GOOGLE_ACCOUNTS.map((acc) => {
                  const isLoadingThis = loadingEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={!!loadingEmail}
                      onClick={() => handleSelectAccount(acc.email, acc.name)}
                      className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50/80 transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full ${acc.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}
                        >
                          {acc.initial}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 text-sm group-hover:text-brand-600 transition">
                            {acc.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                          <span className="inline-block mt-0.5 text-[10px] text-slate-400 font-medium">
                            {acc.roleLabel}
                          </span>
                        </div>
                      </div>

                      {isLoadingThis ? (
                        <Loader2 className="w-5 h-5 text-brand-600 animate-spin shrink-0" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Use Another Google Account Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  setErrorMsg(null);
                }}
                className="w-full mt-3 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/30 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <UserPlus className="w-4 h-4 text-brand-600" />
                <span>Use another Google account</span>
              </button>
            </>
          ) : (
            /* Custom Account Input Mode */
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-1">Enter your Google / Gmail credentials</p>
                <p className="text-[11px] text-slate-500">
                  Label Lens AI will link your legal identity to this Google profile.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Google Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Legal Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(false);
                    setErrorMsg(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
                >
                  ← Back to List
                </button>
                <button
                  type="submit"
                  disabled={!customEmail.trim() || !!loadingEmail}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loadingEmail ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy & Compliance Footnote */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              To continue, Google will share your verified name, email address, and profile photo with Label Lens AI.
              Protected under Google Cloud & Firebase AES-256 Vault.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
