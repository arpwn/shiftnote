import { useEffect, useSyncExternalStore } from "react";
import { translate } from "./translations";
import type { Language } from "./translations";
let current: Language | undefined;
function readLanguage(): Language {
  if (typeof window === "undefined") return "es";
  if (current) return current;
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "es" || requested === "en") return (current = requested);
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "es" || saved === "en") return (current = saved);
  } catch {
    /* The language still works for this session. */
  }
  return (current = "es");
}
function subscribe(callback: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === "lang") {
      current = event.newValue === "en" ? "en" : "es";
      callback();
    }
  };
  window.addEventListener("app-language-change", callback);
  window.addEventListener("storage", storage);
  return () => {
    window.removeEventListener("app-language-change", callback);
    window.removeEventListener("storage", storage);
  };
}
export function setLanguage(lang: Language) {
  current = lang;
  try {
    localStorage.setItem("lang", lang);
  } catch {
    /* Session preference remains available. */
  }
  const url = new URL(window.location.href);
  if (url.searchParams.has("lang")) {
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
  }
  window.dispatchEvent(new Event("app-language-change"));
}
export function useLanguage() {
  const lang = useSyncExternalStore(
    subscribe,
    readLanguage,
    () => "es" as Language,
  );
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "es"
        ? "ShiftNote — Continuidad entre turnos"
        : "ShiftNote — Shift handoffs";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        lang === "es"
          ? "Organiza incidencias, asigna responsables y entrega los pendientes al siguiente turno con ShiftNote."
          : "Track incidents, assign owners, and hand pending items to the next shift with ShiftNote.",
      );
  }, [lang]);
  return {
    lang,
    locale: lang === "es" ? "es-MX" : "en-US",
    setLanguage,
    t: (
      value: string | number | null | undefined,
      parameters: (string | number)[] = [],
    ) => translate(value, lang, parameters),
  };
}
