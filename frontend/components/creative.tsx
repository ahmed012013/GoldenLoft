"use client";

import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bird,
  Search,
  Settings,
  X,
  Moon,
  Sun,
  Languages,
  ClipboardList,
  Heart,
  Home,
  Menu,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
// Lazy load page components for better performance
const LoftPages = lazy(() =>
  import("@/components/loft-pages").then((m) => ({ default: m.LoftPages })),
);
const PigeonPages = lazy(() =>
  import("@/components/pigeon-pages").then((m) => ({ default: m.PigeonPages })),
);
const TasksPages = lazy(() =>
  import("@/components/tasks-pages").then((m) => ({ default: m.TasksPages })),
);
const InventoryPages = lazy(() =>
  import("@/components/inventory-pages").then((m) => ({
    default: m.InventoryPages,
  })),
);
const NutritionPages = lazy(() =>
  import("@/components/nutrition-pages").then((m) => ({
    default: m.NutritionPages,
  })),
);
const BreedingPages = lazy(() =>
  import("@/components/breeding-pages").then((m) => ({
    default: m.BreedingPages,
  })),
);
const TrainingPages = lazy(() =>
  import("@/components/training-pages").then((m) => ({
    default: m.TrainingPages,
  })),
);
const RacingPages = lazy(() =>
  import("@/components/racing-pages").then((m) => ({ default: m.RacingPages })),
);
const FinancialPages = lazy(() =>
  import("@/components/financial-pages").then((m) => ({
    default: m.FinancialPages,
  })),
);
const ReportsPages = lazy(() =>
  import("@/components/reports-pages").then((m) => ({
    default: m.ReportsPages,
  })),
);
const DashboardHome = lazy(() =>
  import("@/components/dashboard-home").then((m) => ({
    default: m.DashboardHome,
  })),
);

// Loading spinner for lazy components
import { PageLoading } from "@/components/ui/page-loading";

function PageLoader() {
  return <PageLoading />;
}
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { useRouter } from "next/navigation";

// Sample data for sidebar navigation
// Sidebar items will be generated dynamically with translations

import apiClient from "@/lib/api-client";

import { useAppNavigation } from "@/hooks/use-app-navigation";
import { getSidebarItems } from "@/config/sidebar-items";

