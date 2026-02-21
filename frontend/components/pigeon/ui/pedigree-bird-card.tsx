import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { Bird } from "@shared/interfaces/bird.interface";

interface PedigreeBirdCardProps {
  pigeon: Bird;
  onClick: (pigeon: Bird) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function PedigreeBirdCard({ pigeon, onClick }: PedigreeBirdCardProps) {
  const { t, language } = useLanguage();

  return (
    <Card
      className="rounded-3xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={() => onClick(pigeon)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">
              {language === "ar"
                ? pigeon.name
                : (pigeon as any).nameEn || pigeon.name}
            </h3>
            <p className="text-sm text-muted-foreground">{pigeon.ringNumber}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>
                {t("father")}: {pigeon.father?.name || "-"}
                {pigeon.father?.ringNumber && ` (${pigeon.father.ringNumber})`}
              </span>
              <span>•</span>
              <span>
                {t("mother")}: {pigeon.mother?.name || "-"}
                {pigeon.mother?.ringNumber && ` (${pigeon.mother.ringNumber})`}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl bg-transparent"
          >
            {t("viewPedigree")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
