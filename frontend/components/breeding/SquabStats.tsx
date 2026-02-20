
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface SquabStatsProps {
    squabs: any[];
}

export function SquabStats({ squabs }: SquabStatsProps) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="rounded-3xl">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{squabs.length}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("totalSquabs")}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className="rounded-3xl">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                            {squabs.filter((s: any) => s.status === "healthy").length}
                        </p>
                        <p className="text-sm text-muted-foreground">{t("healthy")}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="rounded-3xl">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-muted-foreground">
                            {t("weanedThisMonth")}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className="rounded-3xl">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">0</p>
                        <p className="text-sm text-muted-foreground">
                            {t("transferred")}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
