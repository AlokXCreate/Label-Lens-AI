import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CameraScanner } from './components/Scanner/CameraScanner';
import { ScoreCard } from './components/Audit/ScoreCard';
import { ParameterList } from './components/Audit/ParameterList';
import { ExportBar } from './components/Export/ExportBar';
import { ComplaintDrawer } from './components/Complaint/ComplaintDrawer';
import { LocationPromptModal } from './components/Complaint/LocationPromptModal';
import { ChatAssistant } from './components/Chat/ChatAssistant';
import { QuickCallModal } from './components/Authority/QuickCallModal';
import { EnforcementOfficeMap } from './components/Map/EnforcementOfficeMap';
import { SettingsModal } from './components/Settings/SettingsModal';
import { ProfileModal } from './components/Settings/ProfileModal';
import { AuthModal } from './components/Auth/AuthModal';
import { AdminPanelModal } from './components/Admin/AdminPanelModal';
import { PermissionsModal } from './components/Permissions/PermissionsModal';
import { PrivacySecurityModal } from './components/Privacy/PrivacySecurityModal';
import { PrivacyNoticeBanner } from './components/Privacy/PrivacyNoticeBanner';
import { NotificationToastContainer } from './components/Notifications/NotificationToastContainer';
import { MobileAppView } from './components/Mobile/MobileAppView';
import { LanguageSelectorModal } from './components/Language/LanguageSelectorModal';

import { ProductAuditReport } from './types/audit';
import { LegalComplaint } from './types/complaint';
import { UserProfile, AppSettings } from './types/user';

import { analyzeProductUniversal } from './services/aiProviderService';
import { generateGroundedRulesAudit } from './services/geminiService';
import { generateLegalComplaint } from './services/complaintService';
import { getUserProfile, getAppSettings, saveReportLocally, saveComplaintLocally, getStoredReports, clearUserSession } from './services/storageService';
import { subscribeToAuthChanges, logoutUser } from './services/firebaseService';
import { sendAppNotification, requestNotificationPermission } from './services/notificationService';
import { SplashScreen } from './components/Splash/SplashScreen';
import { FloatingAuthPage } from './components/Auth/FloatingAuthPage';
import { CreateProfilePage } from './components/Auth/CreateProfilePage';

