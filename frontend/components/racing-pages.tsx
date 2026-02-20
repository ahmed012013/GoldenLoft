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
  Trophy,
  TrendingUp,
  Award,
  Zap,
  MapPin,
  Clock,
  Medal,
  Target,
  DollarSign,
  Users,
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

interface RacingPagesProps {
  currentPage: "results" | "stats" | "calendar" | null;
  onBack: () => void;
}

// Sample race results data
const sampleRaceResults = [
  {
    id: "RR001",
    date: "2024-01-15",
    raceName: "سباق الإسكندرية",
    raceNameEn: "Alexandria Race",
    distance: "50 km",
    location: "الإسكندرية",
    locationEn: "Alexandria",
    totalParticipants: 45,
    pigeonName: "الصقر الذهبي",
    pigeonNameEn: "Golden Falcon",
    position: 1,
    time: "00:45:32",
    speed: "65.2 km/h",
    prize: "500 جنيه",
    prizeEn: "$50",
    status: "winner",
  },
  {
    id: "RR002",
    date: "2024-01-10",
    raceName: "سباق الشرقية",
    raceNameEn: "Sharkia Race",
    distance: "75 km",
    location: "الشرقية",
    locationEn: "Sharkia",
    totalParticipants: 32,
    pigeonName: "النجمة الفضية",
    pigeonNameEn: "Silver Star",
    position: 3,
    time: "01:08:15",
    speed: "66.8 km/h",
    prize: "200 جنيه",
    prizeEn: "$20",
    status: "placed",
  },
  {
    id: "RR003",
    date: "2024-01-05",
    raceName: "السباق الكبير",
    raceNameEn: "Grand Race",
    distance: "100 km",
    location: "القاهرة - الإسكندرية",
    locationEn: "Cairo - Alexandria",
    totalParticipants: 78,
    pigeonName: "البرق الأسود",
    pigeonNameEn: "Black Lightning",
    position: 2,
    time: "01:32:48",
    speed: "65.1 km/h",
    prize: "300 جنيه",
    prizeEn: "$30",
    status: "placed",
  },
];

// Sample performance statistics
const samplePerformanceStats = [
  {
    id: "P001",
    name: "الصقر الذهبي",
    nameEn: "Golden Falcon",
    totalRaces: 12,
    wins: 5,
    placings: 3,
    totalEarnings: "2,500 جنيه",
    totalEarningsEn: "$250",
    avgSpeed: "65.2 km/h",
    winRate: "41.7%",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "P002",
    name: "النجمة الفضية",
    nameEn: "Silver Star",
    totalRaces: 8,
    wins: 1,
    placings: 4,
    totalEarnings: "800 جنيه",
    totalEarningsEn: "$80",
    avgSpeed: "64.1 km/h",
    winRate: "12.5%",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "P003",
    name: "البرق الأسود",
    nameEn: "Black Lightning",
    totalRaces: 15,
    wins: 7,
    placings: 5,
    totalEarnings: "3,800 جنيه",
    totalEarningsEn: "$380",
    avgSpeed: "66.5 km/h",
    winRate: "46.7%",
    image: "/placeholder.svg?height=80&width=80",
  },
];

// Sample racing calendar
const sampleRaceCalendar = [
  {
    id: "RC001",
    date: "2024-02-01",
    raceName: "سباق فبراير الأول",
    raceNameEn: "February First Race",
    distance: "60 km",
    status: "upcoming",
    location: "الإسكندرية",
    locationEn: "Alexandria",
    registeredPigeons: 8,
  },
  {
    id: "RC002",
    date: "2024-02-10",
    raceName: "السباق الكبير",
    raceNameEn: "Grand Championship",
    distance: "120 km",
    status: "upcoming",
    location: "القاهرة",
    locationEn: "Cairo",
    registeredPigeons: 12,
  },
  {
    id: "RC003",
    date: "2024-01-25",
    raceName: "سباق الدرجة الأولى",
    raceNameEn: "First Class Race",
    distance: "80 km",
    status: "completed",
    location: "الجيزة",
    locationEn: "Giza",
    registeredPigeons: 15,
  },
];

