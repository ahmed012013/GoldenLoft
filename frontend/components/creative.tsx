"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brush,
  Camera,
  Cloud,
  Code,
  FileText,
  Home,
  ImageIcon,
  Layers,
  LayoutGrid,
  Palette,
  Search,
  Sparkles,
  Video,
  X,
  Play,
  Clock,
  Eye,
  Award,
  Bell,
  Grid,
  TrendingUp,
  Archive,
  Download,
  Share2,
  MoreHorizontal,
  Type,
  CuboidIcon,
  Bird,
  Sun,
  Moon,
  Languages,
  LogOut,
  Plus,
  Heart,
  Activity,
  Star,
  Trash,
  PanelLeft,
  Users,
  Crown,
  BookOpen,
  Lightbulb,
  Bookmark,
  ChevronDown,
  ArrowUpDown,
  ClipboardList,
  Package,
  Utensils,
  Baby,
  Trophy,
  DollarSign,
  BarChart3,
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
import { usePigeonStats } from "@/hooks/usePigeonStats";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data for apps
const apps = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "MotionFX",
    icon: <Sparkles className="text-blue-500" />,
    description: "Stunning visual effects and animations",
    category: "Video",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "PageCraft",
    icon: <Layers className="text-red-500" />,
    description: "Professional page design and layout",
    category: "Creative",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "UXFlow",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Intuitive user experience design",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "PhotoLab",
    icon: <Camera className="text-teal-500" />,
    description: "Advanced photo editing and organization",
    category: "Photography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "DocMaster",
    icon: <FileText className="text-red-600" />,
    description: "Document editing and management",
    category: "Document",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "WebCanvas",
    icon: <Code className="text-emerald-500" />,
    description: "Web design and development",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
  },
  {
    name: "3DStudio",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "3D modeling and rendering",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
  },
  {
    name: "FontForge",
    icon: <Type className="text-amber-500" />,
    description: "Typography and font creation",
    category: "Typography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "ColorPalette",
    icon: <Palette className="text-purple-500" />,
    description: "Color scheme creation and management",
    category: "Design",
    recent: false,
    new: false,
    progress: 100,
  },
];

// Sample data for recent files
const recentFiles = [
  {
    name: "Brand Redesign.pxm",
    app: "PixelMaster",
    modified: "2 hours ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    size: "24.5 MB",
    collaborators: 3,
  },
  {
    name: "Company Logo.vec",
    app: "VectorPro",
    modified: "Yesterday",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    size: "8.2 MB",
    collaborators: 2,
  },
  {
    name: "Product Launch Video.vid",
    app: "VideoStudio",
    modified: "3 days ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    size: "1.2 GB",
    collaborators: 0,
  },
  {
    name: "UI Animation.mfx",
    app: "MotionFX",
    modified: "Last week",
    icon: <Sparkles className="text-blue-500" />,
    shared: true,
    size: "345 MB",
    collaborators: 4,
  },
  {
    name: "Magazine Layout.pgc",
    app: "PageCraft",
    modified: "2 weeks ago",
    icon: <Layers className="text-red-500" />,
    shared: false,
    size: "42.8 MB",
    collaborators: 0,
  },
  {
    name: "Mobile App Design.uxf",
    app: "UXFlow",
    modified: "3 weeks ago",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    shared: true,
    size: "18.3 MB",
    collaborators: 5,
  },
  {
    name: "Product Photography.phl",
    app: "PhotoLab",
    modified: "Last month",
    icon: <Camera className="text-teal-500" />,
    shared: false,
    size: "156 MB",
    collaborators: 0,
  },
];

// Sample data for projects
const projects = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    dueDate: "June 15, 2025",
    members: 4,
    files: 23,
  },
  {
    name: "Mobile App Launch",
    description: "Design and assets for new mobile application",
    progress: 60,
    dueDate: "July 30, 2025",
    members: 6,
    files: 42,
  },
  {
    name: "Brand Identity",
    description: "New brand guidelines and assets",
    progress: 90,
    dueDate: "May 25, 2025",
    members: 3,
    files: 18,
  },
  {
    name: "Marketing Campaign",
    description: "Summer promotion materials",
    progress: 40,
    dueDate: "August 10, 2025",
    members: 5,
    files: 31,
  },
];

