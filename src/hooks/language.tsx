import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useContext,
} from 'react';

import i18next from 'i18next';

interface LanguageContextData {
  locale: string;
  handleSelectLang: any;
}

const LanguageContext = createContext<LanguageContextData>(
  {} as LanguageContextData,
);

const LanguageProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState<string>(() => {
    const storagedLocale = localStorage.getItem('@i18next: locale');

    const initialLanguage = 'pt-BR';

    if (storagedLocale) {
      return JSON.parse(storagedLocale);
    }

    return localStorage.setItem(
      '@i18next: locale',
      JSON.stringify(initialLanguage),
    );
  });

  const handleSelectLang = useCallback((e) => {
    const lang = e.target.value;

    localStorage.setItem('@i18next: locale', JSON.stringify(lang));

    setLocale(lang);
  }, []);

  useEffect(() => {
    setLocale(locale);

    i18next.changeLanguage(locale);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, handleSelectLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

function useLanguage(): LanguageContextData {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('error in translate');
  }

  return context;
}

export { LanguageProvider, useLanguage };
