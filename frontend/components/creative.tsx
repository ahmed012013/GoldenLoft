"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Bell,
  ChevronDown,
  Cloud,
  Download,
  Grid,
  Heart,
  Home,
  Lightbulb,
  Menu,
  MessageSquare,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Share2,
  Trash,
  TrendingUp,
  Users,
  Wand2,
  Clock,
  Eye,
  Archive,
  ArrowUpDown,
  MoreHorizontal,
  X,
  Moon,
  Sun,
  Languages,
  Bird,
  ClipboardList,
  Package,
  Utensils,
  Baby,
  Trophy,
  DollarSign,
  BarChart3,
  LogOut,
  Warehouse,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { LoftPages } from "@/components/loft-pages";
import { PigeonPages } from "@/components/pigeon-pages";
import { TasksPages } from "@/components/tasks-pages";
import { InventoryPages } from "@/components/inventory-pages";
import { NutritionPages } from "@/components/nutrition-pages";
import { BreedingPages } from "@/components/breeding-pages";
import { TrainingPages } from "@/components/training-pages";
import { RacingPages } from "@/components/racing-pages";
import { FinancialPages } from "@/components/financial-pages";
import { ReportsPages } from "@/components/reports-pages";
import { DashboardHome } from "@/components/dashboard-home";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { useRouter } from "next/navigation";

// Sample data for sidebar navigation
// Sidebar items will be generated dynamically with translations