export function DesignaliCreative() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await apiClient.get("/auth/profile");
        setUserName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const navigation = useAppNavigation();
  const {
    activeTab,
    setActiveTab,
    currentLoftPage,
    setCurrentLoftPage,
    currentPigeonPage,
    setCurrentPigeonPage,
    currentTasksPage,
    setCurrentTasksPage,
    currentInventoryPage,
    setCurrentInventoryPage,
    currentNutritionPage,
    setCurrentNutritionPage,
    currentBreedingPage,
    setCurrentBreedingPage,
    currentTrainingPage,
    setCurrentTrainingPage,
    currentRacingPage,
    setCurrentRacingPage,
    currentFinancialPage,
    setCurrentFinancialPage,
    currentReportsPage,
    setCurrentReportsPage,
    handleBack,
    resetAllPages,
  } = navigation;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const sidebarItems = getSidebarItems(t, navigation, navigation);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div
      dir={dir}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Animated gradient background */}
      {/* Static gradient background - no animation for performance */}
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-[280px] max-w-[85vw] transform bg-background transition-transform duration-300 ease-in-out md:hidden shadow-xl",
          dir === "rtl" ? "right-0" : "left-0",
          mobileMenuOpen
            ? "translate-x-0"
            : dir === "rtl"
              ? "translate-x-full"
              : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col",
            dir === "rtl" ? "border-l" : "border-r",
          )}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                <Bird className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">{t("title")}</h2>
                <p className="text-xs text-muted-foreground">
                  {userName || t("creativeSuite")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search
                className={cn(
                  "absolute top-3 h-4 w-4 text-muted-foreground",
                  dir === "rtl" ? "right-3" : "left-3",
                )}
              />
              <Input
                type="search"
                placeholder={t("search")}
                className={cn(
                  "w-full rounded-2xl bg-muted py-2",
                  dir === "rtl" ? "pr-9 pl-4" : "pl-9 pr-4",
                )}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <SidebarNavigation
              items={sidebarItems}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              onMobileItemClick={() => setMobileMenuOpen(false)}
              userName={userName}
            />
          </ScrollArea>

          <div className="border-t p-3 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {t("settingsTitle" as any)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-xl justify-start bg-transparent text-sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              <Languages className="h-4 w-4" />
              <span>
                {t("language")}:{" "}
                {language === "ar" ? "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" : "English"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-xl justify-start bg-transparent text-sm"
              onClick={() => toggleTheme()}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span>
                {theme === "light"
                  ? t("darkTheme" as any)
                  : t("lightTheme" as any)}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 rounded-xl justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 z-30 hidden w-64 transform bg-background transition-transform duration-300 ease-in-out md:block",
          dir === "rtl" ? "right-0 border-l" : "left-0 border-r",
          sidebarOpen
            ? "translate-x-0"
            : dir === "rtl"
              ? "translate-x-full"
              : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                <Bird className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">{t("title")}</h2>
                <p className="text-xs text-muted-foreground">
                  {userName || t("creativeSuite")}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <SidebarNavigation
              items={sidebarItems}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              userName={userName}
            />
          </ScrollArea>

          <div className="border-t p-3 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {t("settingsTitle" as any)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-xl justify-start bg-transparent text-sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            >
              <Languages className="h-4 w-4" />
              <span className="truncate">
                {t("language")}:{" "}
                {language === "ar" ? "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" : "English"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-xl justify-start bg-transparent text-sm"
              onClick={() => toggleTheme()}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="truncate">
                {theme === "light"
                  ? t("darkTheme" as any)
                  : t("lightTheme" as any)}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2 rounded-xl justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="truncate">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen
            ? dir === "rtl"
              ? "mr-0 md:mr-64"
              : "ml-0 md:ml-64"
            : "",
        )}
      >
        <main className="flex-1 p-4 md:p-6">
          {/* Page Content - Lazy loaded */}
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  currentLoftPage
                    ? `loft-${currentLoftPage}`
                    : currentPigeonPage
                      ? `pigeon-${currentPigeonPage}`
                      : currentTasksPage
                        ? `tasks-${currentTasksPage}`
                        : currentInventoryPage
                          ? `inventory-${currentInventoryPage}`
                          : currentNutritionPage
                            ? `nutrition-${currentNutritionPage}`
                            : currentBreedingPage
                              ? `breeding-${currentBreedingPage}`
                              : currentTrainingPage
                                ? `training-${currentTrainingPage}`
                                : currentRacingPage
                                  ? `racing-${currentRacingPage}`
                                  : currentFinancialPage
                                    ? `financial-${currentFinancialPage}`
                                    : currentReportsPage
                                      ? `reports-${currentReportsPage}`
                                      : `tab-${activeTab}`
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {currentLoftPage !== null ? (
                  <LoftPages
                    currentPage={currentLoftPage}
                    onBack={handleBack}
                  />
                ) : currentPigeonPage !== null ? (
                  <PigeonPages
                    currentPage={currentPigeonPage}
                    pigeonEditingId={navigation.pigeonEditingId}
                    setPigeonEditingId={navigation.setPigeonEditingId}
                    onBack={handleBack}
                    onNavigate={(page) => {
                      setCurrentPigeonPage(page);
                      window.history.pushState(
                        {},
                        "",
                        `?tab=pigeons&view=${page}`,
                      );
                    }}
                  />
                ) : currentTasksPage !== null ? (
                  <TasksPages
                    currentPage={currentTasksPage}
                    onBack={handleBack}
                  />
                ) : currentInventoryPage !== null ? (
                  <InventoryPages
                    currentPage={currentInventoryPage}
                    onBack={handleBack}
                  />
                ) : currentNutritionPage !== null ? (
                  <NutritionPages
                    currentPage={currentNutritionPage}
                    onBack={handleBack}
                  />
                ) : currentBreedingPage !== null ? (
                  <BreedingPages
                    currentPage={currentBreedingPage}
                    onBack={handleBack}
                  />
                ) : currentTrainingPage !== null ? (
                  <TrainingPages
                    currentPage={currentTrainingPage}
                    onBack={handleBack}
                  />
                ) : currentRacingPage !== null ? (
                  <RacingPages
                    currentPage={currentRacingPage}
                    onBack={handleBack}
                  />
                ) : currentFinancialPage !== null ? (
                  <FinancialPages
                    currentPage={currentFinancialPage}
                    onBack={handleBack}
                  />
                ) : currentReportsPage !== null ? (
                  <ReportsPages
                    currentPage={currentReportsPage}
                    onBack={handleBack}
                  />
                ) : (
                  <Tabs
                    defaultValue="home"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsContent value="home" className="mt-0">
                      <DashboardHome userName={userName} />
                    </TabsContent>
                  </Tabs>
                )}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden safe-area-bottom">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <button
            onClick={() => {
              resetAllPages();
              setActiveTab("home");
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition-colors",
              activeTab === "home" &&
                currentLoftPage === null &&
                currentPigeonPage === null
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="h-5 w-5" />
            <span className="truncate">{t("home")}</span>
          </button>

          <button
            onClick={() => {
              resetAllPages();
              setCurrentPigeonPage("all");
              setActiveTab("pigeons");
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition-colors",
              currentPigeonPage !== null
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Bird className="h-5 w-5" />
            <span className="truncate">{t("pigeons")}</span>
          </button>

          <button
            onClick={() => {
              resetAllPages();
              setCurrentTasksPage("today");
              setActiveTab("tasks");
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition-colors",
              currentTasksPage !== null
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="truncate">{t("dailyTasks")}</span>
          </button>

          <button
            onClick={() => {
              resetAllPages();
              setCurrentBreedingPage("pairings");
              setActiveTab("breeding");
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition-colors",
              currentBreedingPage !== null
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Heart className="h-5 w-5" />
            <span className="truncate">{t("breeding")}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="truncate">{t("more" as any)}</span>
          </button>
        </div>
      </div>

      {/* Spacer for bottom navigation on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
