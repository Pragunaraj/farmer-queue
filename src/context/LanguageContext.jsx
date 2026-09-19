import { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS } from "./translations";

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: "ENG", label: "ENG", full: "English" },
  { code: "HIN", label: "HIN", full: "हिन्दी" },
  { code: "KAN", label: "KAN", full: "ಕನ್ನಡ" },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("agriflow_language");
      if (saved && ["ENG", "HIN", "KAN"].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return "ENG";
  });

  useEffect(() => {
    try {
      localStorage.setItem("agriflow_language", language);
    } catch (e) {
      console.error("Failed to save language preference", e);
    }
  }, [language]);

  // Translation helper function
  const t = (key) => {
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key] !== undefined) {
      return TRANSLATIONS[language][key];
    }
    // Fallback to English
    if (TRANSLATIONS.ENG && TRANSLATIONS.ENG[key] !== undefined) {
      return TRANSLATIONS.ENG[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "ENG",
      setLanguage: () => {},
      t: (key) => TRANSLATIONS.ENG?.[key] || key,
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
