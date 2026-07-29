"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationFR from "../locales/fr/translation.json";
import translationEN from "../locales/en/translation.json";

// Avoid re-initializing on hot reloads
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        fr: { translation: translationFR },
        en: { translation: translationEN },
      },
      fallbackLng: "fr",
      supportedLngs: ["fr", "en"],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["path", "localStorage", "navigator"],
        caches: ["localStorage"],
        lookupFromPathIndex: 1,
        // lookupFromPathIndex: 1 = second segment after leading slash (/en/page → "en")
      },
    });
}

export default i18n;
