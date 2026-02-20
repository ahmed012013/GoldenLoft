import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bird } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface SquabListProps {
  squabs: any[];
}

export function SquabList({ squabs }: SquabListProps) {
  const { t, language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "sick":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (squabs.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="pt-6 text-center">
          <Bird className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
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
      {squabs.map((squab: any) => (
        <Card key={squab.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getStatusColor(squab.status)} rounded-2xl`}
                  >
                    {t(squab.status as any) || squab.status}
                  </Badge>
                  {squab.birthDate && (
                    <span className="text-sm font-medium">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(squab.birthDate).getTime()) /
                          (24 * 60 * 60 * 1000),
                      )}{" "}
                      {t("daysOld")}
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
