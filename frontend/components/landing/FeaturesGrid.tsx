"use client";

import React from "react";
import { useLanguage } from "../../lib/language-context";

const features = [
  {
    icon: "pets",
    titleKey: "birdTracking" as const,
    descKey: "birdTrackingDesc" as const,
    bullets: ["genealogyMapping", "qrCodeTagging"] as const,
    badge: null,
  },
  {
    icon: "favorite",
    titleKey: "breedingMating" as const,
    descKey: "breedingManagementDesc" as const,
    bullets: ["pairingIntelligence", "incubationTracking"] as const,
    badge: "mostLoved" as const,
  },
  {
    icon: "trending_up",
    titleKey: "raceAnalytics" as const,
    descKey: "raceAnalyticsDesc" as const,
    bullets: ["velocityCharts", "competitiveRanking"] as const,
    badge: null,
  },
  {
    icon: "medical_services",
    titleKey: "healthRecords" as const,
    descKey: "birdTrackingDesc" as const,
    bullets: ["categoryHealth", "nextVaccination"] as const,
    badge: null,
  },
  {
    icon: "inventory_2",
    titleKey: "inventoryManagement" as const,
    descKey: "masterOperationsDesc" as const,
    bullets: ["stockAlerts", "recentPurchases"] as const,
    badge: null,
  },
  {
    icon: "task_alt",
    titleKey: "dailyTasksManagement" as const,
    descKey: "masterOperationsDesc" as const,
    bullets: ["taskSchedule", "completedTasks"] as const,
    badge: null,
  },
];

export default function FeaturesGrid() {
  const { t, language } = useLanguage();

  return (
    <section id="features" className="py-24 px-6 relative">
      {/* Section glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary-gold/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-gold/10 border border-primary-gold/20 text-primary-gold text-xs font-bold uppercase tracking-widest mb-4">
            {t("features")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-100">
            {t("masterOperations")}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            {t("masterOperationsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`landing-glass p-8 rounded-2xl transition-all duration-300 group hover:border-primary-gold/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] relative ${
                f.badge
                  ? "border-primary-gold/30 shadow-[0_0_25px_rgba(212,175,55,0.05)]"
                  : ""
              }`}
            >
              {f.badge && (
                <div
                  className={`absolute ${language === "ar" ? "-top-3 -left-3" : "-top-3 -right-3"} bg-primary-gold text-midnight text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10`}
                >
                  {t(f.badge)}
                </div>
              )}

              <div className="w-14 h-14 bg-primary-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-gold transition-colors duration-300">
                <span className="material-icons text-primary-gold group-hover:text-midnight text-3xl transition-colors duration-300">
                  {f.icon}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3 text-slate-100">
                {t(f.titleKey)}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {t(f.descKey)}
              </p>

              <div className="mt-6 pt-5 border-t border-white/5">
                <ul className="space-y-2.5">
                  {f.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <span className="material-icons text-primary-gold text-base flex-shrink-0">
                        check_circle
                      </span>
                      {t(b)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
