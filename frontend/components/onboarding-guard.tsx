"use client";

import { useOnboardingStatus } from "@/hooks/useOnboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Bird } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageLoading } from "@/components/ui/page-loading";

interface OnboardingGuardProps {
  children: React.ReactNode;
  /**
   * 'loft' means only loft is required.
   * 'bird' means loft AND bird are required.
   * Default is 'bird'.
   */
  requiredLevel?: "loft" | "bird";
  onNavigate?: (page: string) => void;
}

export function OnboardingGuard({
  children,
  requiredLevel = "bird",
  onNavigate,
}: OnboardingGuardProps) {
  const status = useOnboardingStatus();
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to trigger navigation compatible with creative.tsx
  const triggerDashboardNav = (tab: "lofts" | "pigeons") => {
    if (onNavigate) {
      onNavigate(tab);
      return;
    }

    // Fallback: Dispatch popstate to notify creative.tsx
    // We construct the URL that creative.tsx expects
    const url =
      tab === "lofts" ? "?tab=lofts&view=all" : "?tab=pigeons&view=all";

    // Push state
    window.history.pushState({}, "", url);
    // Dispatch event
    // creative.tsx listens to 'popstate'
    window.dispatchEvent(new Event("popstate"));
  };

  // If loading...
  if (!mounted || status === "loading") {
    return <PageLoading />;
  }

  // --- Check Logic ---

  if (requiredLevel === "loft") {
    if (status === "needs_loft") {
      return (
        <RequiredState
          title={t("loftRequired" as any) || "إضافة لوفت مطلوب"}
          message={
            t("addLoftFirstMessage" as any) ||
            "يجب عليك إضافة لوفت أولاً قبل أن تتمكن من استخدام باقي خصائص التطبيق."
          }
          buttonLabel={t("goToLoft" as any) || "الذهاب لإضافة لوفت"}
          action={() => triggerDashboardNav("lofts")}
          Icon={Home}
        />
      );
    }
    return <>{children}</>;
  }

  // For 'bird' level (needs Loft AND Bird)
  if (status === "needs_loft") {
    return (
      <RequiredState
        title={t("loftRequired" as any) || "إضافة لوفت مطلوب"}
        message={
          t("addLoftFirstMessage" as any) ||
          "يجب عليك إضافة لوفت أولاً قبل أن تتمكن من استخدام باقي خصائص التطبيق."
        }
        buttonLabel={t("goToLoft" as any) || "الذهاب لإضافة لوفت"}
        action={() => triggerDashboardNav("lofts")}
        Icon={Home}
      />
    );
  }

  if (status === "needs_bird") {
    return (
      <RequiredState
        title={t("birdRequired" as any) || "إضافة حمامة مطلوبة"}
        message={
          t("addBirdFirstMessage" as any) ||
          "يجب عليك إضافة حمامة واحدة على الأقل للمتابعة."
        }
        buttonLabel={t("goToPigeons" as any) || "الذهاب لإضافة حمامة"}
        action={() => triggerDashboardNav("pigeons")}
        Icon={Bird}
      />
    );
  }

  return <>{children}</>;
}

function RequiredState({ title, message, buttonLabel, action, Icon }: any) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-dashed">
        <CardContent className="flex flex-col items-center pt-8 pb-8 space-y-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{message}</p>
          <Button onClick={action} className="w-full max-w-xs gap-2">
            <Icon className="h-4 w-4" />
            {buttonLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
