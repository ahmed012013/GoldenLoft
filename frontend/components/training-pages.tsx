"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  Activity,
  ChevronDown,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Wind,
  Thermometer,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { OnboardingGuard } from "@/components/onboarding-guard";

interface TrainingPagesProps {
  currentPage: "routes" | "sessions" | "condition" | null;
  onBack: () => void;
}

// Sample training routes data
const sampleRoutes = [
  {
    id: "TR001",
    name: "الطريق القريب",
    nameEn: "Short Route",
    distance: "15 km",
    difficulty: "easy",
    location: "مدينة الإسكندرية",
    locationEn: "Alexandria City",
    duration: "30 mins",
    pigeons: 12,
    lastTraining: "2024-01-15",
    description: "مسار تدريب أساسي قريب من المحلة",
  },
  {
    id: "TR002",
    name: "الطريق المتوسط",
    nameEn: "Medium Route",
    distance: "35 km",
    difficulty: "medium",
    location: "شرقية",
    locationEn: "Sharkia Province",
    duration: "60 mins",
    pigeons: 8,
    lastTraining: "2024-01-14",
    description: "مسار تدريب متوسط المسافة",
  },
  {
    id: "TR003",
    name: "الطريق الطويل",
    nameEn: "Long Route",
    distance: "80 km",
    difficulty: "hard",
    location: "الشرقية - القاهرة",
    locationEn: "Sharkia to Cairo",
    duration: "120 mins",
    pigeons: 5,
    lastTraining: "2024-01-10",
    description: "مسار تدريب متقدم لمسافات طويلة",
  },
];

// Sample flight sessions data
const sampleSessions = [
  {
    id: "FS001",
    date: "2024-01-15",
    route: "الطريق القريب",
    routeEn: "Short Route",
    pigeonCount: 12,
    duration: "32 mins",
    avgAltitude: "450m",
    condition: "ممتاز",
    conditionEn: "Excellent",
    notes: "تدريب اعتيادي جيد",
  },
  {
    id: "FS002",
    date: "2024-01-14",
    route: "الطريق المتوسط",
    routeEn: "Medium Route",
    pigeonCount: 8,
    duration: "58 mins",
    avgAltitude: "520m",
    condition: "جيد",
    conditionEn: "Good",
    notes: "أداء جيد من الطيور",
  },
  {
    id: "FS003",
    date: "2024-01-13",
    route: "الطريق القريب",
    routeEn: "Short Route",
    pigeonCount: 11,
    duration: "30 mins",
    avgAltitude: "480m",
    condition: "ممتاز",
    conditionEn: "Excellent",
    notes: "سرعة عودة سريعة جداً",
  },
];

// Sample pigeon condition data
const samplePigeonCondition = [
  {
    id: "P001",
    name: "الصقر الذهبي",
    nameEn: "Golden Falcon",
    weight: "450g",
    condition: "ممتاز",
    conditionEn: "Excellent",
    fitness: 95,
    mood: "نشط جداً",
    moodEn: "Very Active",
    lastFlight: "2024-01-15",
    trainingHours: 156,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "P002",
    name: "النجمة الفضية",
    nameEn: "Silver Star",
    weight: "420g",
    condition: "جيد",
    conditionEn: "Good",
    fitness: 82,
    mood: "نشط",
    moodEn: "Active",
    lastFlight: "2024-01-15",
    trainingHours: 134,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "P003",
    name: "البرق الأسود",
    nameEn: "Black Lightning",
    weight: "460g",
    condition: "ممتاز",
    conditionEn: "Excellent",
    fitness: 98,
    mood: "نشط جداً",
    moodEn: "Very Active",
    lastFlight: "2024-01-15",
    trainingHours: 178,
    image: "/placeholder.svg?height=80&width=80",
  },
];

