import { TranslationKey } from "../../lib/translations";
import { Bird } from "@shared/interfaces/bird.interface";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bird as BirdIcon } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { getSquabStatusColor } from "./utils";

interface SquabListProps {
  squabs: Bird[];
}

export function SquabList({ squabs }: SquabListProps) {
  const { t, language } = useLanguage();

  if (squabs.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="pt-6 text-center">
          <BirdIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">{t("noSquabs")}</p>
          <p className="text-sm text-muted-foreground/70">
            {t("addFirstSquab")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {squabs.map((squab) => (
        <Card key={squab.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getSquabStatusColor(squab.status as any)} rounded-2xl`}
                  >
                    {t(squab.status as TranslationKey) || squab.status}
                  </Badge>
                  {squab.birthDate && (
                    <span className="text-sm font-medium">
                      {calculateAge(squab.birthDate, t, language)}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("ringNumber")}
                    </p>
                    <p className="font-medium">{squab.ringNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("name")}</p>
                    <p className="font-medium">{squab.name}</p>
                  </div>
                  {squab.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("squabWeight")}
                      </p>
                      <p className="font-medium">{squab.weight} g</p>
                    </div>
                  )}
                  {squab.birthDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("hatchDate")}
                      </p>
                      <p className="font-medium">
                        {new Date(squab.birthDate).toLocaleDateString(
                          language === "ar" ? "ar-EG" : "en-US",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
