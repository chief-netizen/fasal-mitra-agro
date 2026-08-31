import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "hi";

const STORAGE_KEY = "agriconnect-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "hi";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "hi" ? saved : "hi";
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "en" ? "en" : "hi";
  }, [language]);

  const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);
  const toggleLanguage = () => setLanguageState((current) => (current === "en" ? "hi" : "en"));

  return createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, toggleLanguage } },
    children,
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
