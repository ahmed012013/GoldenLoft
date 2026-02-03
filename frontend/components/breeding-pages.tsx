"use client";

import { useState } from "react";
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
import { useLanguage } from "@/lib/language-context";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Heart,
  EggIcon,
  Bird,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Pairing {
  id: string;
  male: string;
  female: string;
  pairingDate: string;
  nestBox: string;
  status: "active" | "completed" | "separated" | "failed";
  expectedEggs: number;
  actualEggs: number;
  notes: string;
}

interface Egg {
  id: string;
  pairId: string;
  layingDate: string;
  expectedHatchDate: string;
  actualHatchDate: string;
  status: "fertile" | "infertile" | "hatched" | "broken" | "abandoned";
  candlingDate: string;
  candlingResult: string;
}

interface Squab {
  id: string;
  pairId: string;
  hatchDate: string;
  status: "healthy" | "weak" | "growing" | "weaned" | "transferred";
  weight: string;
  feedingStatus: "parentFeeding" | "handFeeding";
  weaningDate: string;
  daysOld: number;
}

export function BreedingPages({
  currentPage,
  onBack,
}: {
  currentPage: "pairings" | "eggs" | "squabs";
  onBack: () => void;
}) {
  const { t, dir } = useLanguage();
  const [pairings, setPairings] = useState<Pairing[]>([
    {
      id: "1",
      male: "Red Ring 2023-001",
      female: "Blue Ring 2023-002",
      pairingDate: "2024-01-15",
      nestBox: "Box 1",
      status: "active",
      expectedEggs: 2,
      actualEggs: 2,
      notes: "زوج جيد متوافق",
    },
  ]);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [squabs, setSquabs] = useState<Squab[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "healthy":
      case "growing":
      case "fertile":
      case "hatched":
        return "bg-green-100 text-green-800";
      case "completed":
      case "weaned":
      case "parentFeeding":
        return "bg-blue-100 text-blue-800";
      case "separated":
      case "weak":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "infertile":
      case "broken":
      case "abandoned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDaysToHatch = (layingDate: string) => {
    const laying = new Date(layingDate);
    const hatching = new Date(laying.getTime() + 18 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil(
      (hatching.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
    );
    return daysLeft > 0 ? daysLeft : 0;
  };

  const renderPairings = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {pairings.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("totalPairings")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {pairings.filter((p) => p.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("activePairings")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {pairings.reduce((sum, p) => sum + p.actualEggs, 0)}
              </p>
              <p className="text-sm text-muted-foreground">{t("totalEggs")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(
                  (pairings.reduce((sum, p) => sum + p.actualEggs, 0) /
                    Math.max(
                      pairings.reduce((sum, p) => sum + p.expectedEggs, 0),
                      1,
                    )) *
                    100,
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">{t("hatchRate")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addPairing")}
        </Button>
      </div>

      {/* Pairings List */}
      <div className="grid gap-4">
        {pairings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">{t("noPairings")}</p>
              <p className="text-sm text-muted-foreground/70">
                {t("createFirstPairing")}
              </p>
            </CardContent>
          </Card>
        ) : (
          pairings.map((pair) => (
            <Card key={pair.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(pair.status)}>
                          {t(
                            `pairing${pair.status.charAt(0).toUpperCase() + pair.status.slice(1)}` as any,
                          )}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("malePigeon")}
                          </p>
                          <p className="font-medium">{pair.male}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("femalePigeon")}
                          </p>
                          <p className="font-medium">{pair.female}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("pairingDate")}
                          </p>
                          <p className="font-medium">{pair.pairingDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("nestBox")}
                          </p>
                          <p className="font-medium">{pair.nestBox}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("expectedEggs")}
                          </p>
                          <p className="font-medium">{pair.expectedEggs}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("actualEggs")}
                          </p>
                          <p className="font-medium">{pair.actualEggs}</p>
                        </div>
                      </div>
                      {pair.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("breedingNotes")}
                          </p>
                          <p className="font-medium">{pair.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(pair.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setPairings(pairings.filter((p) => p.id !== pair.id))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderEggs = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{eggs.length}</p>
              <p className="text-sm text-muted-foreground">{t("totalEggs")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {eggs.filter((e) => e.status === "fertile").length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("fertileEggs")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {eggs.filter((e) => e.status === "hatched").length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("hatchedEggs")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {eggs.filter((e) => e.status === "infertile").length}
              </p>
              <p className="text-sm text-muted-foreground">{t("infertile")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addEgg")}
        </Button>
      </div>

      {/* Eggs List */}
      <div className="grid gap-4">
        {eggs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <EggIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">{t("noEggs")}</p>
              <p className="text-sm text-muted-foreground/70">
                {t("addFirstEgg")}
              </p>
            </CardContent>
          </Card>
        ) : (
          eggs.map((egg) => (
            <Card key={egg.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(egg.status)}>
                        {t(
                          `egg${egg.status.charAt(0).toUpperCase() + egg.status.slice(1)}` as any,
                        )}
                      </Badge>
                      <span className="text-sm font-medium">
                        {t("daysToHatch")}:{" "}
                        {calculateDaysToHatch(egg.layingDate)}{" "}
                        {t("days" as any)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("eggId")}
                        </p>
                        <p className="font-medium">{egg.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("layingDate")}
                        </p>
                        <p className="font-medium">{egg.layingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("expectedHatchDate")}
                        </p>
                        <p className="font-medium">{egg.expectedHatchDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("incubationDay")}
                        </p>
                        <p className="font-medium">
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(egg.layingDate).getTime()) /
                              (24 * 60 * 60 * 1000),
                          )}{" "}
                          / 18
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setEggs(eggs.filter((e) => e.id !== egg.id))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderSquabs = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{squabs.length}</p>
              <p className="text-sm text-muted-foreground">
                {t("totalSquabs")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {squabs.filter((s) => s.status === "healthy").length}
              </p>
              <p className="text-sm text-muted-foreground">{t("healthy")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {squabs.filter((s) => s.status === "weaned").length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("weanedThisMonth")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {squabs.filter((s) => s.status === "transferred").length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("transferred")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addSquab")}
        </Button>
      </div>

      {/* Squabs List */}
      <div className="grid gap-4">
        {squabs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Bird className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">{t("noSquabs")}</p>
              <p className="text-sm text-muted-foreground/70">
                {t("addFirstSquab")}
              </p>
            </CardContent>
          </Card>
        ) : (
          squabs.map((squab) => (
            <Card key={squab.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(squab.status)}>
                        {t(
                          `squab${squab.status.charAt(0).toUpperCase() + squab.status.slice(1)}` as any,
                        )}
                      </Badge>
                      <span className="text-sm font-medium">
                        {squab.daysOld} {t("daysOld")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("squabId")}
                        </p>
                        <p className="font-medium">{squab.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("hatchDate")}
                        </p>
                        <p className="font-medium">{squab.hatchDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("squabWeight")}
                        </p>
                        <p className="font-medium">{squab.weight} g</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("feedingStatus")}
                        </p>
                        <p className="font-medium">
                          {t(`${squab.feedingStatus}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setSquabs(squabs.filter((s) => s.id !== squab.id))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1
            className={cn("text-2xl font-bold", dir === "rtl" && "text-right")}
          >
            {currentPage === "pairings" && t("pairingsTitle")}
            {currentPage === "eggs" && t("eggsTitle")}
            {currentPage === "squabs" && t("youngPigeonsTitle")}
          </h1>
        </div>
      </div>

      {/* Content */}
      {currentPage === "pairings" && renderPairings()}
      {currentPage === "eggs" && renderEggs()}
      {currentPage === "squabs" && renderSquabs()}
    </div>
  );
}
