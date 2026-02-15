"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/language-context";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Heart,
  EggIcon,
  Bird,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  usePairings,
  usePairingStats,
  usePairingMutations,
  useEggs,
  useEggMutations,
} from "@/hooks/useBreeding";
import { useBirds } from "@/hooks/useBirds";
import { OnboardingGuard } from "@/components/onboarding-guard";

// ============ Types ============

interface BackendPairing {
  id: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  endDate?: string | null;
  status: "ACTIVE" | "FINISHED";
  nestBox?: string | null;
  notes?: string | null;
  male: { id: string; ringNumber: string; name: string };
  female: { id: string; ringNumber: string; name: string };
  eggs: BackendEgg[];
}

interface BackendEgg {
  id: string;
  pairingId: string;
  layDate: string;
  hatchDateExpected?: string | null;
  hatchDateActual?: string | null;
  status: "LAID" | "HATCHED" | "INFERTILE" | "BROKEN" | "DEAD_IN_SHELL";
  candlingDate?: string | null;
  candlingResult?: string | null;
  pairing?: {
    male: { ringNumber: string; name: string };
    female: { ringNumber: string; name: string };
  };
}

// ============ Main Component ============

export function BreedingPages({
  currentPage,
  onBack,
}: {
  currentPage: "pairings" | "eggs" | "squabs";
  onBack: () => void;
}) {
  const { t, dir } = useLanguage();

  return (
    <OnboardingGuard>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1
              className={cn(
                "text-2xl font-bold",
                dir === "rtl" && "text-right",
              )}
            >
              {currentPage === "pairings" && t("pairingsTitle")}
              {currentPage === "eggs" && t("eggsTitle")}
              {currentPage === "squabs" && t("youngPigeonsTitle")}
            </h1>
          </div>
        </div>

        {/* Content */}
        {currentPage === "pairings" && <PairingsTab />}
        {currentPage === "eggs" && <EggsTab />}
        {currentPage === "squabs" && <SquabsTab />}
      </div>
    </OnboardingGuard>
  );
}

// ============ Pairings Tab ============

