import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface PairingStatsProps {
  stats:
    | {
        totalPairings: number;
        activePairings: number;
        totalEggs: number;
        hatchRate: number;
      }
    | undefined;
}

export function PairingStats({ stats }: PairingStatsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">
              {stats?.totalPairings || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("totalPairings")}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats?.activePairings || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("activePairings")}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.totalEggs || 0}
            </p>
            <p className="text-sm text-muted-foreground">{t("totalEggs")}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {stats?.hatchRate || 0}%
            </p>
            <p className="text-sm text-muted-foreground">{t("hatchRate")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