export const App: React.FC = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Application State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getUserProfile());
  const [appSettings, setAppSettings] = useState<AppSettings>(getAppSettings());
  const [currentReport, setCurrentReport] = useState<ProductAuditReport | null>(null);
  const [activeComplaint, setActiveComplaint] = useState<LegalComplaint | null>(null);

  // Dedicated Separate Version: Desktop Website vs Standalone Mobile APK
  const isApkMode = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('app') === 'apk' ||
    window.location.pathname.endsWith('/apk') ||
    window.innerWidth < 768
  );

  // Modals & Drawers Visibility
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplaintDrawerOpen, setIsComplaintDrawerOpen] = useState(false);
  const [isLocationPromptOpen, setIsLocationPromptOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Initialize on mount: listen to Auth changes, load initial report, request notification permission
  useEffect(() => {
    requestNotificationPermission();

    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      if (user) setUserProfile(user);
    });

    const storedReports = getStoredReports();
    if (storedReports.length > 0) {
      setCurrentReport(storedReports[0]);
    } else {
      // Default initial compliant demonstration pack
      const initialReport = generateGroundedRulesAudit({
        textDescription: "Aashirvaad Superior MP Whole Wheat Atta. Net Qty: 5 kg. MRP: ₹ 245.00 (inclusive of all taxes). Unit Sale Price: ₹ 49.00 / kg. Mfd: 08/2026. FSSAI Lic No: 10012022000452. Contains: Wheat (Gluten).",
        pdpAreaSqCm: 650
      });
      setCurrentReport(initialReport);
      saveReportLocally(initialReport);
    }

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Handler for Multimodal Analysis Trigger
  const handleStartAnalysis = async (input: {
    imagesBase64?: string[];
    voiceTranscript?: string;
    textDescription?: string;
    pdpAreaSqCm?: number;
    barcode?: string;
    documentText?: string;
  }) => {
    setIsAnalyzing(true);
    sendAppNotification('SCAN_PROCESSING', appSettings.soundAlertsEnabled);

    try {
      let activeKey = appSettings.geminiApiKey;
      if (appSettings.aiProvider === 'openai') activeKey = appSettings.openaiApiKey || '';
      else if (appSettings.aiProvider === 'openrouter') activeKey = appSettings.openrouterApiKey || '';

      const report = await analyzeProductUniversal(
        appSettings.aiProvider || 'gemini',
        activeKey,
        appSettings.preferredModel,
        input,
        appSettings.customEndpointUrl
      );

      setCurrentReport(report);
      saveReportLocally(report);

      // Play success audio & trigger rich pop-up notification
      sendAppNotification('REPORT_READY', appSettings.soundAlertsEnabled, {
        title: 'Product Audit Complete',
        message: `${report.product_name}: ${report.compliance_score}/100 score (${report.overall_status.toUpperCase()})`,
        meta: {
          score: report.compliance_score,
          status: report.overall_status
        }
      });

    } catch (err) {
      console.error("Universal analysis error, falling back to grounded statutory rules:", err);
      const fallbackReport = generateGroundedRulesAudit({
        imagesBase64: input.imagesBase64,
        voiceTranscript: input.voiceTranscript,
        textDescription: input.textDescription,
        pdpAreaSqCm: input.pdpAreaSqCm
      });
      setCurrentReport(fallbackReport);
      saveReportLocally(fallbackReport);
      sendAppNotification('REPORT_READY', appSettings.soundAlertsEnabled, {
        title: 'Statutory Rules Audit Complete',
        message: `${fallbackReport.product_name}: ${fallbackReport.compliance_score}/100 score`,
        meta: {
          score: fallbackReport.compliance_score,
          status: fallbackReport.overall_status
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 1: Trigger Complaint Flow -> Check Geo-Tagging Confirmation
  const handleInitiateComplaint = () => {
    if (appSettings.enableGeoTaggingConfirmation) {
      setIsLocationPromptOpen(true);
    } else {
      finalizeComplaint(false);
    }
  };

  // Step 2: Finalize Legal Complaint with or without Location Data
  const finalizeComplaint = (
    includeLocation: boolean,
    locationData?: {
      latitude: number;
      longitude: number;
      formatted_address: string;
      state: string;
      district: string;
    }
  ) => {
    if (!currentReport || !userProfile) return;

    const complaint = generateLegalComplaint(
      currentReport,
      userProfile,
      includeLocation,
      locationData
    );

    setActiveComplaint(complaint);
    saveComplaintLocally(complaint);
    setIsLocationPromptOpen(false);
    setIsComplaintDrawerOpen(true);

    sendAppNotification('COMPLAINT_FILED', appSettings.soundAlertsEnabled, {
      title: 'Statutory Grievance Form Drafted',
      message: `Docket #${complaint.complaint_id} prepared for ${complaint.authority_target}.`,
      actionLabel: 'View Docket',
      onAction: () => setIsComplaintDrawerOpen(true),
      meta: {
        docketId: complaint.complaint_id,
        targetDesk: complaint.authority_target
      }
    });
  };

  // Handler for Session Sign Out
  const handleSignOut = async () => {
    await logoutUser();
    clearUserSession();
    setUserProfile(null);
    sendAppNotification('CUSTOM_INFO', appSettings.soundAlertsEnabled, {
      title: 'Signed Out Successfully',
      message: 'Your regulatory session has been securely closed.'
    });
  };

  // ==========================================================================
  // PHASE 0: CINEMATIC SPLASH SCREEN & TRANSITION (INITIAL OPEN)
  // ==========================================================================
  if (showSplash) {
    return (
      <SplashScreen
        durationMs={2800}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  // ==========================================================================
  // PHASE 1: MANDATORY FLOATING AUTHENTICATION (FIRST SCREEN)
  // ==========================================================================
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-950">
        <FloatingAuthPage
          onAuthSuccess={(user) => {
            setUserProfile(user);
          }}
        />
        <NotificationToastContainer />
      </div>
    );
  }

  // ==========================================================================
  // PHASE 2: MANDATORY PROFILE CREATION & IDENTITY ONBOARDING (SECOND SCREEN)
  // ==========================================================================
  if (!userProfile.profileCompleted) {
    return (
      <div className="min-h-screen bg-slate-950">
        <CreateProfilePage
          initialUser={userProfile}
          onProfileCompleted={(completedUser) => {
            setUserProfile(completedUser);
          }}
          onSignOut={handleSignOut}
        />
        <NotificationToastContainer />
      </div>
    );
  }

  // ==========================================================================
  // PHASE 3: REGULATORY COMPLIANCE WORKSPACE (DESKTOP WEB & MOBILE APK)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* SEPARATE VERSION 1: STANDALONE MOBILE APK APPLICATION */}
      {isApkMode ? (
        <MobileAppView
          currentReport={currentReport}
          activeComplaint={activeComplaint}
          userProfile={userProfile}
          appSettings={appSettings}
          isAnalyzing={isAnalyzing}
          onStartAnalysis={handleStartAnalysis}
          onInitiateComplaint={handleInitiateComplaint}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCallModal={() => setIsCallModalOpen(true)}
          onOpenMapModal={() => setIsMapModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenPermissionsModal={() => setIsPermissionsOpen(true)}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
          onSignOut={handleSignOut}
        />
      ) : (
        /* SEPARATE VERSION 2: DEDICATED DESKTOP WEBSITE COMMAND CENTER */
        <>
          {/* Enterprise Privacy & Security Notification Banner */}
          <PrivacyNoticeBanner onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />

          {/* Clean Executive Website Navbar (No APK / Mobile toggles) */}
          <Navbar
            userProfile={userProfile}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenCallModal={() => setIsCallModalOpen(true)}
            onOpenMapModal={() => setIsMapModalOpen(true)}
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
            onOpenPermissionsModal={() => setIsPermissionsOpen(true)}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isChatOpen={isChatOpen}
            onSignOut={handleSignOut}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Multimodal Camera Scanner & Voice Input */}
            <CameraScanner
              onStartAnalysis={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
            />

            {/* Dynamic Audit Results Section */}
            {currentReport && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Scorecard & Technical Metadata */}
                <ScoreCard report={currentReport} />

                {/* 5-Point Parameter Evaluation Findings */}
                <ParameterList
                  findings={currentReport.findings}
                  onOpenComplaintDrawer={handleInitiateComplaint}
                />

                {/* One-Click 5-Format Export Bar */}
                <ExportBar
                  report={currentReport}
                  complaint={activeComplaint || undefined}
                />

              </div>
            )}

          </main>

          {/* Footer with Enterprise & Statutory Links */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="hover:text-brand-700 dark:hover:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Directorate Admin Command Center
                </button>
                <span>•</span>
                <button
                  onClick={() => setIsPermissionsOpen(true)}
                  className="hover:text-brand-700 dark:hover:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Hardware & Permissions Hub
                </button>
                <span>•</span>
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:text-brand-700 dark:hover:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Enterprise Privacy & Security Charter
                </button>
                <span>•</span>
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-700 dark:hover:text-brand-400 hover:underline"
                >
                  Dept. of Consumer Affairs (MoCAF&PD)
                </a>
              </div>

              <p className="font-semibold text-slate-700 dark:text-slate-200">
                Label Lens AI — Developed for Smart India Hackathon (SIH 2026 Problem Statement 26034)
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Grounded in Legal Metrology Act, 2009 (PCR 2026), FSSAI Labelling Regulations, and backed by Google Cloud & Firebase.
              </p>
            </div>
          </footer>
        </>
      )}

      {/* Modals & Slide-in Drawers */}
      <LocationPromptModal
        isOpen={isLocationPromptOpen}
        onConfirm={(locData) => finalizeComplaint(!!locData, locData)}
        onClose={() => setIsLocationPromptOpen(false)}
      />

      <ComplaintDrawer
        isOpen={isComplaintDrawerOpen}
        complaint={activeComplaint}
        report={currentReport}
        onClose={() => setIsComplaintDrawerOpen(false)}
        onDispatched={() => {
          sendAppNotification('COMPLAINT_FILED', appSettings.soundAlertsEnabled);
          alert("Official Complaint has been prepared and dispatched via email / direct FoSCoS portal.");
        }}
      />

      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        apiKey={
          appSettings.aiProvider === 'openai'
            ? appSettings.openaiApiKey
            : appSettings.aiProvider === 'openrouter'
            ? appSettings.openrouterApiKey
            : appSettings.geminiApiKey
        }
        provider={appSettings.aiProvider}
        model={appSettings.preferredModel}
      />

      {/* Google Maps Enforcement Office & Testing Lab Locator */}
      <EnforcementOfficeMap
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        userAddress={userProfile.currentLocation || "Pune, Maharashtra, India"}
        onSelectOfficeForComplaint={(officeName) => {
          if (activeComplaint) {
            setActiveComplaint({
              ...activeComplaint,
              authority_target: officeName
            });
            setIsComplaintDrawerOpen(true);
          }
        }}
      />

      <QuickCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        userState={userProfile.currentLocation?.includes('Maharashtra') ? 'Maharashtra' : 'National'}
        auditId={currentReport?.id}
        userUid={userProfile.uid}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={appSettings}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={(updated) => setAppSettings(updated)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        userProfile={userProfile}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={(updated) => setUserProfile(updated)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Google / Gmail Authentication & Account Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setUserProfile(user)}
      />

      {/* Directorate Admin Command Center with Excel Export */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={userProfile}
      />

      {/* Hardware & System Permissions Hub */}
      <PermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />

      {/* Enterprise Data Protection & Privacy Charter Modal */}
      <PrivacySecurityModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Regional Indian Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Global Regulatory Pop-up Notification HUD */}
      <NotificationToastContainer />

    </div>
  );
};

export default App;
