import React, { useState } from 'react';
import { PhoneCall, Settings, User, Bot, Sparkles, MapPin, ShieldAlert, KeyRound, Languages, LogOut, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types/user';
import { LabelLensLogo } from './common/LabelLensLogo';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelectorModal } from './Language/LanguageSelectorModal';

interface NavbarProps {
  userProfile: UserProfile;
  viewMode?: 'desktop' | 'mobile_apk';
  onToggleViewMode?: (mode: 'desktop' | 'mobile_apk') => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenCallModal: () => void;
  onOpenMapModal?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenAuthModal?: () => void;
  onOpenPermissionsModal?: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onOpenSettings,
  onOpenProfile,
  onOpenCallModal,
  onOpenMapModal,
  onOpenAdminPanel,
  onOpenPermissionsModal,
  onToggleChat,
  isChatOpen,
  onSignOut
}) => {
  const { currentLanguageMeta, t } = useLanguage();
  const { actualTheme, toggleTheme } = useTheme();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Statutory Subtitle (Clean, Zero-Wrap, High Tech) */}
        <div className="flex items-center gap-3 shrink-0">
          <LabelLensLogo size="md" showText={true} showSubtitle={true} />
        </div>

        {/* Action Controls & Statutory Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Quick Regional Indian Language Selector */}
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition shadow-xs active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            title="Switch Application Language (10 Indian Regional Languages)"
          >
            <span className="text-base leading-none select-none">{currentLanguageMeta.flag}</span>
            <span className="font-bold">{currentLanguageMeta.nativeName}</span>
            <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Interactive Light / Dark Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer shrink-0 shadow-xs"
            title={actualTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {actualTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Directorate Admin Panel Button */}
          {onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition shadow-xs active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              title="Open Directorate Admin Command Center & Excel Exporter"
            >
              <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{t('adminPanel')}</span>
              <span className="text-[10px] bg-purple-200 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 px-1.5 py-0.2 rounded font-extrabold hidden md:inline">
                Director
              </span>
            </button>
          )}

          {/* Google Maps Enforcement Office Locator */}
          {onOpenMapModal && (
            <button
              onClick={onOpenMapModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition shadow-xs active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              title="Locate Nearest Legal Metrology & FSSAI Offices on Google Maps"
            >
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('officesAndLabs')}</span>
            </button>
          )}

          {/* Direct Authority Calling Trigger */}
          <button
            onClick={onOpenCallModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition shadow-xs active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            title="One-Click Direct Helpline & Call Records"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{t('callHelpline')}</span>
          </button>

          {/* AI Legal Assistant Toggle */}
          <button
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs active:scale-95 whitespace-nowrap shrink-0 cursor-pointer ${
              isChatOpen
                ? 'bg-brand-600 text-white shadow-brand-500/25'
                : 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">{t('chatAssistant')}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>

          {/* Subtle Vertical Divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block shrink-0" />

          {/* System Permissions Access Hub */}
          {onOpenPermissionsModal && (
            <button
              onClick={onOpenPermissionsModal}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hidden md:flex items-center justify-center shrink-0 cursor-pointer"
              title="Hardware & System Permissions Hub (Camera, Mic, Location, Storage)"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}

          {/* Settings / API Key Vault */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shrink-0 cursor-pointer"
            title="Configure API Keys (Gemini 3.7 / 2.5 / OpenAI) & Preferences"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Complainant Legal Identity & Sign Out */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 shadow-xs cursor-pointer shrink-0"
              title="Complainant Legal Profile & Settings"
            >
              <div className="text-left hidden xl:block max-w-[120px]">
                <div className="text-xs font-black text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {userProfile.displayName || 'Verified User'}
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 capitalize truncate">
                  {userProfile.role || 'Citizen'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 cursor-pointer shrink-0"
                title={t('signOut')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </header>
  );
};
