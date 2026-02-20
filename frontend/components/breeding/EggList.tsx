import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EggIcon, Edit2, Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BackendEgg } from "./types";

interface EggListProps {
  eggs: BackendEgg[];
  onEdit: (egg: BackendEgg) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: BackendEgg["status"]) => void;
  isDeleting: boolean;
}

export function EggList({
  eggs,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
}: EggListProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LAID":
        return "bg-yellow-100 text-yellow-800";
      case "HATCHED":
        return "bg-green-100 text-green-800";
      case "INFERTILE":
        return "bg-red-100 text-red-800";
      case "BROKEN":
        return "bg-orange-100 text-orange-800";
      case "DEAD_IN_SHELL":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "LAID":
        return t("eggLaid");
      case "HATCHED":
        return t("eggHatched");
      case "INFERTILE":
        return t("infertile");
      case "BROKEN":
        return t("eggBroken");
      case "DEAD_IN_SHELL":
        return t("eggDeadInShell");
      default:
        return status;
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

  const calculateIncubationDay = (layingDate: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(layingDate).getTime()) /
        (24 * 60 * 60 * 1000),
    );
    return Math.max(0, days);
  };

  if (eggs.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="pt-6 text-center">
          <EggIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">{t("noEggs")}</p>
          <p className="text-sm text-muted-foreground/70">{t("addFirstEgg")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {eggs.map((egg) => (
        <Card key={egg.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={`${getStatusColor(egg.status)} rounded-2xl`}
                  >
                    {getStatusLabel(egg.status)}
                  </Badge>
                  {egg.status === "LAID" && (
                    <span className="text-sm font-medium">
                      {t("daysToHatch")}: {calculateDaysToHatch(egg.layDate)}{" "}
                      {t("days")}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("pairing")}
                    </p>
                    <p className="font-medium">
                      {egg.pairing?.male?.name} × {egg.pairing?.female?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("layingDate")}
                    </p>
                    <p className="font-medium">
                      {new Date(egg.layDate).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("expectedHatchDate")}
                    </p>
                    <p className="font-medium">
                      {egg.hatchDateExpected
                        ? new Date(egg.hatchDateExpected).toLocaleDateString(
                            "ar-EG",
                          )
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("incubationDay")}
                    </p>
                    <p className="font-medium">
                      {calculateIncubationDay(egg.layDate)} / 18
                    </p>
                  </div>
                  {egg.candlingDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("candlingDate")}
                      </p>
                      <p className="font-medium">
                        {new Date(egg.candlingDate).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  )}
                  {egg.candlingResult && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("candlingResult")}
                      </p>
                      <p className="font-medium">
                        {t(egg.candlingResult as any) || egg.candlingResult}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(egg)}
                    className="rounded-2xl"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(egg.id)}
                    disabled={isDeleting}
                    className="rounded-2xl"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {/* Quick status buttons */}
                {egg.status === "LAID" && (
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-2xl"
                      onClick={() => onStatusChange(egg.id, "HATCHED")}
                    >
                      🐣 {t("hatched")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-2xl"
                      onClick={() => onStatusChange(egg.id, "INFERTILE")}
                    >
                      ✕ {t("infertile")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
