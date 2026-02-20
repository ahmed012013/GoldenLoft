import {
  Home,
  Warehouse,
  Bird,
  ClipboardList,
  Package,
  Utensils,
  Heart,
  Trophy,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { NavigationState } from "../hooks/use-app-navigation";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  key: string;
  badge?: string;
  items?: Array<{
    title: string;
    url: string;
    badge?: string;
    onClick: () => void;
  }>;
  onClick?: () => void;
}

import { TranslationKey } from "../lib/translations";

export function getSidebarItems(
  t: (key: TranslationKey) => string,
  state: NavigationState,
  actions: {
    resetAllPages: () => void;
    setActiveTab: (tab: string) => void;
    setCurrentLoftPage: (page: any) => void;
    setCurrentPigeonPage: (page: any) => void;
    setCurrentTasksPage: (page: any) => void;
    setCurrentInventoryPage: (page: any) => void;
    setCurrentNutritionPage: (page: any) => void;
    setCurrentBreedingPage: (page: any) => void;
    setCurrentTrainingPage: (page: any) => void;
    setCurrentRacingPage: (page: any) => void;
    setCurrentFinancialPage: (page: any) => void;
    setCurrentReportsPage: (page: any) => void;
  },
): SidebarItem[] {
  const {
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
  } = state;

  const {
    resetAllPages,
    setActiveTab,
    setCurrentLoftPage,
    setCurrentPigeonPage,
    setCurrentTasksPage,
    setCurrentInventoryPage,
    setCurrentNutritionPage,
    setCurrentBreedingPage,
    setCurrentTrainingPage,
    setCurrentRacingPage,
    setCurrentFinancialPage,
    setCurrentReportsPage,
  } = actions;

  return [
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
          title: t("upcomingRaces"),
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
}
