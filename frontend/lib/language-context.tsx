
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { translations, Language, TranslationKey } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
  isRtl: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  forcedLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = "ar",
  forcedLanguage
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // If language is forced, always use it and ignore local storage
    if (forcedLanguage) {
      setLanguageState(forcedLanguage);
      return;
    }

    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguageState(saved);
    }
  }, [forcedLanguage]);

  useEffect(() => {
    const activeLang = forcedLanguage || language;

    // Only save to local storage if not forced (user preference)
    if (!forcedLanguage) {
      localStorage.setItem("language", activeLang);
    }

    document.documentElement.dir = activeLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = activeLang;
  }, [language, forcedLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    if (forcedLanguage) return; // Cannot change if forced
    setLanguageState(lang);
  }, [forcedLanguage]);

  const t = useCallback((key: TranslationKey): string => {
    const activeLang = forcedLanguage || language;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return (translations[activeLang] as any)[key] || key;
  }, [language, forcedLanguage]);

  const activeLang = forcedLanguage || language;
  const dir = activeLang === "ar" ? "rtl" : "ltr";
  const isRtl = activeLang === "ar";

  return (
    <LanguageContext.Provider value={{ language: activeLang, setLanguage, t, dir, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
