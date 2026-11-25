import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { getLocales } from 'expo-localization';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { setApiLanguage } from '@/api/tmdb';
import { pickLanguage, TMDB_LANGUAGE, translate, type Language, type TranslationKey } from '@/lib/i18n';

const STORAGE_KEY = 'language';

type LanguageValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [lang, setLangState] = useState<Language>(() => {
    const initial = pickLanguage(getLocales()[0]?.languageCode);
    setApiLanguage(TMDB_LANGUAGE[initial]);
    return initial;
  });

  const apply = (next: Language) => {
    setApiLanguage(TMDB_LANGUAGE[next]);
    setLangState(next);
    // Titles, overviews and genres come from TMDB in the chosen language.
    queryClient.resetQueries();
  };

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'ka') apply(saved);
    });
    // Runs once on start to restore the saved choice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (next: Language) => {
    AsyncStorage.setItem(STORAGE_KEY, next);
    apply(next);
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>) => translate(lang, key, vars);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
