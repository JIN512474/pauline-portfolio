"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "KR" | "EN";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("KR");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("site_lang");
      if (saved === "KR" || saved === "EN") setLangState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("site_lang", l);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => setLang(lang === "KR" ? "EN" : "KR");

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <Providers />");
  return ctx;
}
