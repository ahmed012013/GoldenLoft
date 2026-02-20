import { ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/language-context";

interface TaskStatsProps {
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  progressPercent: number;
}

export function TaskStats({
  totalCount,
  pendingCount,
  completedCount,
  progressPercent,
}: TaskStatsProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {t("todayTasksTitle" as any)}
              </h2>
              <p className="text-white/80">
                {completedCount} {language === "ar" ? "من" : "of"} {totalCount}{" "}
                {t("completedTasks" as any)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold">{progressPercent}%</p>
                <p className="text-sm text-white/80">{t("completed" as any)}</p>
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="mt-4 h-3 bg-white/20" />
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("totalTasks" as any)}
                </p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("pendingTasks" as any)}
                </p>
                <p className="text-2xl font-bold text-amber-500">
                  {pendingCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("completedToday" as any)}
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {completedCount}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("overdueTasks" as any)}
                </p>
                <p className="text-2xl font-bold text-red-500">0</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
