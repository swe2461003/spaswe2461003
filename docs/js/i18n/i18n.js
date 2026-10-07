import { translations } from "./translations.js";
const DEFAULT_LANGUAGE = "mn";
const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };

export const getCurrentLanguage = () =>
  safe(() => localStorage.getItem("language"), null) || DEFAULT_LANGUAGE;

export function setLanguage(lang) {
  safe(() => localStorage.setItem("language", lang));
  document.documentElement.lang = lang;
}

export function t(path) {
  let value = translations[getCurrentLanguage()];
  for (const key of path.split(".")) value = value?.[key];
  return value ?? path;
}

export function toggleLanguage() {
  const next = getCurrentLanguage() === "mn" ? "en" : "mn";
  setLanguage(next);
  return next;
}
