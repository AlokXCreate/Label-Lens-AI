import React from 'react';
import { Languages, Check, X, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { IndianLanguageCode } from '../../types/user';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage?: (lang: IndianLanguageCode) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  if (!isOpen) return null;

  const handleLanguageClick = (langCode: IndianLanguageCode) => {
    setLanguage(langCode);
    onSelectLanguage?.(langCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md shadow-brand-900/40">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  {t('selectLanguage')} / भाषा चयन
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 10 Languages
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Indian Administrative & Regional Languages (Legal Metrology & FSSAI)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[65vh] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageClick(lang.code)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm sm:text-base text-slate-900 leading-tight group-hover:text-brand-700 transition">
                          {lang.nativeName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({lang.name})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {lang.region}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-brand-400 transition" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2 mt-4">
            <Globe className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Indian Multilingual Guarantee:</strong> All legal terms, 5-point statutory parameters (Rule 6 PCR 2011), petitions, and guidance text are natively localized without machine distortion.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition cursor-pointer shadow-xs"
          >
            Done / पूर्ण
          </button>
        </div>

      </div>
    </div>
  );
};

export default LanguageSelectorModal;