export function RacingPages({ currentPage, onBack }: RacingPagesProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState<
    (typeof sampleRaceResults)[0] | null
  >(null);

  const filteredResults = sampleRaceResults.filter(
    (result) =>
      result.raceName.includes(searchTerm) ||
      result.raceNameEn.includes(searchTerm),
  );

  const filteredStats = samplePerformanceStats.filter(
    (stat) =>
      stat.name.includes(searchTerm) || stat.nameEn.includes(searchTerm),
  );

  const filteredCalendar = sampleRaceCalendar.filter(
    (race) =>
      race.raceName.includes(searchTerm) ||
      race.raceNameEn.includes(searchTerm),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "winner":
        return "bg-yellow-100 text-yellow-800";
      case "placed":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (currentPage === "results") {
    return (
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {language === "ar" ? "إضافة نتيجة" : "Add Result"}
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={
                language === "ar" ? "ابحث عن سباق..." : "Search races..."
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
          {filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      {language === "ar" ? result.raceName : result.raceNameEn}
                    </CardTitle>
                    <CardDescription>
                      {language === "ar" ? result.location : result.locationEn}{" "}
                      • {result.date}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status === "winner"
                      ? language === "ar"
                        ? "الفائز"
                        : "Winner"
                      : language === "ar"
                        ? "موضع"
                        : "Placed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "اسم الطير" : "Pigeon Name"}
                    </p>
                    <p className="font-semibold">
                      {language === "ar"
                        ? result.pigeonName
                        : result.pigeonNameEn}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "الترتيب" : "Position"}
                    </p>
                    <p className="font-semibold text-lg text-yellow-600">
                      #{result.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "الوقت" : "Time"}
                    </p>
                    <p className="font-semibold">{result.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "المسافة" : "Distance"}
                    </p>
                    <p className="font-semibold">{result.distance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "السرعة" : "Speed"}
                    </p>
                    <p className="font-semibold">{result.speed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === "ar" ? "المشاركون" : "Participants"}
                    </p>
                    <p className="font-semibold">{result.totalParticipants}</p>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-gray-500">
                    {language === "ar" ? "المكافأة" : "Prize"}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {language === "ar" ? result.prize : result.prizeEn}
                  </p>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  if (currentPage === "stats") {
    return (
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
          {filteredStats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={stat.image || "/placeholder.svg"} />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {language === "ar" ? stat.name : stat.nameEn}
                      </CardTitle>
                      <CardDescription>{stat.id}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      {language === "ar" ? "إجمالي السباقات" : "Total Races"}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stat.totalRaces}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      {language === "ar" ? "الانتصارات" : "Wins"}
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stat.wins}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      {language === "ar" ? "المواضع" : "Placings"}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stat.placings}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      {language === "ar" ? "السرعة المتوسطة" : "Avg Speed"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {stat.avgSpeed}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        {language === "ar" ? "نسبة الفوز" : "Win Rate"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === "ar"
                          ? "نسبة الانتصار"
                          : "Victory Percentage"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-600">
                        {stat.winRate}
                      </p>
                    </div>
                  </div>
                  <Progress value={parseFloat(stat.winRate)} className="h-2" />
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                  <p className="text-xs text-gray-600">
                    {language === "ar" ? "إجمالي الجوائز" : "Total Earnings"}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {language === "ar"
                      ? stat.totalEarnings
                      : stat.totalEarningsEn}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  if (currentPage === "calendar") {
    return (
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {language === "ar" ? "إضافة سباق" : "Add Race"}
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={
                language === "ar" ? "ابحث عن سباق..." : "Search races..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              {language === "ar" ? "القادمة" : "Upcoming"}
            </TabsTrigger>
            <TabsTrigger value="completed">
              {language === "ar" ? "المكتملة" : "Completed"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {filteredCalendar
              .filter((race) => race.status === "upcoming")
              .map((race) => (
                <Card
                  key={race.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-500" />
                          {language === "ar" ? race.raceName : race.raceNameEn}
                        </CardTitle>
                        <CardDescription>
                          {language === "ar" ? race.location : race.locationEn}{" "}
                          • {race.date}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {language === "ar" ? "قادمة" : "Upcoming"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === "ar" ? "المسافة" : "Distance"}
                        </p>
                        <p className="font-semibold">{race.distance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === "ar" ? "الطيور المسجلة" : "Registered"}
                        </p>
                        <p className="font-semibold">
                          {race.registeredPigeons}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === "ar" ? "الحالة" : "Status"}
                        </p>
                        <p className="font-semibold">
                          {language === "ar" ? "قريب جداً" : "Very Soon"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-2 flex-1">
                        <Plus className="h-4 w-4" />
                        {language === "ar" ? "تسجيل طير" : "Register Pigeon"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                        {language === "ar" ? "عرض" : "View"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {filteredCalendar
              .filter((race) => race.status === "completed")
              .map((race) => (
                <Card key={race.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-gray-400" />
                          {language === "ar" ? race.raceName : race.raceNameEn}
                        </CardTitle>
                        <CardDescription>
                          {language === "ar" ? race.location : race.locationEn}{" "}
                          • {race.date}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">
                        {language === "ar" ? "مكتملة" : "Completed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === "ar" ? "المسافة" : "Distance"}
                        </p>
                        <p className="font-semibold">{race.distance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === "ar" ? "المشاركة" : "Participated"}
                        </p>
                        <p className="font-semibold">
                          {race.registeredPigeons}
                        </p>
                      </div>
                      <div>
                        <Button size="sm" variant="outline">
                          {language === "ar" ? "النتائج" : "Results"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  }

  return null;
}
