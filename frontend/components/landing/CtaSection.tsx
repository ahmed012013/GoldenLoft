"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/language-context";

export default function CtaSection() {
    const { t } = useLanguage();

    return (
        <section id="cta" className="py-24 px-6">
            <div className="max-w-5xl mx-auto landing-glass p-12 md:p-20 rounded-[2rem] text-center relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 bg-primary-gold/5 -z-10 pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-gold/10 blur-[80px] rounded-full -z-10 pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-gold/8 blur-[80px] rounded-full -z-10 pointer-events-none" />

                {/* Decorative ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-gold/5 rounded-full -z-10 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary-gold/8 rounded-full -z-10 pointer-events-none" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-gold/15 border border-primary-gold/30 text-primary-gold text-xs font-bold uppercase tracking-widest mb-6">
                    🕊️ Free to Start
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-100">
                    {t("readyToElevate")}
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {t("joinThousands")}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/register"
                        className="bg-primary-gold hover:bg-primary-gold/90 text-midnight px-10 py-5 rounded-xl font-bold text-xl transition-all gold-glow inline-flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                        {t("startTrial")}
                    </Link>
                    <a
                        href="mailto:support@goldenloft.app"
                        className="bg-transparent border border-slate-600 hover:border-primary-gold/60 hover:bg-white/5 px-10 py-5 rounded-xl font-bold text-xl transition-all text-slate-200 inline-flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-2xl">mail</span>
                        {t("contactSales")}
                    </a>
                </div>

                {/* Extra trust note */}
                <p className="mt-8 text-sm text-slate-500">
                    No credit card required. Cancel anytime.
                </p>
            </div>
        </section>
    );
}
