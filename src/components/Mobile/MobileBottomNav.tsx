import React from 'react';
import { Camera, ShieldCheck, MapPin, Phone, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type MobileTab = 'scan' | 'audit' | 'offices' | 'helpline' | 'profile';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  hasViolations?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  hasViolations = false
}) => {
  const { t } = useLanguage();

  const tabs: { id: MobileTab; labelKey: string; icon: React.FC<{ className?: string }>; badge?: boolean }[] = [
    { id: 'scan', labelKey: 'tabScan', icon: Camera },
    { id: 'audit', labelKey: 'tabAudit', icon: ShieldCheck, badge: hasViolations },
    { id: 'offices', labelKey: 'tabOffices', icon: MapPin },
    { id: 'helpline', labelKey: 'tabHelpline', icon: Phone },
    { id: 'profile', labelKey: 'tabProfile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe transition-colors duration-200">
      <div className="max-w-md mx-auto px-2 pt-1.5 pb-1 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 relative group tap-transparent active:scale-95 ${
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Material 3 Pill Indicator */}
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 relative ${
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-xs'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />

                {/* Violation Alert Dot */}
                {tab.badge && (
                  <span className="absolute 1.5 top-0.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </div>

              {/* Label - strict width and truncate to prevent text overflow in all languages */}
              <span
                className={`text-[10px] leading-tight truncate w-full text-center tracking-tight mt-0.5 max-w-[62px] block transition-colors ${
                  isActive ? 'font-extrabold text-brand-700 dark:text-brand-300' : 'font-semibold text-slate-500 dark:text-slate-400'
                }`}
                title={t(tab.labelKey)}
              >
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
