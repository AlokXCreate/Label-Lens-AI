import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, X, Check, ArrowRight, Loader2, Sparkles, Languages } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { signInWithGoogle, loginWithEmail, registerAccount } from '../../services/firebaseService';
import { useLanguage } from '../../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'google' | 'login' | 'register'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'consumer' | 'inspector' | 'admin'>('consumer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle(email.trim() || undefined);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to complete Google Sign-In. Please check network.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await loginWithEmail(email.trim(), password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid credentials or account error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !displayName.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await registerAccount(email.trim(), password, displayName.trim(), role, currentLanguage);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold border border-brand-100 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {t('authTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('authSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indian Language Selector Bar */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Languages className="w-4 h-4 text-brand-600" />
            <span>{t('language')}:</span>
          </div>
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => { setActiveTab('google'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition cursor-pointer ${activeTab === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
          >
            Google Gmail
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition cursor-pointer ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
          >
            {t('signIn')}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition cursor-pointer ${activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
          >
            {t('createAccountAction')}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* Tab 1: Google Gmail Sign-In */}
        {activeTab === 'google' && (
          <form onSubmit={handleGoogleSignIn} className="space-y-4">
            <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 to-slate-50 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-indigo-950 block mb-1">
                Direct Google (Gmail) Sign-In
              </span>
              Sign in with your Google account to sync your inspection audits, access the Directorate Admin Panel, and file official complaints under your verified legal name.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Google / Gmail ID (Optional Hint)
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="e.g. alok.consumer.safety@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs outline-none text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md shadow-slate-900/20 flex items-center justify-center gap-2.5 transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Continue with Google Gmail</span>
            </button>
          </form>
        )}

        {/* Tab 2: Email & Password Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs outline-none text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Sign In to Account</span>
            </button>
          </form>
        )}

        {/* Tab 3: Create Account */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Kumar"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full text-xs outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-brand-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs outline-none text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designated Inspection Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'consumer' as const, label: 'Citizen / Buyer' },
                  { id: 'inspector' as const, label: 'LMPC Inspector' },
                  { id: 'admin' as const, label: 'Directorate Admin' }
                ].map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-1.5 rounded-lg border font-semibold text-center transition text-[11px] ${
                      role === r.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Create Official Account</span>
            </button>
          </form>
        )}

        {/* Enterprise Security Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Firebase & Google Cloud Verified</span>
          </span>
          <span className="font-mono text-[10px]">AES-256 SSL</span>
        </div>

      </div>
    </div>
  );
};
