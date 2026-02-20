import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { BackendEgg } from "./types";
import { EggStatus } from "@/lib/breeding-api";

interface EggStatsProps {
  eggs: BackendEgg[];
}

export function EggStats({ eggs }: EggStatsProps) {
  const { t } = useLanguage();

  const fertileCount = eggs.filter((e) => e.status === EggStatus.LAID).length;
  const hatchedCount = eggs.filter((e) => e.status === EggStatus.HATCHED).length;
  const infertileCount = eggs.filter((e) => e.status === EggStatus.INFERTILE)
    .length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{eggs.length}</p>
            <p className="text-sm text-muted-foreground">{t("totalEggs")}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{fertileCount}</p>
            <p className="text-sm text-muted-foreground">{t("fertileEggs")}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{hatchedCount}</p>
            <p className="text-sm text-muted-foreground">{t("hatchedEggs")}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {infertileCount}
            </p>
            <p className="text-sm text-muted-foreground">{t("infertile")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
