"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language-context";

export default function AppStoreSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 border-y border-primary-gold/8 bg-charcoal/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
            {t("availableOnDevices")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Web App */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 bg-background-dark border border-slate-700 hover:border-primary-gold/50 px-6 py-3 rounded-xl transition-all group"
            >
              <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-primary-gold transition-colors">
                public
              </span>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  Open in
                </p>
                <p className="text-lg font-bold leading-none text-slate-100">
                  Web App
                </p>
              </div>
            </Link>

            {/* PWA Install */}
            <button
              className="flex items-center gap-3 bg-background-dark border border-slate-700 hover:border-primary-gold/50 px-6 py-3 rounded-xl transition-all group"
              onClick={() => {
                // PWA prompt if available
                const deferredPrompt = (window as any).__pwaInstallPrompt;
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                } else {
                  alert(
                    "To install: open the site in Chrome, then tap the menu → 'Add to Home Screen'",
                  );
                }
              }}
            >
              <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-primary-gold transition-colors">
                install_mobile
              </span>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  Install as
                </p>
                <p className="text-lg font-bold leading-none text-slate-100">
                  Mobile App
                </p>
              </div>
            </button>

            {/* Desktop */}
            <button className="flex items-center gap-3 bg-background-dark border border-slate-700 hover:border-primary-gold/50 px-6 py-3 rounded-xl transition-all group">
              <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:text-primary-gold transition-colors">
                desktop_windows
              </span>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-500">
                  Works on
                </p>
                <p className="text-lg font-bold leading-none text-slate-100">
                  Desktop
                </p>
              </div>
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            No download required. Works instantly in your browser.
          </p>
        </div>
      </div>
    </section>
  );
}
