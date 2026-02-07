import React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

// Font fallbacks for environments without internet access (e.g. Docker build)
const _geist = { variable: "--font-geist-sans" };
const _geistMono = { variable: "--font-geist-mono" };
const _cairo = { variable: "--font-cairo" };

export const metadata: Metadata = {
  title: "مدير لوفت الحمام | Pigeon Loft Manager",
  description:
    "نظام إدارة لوفت الحمام الاحترافي - Professional Pigeon Loft Management System",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className="dark" suppressHydrationWarning>
      <body
        className={`${_geist.variable} ${_geistMono.variable} ${_cairo.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <QueryProvider>{children}</QueryProvider>
            <Toaster dir="rtl" />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