function PairingsTab() {
  const { t } = useLanguage();
  const { data: pairings = [], isLoading } = usePairings();
  const { data: stats } = usePairingStats();
  const { createPairing, updatePairing, deletePairing } = usePairingMutations();
  const { data: birdsData } = useBirds({ limit: 200 });

  const [showForm, setShowForm] = useState(false);
  const [editingPairing, setEditingPairing] = useState<BackendPairing | null>(
    null,
  );

  // Form state
  const [formMaleId, setFormMaleId] = useState("");
  const [formFemaleId, setFormFemaleId] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formNestBox, setFormNestBox] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const birds = birdsData?.data || [];
  const maleBirds = birds.filter((b: any) => b.gender === "male");
  const femaleBirds = birds.filter((b: any) => b.gender === "female");

  const resetForm = () => {
    setFormMaleId("");
    setFormFemaleId("");
    setFormStartDate("");
    setFormNestBox("");
    setFormNotes("");
    setEditingPairing(null);
    setShowForm(false);
  };

  const openEditForm = (pairing: BackendPairing) => {
    setEditingPairing(pairing);
    setFormMaleId(pairing.maleId);
    setFormFemaleId(pairing.femaleId);
    setFormStartDate(pairing.startDate.split("T")[0]);
    setFormNestBox(pairing.nestBox || "");
    setFormNotes(pairing.notes || "");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formMaleId || !formFemaleId || !formStartDate) {
      toast.error(t("fillAllFields" as any) || "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      if (editingPairing) {
        await updatePairing.mutateAsync({
          id: editingPairing.id,
          data: {
            nestBox: formNestBox || undefined,
            notes: formNotes || undefined,
          },
        });
        toast.success(t("pairingUpdated" as any) || "تم تحديث التزاوج بنجاح");
      } else {
        await createPairing.mutateAsync({
          maleId: formMaleId,
          femaleId: formFemaleId,
          startDate: new Date(formStartDate).toISOString(),
          nestBox: formNestBox || undefined,
          notes: formNotes || undefined,
        });
        toast.success(t("pairingCreated" as any) || "تم إضافة التزاوج بنجاح");
      }
      resetForm();
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePairing.mutateAsync(id);
      toast.success(t("pairingDeleted" as any) || "تم حذف التزاوج");
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "ACTIVE" | "FINISHED",
  ) => {
    try {
      await updatePairing.mutateAsync({
        id,
        data: {
          status: newStatus,
          ...(newStatus === "FINISHED"
            ? { endDate: new Date().toISOString() }
            : {}),
        },
      });
      toast.success(t("statusUpdated" as any) || "تم تحديث الحالة");
    } catch {
      // Error handled by api-client interceptor
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
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
        <Card>
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats?.totalEggs || 0}
              </p>
              <p className="text-sm text-muted-foreground">{t("totalEggs")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
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

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addPairing")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingPairing
                  ? t("editPairing" as any) || "تعديل التزاوج"
                  : t("addPairing")}
              </h3>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("malePigeon")}</Label>
                <Select
                  value={formMaleId}
                  onValueChange={setFormMaleId}
                  disabled={!!editingPairing}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectMale" as any) || "اختر الذكر"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {maleBirds.map((bird: any) => (
                      <SelectItem key={bird.id} value={bird.id}>
                        {bird.name} ({bird.ringNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("femalePigeon")}</Label>
                <Select
                  value={formFemaleId}
                  onValueChange={setFormFemaleId}
                  disabled={!!editingPairing}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectFemale" as any) || "اختر الأنثى"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {femaleBirds.map((bird: any) => (
                      <SelectItem key={bird.id} value={bird.id}>
                        {bird.name} ({bird.ringNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("pairingDate")}</Label>
                <Input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  disabled={!!editingPairing}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("nestBox")}</Label>
                <Input
                  value={formNestBox}
                  onChange={(e) => setFormNestBox(e.target.value)}
                  placeholder={t("nestBox") || "رقم العش"}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("breedingNotes")}</Label>
                <Textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t("breedingNotes") || "ملاحظات"}
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetForm}>
                {t("cancel" as any) || "إلغاء"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createPairing.isPending || updatePairing.isPending}
              >
                {(createPairing.isPending || updatePairing.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {editingPairing ? t("save" as any) || "حفظ" : t("addPairing")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pairings List */}
      <div className="grid gap-4">
        {(pairings as BackendPairing[]).length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">{t("noPairings")}</p>
              <p className="text-sm text-muted-foreground/70">
                {t("createFirstPairing")}
              </p>
            </CardContent>
          </Card>
        ) : (
          (pairings as BackendPairing[]).map((pair) => (
            <Card key={pair.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            pair.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                          onClick={() =>
                            handleStatusChange(
                              pair.id,
                              pair.status === "ACTIVE" ? "FINISHED" : "ACTIVE",
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {pair.status === "ACTIVE"
                            ? t("pairingActive" as any) || "نشط"
                            : t("pairingCompleted" as any) || "مكتمل"}
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
                            {new Date(pair.startDate).toLocaleDateString(
                              "ar-EG",
                            )}
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
                          <p className="font-medium">
                            {pair.eggs?.length || 0}
                          </p>
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
                        onClick={() => openEditForm(pair)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(pair.id)}
                        disabled={deletePairing.isPending}
                      >
                        {deletePairing.isPending ? (
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
          ))
        )}
      </div>
    </div>
  );
}

// ============ Eggs Tab ============

function EggsTab() {
  const { t } = useLanguage();
  const { data: eggs = [], isLoading } = useEggs();
  const { data: pairings = [] } = usePairings();
  const { createEgg, updateEgg, deleteEgg } = useEggMutations();

  const [showForm, setShowForm] = useState(false);
  const [editingEgg, setEditingEgg] = useState<BackendEgg | null>(null);

  // Form state
  const [formPairingId, setFormPairingId] = useState("");
  const [formLayDate, setFormLayDate] = useState("");
  const [formCandlingDate, setFormCandlingDate] = useState("");
  const [formCandlingResult, setFormCandlingResult] = useState("");

  const activePairings = (pairings as BackendPairing[]).filter(
    (p) => p.status === "ACTIVE",
  );

  const resetForm = () => {
    setFormPairingId("");
    setFormLayDate("");
    setFormCandlingDate("");
    setFormCandlingResult("");
    setEditingEgg(null);
    setShowForm(false);
  };

  const openEditForm = (egg: BackendEgg) => {
    setEditingEgg(egg);
    setFormPairingId(egg.pairingId);
    setFormLayDate(egg.layDate.split("T")[0]);
    setFormCandlingDate(egg.candlingDate ? egg.candlingDate.split("T")[0] : "");
    setFormCandlingResult(egg.candlingResult || "");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!editingEgg && (!formPairingId || !formLayDate)) {
      toast.error(t("fillAllFields" as any) || "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      if (editingEgg) {
        await updateEgg.mutateAsync({
          id: editingEgg.id,
          data: {
            candlingDate: formCandlingDate
              ? new Date(formCandlingDate).toISOString()
              : undefined,
            candlingResult: formCandlingResult || undefined,
          },
        });
        toast.success(t("eggUpdated" as any) || "تم تحديث البيضة بنجاح");
      } else {
        await createEgg.mutateAsync({
          pairingId: formPairingId,
          layDate: new Date(formLayDate).toISOString(),
          candlingDate: formCandlingDate
            ? new Date(formCandlingDate).toISOString()
            : undefined,
          candlingResult: formCandlingResult || undefined,
        });
        toast.success(t("eggCreated" as any) || "تم تسجيل البيضة بنجاح");
      }
      resetForm();
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleStatusChange = async (
    eggId: string,
    newStatus: BackendEgg["status"],
  ) => {
    try {
      await updateEgg.mutateAsync({
        id: eggId,
        data: {
          status: newStatus,
          ...(newStatus === "HATCHED"
            ? { hatchDateActual: new Date().toISOString() }
            : {}),
        },
      });
      toast.success(t("statusUpdated" as any) || "تم تحديث الحالة");
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEgg.mutateAsync(id);
      toast.success(t("eggDeleted" as any) || "تم حذف البيضة");
    } catch {
      // Error handled by api-client interceptor
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LAID":
        return "bg-yellow-100 text-yellow-800";
      case "HATCHED":
        return "bg-green-100 text-green-800";
      case "INFERTILE":
        return "bg-red-100 text-red-800";
      case "BROKEN":
        return "bg-orange-100 text-orange-800";
      case "DEAD_IN_SHELL":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "LAID":
        return t("eggLaid" as any) || "موضوعة";
      case "HATCHED":
        return t("eggHatched" as any) || "فقست";
      case "INFERTILE":
        return t("infertile") || "غير مخصبة";
      case "BROKEN":
        return t("eggBroken" as any) || "مكسورة";
      case "DEAD_IN_SHELL":
        return t("eggDeadInShell" as any) || "نافقة في القشرة";
      default:
        return status;
    }
  };

  const calculateDaysToHatch = (layingDate: string) => {
    const laying = new Date(layingDate);
    const hatching = new Date(laying.getTime() + 18 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysLeft = Math.ceil(
      (hatching.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
    );
    return daysLeft > 0 ? daysLeft : 0;
  };

  const calculateIncubationDay = (layingDate: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(layingDate).getTime()) /
        (24 * 60 * 60 * 1000),
    );
    return Math.max(0, days);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const eggsList = eggs as BackendEgg[];
  const fertileCount = eggsList.filter((e) => e.status === "LAID").length;
  const hatchedCount = eggsList.filter((e) => e.status === "HATCHED").length;
  const infertileCount = eggsList.filter(
    (e) => e.status === "INFERTILE",
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {eggsList.length}
              </p>
              <p className="text-sm text-muted-foreground">{t("totalEggs")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {fertileCount}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("fertileEggs")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{hatchedCount}</p>
              <p className="text-sm text-muted-foreground">
                {t("hatchedEggs")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
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

      {/* Add Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addEgg")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingEgg
                  ? t("editEgg" as any) || "تعديل البيضة"
                  : t("addEgg")}
              </h3>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("selectPairing" as any) || "اختر التزاوج"}</Label>
                <Select
                  value={formPairingId}
                  onValueChange={setFormPairingId}
                  disabled={!!editingEgg}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectPairing" as any) || "اختر التزاوج"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {activePairings.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.male?.name} × {p.female?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("layingDate")}</Label>
                <Input
                  type="date"
                  value={formLayDate}
                  onChange={(e) => setFormLayDate(e.target.value)}
                  disabled={!!editingEgg}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("candlingDate" as any) || "تاريخ الكشف"}</Label>
                <Input
                  type="date"
                  value={formCandlingDate}
                  onChange={(e) => setFormCandlingDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("candlingResult" as any) || "نتيجة الكشف"}</Label>
                <Select
                  value={formCandlingResult}
                  onValueChange={setFormCandlingResult}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectResult" as any) || "اختر النتيجة"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fertile">
                      {t("fertile" as any) || "مخصبة"}
                    </SelectItem>
                    <SelectItem value="infertile">
                      {t("infertile") || "غير مخصبة"}
                    </SelectItem>
                    <SelectItem value="unclear">
                      {t("unclear" as any) || "غير واضحة"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetForm}>
                {t("cancel" as any) || "إلغاء"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createEgg.isPending || updateEgg.isPending}
              >
                {(createEgg.isPending || updateEgg.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {editingEgg ? t("save" as any) || "حفظ" : t("addEgg")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eggs List */}
      <div className="grid gap-4">
        {eggsList.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <EggIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">{t("noEggs")}</p>
              <p className="text-sm text-muted-foreground/70">
                {t("addFirstEgg")}
              </p>
            </CardContent>
          </Card>
        ) : (
          eggsList.map((egg) => (
            <Card key={egg.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(egg.status)}>
                        {getStatusLabel(egg.status)}
                      </Badge>
                      {egg.status === "LAID" && (
                        <span className="text-sm font-medium">
                          {t("daysToHatch")}:{" "}
                          {calculateDaysToHatch(egg.layDate)}{" "}
                          {t("days" as any) || "يوم"}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("pairing" as any) || "التزاوج"}
                        </p>
                        <p className="font-medium">
                          {egg.pairing?.male?.name} ×{" "}
                          {egg.pairing?.female?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("layingDate")}
                        </p>
                        <p className="font-medium">
                          {new Date(egg.layDate).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("expectedHatchDate")}
                        </p>
                        <p className="font-medium">
                          {egg.hatchDateExpected
                            ? new Date(
                                egg.hatchDateExpected,
                              ).toLocaleDateString("ar-EG")
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("incubationDay")}
                        </p>
                        <p className="font-medium">
                          {calculateIncubationDay(egg.layDate)} / 18
                        </p>
                      </div>
                      {egg.candlingDate && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("candlingDate" as any) || "تاريخ الكشف"}
                          </p>
                          <p className="font-medium">
                            {new Date(egg.candlingDate).toLocaleDateString(
                              "ar-EG",
                            )}
                          </p>
                        </div>
                      )}
                      {egg.candlingResult && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("candlingResult" as any) || "نتيجة الكشف"}
                          </p>
                          <p className="font-medium">{egg.candlingResult}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(egg)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(egg.id)}
                        disabled={deleteEgg.isPending}
                      >
                        {deleteEgg.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {/* Quick status buttons */}
                    {egg.status === "LAID" && (
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleStatusChange(egg.id, "HATCHED")}
                        >
                          🐣 {t("markHatched" as any) || "فقست"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() =>
                            handleStatusChange(egg.id, "INFERTILE")
                          }
                        >
                          ✕ {t("markInfertile" as any) || "غير مخصبة"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ============ Squabs Tab ============

function SquabsTab() {
  const { t } = useLanguage();
  const { data: birdsData, isLoading } = useBirds({
    status: "squab",
    limit: 200,
  });

  const squabs = birdsData?.data || [];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{squabs.length}</p>
              <p className="text-sm text-muted-foreground">
                {t("totalSquabs")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {squabs.filter((s: any) => s.status === "healthy").length}
              </p>
              <p className="text-sm text-muted-foreground">{t("healthy")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-muted-foreground">
                {t("weanedThisMonth")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
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

      {/* Squabs List */}
      <div className="grid gap-4">
        {squabs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Bird className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">{t("noSquabs")}</p>
              <p className="text-sm text-muted-foreground/70">
                {t("addFirstSquab")}
              </p>
            </CardContent>
          </Card>
        ) : (
          squabs.map((squab: any) => (
            <Card key={squab.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(squab.status)}>
                        {squab.status}
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
                          {t("ringNumber" as any) || "رقم الحلقة"}
                        </p>
                        <p className="font-medium">{squab.ringNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("name" as any) || "الاسم"}
                        </p>
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
                              "ar-EG",
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
