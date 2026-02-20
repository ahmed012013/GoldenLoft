"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language-context";

export default function Hero() {
    const { t } = useLanguage();

    const scrollToFeatures = () => {
        const el = document.getElementById("features");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary-gold/5 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-primary-gold/8 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-primary-gold/3 blur-[180px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-gold/10 border border-primary-gold/25 text-primary-gold text-xs font-bold uppercase tracking-widest mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-gold opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-gold" />
                    </span>
                    {t("poweredByAi")}
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto tracking-tight">
                    <span className="text-primary-gold">{t("brandName")}</span>{" "}
                    —{" "}
                    <span className="text-slate-100">{t("heroTitle")}</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t("heroDescription")}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/register"
                        className="w-full sm:w-auto bg-primary-gold hover:bg-primary-gold/90 text-midnight px-8 py-4 rounded-xl font-bold text-lg transition-all gold-glow inline-flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">rocket_launch</span>
                        {t("getStartedFree")}
                    </Link>
                    <button
                        onClick={scrollToFeatures}
                        className="w-full sm:w-auto landing-glass border border-primary-gold/20 hover:bg-primary-gold/10 hover:border-primary-gold/40 px-8 py-4 rounded-xl font-bold text-lg transition-all text-slate-100 inline-flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">play_circle</span>
                        {t("viewDemo")}
                    </button>
                </div>

                {/* Dashboard Preview Card */}
                <div className="relative max-w-5xl mx-auto rounded-2xl border border-primary-gold/15 bg-gradient-to-b from-slate-900/80 to-midnight/90 p-4 shadow-2xl overflow-hidden group">
                    {/* Decorative top bar */}
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                        <div className="flex-1 mx-4 h-6 rounded-md bg-white/5 border border-white/10 flex items-center px-3">
                            <span className="text-xs text-slate-500">goldenloft.app/dashboard</span>
                        </div>
                    </div>

                    {/* Mock Dashboard Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-3">
                        {[
                            { label: t("totalPigeons"), value: "128", icon: "🕊️", color: "from-primary-gold/20 to-primary-gold/5" },
                            { label: t("healthyPigeons"), value: "115", icon: "💚", color: "from-emerald-500/20 to-emerald-500/5" },
                            { label: t("pairings"), value: "24", icon: "❤️", color: "from-rose-500/20 to-rose-500/5" },
                            { label: t("dailyTasks"), value: "8/12", icon: "✅", color: "from-blue-500/20 to-blue-500/5" },
                        ].map((card, i) => (
                            <div key={i} className={`rounded-xl bg-gradient-to-br ${card.color} border border-white/5 p-3 text-left`}>
                                <div className="text-xl mb-1">{card.icon}</div>
                                <div className="text-lg font-bold text-slate-100">{card.value}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{card.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Mock Chart */}
                    <div className="rounded-xl bg-white/3 border border-white/5 p-4 flex items-end gap-1.5 h-28">
                        {[40, 65, 45, 80, 60, 90, 70, 85, 55, 78, 92, 68].map((h, i) => (
                            <div key={i} className="flex-1 rounded-sm bg-primary-gold/30 transition-all hover:bg-primary-gold/60" style={{ height: `${h}%` }} />
                        ))}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-midnight/40 rounded-2xl">
                        <Link
                            href="/dashboard"
                            className="bg-primary-gold text-midnight font-bold px-6 py-3 rounded-full shadow-lg pointer-events-auto hover:bg-primary-gold/90 transition-colors"
                        >
                            {t("enterDashboard")} →
                        </Link>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary-gold">security</span> Secure SSL</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary-gold">cloud_done</span> Cloud Synced</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary-gold">devices</span> Works on All Devices</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary-gold">language</span> Arabic & English</span>
                </div>
            </div>
        </section>
    );
}
