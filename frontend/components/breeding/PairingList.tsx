import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Edit2, Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BackendPairing } from "./types";

interface PairingListProps {
  pairings: BackendPairing[];
  onEdit: (pairing: BackendPairing) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: "ACTIVE" | "FINISHED") => void;
  isDeleting: boolean;
}

export function PairingList({
  pairings,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
}: PairingListProps) {
  const { t, language } = useLanguage();

  if (pairings.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="pt-6 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground">{t("noPairings")}</p>
          <p className="text-sm text-muted-foreground/70">
            {t("createFirstPairing")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {pairings.map((pair) => (
        <Card key={pair.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`rounded-2xl ${pair.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                        }`}
                      onClick={() =>
                        onStatusChange(
                          pair.id,
                          pair.status === "ACTIVE" ? "FINISHED" : "ACTIVE",
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {pair.status === "ACTIVE"
                        ? t("pairingActive")
                        : t("pairingCompleted")}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("malePigeon")}
                      </p>
                      <p className="font-medium">
                        {pair.male?.name} ({pair.male?.ringNumber})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("femalePigeon")}
                      </p>
                      <p className="font-medium">
                        {pair.female?.name} ({pair.female?.ringNumber})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("pairingDate")}
                      </p>
                      <p className="font-medium">
                        {new Date(pair.startDate).toLocaleDateString(language)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("nestBox")}
                      </p>
                      <p className="font-medium">{pair.nestBox || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("totalEggs")}
                      </p>
                      <p className="font-medium">{pair.eggs?.length || 0}</p>
                    </div>
                  </div>
                  {pair.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("breedingNotes")}
                      </p>
                      <p className="font-medium">{pair.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(pair)}
                    className="rounded-2xl"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(pair.id)}
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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
