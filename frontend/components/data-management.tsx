"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import {
  Download,
  Upload,
  Shield,
  FileJson,
  FileText,
  Database,
} from "lucide-react";

export function DataManagement() {
  const { t } = useLanguage();
  const [lastBackup, setLastBackup] = useState("منذ 2 ساعة");
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = (format: "pdf" | "csv" | "json") => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleBackup = () => {
    setLastBackup("الآن");
    setTimeout(() => setLastBackup("منذ لحظات"), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-4">إدارة البيانات</h3>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تصدير البيانات
          </CardTitle>
          <CardDescription>تنزيل بيانات حمامك بصيغ مختلفة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl bg-transparent"
              onClick={() => handleExport("pdf")}
            >
              <FileText className="h-4 w-4" />
              تصدير PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl bg-transparent"
              onClick={() => handleExport("csv")}
            >
              <Database className="h-4 w-4" />
              تصدير CSV
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl bg-transparent"
              onClick={() => handleExport("json")}
            >
              <FileJson className="h-4 w-4" />
              تصدير JSON
            </Button>
          </div>
          {exportProgress > 0 && exportProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            استيراد البيانات
          </CardTitle>
          <CardDescription>استيراد بيانات من ملف</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-xl p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm mb-3">اسحب الملف هنا أو انقر للاختيار</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg bg-transparent"
            >
              اختر ملف
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            النسخة الاحتياطية
          </CardTitle>
          <CardDescription>حماية بيانات حمامك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
            <div>
              <p className="font-medium">آخر نسخة احتياطية</p>
              <p className="text-sm text-muted-foreground">{lastBackup}</p>
            </div>
            <Badge className="rounded-lg">مفعلة</Badge>
          </div>
          <Button className="w-full gap-2 rounded-xl" onClick={handleBackup}>
            <Shield className="h-4 w-4" />
            إنشاء نسخة احتياطية الآن
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            يتم إنشاء نسخ احتياطية تلقائية يومياً
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
