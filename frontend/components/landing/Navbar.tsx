"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language-context";
import { useTheme } from "../../lib/theme-context";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-4 md:px-6 py-3 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
    >
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between landing-glass px-5 py-3 rounded-xl border border-primary-gold/10 transition-all duration-300 ${scrolled ? "bg-midnight/95 shadow-2xl shadow-black/50" : "bg-midnight/80"}`}
      >
        {/* Logo */}
        <button
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-2xl font-bold tracking-tighter text-primary-gold group-hover:opacity-80 transition-opacity">
            {t("brandName")} 🕊️
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-primary-gold transition-colors"
          >
            {t("features")}
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-primary-gold transition-colors"
          >
            {t("trainingRacing")}
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-primary-gold transition-colors"
          >
            {t("breedingMating")}
          </button>
          <button
            onClick={() => scrollTo("cta")}
            className="hover:text-primary-gold transition-colors"
          >
            {t("pricing")}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="hidden md:flex text-slate-300 hover:text-primary-gold transition-colors p-2 rounded-full hover:bg-white/5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <span className="material-symbols-outlined text-xl">
                light_mode
              </span>
            ) : (
              <span className="material-symbols-outlined text-xl">
                dark_mode
              </span>
            )}
          </button>

          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-slate-300 hover:text-primary-gold transition-colors font-bold text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 border border-slate-700 hover:border-primary-gold/40"
          >
            {language === "en" ? "AR" : "EN"}
          </button>

          <Link
            href="/register"
            className="bg-primary-gold hover:bg-primary-gold/90 text-midnight px-5 py-2.5 rounded-lg font-bold text-sm transition-all gold-glow inline-block hidden md:inline-block"
          >
            {t("getStartedFree")}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-primary-gold p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl landing-glass rounded-xl border border-primary-gold/10 bg-midnight/95 px-5 py-4 flex flex-col gap-3 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo("features")}
            className="text-left hover:text-primary-gold transition-colors py-2 border-b border-white/5"
          >
            {t("features")}
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="text-left hover:text-primary-gold transition-colors py-2 border-b border-white/5"
          >
            {t("trainingRacing")}
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="text-left hover:text-primary-gold transition-colors py-2 border-b border-white/5"
          >
            {t("breedingMating")}
          </button>
          <button
            onClick={() => scrollTo("cta")}
            className="text-left hover:text-primary-gold transition-colors py-2 border-b border-white/5"
          >
            {t("pricing")}
          </button>
          <Link
            href="/register"
            className="mt-2 bg-primary-gold text-midnight px-5 py-2.5 rounded-lg font-bold text-center"
          >
            {t("getStartedFree")}
          </Link>
        </div>
      )}
    </nav>
  );
}