export function DesignaliCreative() {
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState(5);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [currentLoftPage, setCurrentLoftPage] = useState<
    "all" | "add" | "settings" | null
  >(null);
  const [currentPigeonPage, setCurrentPigeonPage] = useState<
    "all" | "add" | "pedigree" | "health" | null
  >(null);
  const [currentTasksPage, setCurrentTasksPage] = useState<
    "today" | "schedule" | "completed" | null
  >(null);
  const [currentInventoryPage, setCurrentInventoryPage] = useState<
    "feed" | "medications" | "equipment" | null
  >(null);
  const [currentNutritionPage, setCurrentNutritionPage] = useState<
    "feeding" | "supplements" | "water" | null
  >(null);
  const [currentBreedingPage, setCurrentBreedingPage] = useState<
    "pairings" | "eggs" | "squabs" | null
  >(null);
  const [currentTrainingPage, setCurrentTrainingPage] = useState<
    "routes" | "sessions" | "condition" | null
  >(null);
  const [currentRacingPage, setCurrentRacingPage] = useState<
    "results" | "stats" | "calendar" | null
  >(null);
  const [currentFinancialPage, setCurrentFinancialPage] = useState<
    "income" | "expenses" | "reports" | null
  >(null);
  const [currentReportsPage, setCurrentReportsPage] = useState<
    "pigeons" | "financial" | "breeding" | null
  >(null);

  // Helper function to reset all pages
  const resetAllPages = () => {
    setCurrentLoftPage(null);
    setCurrentPigeonPage(null);
    setCurrentTasksPage(null);
    setCurrentInventoryPage(null);
    setCurrentNutritionPage(null);
    setCurrentBreedingPage(null);
    setCurrentTrainingPage(null);
    setCurrentRacingPage(null);
    setCurrentFinancialPage(null);
    setCurrentReportsPage(null);
  };

  // Helper function for going back
  const handleBack = () => {
    resetAllPages();
    setActiveTab("home");
    window.history.pushState({}, "", "/dashboard");
  };

  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem("access_token");
    // Clear navigation state to reset to home on next login
    localStorage.removeItem("goldenloft_activeTab");
    localStorage.removeItem("goldenloft_currentLoftPage");
    localStorage.removeItem("goldenloft_currentPigeonPage");
    localStorage.removeItem("goldenloft_currentTasksPage");
    localStorage.removeItem("goldenloft_currentInventoryPage");
    localStorage.removeItem("goldenloft_currentNutritionPage");
    localStorage.removeItem("goldenloft_currentBreedingPage");
    localStorage.removeItem("goldenloft_currentTrainingPage");
    localStorage.removeItem("goldenloft_currentRacingPage");
    localStorage.removeItem("goldenloft_currentFinancialPage");
    localStorage.removeItem("goldenloft_currentReportsPage");
    router.push("/login");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sync URL with State on PopState (Back Button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const view = params.get("view");

      resetAllPages();
      if (tab) setActiveTab(tab);
      else setActiveTab("home");

      if (tab === "lofts" && view) setCurrentLoftPage(view as any);
      if (tab === "pigeons" && view) setCurrentPigeonPage(view as any);
      if (tab === "tasks" && view) setCurrentTasksPage(view as any);
      if (tab === "inventory" && view) setCurrentInventoryPage(view as any);
      if (tab === "nutrition" && view) setCurrentNutritionPage(view as any);
      if (tab === "breeding" && view) setCurrentBreedingPage(view as any);
      if (tab === "training" && view) setCurrentTrainingPage(view as any);
      if (tab === "racing" && view) setCurrentRacingPage(view as any);
      if (tab === "finance" && view) setCurrentFinancialPage(view as any);
      if (tab === "reports" && view) setCurrentReportsPage(view as any);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedActiveTab = localStorage.getItem("goldenloft_activeTab");
    const savedLoftPage = localStorage.getItem("goldenloft_currentLoftPage");
    const savedPigeonPage = localStorage.getItem(
      "goldenloft_currentPigeonPage",
    );
    const savedTasksPage = localStorage.getItem("goldenloft_currentTasksPage");
    const savedInventoryPage = localStorage.getItem(
      "goldenloft_currentInventoryPage",
    );
    const savedNutritionPage = localStorage.getItem(
      "goldenloft_currentNutritionPage",
    );
    const savedBreedingPage = localStorage.getItem(
      "goldenloft_currentBreedingPage",
    );
    const savedTrainingPage = localStorage.getItem(
      "goldenloft_currentTrainingPage",
    );
    const savedRacingPage = localStorage.getItem(
      "goldenloft_currentRacingPage",
    );
    const savedFinancialPage = localStorage.getItem(
      "goldenloft_currentFinancialPage",
    );
    const savedReportsPage = localStorage.getItem(
      "goldenloft_currentReportsPage",
    );

    if (savedActiveTab) setActiveTab(savedActiveTab);
    if (savedLoftPage) setCurrentLoftPage(savedLoftPage as any);
    if (savedPigeonPage) setCurrentPigeonPage(savedPigeonPage as any);
    if (savedTasksPage) setCurrentTasksPage(savedTasksPage as any);
    if (savedInventoryPage) setCurrentInventoryPage(savedInventoryPage as any);
    if (savedNutritionPage) setCurrentNutritionPage(savedNutritionPage as any);
    if (savedBreedingPage) setCurrentBreedingPage(savedBreedingPage as any);
    if (savedTrainingPage) setCurrentTrainingPage(savedTrainingPage as any);
    if (savedRacingPage) setCurrentRacingPage(savedRacingPage as any);
    if (savedFinancialPage) setCurrentFinancialPage(savedFinancialPage as any);
    if (savedReportsPage) setCurrentReportsPage(savedReportsPage as any);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("goldenloft_activeTab", activeTab);
    if (currentLoftPage)
      localStorage.setItem("goldenloft_currentLoftPage", currentLoftPage);
    else localStorage.removeItem("goldenloft_currentLoftPage");

    if (currentPigeonPage)
      localStorage.setItem("goldenloft_currentPigeonPage", currentPigeonPage);
    else localStorage.removeItem("goldenloft_currentPigeonPage");

    if (currentTasksPage)
      localStorage.setItem("goldenloft_currentTasksPage", currentTasksPage);
    else localStorage.removeItem("goldenloft_currentTasksPage");

    if (currentInventoryPage)
      localStorage.setItem(
        "goldenloft_currentInventoryPage",
        currentInventoryPage,
      );
    else localStorage.removeItem("goldenloft_currentInventoryPage");

    if (currentNutritionPage)
      localStorage.setItem(
        "goldenloft_currentNutritionPage",
        currentNutritionPage,
      );
    else localStorage.removeItem("goldenloft_currentNutritionPage");

    if (currentBreedingPage)
      localStorage.setItem(
        "goldenloft_currentBreedingPage",
        currentBreedingPage,
      );
    else localStorage.removeItem("goldenloft_currentBreedingPage");

    if (currentTrainingPage)
      localStorage.setItem(
        "goldenloft_currentTrainingPage",
        currentTrainingPage,
      );
    else localStorage.removeItem("goldenloft_currentTrainingPage");

    if (currentRacingPage)
      localStorage.setItem("goldenloft_currentRacingPage", currentRacingPage);
    else localStorage.removeItem("goldenloft_currentRacingPage");

    if (currentFinancialPage)
      localStorage.setItem(
        "goldenloft_currentFinancialPage",
        currentFinancialPage,
      );
    else localStorage.removeItem("goldenloft_currentFinancialPage");

    if (currentReportsPage)
      localStorage.setItem("goldenloft_currentReportsPage", currentReportsPage);
    else localStorage.removeItem("goldenloft_currentReportsPage");
  }, [
    activeTab,
    currentLoftPage,
    currentPigeonPage,
    currentTasksPage,
    currentInventoryPage,
    currentNutritionPage,
    currentBreedingPage,
    currentTrainingPage,
    currentRacingPage,
    currentFinancialPage,
    currentReportsPage,
  ]);

  // Sidebar navigation items for Pigeon Manager
  const sidebarItems = [
    {
      title: t("home"),
      icon: <Home className="h-5 w-5" />,
      isActive: activeTab === "home",
      key: "home",
      onClick: () => {
        resetAllPages();
        setActiveTab("home");
        window.history.pushState({}, "", "/dashboard");
      },
    },
    {
      title: t("loftManagement"),
      icon: <Warehouse className="h-5 w-5" />,
      isActive: currentLoftPage !== null,
      key: "lofts",
      items: [
        {
          title: t("allLofts"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentLoftPage("all");
            setActiveTab("lofts");
            window.history.pushState({}, "", "?tab=lofts&view=all");
          },
        },
        {
          title: t("loftSettings"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentLoftPage("settings");
            setActiveTab("lofts");
            window.history.pushState({}, "", "?tab=lofts&view=settings");
          },
        },
      ],
    },
    {
      title: t("pigeons"),
      icon: <Bird className="h-5 w-5" />,
      isActive: currentPigeonPage !== null,
      key: "pigeons",
      badge: "48",
      items: [
        {
          title: t("allPigeons"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentPigeonPage("all");
            setActiveTab("pigeons");
            window.history.pushState({}, "", "?tab=pigeons&view=all");
          },
        },
        {
          title: t("addPigeon"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentPigeonPage("add");
            setActiveTab("pigeons");
            window.history.pushState({}, "", "?tab=pigeons&view=add");
          },
        },
        {
          title: t("pedigree"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentPigeonPage("pedigree");
            setActiveTab("pigeons");
            window.history.pushState({}, "", "?tab=pigeons&view=pedigree");
          },
        },
        {
          title: t("healthRecords"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentPigeonPage("health");
            setActiveTab("pigeons");
            window.history.pushState({}, "", "?tab=pigeons&view=health");
          },
        },
      ],
    },
    {
      title: t("dailyTasks"),
      icon: <ClipboardList className="h-5 w-5" />,
      isActive: currentTasksPage !== null,
      key: "tasks",
      badge: "5",
      items: [
        {
          title: t("todayTasks"),
          url: "#",
          badge: "5",
          onClick: () => {
            resetAllPages();
            setCurrentTasksPage("today");
            setActiveTab("tasks");
          },
        },
        {
          title: t("taskSchedule"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentTasksPage("schedule");
            setActiveTab("tasks");
          },
        },
        {
          title: t("completedTasks"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentTasksPage("completed");
            setActiveTab("tasks");
          },
        },
      ],
    },
    {
      title: t("inventory"),
      icon: <Package className="h-5 w-5" />,
      isActive: currentInventoryPage !== null,
      key: "inventory",
      items: [
        {
          title: t("feed"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentInventoryPage("feed");
            setActiveTab("inventory");
          },
        },
        {
          title: t("medications"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentInventoryPage("medications");
            setActiveTab("inventory");
          },
        },
        {
          title: t("equipment"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentInventoryPage("equipment");
            setActiveTab("inventory");
          },
        },
      ],
    },
    {
      title: t("nutrition"),
      icon: <Utensils className="h-5 w-5" />,
      isActive: currentNutritionPage !== null,
      key: "nutrition",
      items: [
        {
          title: t("feedingPlans"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentNutritionPage("feeding");
            setActiveTab("nutrition");
          },
        },
        {
          title: t("supplements"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentNutritionPage("supplements");
            setActiveTab("nutrition");
          },
        },
        {
          title: t("waterManagement"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentNutritionPage("water");
            setActiveTab("nutrition");
          },
        },
      ],
    },
    {
      title: t("breeding"),
      icon: <Heart className="h-5 w-5" />,
      isActive: currentBreedingPage !== null,
      key: "breeding",
      badge: "3",
      items: [
        {
          title: t("pairings"),
          url: "#",
          badge: "3",
          onClick: () => {
            resetAllPages();
            setCurrentBreedingPage("pairings");
            setActiveTab("breeding");
          },
        },
        {
          title: t("eggs"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentBreedingPage("eggs");
            setActiveTab("breeding");
          },
        },
        {
          title: t("youngPigeons"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentBreedingPage("squabs");
            setActiveTab("breeding");
          },
        },
      ],
    },
    {
      title: t("trainingRacing"),
      icon: <Trophy className="h-5 w-5" />,
      isActive: currentTrainingPage !== null || currentRacingPage !== null,
      key: "training-racing",
      badge: "3",
      items: [
        {
          title: t("trainingSchedule"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentTrainingPage("routes");
            setActiveTab("training");
          },
        },
        {
          title: t("upcomingRaces" as any),
          url: "#",
          badge: "3",
          onClick: () => {
            resetAllPages();
            setCurrentRacingPage("calendar");
            setActiveTab("racing");
          },
        },
        {
          title: t("raceResults"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentRacingPage("results");
            setActiveTab("racing");
          },
        },
        {
          title: t("performance"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentRacingPage("stats");
            setActiveTab("racing");
          },
        },
      ],
    },
    {
      title: t("finance"),
      icon: <DollarSign className="h-5 w-5" />,
      isActive: currentFinancialPage !== null,
      key: "finance",
      items: [
        {
          title: t("income"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentFinancialPage("income");
            setActiveTab("finance");
          },
        },
        {
          title: t("expenses"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentFinancialPage("expenses");
            setActiveTab("finance");
          },
        },
        {
          title: t("financialReports"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentFinancialPage("reports");
            setActiveTab("finance");
          },
        },
      ],
    },
    {
      title: t("reports"),
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: currentReportsPage !== null,
      key: "reports",
      items: [
        {
          title: t("pigeonReports"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentReportsPage("pigeons");
            setActiveTab("reports");
          },
        },
        {
          title: t("financialReports"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentReportsPage("financial");
            setActiveTab("reports");
          },
        },
        {
          title: t("breedingReports"),
          url: "#",
          onClick: () => {
            resetAllPages();
            setCurrentReportsPage("breeding");
            setActiveTab("reports");
          },
        },
      ],
    },
  ];

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
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
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
                  {t("creativeSuite")}
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
                  {t("creativeSuite")}
                </p>
              </div>
            </div>
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
          {/* Loft Pages */}
          {currentLoftPage !== null ? (
            <LoftPages currentPage={currentLoftPage} onBack={handleBack} />
          ) : currentPigeonPage !== null ? (
            <PigeonPages
              currentPage={currentPigeonPage}
              onBack={handleBack}
              onNavigate={(page) => {
                setCurrentPigeonPage(page);
                window.history.pushState({}, "", `?tab=pigeons&view=${page}`);
              }}
            />
          ) : currentTasksPage !== null ? (
            <TasksPages currentPage={currentTasksPage} onBack={handleBack} />
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
            <RacingPages currentPage={currentRacingPage} onBack={handleBack} />
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="home" className="mt-0">
                    <DashboardHome />

                    {/* Daily Tasks and Alerts */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Daily Tasks Card */}
                      <section>
                        <Card className="overflow-hidden rounded-3xl">
                          <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
                                  <ClipboardList className="h-5 w-5 text-blue-500" />
                                </div>
                                <CardTitle>{t("dailyTasksTitle")}</CardTitle>
                              </div>
                              <Badge variant="outline" className="rounded-xl">
                                5 {t("taskPending")}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y">
                              {[
                                {
                                  task:
                                    language === "ar"
                                      ? "ØªÙ†Ø¸ÙŠÙ Ø§Ù„Ù„ÙˆÙØª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ"
                                      : "Clean main loft",
                                  time: "08:00",
                                  completed: true,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ø¹Ø§Ù… Ø§Ù„ØµØ¨Ø§Ø­ÙŠ"
                                      : "Morning feeding",
                                  time: "09:00",
                                  completed: true,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "ÙØ­Øµ Ø§Ù„Ø­Ù…Ø§Ù… Ø§Ù„Ù…Ø±ÙŠØ¶"
                                      : "Check sick pigeons",
                                  time: "10:00",
                                  completed: false,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "ØªØºÙŠÙŠØ± Ø§Ù„Ù…ÙŠØ§Ù‡"
                                      : "Change water",
                                  time: "11:00",
                                  completed: false,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ÙŠÙˆÙ…ÙŠØ©"
                                      : "Record daily data",
                                  time: "12:00",
                                  completed: false,
                                },
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{
                                    backgroundColor: "rgba(0,0,0,0.02)",
                                  }}
                                  className="flex items-center justify-between p-4"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full border-2",
                                        item.completed
                                          ? "border-green-500 bg-green-500/10"
                                          : "border-muted-foreground/30",
                                      )}
                                    >
                                      {item.completed && (
                                        <Award className="h-4 w-4 text-green-500" />
                                      )}
                                    </div>
                                    <div>
                                      <p
                                        className={cn(
                                          "font-medium",
                                          item.completed &&
                                          "line-through text-muted-foreground",
                                        )}
                                      >
                                        {item.task}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.time}
                                      </p>
                                    </div>
                                  </div>
                                  {!item.completed && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="rounded-xl text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                                    >
                                      {t("markComplete")}
                                    </Button>
                                  )}
                                  {item.completed && (
                                    <Badge className="rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                      {t("taskCompleted")}
                                    </Badge>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </section>

                      {/* Alerts Card */}
                      <section>
                        <Card className="overflow-hidden rounded-3xl">
                          <CardHeader className="border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10">
                                  <Bell className="h-5 w-5 text-red-500" />
                                </div>
                                <CardTitle>{t("alertsTitle")}</CardTitle>
                              </div>
                              <Badge
                                variant="outline"
                                className="rounded-xl bg-red-500/10 text-red-500 border-red-500/30"
                              >
                                3 {t("alertHigh")}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y">
                              {[
                                {
                                  alert:
                                    language === "ar"
                                      ? "Ø­Ù…Ø§Ù…Ø© Ø±Ù‚Ù… 127 ØªØ­ØªØ§Ø¬ ÙØ­Øµ Ø·Ø¨ÙŠ Ø¹Ø§Ø¬Ù„"
                                      : "Pigeon #127 needs urgent medical check",
                                  priority: "high",
                                  time:
                                    language === "ar"
                                      ? "Ù…Ù†Ø° Ø³Ø§Ø¹Ø©"
                                      : "1 hour ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "Ù…Ø®Ø²ÙˆÙ† Ø§Ù„Ø¹Ù„Ù Ù…Ù†Ø®ÙØ¶ - ÙŠØ¬Ø¨ Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ø·Ù„Ø¨"
                                      : "Feed stock is low - reorder needed",
                                  priority: "high",
                                  time:
                                    language === "ar"
                                      ? "Ù…Ù†Ø° 2 Ø³Ø§Ø¹Ø©"
                                      : "2 hours ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "Ù…ÙˆØ¹Ø¯ ØªØ·Ø¹ÙŠÙ… 15 Ø­Ù…Ø§Ù…Ø© ØºØ¯Ø§Ù‹"
                                      : "15 pigeons vaccination due tomorrow",
                                  priority: "medium",
                                  time:
                                    language === "ar"
                                      ? "Ù…Ù†Ø° 3 Ø³Ø§Ø¹Ø§Øª"
                                      : "3 hours ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "Ø³Ø¨Ø§Ù‚ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ Ø§Ù„Ù‚Ø§Ø¯Ù… - ØªØ£ÙƒØ¯ Ù…Ù† Ø§Ù„ØªØ³Ø¬ÙŠÙ„"
                                      : "Next week race - confirm registration",
                                  priority: "medium",
                                  time:
                                    language === "ar"
                                      ? "Ù…Ù†Ø° 5 Ø³Ø§Ø¹Ø§Øª"
                                      : "5 hours ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "ØªØ­Ø¯ÙŠØ« Ø¨ÙŠØ§Ù†Ø§Øª 3 Ø­Ù…Ø§Ù…Ø§Øª Ø¬Ø¯ÙŠØ¯Ø©"
                                      : "Update data for 3 new pigeons",
                                  priority: "low",
                                  time:
                                    language === "ar"
                                      ? "Ù…Ù†Ø° ÙŠÙˆÙ…"
                                      : "1 day ago",
                                },
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{
                                    backgroundColor: "rgba(0,0,0,0.02)",
                                  }}
                                  className="flex items-center justify-between p-4"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        "flex h-3 w-3 rounded-full",
                                        item.priority === "high"
                                          ? "bg-red-500"
                                          : item.priority === "medium"
                                            ? "bg-amber-500"
                                            : "bg-blue-500",
                                      )}
                                    />
                                    <div>
                                      <p className="font-medium">
                                        {item.alert}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {item.time}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "rounded-xl",
                                      item.priority === "high"
                                        ? "border-red-500/30 text-red-500 bg-red-500/10"
                                        : item.priority === "medium"
                                          ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                                          : "border-blue-500/30 text-blue-500 bg-blue-500/10",
                                    )}
                                  >
                                    {item.priority === "high"
                                      ? t("alertHigh")
                                      : item.priority === "medium"
                                        ? t("alertMedium")
                                        : t("alertLow")}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          )}
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
