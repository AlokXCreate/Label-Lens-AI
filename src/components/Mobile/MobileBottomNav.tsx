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
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-colors duration-200">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative group active:scale-90 ${
                isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Pill Indicator */}
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 relative ${
                  isActive ? 'bg-brand-50 dark:bg-brand-950/80 shadow-xs' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-brand-600 dark:text-brand-400 stroke-[2.4]' : 'text-slate-500 dark:text-slate-400 stroke-[1.8]'
                  }`}
                />

                {/* Violation Alert Dot */}
                {tab.badge && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'font-extrabold text-brand-700 dark:text-brand-400' : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
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
