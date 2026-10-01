"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, Shield, Plus, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenPrivacyModal: () => void;
  onOpenLoggerToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrivacyModal,
  onOpenLoggerToday,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system or stored theme
    const stored = localStorage.getItem("aurea_theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (stored === "dark" || (!stored && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("aurea_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aurea_theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#FBFBFA]/80 backdrop-blur-md transition-colors dark:border-stone-800/80 dark:bg-[#09090B]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900">
            {/* Minimalist discreet monogram glyph */}
            <span className="font-serif text-sm font-light tracking-widest">
              A
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-wider text-stone-900 uppercase dark:text-stone-50">
                Aurea
              </span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-stone-500 uppercase dark:bg-stone-800 dark:text-stone-400">
                Clinical
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Discreet Cycle Intelligence
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy & Data modal trigger */}
          <button
            onClick={onOpenPrivacyModal}
            className="flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <Shield className="h-3.5 w-3.5 text-sage-600 dark:text-sage-400" />
            <span className="hidden sm:inline">Privacy & Data</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-xl border border-stone-200/80 bg-white/70 p-2 text-stone-600 shadow-sm transition hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800/60 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-stone-600" />
            )}
          </button>

          {/* Quick Log Today CTA */}
          <button
            onClick={onOpenLoggerToday}
            className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.98] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Today</span>
          </button>
        </div>
      </div>
    </header>
  );
};

