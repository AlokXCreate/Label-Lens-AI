import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndianLanguageCode } from '../types/user';
import {
  SupportedLanguage,
  SUPPORTED_INDIAN_LANGUAGES,
  getCurrentLanguage,
  setAppLanguage,
  subscribeToLanguage,
  t
} from '../services/i18nService';

interface LanguageContextType {
  currentLanguage: IndianLanguageCode;
  setLanguage: (lang: IndianLanguageCode) => void;
  t: (key: string) => string;
  languages: SupportedLanguage[];
  currentLanguageMeta: SupportedLanguage;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<IndianLanguageCode>(getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = subscribeToLanguage((lang) => {
      setCurrentLanguageState(lang);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSetLanguage = (lang: IndianLanguageCode) => {
    setAppLanguage(lang);
  };

  const currentLanguageMeta =
    SUPPORTED_INDIAN_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_INDIAN_LANGUAGES[0];

  const translate = (key: string) => t(key, currentLanguage);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        t: translate,
        languages: SUPPORTED_INDIAN_LANGUAGES,
        currentLanguageMeta
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
