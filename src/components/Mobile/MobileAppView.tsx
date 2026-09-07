import React, { useState } from 'react';
import {
  ShieldAlert,
  Settings,
  Globe,
  FileWarning,
  Sparkles,
  PhoneCall,
  MapPin,
  FileText,
  ChevronRight,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { LabelLensLogo } from '../common/LabelLensLogo';
import { MobileBottomNav, MobileTab } from './MobileBottomNav';
import { CameraScanner } from '../Scanner/CameraScanner';
import { ScoreCard } from '../Audit/ScoreCard';
import { ParameterList } from '../Audit/ParameterList';
import { ExportBar } from '../Export/ExportBar';
import { StatutoryComplaintBanner } from '../Complaint/StatutoryComplaintBanner';
import { ProductAuditReport } from '../../types/audit';
import { LegalComplaint } from '../../types/complaint';
import { UserProfile, AppSettings } from '../../types/user';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface MobileAppViewProps {
  currentReport: ProductAuditReport | null;
  activeComplaint: LegalComplaint | null;
  userProfile: UserProfile;
  appSettings: AppSettings;
  isAnalyzing: boolean;
  onStartAnalysis: (input: any) => void;
  onInitiateComplaint: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenCallModal: () => void;
  onOpenMapModal: () => void;
  onOpenAdminPanel: () => void;
  onOpenAuthModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenPrivacyModal: () => void;
  onToggleChat: () => void;
  onOpenLanguageSelector: () => void;
  onSignOut?: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  currentReport,
  activeComplaint,
  userProfile,
  appSettings,
  isAnalyzing,
  onStartAnalysis,
  onInitiateComplaint,
  onOpenSettings,
  onOpenProfile,
  onOpenCallModal,
  onOpenMapModal,
  onOpenAdminPanel,
  onOpenAuthModal,
  onOpenPermissionsModal,
  onOpenPrivacyModal,
  onToggleChat,
  onOpenLanguageSelector,
  onSignOut
}) => {
  const { t, currentLanguageMeta } = useLanguage();
  const { actualTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<MobileTab>('scan');

  const hasViolations = currentReport
    ? currentReport.findings.some(f => f.status === 'Non-Compliant')
    : false;

  const violationCount = currentReport
    ? currentReport.findings.filter(f => f.status === 'Non-Compliant').length
    : 0;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <LabelLensLogo className="w-7 h-7" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">Label Lens AI</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[9px] rounded border border-emerald-500/30">
                APK
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 truncate max-w-[170px]">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Action icons (Language, Theme, Chat, Settings) */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher Pill */}
          <button
            onClick={onOpenLanguageSelector}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition active:scale-95 shadow-xs"
            title="Switch Language"
          >
            <span className="text-xs">{currentLanguageMeta.flag}</span>
            <span className="text-[11px] font-bold">{currentLanguageMeta.nativeName}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition active:scale-95 shadow-xs"
            title={actualTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {actualTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* AI Legal Chat Assistant */}
          <button
            onClick={onToggleChat}
            className="p-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-xs transition active:scale-95"
            title="Legal AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition active:scale-95 shadow-xs"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Tab Content Display */}
      <main className="flex-1 p-3.5 space-y-4">
        
        {/* TAB 1: SCAN */}
        {activeTab === 'scan' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <CameraScanner
              onStartAnalysis={(input) => {
                onStartAnalysis(input);
                setActiveTab('audit');
              }}
              isAnalyzing={isAnalyzing}
            />

            {currentReport && (
              currentReport.compliance_score < 90 || currentReport.findings.some(f => f.status === 'Non-Compliant') ? (
                <div className="p-4 bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 text-white rounded-3xl border border-rose-500/50 shadow-lg shadow-rose-950/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      Statutory Breaches Identified
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-300">
                      Score: {currentReport.compliance_score}/100
                    </span>
                  </div>
                  <div className="font-extrabold text-sm text-white">
                    {currentReport.brand_name} - {currentReport.product_name}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={onInitiateComplaint}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 active:scale-95 transition cursor-pointer"
                    >
                      <FileWarning className="w-4 h-4" />
                      <span>File Statutory Complaint</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <span>Findings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 text-white rounded-2xl border border-emerald-500/50 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Fully Compliant Dossier
                    </span>
                    <div className="font-extrabold text-xs text-white">
                      {currentReport.product_name} ({currentReport.compliance_score}/100)
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95 shrink-0"
                  >
                    <span>View Findings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 2: AUDIT & STATUTORY FINDINGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {currentReport ? (
              <>
                <ScoreCard
                  report={currentReport}
                  onFileComplaint={onInitiateComplaint}
                />
                <StatutoryComplaintBanner
                  report={currentReport}
                  complaint={activeComplaint}
                  onOpenComplaintDrawer={onInitiateComplaint}
                />
                <ParameterList
                  findings={currentReport.findings}
                  onOpenComplaintDrawer={onInitiateComplaint}
                />
                <ExportBar
                  report={currentReport}
                  complaint={activeComplaint || undefined}
                />
              </>
            ) : (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No Active Audit Dossier</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Scan a packaged commodity or load a test preset to view compliance scorecards and 5-point parameter findings.
                </p>
                <button
                  onClick={() => setActiveTab('scan')}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Start Scanning
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ENFORCEMENT OFFICES & TESTING LABS */}
        {activeTab === 'offices' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Enforcement Offices & NABL Labs
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Locate statutory Legal Metrology Controller offices, District Consumer Fora, and authorized food testing laboratories across India.
              </p>
              <button
                onClick={onOpenMapModal}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                <span>Open Interactive Google Map Locator</span>
              </button>
            </div>

            {/* Quick Cards of Prominent State Authorities */}
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">Controller of Legal Metrology, Maharashtra</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Barrack No. 7, Free Press Journal Marg, Nariman Point, Mumbai</div>
                <div className="text-brand-600 font-bold text-[11px] mt-1">Tel: 022-22886666</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">FSSAI Western Regional Office</div>
                <div className="text-slate-500 text-[11px] mt-0.5">902, Subharambh Building, Mumbai 400051</div>
                <div className="text-brand-600 font-bold text-[11px] mt-1">Tel: 022-26591000</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HELPLINE & EMERGENCY DIALER */}
        {activeTab === 'helpline' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Statutory National & State Helplines
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect directly with national consumer desks and state-wise food safety helplines with automatic call note recording.
              </p>

              {/* National Helpline 1-Click Dial */}
              <a
                href="tel:1800112100"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call National Consumer Helpline (1800-11-4000 / 1915)</span>
              </a>

              {/* In-App Calling Desk & Log Recorder */}
              <button
                onClick={onOpenCallModal}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>State Desks & Call Docket Logger</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE, IDENTITY & SYSTEM */}
        {activeTab === 'profile' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* User Identity Card */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-brand-500/20">
                  {userProfile.displayName ? userProfile.displayName.charAt(0) : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-900 dark:text-white text-sm truncate">
                    {userProfile.displayName || 'Verified Citizen Complainant'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] rounded-full uppercase">
                    {userProfile.role || 'Citizen'} • {appSettings.aiProvider?.toUpperCase() || 'GEMINI'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={onOpenProfile}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                >
                  Edit Details
                </button>
                <button
                  onClick={onOpenAuthModal}
                  className="py-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-300 font-bold text-xs border border-brand-200 dark:border-brand-800 transition"
                >
                  Switch Account
                </button>
              </div>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="w-full mt-3 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900/50 transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            {/* Quick System Hubs */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs transition-colors duration-200">
              {/* Theme Mode Toggle Row */}
              <button
                onClick={toggleTheme}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  {actualTheme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Theme Appearance</div>
                    <div className="text-slate-400 text-[11px] capitalize">Currently {actualTheme} mode (Tap to toggle)</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {actualTheme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              <button
                onClick={onOpenLanguageSelector}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Regional Indian Language</div>
                    <div className="text-slate-400 text-[11px]">{currentLanguageMeta.name} ({currentLanguageMeta.nativeName})</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenAdminPanel}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Directorate Admin & Excel Reports</div>
                    <div className="text-slate-400 text-[11px]">Download multi-sheet audit workbooks</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenPermissionsModal}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Hardware & Permissions Hub</div>
                    <div className="text-slate-400 text-[11px]">Camera, Mic, GPS, Storage Access</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenPrivacyModal}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Enterprise Privacy & Security Charter</div>
                    <div className="text-slate-400 text-[11px]">Cloud Firestore & OAuth Protected</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Action Button (FAB) for Instant Legal Complaint on Audit Tab */}
      {activeTab === 'audit' && hasViolations && (
        <button
          onClick={onInitiateComplaint}
          className="fixed bottom-20 right-4 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs shadow-xl shadow-rose-900/30 flex items-center gap-2 transition active:scale-95 animate-bounce"
        >
          <FileWarning className="w-4 h-4" />
          <span>File Petition ({violationCount})</span>
        </button>
      )}

      {/* Material 3 Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        hasViolations={hasViolations}
      />

    </div>
  );
};