export function TrainingPages({ currentPage, onBack }: TrainingPagesProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<
    (typeof sampleRoutes)[0] | null
  >(null);
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteDistance, setNewRouteDistance] = useState("");
  const [newRouteDifficulty, setNewRouteDifficulty] = useState("easy");

  const filteredRoutes = sampleRoutes.filter(
    (route) =>
      route.name.includes(searchTerm) || route.nameEn.includes(searchTerm),
  );

  const filteredSessions = sampleSessions.filter((s) =>
    s.date.includes(searchTerm),
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    const isArabic = condition.includes("م");
    if (isArabic) {
      return condition.startsWith("ممتاز")
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";
    }
    return condition === "Excellent"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const renderRoutes = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {language === "ar" ? "رجوع" : "Back"}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {language === "ar" ? "إضافة مسار" : "Add Route"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {language === "ar"
                  ? "إضافة مسار تدريب جديد"
                  : "Add New Training Route"}
              </DialogTitle>
              <DialogDescription>
                {language === "ar"
                  ? "أنشئ مسار تدريب جديد لطيورك"
                  : "Create a new training route for your pigeons"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{language === "ar" ? "اسم المسار" : "Route Name"}</Label>
                <Input
                  placeholder={
                    language === "ar" ? "أدخل اسم المسار" : "Enter route name"
                  }
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  {language === "ar" ? "المسافة (كم)" : "Distance (km)"}
                </Label>
                <Input
                  placeholder="50"
                  value={newRouteDistance}
                  onChange={(e) => setNewRouteDistance(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  {language === "ar" ? "مستوى الصعوبة" : "Difficulty"}
                </Label>
                <Select
                  value={newRouteDifficulty}
                  onValueChange={setNewRouteDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      {language === "ar" ? "سهل" : "Easy"}
                    </SelectItem>
                    <SelectItem value="medium">
                      {language === "ar" ? "متوسط" : "Medium"}
                    </SelectItem>
                    <SelectItem value="hard">
                      {language === "ar" ? "صعب" : "Hard"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">
                {language === "ar" ? "إنشاء المسار" : "Create Route"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={
              language === "ar" ? "ابحث عن مسار..." : "Search routes..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-blue-500" />
                    {language === "ar" ? route.name : route.nameEn}
                  </CardTitle>
                  <CardDescription>
                    {language === "ar" ? route.location : route.locationEn}
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(route.difficulty)}>
                  {language === "ar"
                    ? route.difficulty === "easy"
                      ? "سهل"
                      : route.difficulty === "medium"
                        ? "متوسط"
                        : "صعب"
                    : route.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{route.description}</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "المسافة" : "Distance"}
                  </p>
                  <p className="font-semibold">{route.distance}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "المدة" : "Duration"}
                  </p>
                  <p className="font-semibold">{route.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "الطيور" : "Pigeons"}
                  </p>
                  <p className="font-semibold">{route.pigeons}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "آخر تدريب" : "Last Training"}
                  </p>
                  <p className="font-semibold text-xs">{route.lastTraining}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  {language === "ar" ? "عرض" : "View"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Edit className="h-4 w-4" />
                  {language === "ar" ? "تعديل" : "Edit"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  {language === "ar" ? "حذف" : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderSessions = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {language === "ar" ? "رجوع" : "Back"}
      </Button>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={
              language === "ar" ? "ابحث عن جلسة..." : "Search sessions..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === "ar" ? "التاريخ" : "Date"}</TableHead>
              <TableHead>{language === "ar" ? "المسار" : "Route"}</TableHead>
              <TableHead>
                {language === "ar" ? "عدد الطيور" : "Pigeons"}
              </TableHead>
              <TableHead>{language === "ar" ? "المدة" : "Duration"}</TableHead>
              <TableHead>
                {language === "ar" ? "الارتفاع" : "Altitude"}
              </TableHead>
              <TableHead>
                {language === "ar" ? "الحالة" : "Condition"}
              </TableHead>
              <TableHead>
                {language === "ar" ? "الإجراءات" : "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.date}</TableCell>
                <TableCell>
                  {language === "ar" ? session.route : session.routeEn}
                </TableCell>
                <TableCell>{session.pigeonCount}</TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>{session.avgAltitude}</TableCell>
                <TableCell>
                  <Badge
                    className={getConditionColor(
                      language === "ar"
                        ? session.condition
                        : session.conditionEn,
                    )}
                  >
                    {language === "ar"
                      ? session.condition
                      : session.conditionEn}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    {language === "ar" ? "عرض" : "View"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );

  const renderCondition = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {language === "ar" ? "رجوع" : "Back"}
      </Button>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={
              language === "ar" ? "ابحث عن طير..." : "Search pigeon..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {samplePigeonCondition.map((pigeon) => (
          <Card key={pigeon.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={pigeon.image || "/placeholder.svg"} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {language === "ar" ? pigeon.name : pigeon.nameEn}
                    </CardTitle>
                    <CardDescription>{pigeon.id}</CardDescription>
                  </div>
                </div>
                <Badge
                  className={getConditionColor(
                    language === "ar" ? pigeon.condition : pigeon.conditionEn,
                  )}
                >
                  {language === "ar" ? pigeon.condition : pigeon.conditionEn}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "الوزن" : "Weight"}
                  </p>
                  <p className="font-semibold">{pigeon.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "اللياقة" : "Fitness"}
                  </p>
                  <p className="font-semibold">{pigeon.fitness}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "المزاج" : "Mood"}
                  </p>
                  <p className="font-semibold">
                    {language === "ar" ? pigeon.mood : pigeon.moodEn}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "آخر طيران" : "Last Flight"}
                  </p>
                  <p className="font-semibold text-xs">{pigeon.lastFlight}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  {language === "ar" ? "مستوى اللياقة" : "Fitness Level"}
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={pigeon.fitness} className="flex-1" />
                  <span className="text-sm font-semibold">
                    {pigeon.fitness}%
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  {language === "ar"
                    ? "ساعات التدريب الكلية"
                    : "Total Training Hours"}
                </p>
                <p className="font-semibold">
                  {pigeon.trainingHours} {language === "ar" ? "ساعة" : "hours"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  return (
    <OnboardingGuard>
      {currentPage === "routes" && renderRoutes()}
      {currentPage === "sessions" && renderSessions()}
      {currentPage === "condition" && renderCondition()}
    </OnboardingGuard>
  );
}
