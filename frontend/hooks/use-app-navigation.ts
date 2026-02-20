import { useState, useEffect } from "react";

export interface NavigationState {
  activeTab: string;
  currentLoftPage: "all" | "add" | "settings" | null;
  currentPigeonPage: "all" | "add" | "pedigree" | "health" | null;
  currentTasksPage: "today" | "schedule" | "completed" | null;
  currentInventoryPage: "feed" | "medications" | "equipment" | null;
  currentNutritionPage: "feeding" | "supplements" | "water" | null;
  currentBreedingPage: "pairings" | "eggs" | "squabs" | null;
  currentTrainingPage: "routes" | "sessions" | "condition" | null;
  currentRacingPage: "results" | "stats" | "calendar" | null;
  currentFinancialPage: "income" | "expenses" | "reports" | null;
  currentReportsPage: "pigeons" | "financial" | "breeding" | null;
  pigeonEditingId: string | null;
}

export function useAppNavigation() {
  const [activeTab, setActiveTab] = useState("home");
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
  const [pigeonEditingId, setPigeonEditingId] = useState<string | null>(null);

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
    setPigeonEditingId(null);
  };

  // Helper function for going back
  const handleBack = () => {
    resetAllPages();
    setActiveTab("home");
    window.history.pushState({}, "", "/dashboard");
  };

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

  return {
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
    pigeonEditingId,
    setPigeonEditingId,
    resetAllPages,
    handleBack,
  };
}
