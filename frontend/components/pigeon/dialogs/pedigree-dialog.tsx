import { Bird as BirdIcon, Trophy, Activity } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Bird } from "@shared/interfaces/bird.interface";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface PedigreeDialogProps {
  bird: Bird | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PedigreeDialog({
  bird,
  open,
  onOpenChange,
}: PedigreeDialogProps) {
  const { t, language } = useLanguage();

  if (!bird) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{t("pedigreeTitle")}</DialogTitle>
          <DialogDescription>
            {language === "ar" ? bird.name : (bird as any).nameEn} -{" "}
            {bird.ringNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl">
              <TabsTrigger value="info" className="rounded-xl">
                {t("viewDetails")}
              </TabsTrigger>
              <TabsTrigger value="pedigree" className="rounded-xl">
                {t("pedigree")}
              </TabsTrigger>
              <TabsTrigger value="racing" className="rounded-xl">
                {t("racingRecord")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4 space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="h-40 w-40 relative rounded-3xl overflow-hidden border-2 border-primary/20 bg-muted shadow-inner">
                  <Image
                    src={
                      bird.image && bird.image.startsWith("/")
                        ? `${API_URL}${bird.image}`
                        : bird.image || "/placeholder.svg"
                    }
                    alt={bird.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    {t("ringNumber")}
                  </Label>
                  <p className="font-medium">{bird.ringNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    {t("pigeonName")}
                  </Label>
                  <p className="font-medium">{bird.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("gender")}</Label>
                  <p className="font-medium">
                    {bird.gender === "male" ? t("male") : t("female")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("color")}</Label>
                  <p className="font-medium">{bird.color}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("breed")}</Label>
                  <p className="font-medium">{bird.type || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    {t("birthDate")}
                  </Label>
                  <p className="font-medium">
                    {bird.birthDate
                      ? new Date(bird.birthDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("weight")}</Label>
                  <p className="font-medium">{bird.weight}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("loft")}</Label>
                  <p className="font-medium">{bird.loft?.name || "-"}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pedigree" className="mt-4">
              <div className="flex flex-col items-center gap-4">
                {/* Current Pigeon */}
                <Card className="rounded-2xl border-2 border-primary w-48 overflow-hidden">
                  <div className="h-24 w-full relative bg-muted border-b">
                    <Image
                      src={
                        bird.image && bird.image.startsWith("/")
                          ? `${API_URL}${bird.image}`
                          : bird.image || "/placeholder.svg"
                      }
                      alt={bird.name}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <p className="font-semibold text-sm">{bird.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {bird.ringNumber}
                    </p>
                  </CardContent>
                </Card>
                {/* Parents */}
                <div className="flex items-center gap-8">
                  <Card className="rounded-2xl w-40">
                    <CardContent className="p-3 text-center">
                      <BirdIcon className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                      <p className="font-medium text-sm">{t("father")}</p>
                      <p className="text-xs text-muted-foreground">
                        {bird.father?.name || "-"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl w-40">
                    <CardContent className="p-3 text-center">
                      <BirdIcon className="h-6 w-6 mx-auto text-pink-500 mb-2" />
                      <p className="font-medium text-sm">{t("mother")}</p>
                      <p className="text-xs text-muted-foreground">
                        {bird.mother?.name || "-"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="racing" className="mt-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <p className="text-2xl font-bold">
                      {(bird as any).races || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("totalRaces")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">
                      {(bird as any).wins || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("wins")}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">
                      {Math.round(
                        (((bird as any).wins || 0) /
                          ((bird as any).races || 1)) *
                        100,
                      )}
                      %
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("topFinishes")}
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                    <p className="text-2xl font-bold">85</p>
                    <p className="text-sm text-muted-foreground">
                      {t("avgSpeed")} km/h
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
