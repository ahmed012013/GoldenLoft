"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../lib/language-context";

interface Stat {
  end: number;
  suffix: string;
  labelKey: "activeLofts" | "birdsLogged" | "uptimeAccuracy" | "supportExpert";
  icon: string;
}

const stats: Stat[] = [
  { end: 1200, suffix: "+", labelKey: "activeLofts", icon: "home" },
  { end: 85000, suffix: "+", labelKey: "birdsLogged", icon: "pets" },
  { end: 99, suffix: ".9%", labelKey: "uptimeAccuracy", icon: "verified" },
  { end: 24, suffix: "/7", labelKey: "supportExpert", icon: "support_agent" },
];

function useCountUp(end: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);
  return count;
}

function StatCard({ stat, started }: { stat: Stat; started: boolean }) {
  const { t } = useLanguage();
  const count = useCountUp(stat.end, started);
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-14 h-14 mb-4 rounded-2xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center group-hover:bg-primary-gold/20 transition-colors">
        <span className="material-icons text-primary-gold text-2xl">
          {stat.icon}
        </span>
      </div>
      <p className="text-4xl md:text-5xl font-bold text-primary-gold mb-2 tabular-nums">
        {count.toLocaleString("en-US")}
        {stat.suffix}
      </p>
      <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">
        {t(stat.labelKey)}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-primary-gold/3 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3">
            {t("statsTrustedByComm")}
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {t("statsRealNumbers")}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
