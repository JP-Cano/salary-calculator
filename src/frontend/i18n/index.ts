import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { en } from "./en.ts";
import { es } from "./es.ts";

export type Language = "en" | "es";
export type TranslationKey = keyof typeof en;
export type TranslationDictionary = Record<TranslationKey, string>;

const STORAGE_KEY = "salary-calc-lang";
const DEFAULT_LANGUAGE: Language = "es";

const dictionaries: Record<Language, TranslationDictionary> = { en, es };

type LanguageContextValue = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "en" || stored === "es") return stored;
    } catch {
    }
    return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    function setLanguage(lang: Language) {
        setLanguageState(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
        }
    }

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    function t(key: TranslationKey): string {
        return dictionaries[language][key] ?? dictionaries.en[key] ?? key;
    }

    const value: LanguageContextValue = { language, setLanguage, t };

    return React.createElement(LanguageContext.Provider, { value }, children);
}

export function useTranslation(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useTranslation must be used within a LanguageProvider");
    }
    return ctx;
}
