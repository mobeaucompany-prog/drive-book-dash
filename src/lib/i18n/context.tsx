import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { chooseLocale, type Locale } from "./locale";
import { detectLocale } from "./detect";
import de from "./de.json";

const translations: Record<string,string> = de;
export function translate(text: string, locale: Locale) {
  if (locale === "fr") return text;
  const key = text.replace(/\s+/g, " ").trim();
  const value = translations[key];
  if (!value) return text;
  return `${/^\s/.test(text) ? " " : ""}${value}${/\s$/.test(text) ? " " : ""}`;
}
const LanguageContext = createContext({ locale: "fr" as Locale, setLocale: (_: Locale) => {}, t: (text: string) => text });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("fr");
  const manuallyChosen = useRef(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  useEffect(() => {
    let active = true;
    let saved: string | null = null;
    try { saved = localStorage.getItem("bruch-language"); } catch { /* Browser privacy mode. */ }
    if (saved === "fr" || saved === "de") { manuallyChosen.current = true; updateLocale(saved); }
    else {
      updateLocale(chooseLocale(null, navigator.languages.join(",")));
      void detectLocale().then(result => {
        if (active && !manuallyChosen.current && result.countryKnown) updateLocale(result.locale);
      }).catch(() => { /* Keep browser language when country detection is unavailable. */ });
    }
    return () => { active = false; };
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    const titles: Record<string, [string,string]> = {
      "/": ["Pneus du Bruch — Pneus & mécanique à Forbach", "Pneus du Bruch — Reifen & Werkstatt in Forbach"],
      "/devis": ["Demande de devis — Pneus du Bruch", "Angebot anfordern — Pneus du Bruch"],
      "/compte": ["Mon compte — Pneus du Bruch", "Mein Konto — Pneus du Bruch"],
      "/admin/stock": ["Gestion du stock — Pneus du Bruch", "Reifenbestand — Pneus du Bruch"],
    };
    if (titles[pathname]) document.title = titles[pathname][locale === "de" ? 1 : 0];
  }, [locale, pathname]);
  const setLocale = (next: Locale) => {
    manuallyChosen.current = true; updateLocale(next);
    try { localStorage.setItem("bruch-language", next); } catch { /* Still works for this visit. */ }
  };
  return <LanguageContext.Provider value={{ locale, setLocale, t: text => translate(text,locale) }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  return <div className="language-switch" role="group" aria-label="Langue / Sprache">
    <button type="button" lang="fr" aria-label="Français" aria-pressed={locale === "fr"} onClick={() => setLocale("fr")}>FR</button>
    <button type="button" lang="de" aria-label="Deutsch" aria-pressed={locale === "de"} onClick={() => setLocale("de")}>DE</button>
  </div>;
}
