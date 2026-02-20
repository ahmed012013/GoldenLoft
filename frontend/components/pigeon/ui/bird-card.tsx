import { memo } from "react";
import { Bird, Trophy, Activity, Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Bird as BirdInterface } from "@shared/interfaces/bird.interface";
import { getStatusColor, getStatusText } from "../utils/bird-utils";

interface BirdCardProps {
  pigeon: BirdInterface;
  onView: (pigeon: BirdInterface) => void;
  onEdit: (pigeon: BirdInterface) => void;
  onDelete: (id: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const BirdCard = memo(function BirdCard({
  pigeon,
  onView,
  onEdit,
  onDelete,
}: BirdCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden rounded-3xl hover:border-primary/50 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="h-20 w-20 relative shrink-0 overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={
                pigeon.image && pigeon.image.startsWith("/")
                  ? `${API_URL}${pigeon.image}`
                  : pigeon.image || "/placeholder.svg"
              }
              alt={pigeon.name}
              fill
              className="object-cover"
              sizes="80px"
              loading="lazy"
              unoptimized={pigeon.image?.includes("placehold.co")}
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{pigeon.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {pigeon.ringNumber}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("rounded-xl", getStatusColor(pigeon.status))}
              >
                {getStatusText(pigeon.status, t)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{pigeon.gender === "male" ? t("male") : t("female")}</span>
              <span>•</span>
              <span>{pigeon.color}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{pigeon.loft?.name || t("unknownLoft")}</span>
            </div>
          </div>
        </div>
        <div className="border-t bg-muted/30 p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>
                  {pigeon.totalRaces} {t("totalRaces")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-green-500" />
                <span>
                  {pigeon.wins} {t("wins")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => onView(pigeon)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-green-500 hover:text-green-600 hover:bg-green-50"
                onClick={() => onEdit(pigeon)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(pigeon.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
