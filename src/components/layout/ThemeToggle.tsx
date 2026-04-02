"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "symptora-theme";
const THEME_EVENT = "symptora-theme-change";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function readTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "light";
}

function subscribe(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_EVENT, handleChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "light");

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#171717] shadow-[6px_6px_0_#171717] transition hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-[#f8f4ea] dark:bg-[#171717] dark:text-[#f8f4ea] dark:shadow-[6px_6px_0_#000000]"
    >
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
