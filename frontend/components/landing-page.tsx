"use client";

import React from "react";
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import AppStoreSection from "./landing/AppStoreSection";
import FeaturesGrid from "./landing/FeaturesGrid";
import StatsSection from "./landing/StatsSection";
import CtaSection from "./landing/CtaSection";
import Footer from "./landing/Footer";

export default function LandingPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display selection:bg-primary-gold selection:text-background-dark min-h-screen">
            <Navbar />
            <Hero />
            <AppStoreSection />
            <FeaturesGrid />
            <StatsSection />
            <CtaSection />
            <Footer />
        </div>
    );
}
