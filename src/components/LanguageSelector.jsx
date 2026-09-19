import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  return (
    <div
      className="lang-selector-container"
      role="group"
      aria-label="Language Selector"
    >
      {supportedLanguages.map((lang, index) => {
        const isActive = language === lang.code;
        return (
          <React.Fragment key={lang.code}>
            <button
              type="button"
              className={`lang-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setLanguage(lang.code)}
              title={`Switch language to ${lang.full}`}
              aria-pressed={isActive}
            >
              {lang.label}
            </button>
            {index < supportedLanguages.length - 1 && (
              <span className="lang-divider" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
