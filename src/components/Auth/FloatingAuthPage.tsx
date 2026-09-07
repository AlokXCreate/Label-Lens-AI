import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Languages,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Scale
} from 'lucide-react';
import { LabelLensLogo } from '../common/LabelLensLogo';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelectorModal } from '../Language/LanguageSelectorModal';
import { signInWithGoogle, loginWithEmail, registerAccount } from '../../services/firebaseService';
import { UserProfile, IndianLanguageCode } from '../../types/user';
import { GoogleSignInModal } from './GoogleSignInModal';

interface FloatingAuthPageProps {
  onAuthSuccess: (user: UserProfile) => void;
  onDemoLogin?: (role: 'consumer' | 'inspector' | 'admin') => void;
}

export const FloatingAuthPage: React.FC<FloatingAuthPageProps> = ({
  onAuthSuccess,
  onDemoLogin
}) => {
  const { currentLanguage, currentLanguageMeta, t } = useLanguage();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'consumer' | 'inspector' | 'admin'>('consumer');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1-Click Google / Gmail Sign-In Opens Google Account Chooser
  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    setIsGoogleModalOpen(true);
  };

  // Email / Password Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'login') {
        const user = await loginWithEmail(email, password);
        onAuthSuccess(user);
      } else {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your full legal name.");
          setIsLoading(false);
          return;
        }
        const user = await registerAccount(
          email,
          password,
          fullName,
          role,
          currentLanguage as IndianLanguageCode
        );
        onAuthSuccess(user);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Evaluator Demo Sign-In
  const handleFastDemoLogin = async (targetRole: 'consumer' | 'inspector' | 'admin') => {
    setIsLoading(true);
    try {
      if (onDemoLogin) {
        onDemoLogin(targetRole);
      } else {
        const demoEmail =
          targetRole === 'admin'
            ? 'nikita.directorate@doca.gov.in'
            : targetRole === 'inspector'
            ? 'shreya.lm.inspector@maharashtra.gov.in'
            : 'masira.consumer.safety@gmail.com';

        const user = await signInWithGoogle(demoEmail);
        onAuthSuccess(user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-950">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/25 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar Floating Badges */}
      <header className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white shadow-lg">
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-black tracking-wide text-slate-200">
            SIH 2026 Problem Statement 26034
          </span>
        </div>

        {/* Regional Language Switcher Pill */}
        <button
          onClick={() => setIsLanguageModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white backdrop-blur-md transition active:scale-95 shadow-lg text-xs font-bold"
          title="Choose Indian Language"
        >
          <span className="text-sm">{currentLanguageMeta.flag}</span>
          <span className="text-slate-200">{currentLanguageMeta.nativeName}</span>
          <Languages className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </header>

      {/* Central Floating Glassmorphism Auth Card */}
      <div className="w-full max-w-md my-12 relative z-10 bg-slate-900/85 backdrop-blur-2xl border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-brand-600/30 to-emerald-500/20 border border-slate-700/80 rounded-2xl shadow-xl shadow-brand-500/10 mb-3">
            <LabelLensLogo size="lg" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Label Lens AI</span>
            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              v1.0
            </span>
          </h1>

          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Mode Switcher: Sign In vs Create Account */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-2xl mb-5 shadow-inner">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('loginAction')}
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('createAccountAction')}
          </button>
        </div>

        {/* 1-Click Google / Gmail Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-150 shadow-md active:scale-98 disabled:opacity-50"
        >
          {/* Official Colorful Google G SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <span>{t('loginGoogle')}</span>
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-slate-900/90 px-3 text-slate-400">
              {t('orEmail')}
            </span>
          </div>
        </div>

        {/* Form Error Display */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name for Registration */}
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                {t('fullName')}
              </label>
              <div className="relative flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                <User className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Masira Mulani"
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-medium"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              {t('emailAddress')}
            </label>
            <div className="relative flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
              <Mail className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              {t('password')}
            </label>
            <div className="relative flex items-center bg-slate-950/60 rounded-xl border border-slate-700/80 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
              <Lock className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-slate-400 hover:text-slate-200 transition mr-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Role selector for registration */}
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                {t('accountRole')}
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setRole('consumer')}
                  className={`p-2 rounded-xl border text-center transition ${
                    role === 'consumer'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('inspector')}
                  className={`p-2 rounded-xl border text-center transition ${
                    role === 'inspector'
                      ? 'bg-blue-500/20 border-blue-500/60 text-blue-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Inspector
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2 rounded-xl border text-center transition ${
                    role === 'admin'
                      ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Director
                </button>
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>{authMode === 'login' ? t('loginAction') : t('createAccountAction')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Fast Evaluator Demo Access */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              1-Click Demo Evaluation Access:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleFastDemoLogin('consumer')}
              className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition flex items-center justify-center gap-1"
              title="Sign in as Citizen Complainant"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => handleFastDemoLogin('inspector')}
              className="py-1.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold transition flex items-center justify-center gap-1"
              title="Sign in as Legal Metrology Inspector"
            >
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>Inspector</span>
            </button>

            <button
              type="button"
              onClick={() => handleFastDemoLogin('admin')}
              className="py-1.5 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold transition flex items-center justify-center gap-1"
              title="Sign in as Directorate Administrator"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Director</span>
            </button>
          </div>
        </div>

        {/* Security / Privacy Trust Strip */}
        <div className="mt-5 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured by Google Cloud Firebase & 256-bit AES Compliance Vault</span>
        </div>

      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Interactive Google / Gmail Account Chooser Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={(user) => {
          setIsGoogleModalOpen(false);
          onAuthSuccess(user);
        }}
      />

    </div>
  );
};
