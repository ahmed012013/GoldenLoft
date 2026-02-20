"use client";

import React from "react";
import { useLanguage } from "../../lib/language-context";

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          {/* Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={scrollToTop}
              className="text-2xl font-bold text-primary-gold mb-3 block hover:opacity-80 transition-opacity text-left"
            >
              {t("brandName")} 🕊️
            </button>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              {t("footerBrandDescription")}
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm text-slate-400">
            <div className="space-y-3">
              <p className="text-slate-200 font-semibold mb-2">{t("footerProduct")}</p>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block hover:text-primary-gold transition-colors text-left"
              >
                {t("features")}
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("stats")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block hover:text-primary-gold transition-colors text-left"
              >
                {t("pricing")}
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("cta")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="block hover:text-primary-gold transition-colors text-left"
              >
                {t("startTrial")}
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-slate-200 font-semibold mb-2">{t("footerLegal")}</p>
              <span
                className="block text-slate-500 cursor-default"
                aria-disabled="true"
              >
                {t("privacyPolicy")}
              </span>
              <span
                className="block text-slate-500 cursor-default"
                aria-disabled="true"
              >
                {t("termsOfService")}
              </span>
              <a
                href="mailto:support@goldenloft.app"
                className="block hover:text-primary-gold transition-colors"
              >
                {t("footerContactUs")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            © 2026 GoldenLoft. {t("allRightsReserved")}
          </p>

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="text-slate-500 hover:text-primary-gold transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_upward
            </span>
            {t("footerBackToTop")}
          </button>
        </div>
      </div>
    </footer>
  );
}