// Sample data for tutorials
const tutorials = [
  {
    title: "Mastering Digital Illustration",
    description: "Learn advanced techniques for creating stunning digital art",
    duration: "1h 45m",
    level: "Advanced",
    instructor: "Sarah Chen",
    category: "Illustration",
    views: "24K",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Essential principles for creating intuitive user interfaces",
    duration: "2h 20m",
    level: "Intermediate",
    instructor: "Michael Rodriguez",
    category: "Design",
    views: "56K",
  },
  {
    title: "Video Editing Masterclass",
    description: "Professional techniques for cinematic video editing",
    duration: "3h 10m",
    level: "Advanced",
    instructor: "James Wilson",
    category: "Video",
    views: "32K",
  },
  {
    title: "Typography Essentials",
    description: "Create beautiful and effective typography for any project",
    duration: "1h 30m",
    level: "Beginner",
    instructor: "Emma Thompson",
    category: "Typography",
    views: "18K",
  },
  {
    title: "Color Theory for Designers",
    description: "Understanding color relationships and psychology",
    duration: "2h 05m",
    level: "Intermediate",
    instructor: "David Kim",
    category: "Design",
    views: "41K",
  },
];

// Sample data for community posts
const communityPosts = [
  {
    title: "Minimalist Logo Design",
    author: "Alex Morgan",
    likes: 342,
    comments: 28,
    image: "/placeholder.svg?height=300&width=400",
    time: "2 days ago",
  },
  {
    title: "3D Character Concept",
    author: "Priya Sharma",
    likes: 518,
    comments: 47,
    image: "/placeholder.svg?height=300&width=400",
    time: "1 week ago",
  },
  {
    title: "UI Dashboard Redesign",
    author: "Thomas Wright",
    likes: 276,
    comments: 32,
    image: "/placeholder.svg?height=300&width=400",
    time: "3 days ago",
  },
  {
    title: "Product Photography Setup",
    author: "Olivia Chen",
    likes: 189,
    comments: 15,
    image: "/placeholder.svg?height=300&width=400",
    time: "5 days ago",
  },
];

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
  const [userName, setUserName] = useState<string>("");

  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { data: stats, isLoading } = usePigeonStats();

  // Load user info from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setUserName(parsed.name || "");
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }
  }, []);

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sidebar navigation items for Pigeon Manager
  const sidebarItems = [
    {
      title: t("home"),
      icon: <Home className="h-5 w-5" />,
      isActive: activeTab === "home",
      key: "home",
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
            setCurrentLoftPage("all");
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("lofts");
          },
        },
        {
          title: t("loftSettings"),
          url: "#",
          onClick: () => {
            setCurrentLoftPage("settings");
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("lofts");
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
            setCurrentPigeonPage("all");
            setCurrentLoftPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("pigeons");
          },
        },
        {
          title: t("pedigree"),
          url: "#",
          onClick: () => {
            setCurrentPigeonPage("pedigree");
            setCurrentLoftPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("pigeons");
          },
        },
        {
          title: t("healthRecords"),
          url: "#",
          onClick: () => {
            setCurrentPigeonPage("health");
            setCurrentLoftPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("pigeons");
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
            setCurrentTasksPage("today");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("tasks");
          },
        },
        {
          title: t("taskSchedule"),
          url: "#",
          onClick: () => {
            setCurrentTasksPage("schedule");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("tasks");
          },
        },
        {
          title: t("completedTasks"),
          url: "#",
          onClick: () => {
            setCurrentTasksPage("completed");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentInventoryPage(null);
            setCurrentNutritionPage(null);
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
            setCurrentInventoryPage("feed");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("inventory");
          },
        },
        {
          title: t("medications"),
          url: "#",
          onClick: () => {
            setCurrentInventoryPage("medications");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentNutritionPage(null);
            setActiveTab("inventory");
          },
        },
        {
          title: t("equipment"),
          url: "#",
          onClick: () => {
            setCurrentInventoryPage("equipment");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentNutritionPage(null);
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
            setCurrentNutritionPage("feeding");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setActiveTab("nutrition");
          },
        },
        {
          title: t("supplements"),
          url: "#",
          onClick: () => {
            setCurrentNutritionPage("supplements");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setActiveTab("nutrition");
          },
        },
        {
          title: t("waterManagement"),
          url: "#",
          onClick: () => {
            setCurrentNutritionPage("water");
            setCurrentLoftPage(null);
            setCurrentPigeonPage(null);
            setCurrentTasksPage(null);
            setCurrentInventoryPage(null);
            setActiveTab("nutrition");
          },
        },
      ],
    },
    {
      title: t("breedingMating"),
      icon: <Baby className="h-5 w-5" />,
      isActive: false,
      key: "breeding",
      badge: "3",
      items: [
        { title: t("pairings"), url: "#", badge: "3" },
        { title: t("eggs"), url: "#" },
        { title: t("youngPigeons"), url: "#" },
      ],
    },
    {
      title: t("trainingRacing"),
      icon: <Trophy className="h-5 w-5" />,
      isActive: false,
      key: "training",
      items: [
        { title: t("trainingSchedule"), url: "#" },
        { title: t("raceResults"), url: "#" },
        { title: t("performance"), url: "#" },
      ],
    },
    {
      title: t("finance"),
      icon: <DollarSign className="h-5 w-5" />,
      isActive: false,
      key: "finance",
      items: [
        { title: t("income"), url: "#" },
        { title: t("expenses"), url: "#" },
        { title: t("salesPurchases"), url: "#" },
      ],
    },
    {
      title: t("reports"),
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: false,
      key: "reports",
      items: [
        { title: t("pigeonReports"), url: "#" },
        { title: t("financialReports"), url: "#" },
        { title: t("breedingReports"), url: "#" },
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
          "fixed inset-y-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
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
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                      item.isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted",
                    )}
                    onClick={() => {
                      if (item.items) {
                        toggleExpanded(item.title);
                      } else if (item.key === "home") {
                        setCurrentLoftPage(null);
                        setCurrentPigeonPage(null);
                        setCurrentTasksPage(null);
                        setCurrentInventoryPage(null);
                        setCurrentNutritionPage(null);
                        setActiveTab("home");
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          dir === "rtl" ? "mr-auto" : "ml-auto",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.items && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          dir === "rtl" ? "mr-2" : "ml-2",
                          expandedItems[item.title] ? "rotate-180" : "",
                        )}
                      />
                    )}
                  </button>

                  {item.items && expandedItems[item.title] && (
                    <div
                      className={cn(
                        "mt-1 space-y-1",
                        dir === "rtl"
                          ? "mr-6 border-r pr-3"
                          : "ml-6 border-l pl-3",
                      )}
                    >
                      {item.items.map((subItem: any) => (
                        <button
                          key={subItem.title}
                          onClick={() => {
                            if (subItem.onClick) {
                              subItem.onClick();
                              setMobileMenuOpen(false);
                            }
                          }}
                          className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                        >
                          {subItem.title}
                          {subItem.badge && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                dir === "rtl" ? "mr-auto" : "ml-auto",
                              )}
                            >
                              {subItem.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span>{theme === "dark" ? t("light") : t("dark")}</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              >
                <Languages className="h-5 w-5" />
                <span>{language === "en" ? "العربية" : "English"}</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>{t("logout")}</span>
              </button>
            </div>
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
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                      item.isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted",
                    )}
                    onClick={() => {
                      if (item.items) {
                        toggleExpanded(item.title);
                      } else if (item.key === "home") {
                        setCurrentLoftPage(null);
                        setCurrentPigeonPage(null);
                        setCurrentTasksPage(null);
                        setCurrentInventoryPage(null);
                        setCurrentNutritionPage(null);
                        setActiveTab("home");
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          dir === "rtl" ? "mr-auto" : "ml-auto",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.items && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          dir === "rtl" ? "mr-2" : "ml-2",
                          expandedItems[item.title] ? "rotate-180" : "",
                        )}
                      />
                    )}
                  </button>

                  {item.items && expandedItems[item.title] && (
                    <div
                      className={cn(
                        "mt-1 space-y-1",
                        dir === "rtl"
                          ? "mr-6 border-r pr-3"
                          : "ml-6 border-l pl-3",
                      )}
                    >
                      {item.items.map((subItem: any) => (
                        <button
                          key={subItem.title}
                          onClick={() => {
                            if (subItem.onClick) {
                              subItem.onClick();
                            }
                          }}
                          className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                        >
                          {subItem.title}
                          {subItem.badge && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                dir === "rtl" ? "mr-auto" : "ml-auto",
                              )}
                            >
                              {subItem.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span>{theme === "dark" ? t("light") : t("dark")}</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              >
                <Languages className="h-5 w-5" />
                <span>{language === "en" ? "العربية" : "English"}</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>{t("logout")}</span>
              </button>
            </div>
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
            <LoftPages
              currentPage={currentLoftPage}
              onBack={() => {
                setCurrentLoftPage(null);
                setActiveTab("home");
              }}
            />
          ) : currentPigeonPage !== null ? (
            <PigeonPages
              currentPage={currentPigeonPage}
              onBack={() => {
                setCurrentPigeonPage(null);
                setActiveTab("home");
              }}
            />
          ) : currentTasksPage !== null ? (
            <TasksPages
              currentPage={currentTasksPage}
              onBack={() => {
                setCurrentTasksPage(null);
                setActiveTab("home");
              }}
            />
          ) : currentInventoryPage !== null ? (
            <InventoryPages
              currentPage={currentInventoryPage}
              onBack={() => {
                setCurrentInventoryPage(null);
                setActiveTab("home");
              }}
            />
          ) : currentNutritionPage !== null ? (
            <NutritionPages
              currentPage={currentNutritionPage}
              onBack={() => {
                setCurrentNutritionPage(null);
                setActiveTab("home");
              }}
            />
          ) : (
            <Tabs
              defaultValue="home"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="home" className="space-y-8 mt-0">
                    {/* Welcome Banner */}
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-4">
                            <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                              {t("premium")}
                            </Badge>
                            <h2 className="text-3xl font-bold">
                              {t("welcomeTitle")}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                              {t("welcomeDescription")}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <Button className="rounded-2xl bg-white text-blue-700 hover:bg-white/90">
                                <Plus
                                  className={cn(
                                    "h-4 w-4",
                                    dir === "rtl" ? "ml-2" : "mr-2",
                                  )}
                                />
                                {t("explorePlans")}
                              </Button>
                              <Button
                                variant="outline"
                                className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
                              >
                                <Eye
                                  className={cn(
                                    "h-4 w-4",
                                    dir === "rtl" ? "ml-2" : "mr-2",
                                  )}
                                />
                                {t("takeATour")}
                              </Button>
                            </div>
                          </div>
                          <div className="hidden lg:block">
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                              className="relative"
                            >
                              <Bird className="h-32 w-32 text-white/80" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </section>

                    {/* Statistics Cards */}
                    {/* Statistics Cards */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-blue-500/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {t("totalPigeons")}
                                </p>
                                {isLoading ? (
                                  <Skeleton className="h-9 w-20 rounded-lg" />
                                ) : (
                                  <p className="text-3xl font-bold text-foreground">
                                    {stats?.total ?? 0}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t("pigeon")}
                                </p>
                              </div>
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                                <Bird className="h-7 w-7 text-blue-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-green-500/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {language === "ar" ? "بصحة جيدة" : "Healthy"}
                                </p>
                                {isLoading ? (
                                  <Skeleton className="h-9 w-20 rounded-lg" />
                                ) : (
                                  <p className="text-3xl font-bold text-foreground">
                                    {stats?.healthy ?? 0}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t("pigeon")}
                                </p>
                              </div>
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
                                <Heart className="h-7 w-7 text-green-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-red-500/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {language === "ar" ? "مريض" : "Sick"}
                                </p>
                                {isLoading ? (
                                  <Skeleton className="h-9 w-20 rounded-lg" />
                                ) : (
                                  <p className="text-3xl font-bold text-foreground">
                                    {stats?.sick ?? 0}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {t("pigeon")}
                                </p>
                              </div>
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                                <Activity className="h-7 w-7 text-red-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </section>

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
                                      ? "تنظيف اللوفت الرئيسي"
                                      : "Clean main loft",
                                  time: "08:00",
                                  completed: true,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "تقديم الطعام الصباحي"
                                      : "Morning feeding",
                                  time: "09:00",
                                  completed: true,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "فحص الحمام المريض"
                                      : "Check sick pigeons",
                                  time: "10:00",
                                  completed: false,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "تغيير المياه"
                                      : "Change water",
                                  time: "11:00",
                                  completed: false,
                                },
                                {
                                  task:
                                    language === "ar"
                                      ? "تسجيل البيانات اليومية"
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
                                      ? "حمامة رقم 127 تحتاج فحص طبي عاجل"
                                      : "Pigeon #127 needs urgent medical check",
                                  priority: "high",
                                  time:
                                    language === "ar"
                                      ? "منذ ساعة"
                                      : "1 hour ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "مخزون العلف منخفض - يجب إعادة الطلب"
                                      : "Feed stock is low - reorder needed",
                                  priority: "high",
                                  time:
                                    language === "ar"
                                      ? "منذ 2 ساعة"
                                      : "2 hours ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "موعد تطعيم 15 حمامة غداً"
                                      : "15 pigeons vaccination due tomorrow",
                                  priority: "medium",
                                  time:
                                    language === "ar"
                                      ? "منذ 3 ساعات"
                                      : "3 hours ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "سباق الأسبوع القادم - تأكد من التسجيل"
                                      : "Next week race - confirm registration",
                                  priority: "medium",
                                  time:
                                    language === "ar"
                                      ? "منذ 5 ساعات"
                                      : "5 hours ago",
                                },
                                {
                                  alert:
                                    language === "ar"
                                      ? "تحديث بيانات 3 حمامات جديدة"
                                      : "Update data for 3 new pigeons",
                                  priority: "low",
                                  time:
                                    language === "ar" ? "منذ يوم" : "1 day ago",
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

                  <TabsContent value="apps" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold">
                              {t("creativeAppsCollection")}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                              {t("creativeAppsDescription")}
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-red-700 hover:bg-white/90">
                            <Download
                              className={cn(
                                "h-4 w-4",
                                dir === "rtl" ? "ml-2" : "mr-2",
                              )}
                            />
                            {t("installDesktopApp")}
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        {t("allCategories")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        {t("creative")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        {t("video")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        {t("web")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        {t("threeD")}
                      </Button>
                      <div className="flex-1"></div>
                      <div className="relative w-full md:w-auto mt-3 md:mt-0">
                        <Search
                          className={cn(
                            "absolute top-3 h-4 w-4 text-muted-foreground",
                            dir === "rtl" ? "right-3" : "left-3",
                          )}
                        />
                        <Input
                          type="search"
                          placeholder={t("searchApps")}
                          className={cn(
                            "w-full rounded-2xl md:w-[200px]",
                            dir === "rtl" ? "pr-9" : "pl-9",
                          )}
                        />
                      </div>
                    </div>

                    <section className="space-y-4">
                      <h2 className="text-2xl font-semibold">{t("new")}</h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {apps
                          .filter((app) => app.new)
                          .map((app) => (
                            <motion.div
                              key={app.name}
                              whileHover={{ scale: 1.02, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                      {app.icon}
                                    </div>
                                    <Badge className="rounded-xl bg-amber-500">
                                      {t("new")}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <CardTitle className="text-lg">
                                    {app.name}
                                  </CardTitle>
                                  <CardDescription>
                                    {app.description}
                                  </CardDescription>
                                  <div className="mt-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>{t("installing")}</span>
                                      <span>{app.progress}%</span>
                                    </div>
                                    <Progress
                                      value={app.progress}
                                      className="h-2 mt-1 rounded-xl"
                                    />
                                  </div>
                                </CardContent>
                                <CardFooter>
                                  <Button
                                    variant="secondary"
                                    className="w-full rounded-2xl"
                                  >
                                    {app.progress < 100
                                      ? t("installing")
                                      : t("open")}
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-2xl font-semibold">
                        {t("allAppsTitle")}
                      </h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {apps.map((app) => (
                          <motion.div
                            key={app.name}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                    {app.icon}
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="rounded-xl"
                                  >
                                    {app.category}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <CardTitle className="text-lg">
                                  {app.name}
                                </CardTitle>
                                <CardDescription>
                                  {app.description}
                                </CardDescription>
                              </CardContent>
                              <CardFooter className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  className="flex-1 rounded-2xl"
                                >
                                  {app.progress < 100 ? t("getApp") : t("open")}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-2xl bg-transparent"
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="files" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold">
                              {t("fileManagement")}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                              {t("fileManagementDescription")}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Button className="rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30">
                              <Cloud
                                className={cn(
                                  "h-4 w-4",
                                  dir === "rtl" ? "ml-2" : "mr-2",
                                )}
                              />
                              {t("cloudStorage")}
                            </Button>
                            <Button className="rounded-2xl bg-white text-blue-700 hover:bg-white/90">
                              <Plus
                                className={cn(
                                  "h-4 w-4",
                                  dir === "rtl" ? "ml-2" : "mr-2",
                                )}
                              />
                              {t("uploadFiles")}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </section>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <FileText
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("allFiles")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Clock
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("recent")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Users
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("shared")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("favorites")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Trash
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("trash")}
                      </Button>
                      <div className="flex-1"></div>
                      <div className="relative w-full md:w-auto mt-3 md:mt-0">
                        <Search
                          className={cn(
                            "absolute top-3 h-4 w-4 text-muted-foreground",
                            dir === "rtl" ? "right-3" : "left-3",
                          )}
                        />
                        <Input
                          type="search"
                          placeholder={t("searchFiles")}
                          className={cn(
                            "w-full rounded-2xl md:w-[200px]",
                            dir === "rtl" ? "pr-9" : "pl-9",
                          )}
                        />
                      </div>
                    </div>

                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                          {t("allFiles")}
                        </h2>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl bg-transparent"
                          >
                            <PanelLeft
                              className={cn(
                                "h-4 w-4",
                                dir === "rtl" ? "ml-2" : "mr-2",
                              )}
                            />
                            {t("filter")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl bg-transparent"
                          >
                            <ArrowUpDown
                              className={cn(
                                "h-4 w-4",
                                dir === "rtl" ? "ml-2" : "mr-2",
                              )}
                            />
                            {t("sort")}
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-3xl border overflow-hidden">
                        <div className="bg-muted/50 p-3 hidden md:grid md:grid-cols-12 text-sm font-medium">
                          <div className="col-span-6">{t("name")}</div>
                          <div className="col-span-2">{t("app")}</div>
                          <div className="col-span-2">{t("size")}</div>
                          <div className="col-span-2">{t("modified")}</div>
                        </div>
                        <div className="divide-y">
                          {recentFiles.map((file) => (
                            <motion.div
                              key={file.name}
                              whileHover={{
                                backgroundColor: "rgba(0,0,0,0.02)",
                              }}
                              className="p-3 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-3 md:gap-0"
                            >
                              <div className="col-span-6 flex items-center gap-3 w-full md:w-auto">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                                  {file.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  {file.shared && (
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Users
                                        className={cn(
                                          "h-3 w-3",
                                          dir === "rtl" ? "ml-1" : "mr-1",
                                        )}
                                      />
                                      {t("sharedWith")} {file.collaborators}{" "}
                                      {t("people")}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-span-2 text-sm md:text-base">
                                {file.app}
                              </div>
                              <div className="col-span-2 text-sm md:text-base">
                                {file.size}
                              </div>
                              <div className="col-span-2 flex items-center justify-between w-full md:w-auto">
                                <span className="text-sm md:text-base">
                                  {file.modified}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-xl"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-xl"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold">
                              {t("projectManagement")}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                              {t("projectManagementDescription")}
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                            <Plus
                              className={cn(
                                "h-4 w-4",
                                dir === "rtl" ? "ml-2" : "mr-2",
                              )}
                            />
                            {t("newProject")}
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Layers
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("allProjectsBtn")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Clock
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("recent")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Users
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("shared")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Archive
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("archived")}
                      </Button>
                      <div className="flex-1"></div>
                      <div className="relative w-full md:w-auto mt-3 md:mt-0">
                        <Search
                          className={cn(
                            "absolute top-3 h-4 w-4 text-muted-foreground",
                            dir === "rtl" ? "right-3" : "left-3",
                          )}
                        />
                        <Input
                          type="search"
                          placeholder={t("searchProjects")}
                          className={cn(
                            "w-full rounded-2xl md:w-[200px]",
                            dir === "rtl" ? "pr-9" : "pl-9",
                          )}
                        />
                      </div>
                    </div>

                    <section className="space-y-4">
                      <h2 className="text-2xl font-semibold">
                        {t("activeProjectsTitle")}
                      </h2>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                          <motion.div
                            key={project.name}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle>{project.name}</CardTitle>
                                  <Badge
                                    variant="outline"
                                    className="rounded-xl"
                                  >
                                    {t("due")} {project.dueDate}
                                  </Badge>
                                </div>
                                <CardDescription>
                                  {project.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>{t("progress")}</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <Progress
                                    value={project.progress}
                                    className="h-2 rounded-xl"
                                  />
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Users
                                      className={cn(
                                        "h-4 w-4",
                                        dir === "rtl" ? "ml-1" : "mr-1",
                                      )}
                                    />
                                    {project.members} {t("members")}
                                  </div>
                                  <div className="flex items-center">
                                    <FileText
                                      className={cn(
                                        "h-4 w-4",
                                        dir === "rtl" ? "ml-1" : "mr-1",
                                      )}
                                    />
                                    {project.files} {t("files")}
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  className="flex-1 rounded-2xl"
                                >
                                  {t("openProject")}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-2xl bg-transparent"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                        <motion.div
                          whileHover={{ scale: 1.02, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed p-8 hover:border-primary/50 transition-all duration-300">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                              <Plus className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium">
                              {t("createNewProject")}
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                              {t("createNewProjectDescription")}
                            </p>
                            <Button className="rounded-2xl">
                              {t("newProject")}
                            </Button>
                          </Card>
                        </motion.div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-2xl font-semibold">
                        {t("projectTemplates")}
                      </h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <Card className="overflow-hidden rounded-3xl">
                          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                            <h3 className="text-lg font-medium">
                              {t("brandIdentity")}
                            </h3>
                            <p className="text-sm text-white/80">
                              {t("brandIdentityDesc")}
                            </p>
                          </div>
                          <CardFooter className="flex justify-between p-4">
                            <Badge variant="outline" className="rounded-xl">
                              {t("popular")}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-xl"
                            >
                              {t("useTemplate")}
                            </Button>
                          </CardFooter>
                        </Card>
                        <Card className="overflow-hidden rounded-3xl">
                          <div className="aspect-video bg-gradient-to-br from-amber-500 to-red-600 p-6 text-white">
                            <h3 className="text-lg font-medium">
                              {t("marketingCampaign")}
                            </h3>
                            <p className="text-sm text-white/80">
                              {t("marketingCampaignDesc")}
                            </p>
                          </div>
                          <CardFooter className="flex justify-between p-4">
                            <Badge variant="outline" className="rounded-xl">
                              {t("new")}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-xl"
                            >
                              {t("useTemplate")}
                            </Button>
                          </CardFooter>
                        </Card>
                        <Card className="overflow-hidden rounded-3xl">
                          <div className="aspect-video bg-gradient-to-br from-green-500 to-teal-600 p-6 text-white">
                            <h3 className="text-lg font-medium">
                              {t("websiteRedesign")}
                            </h3>
                            <p className="text-sm text-white/80">
                              {t("websiteRedesignDesc")}
                            </p>
                          </div>
                          <CardFooter className="flex justify-between p-4">
                            <Badge variant="outline" className="rounded-xl">
                              {t("featured")}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-xl"
                            >
                              {t("useTemplate")}
                            </Button>
                          </CardFooter>
                        </Card>
                        <Card className="overflow-hidden rounded-3xl">
                          <div className="aspect-video bg-gradient-to-br from-pink-500 to-rose-600 p-6 text-white">
                            <h3 className="text-lg font-medium">
                              {t("productLaunch")}
                            </h3>
                            <p className="text-sm text-white/80">
                              {t("productLaunchDesc")}
                            </p>
                          </div>
                          <CardFooter className="flex justify-between p-4">
                            <Badge variant="outline" className="rounded-xl">
                              {t("popular")}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-xl"
                            >
                              {t("useTemplate")}
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="learn" className="space-y-8 mt-0">
                    <section>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold">
                              {t("learnAndGrow")}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                              {t("learnAndGrowDescription")}
                            </p>
                          </div>
                          <Button className="w-fit rounded-2xl bg-white text-emerald-700 hover:bg-white/90">
                            <Crown
                              className={cn(
                                "h-4 w-4",
                                dir === "rtl" ? "ml-2" : "mr-2",
                              )}
                            />
                            {t("upgradeToPro")}
                          </Button>
                        </div>
                      </motion.div>
                    </section>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Play
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("allTutorials")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <BookOpen
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("courses")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Lightbulb
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("tipsAndTricks")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <TrendingUp
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("trending")}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl bg-transparent"
                      >
                        <Bookmark
                          className={cn(
                            "h-4 w-4",
                            dir === "rtl" ? "ml-2" : "mr-2",
                          )}
                        />
                        {t("saved")}
                      </Button>
                      <div className="flex-1"></div>
                      <div className="relative w-full md:w-auto mt-3 md:mt-0">
                        <Search
                          className={cn(
                            "absolute top-3 h-4 w-4 text-muted-foreground",
                            dir === "rtl" ? "right-3" : "left-3",
                          )}
                        />
                        <Input
                          type="search"
                          placeholder={t("searchTutorials")}
                          className={cn(
                            "w-full rounded-2xl md:w-[200px]",
                            dir === "rtl" ? "pr-9" : "pl-9",
                          )}
                        />
                      </div>
                    </div>

                    <section className="space-y-4">
                      <h2 className="text-2xl font-semibold">
                        {t("featuredTutorials")}
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tutorials.slice(0, 3).map((tutorial) => (
                          <motion.div
                            key={tutorial.title}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card className="overflow-hidden rounded-3xl">
                              <div className="aspect-video overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-14 w-14 rounded-full"
                                  >
                                    <Play className="h-6 w-6" />
                                  </Button>
                                </div>
                                <div
                                  className={cn(
                                    "absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white",
                                    dir === "rtl"
                                      ? "right-0 left-0"
                                      : "left-0 right-0",
                                  )}
                                >
                                  <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                                    {tutorial.category}
                                  </Badge>
                                  <h3 className="mt-2 text-lg font-medium">
                                    {tutorial.title}
                                  </h3>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">
                                  {tutorial.description}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback>
                                        {tutorial.instructor.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">
                                      {tutorial.instructor}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {tutorial.duration}
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex items-center justify-between border-t p-4">
                                <Badge variant="outline" className="rounded-xl">
                                  {tutorial.level}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Eye className="h-4 w-4" />
                                  {tutorial.views} {t("views")}
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                          {t("courses")}
                        </h2>
                        <Button variant="ghost" className="rounded-2xl">
                          {t("viewAll")}
                        </Button>
                      </div>
                      <div className="rounded-3xl border overflow-hidden">
                        <div className="divide-y">
                          {tutorials.slice(3, 5).map((tutorial) => (
                            <motion.div
                              key={tutorial.title}
                              whileHover={{ scale: 1.02, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              className="p-4 flex flex-col md:flex-row gap-3"
                            >
                              <div className="flex-shrink-0">
                                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">
                                  {tutorial.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {tutorial.description}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className="rounded-xl"
                                  >
                                    {tutorial.level}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {tutorial.duration}
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Eye className="h-3 w-3" />
                                    {tutorial.views} {t("views")}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-xl"
                                >
                                  {t("watchNow")}
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-2xl font-semibold">{t("courses")}</h2>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge className="rounded-xl bg-blue-500">
                                {t("beginner")}
                              </Badge>
                              <Award className="h-5 w-5 text-amber-500" />
                            </div>
                            <CardTitle className="mt-2">
                              UI/UX Design Fundamentals
                            </CardTitle>
                            <CardDescription>
                              Master the basics of user interface and experience
                              design
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>8 {t("courses")} • 24h</span>
                                <span>4.8 ★</span>
                              </div>
                              <Progress value={30} className="h-2 rounded-xl" />
                              <p className="text-xs text-muted-foreground">
                                30%
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="secondary"
                              className="w-full rounded-2xl"
                            >
                              {t("startLearning")}
                            </Button>
                          </CardFooter>
                        </Card>

                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge className="rounded-xl bg-amber-500">
                                {t("intermediate")}
                              </Badge>
                              <Award className="h-5 w-5 text-amber-500" />
                            </div>
                            <CardTitle className="mt-2">
                              Digital Illustration Mastery
                            </CardTitle>
                            <CardDescription>
                              Create stunning digital artwork and illustrations
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>12 {t("courses")} • 36h</span>
                                <span>4.9 ★</span>
                              </div>
                              <Progress value={0} className="h-2 rounded-xl" />
                              <p className="text-xs text-muted-foreground">
                                0%
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="secondary"
                              className="w-full rounded-2xl"
                            >
                              {t("startLearning")}
                            </Button>
                          </CardFooter>
                        </Card>

                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <Badge className="rounded-xl bg-red-500">
                                {t("advanced")}
                              </Badge>
                              <Award className="h-5 w-5 text-amber-500" />
                            </div>
                            <CardTitle className="mt-2">
                              Motion Graphics & Animation
                            </CardTitle>
                            <CardDescription>
                              Create professional motion graphics and animations
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>10 {t("courses")} • 30h</span>
                                <span>4.7 ★</span>
                              </div>
                              <Progress value={0} className="h-2 rounded-xl" />
                              <p className="text-xs text-muted-foreground">
                                0%
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="secondary"
                              className="w-full rounded-2xl"
                            >
                              {t("startLearning")}
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </section>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}
