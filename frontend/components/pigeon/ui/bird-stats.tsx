import { Bird as BirdIcon, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { Bird } from "@shared/interfaces/bird.interface";
import { BirdGender, BirdStatus } from "@shared/enums/bird.enums";

interface BirdStatsProps {
  birds: Bird[];
}

export function BirdStats({ birds }: BirdStatsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("totalPigeons")}
              </p>
              <p className="text-2xl font-bold">{birds.length}</p>
            </div>
            <BirdIcon className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("healthyPigeons")}
              </p>
              <p className="text-2xl font-bold text-green-500">
                {birds.filter((p) => p.status === BirdStatus.HEALTHY).length}
              </p>
            </div>
            <Heart className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("male")}</p>
              <p className="text-2xl font-bold text-blue-500">
                {birds.filter((p) => p.gender === BirdGender.MALE).length}
              </p>
            </div>
            <BirdIcon className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("female")}</p>
              <p className="text-2xl font-bold text-pink-500">
                {birds.filter((p) => p.gender === BirdGender.FEMALE).length}
              </p>
            </div>
            <BirdIcon className="h-8 w-8 text-pink-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
