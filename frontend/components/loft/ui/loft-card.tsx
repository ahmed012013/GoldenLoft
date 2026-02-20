import { motion } from "framer-motion";
import {
  Warehouse,
  MapPin,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Bird,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface LoftCardProps {
  loft: any;
  onView: (loft: any) => void;
  onEdit: (loft: any) => void;
  onDelete: (id: string) => void;
}

export function LoftCard({ loft, onView, onEdit, onDelete }: LoftCardProps) {
  const { t, dir, language } = useLanguage();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "racing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "breeding":
        return "bg-pink-500/10 text-pink-500 border-pink-500/30";
      case "young":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "quarantine":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "racing":
        return t("racing");
      case "breeding":
        return t("breeding");
      case "young":
        return t("young");
      case "quarantine":
        return t("quarantine");
      default:
        return type || (language === "ar" ? "عام" : "General");
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
      <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Warehouse className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{loft.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {loft.location || t("noLocation")}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                <DropdownMenuItem onClick={() => onView(loft)}>
                  <Eye
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("viewDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(loft)}>
                  <Edit
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("editLoft")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => onDelete(loft.id)}
                >
                  <Trash2
                    className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                  />
                  {t("deleteLoft")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn("rounded-xl", getTypeColor("racing"))}
            >
              {getTypeLabel("racing")}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "rounded-xl",
                "bg-green-500/10 text-green-500 border-green-500/30",
              )}
            >
              {t("active")}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("occupancy") ||
                  (language === "ar" ? "الإشغال" : "Occupancy")}
              </span>
              <span className="font-medium">
                {loft._count?.birds || 0} / {loft.capacity || 50}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.min(
                    ((loft._count?.birds || 0) / (loft.capacity || 50)) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-2">
              <Bird className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">
                  {t("pigeons")}
                </span>
                <span className="text-sm font-bold">
                  {loft._count?.birds || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-2">
              <Warehouse className="h-4 w-4 text-amber-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">
                  {t("capacity") || (language === "ar" ? "السعة" : "Capacity")}
                </span>
                <span className="text-sm font-bold">{loft.capacity || 50}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
