/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bird as BirdIcon,
  Plus,
  Search,
  Edit,
  Eye,
  Heart,
  Trophy,
  Calendar as CalendarIcon,
  Activity,
  Stethoscope,
  Syringe,
  Pill,
  Upload,
  Pencil,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { useLanguage } from "@/lib/language-context";
import { BirdModal } from "./bird-modal";
import { HealthRecordsList } from "./health-records-list";
import { AddHealthRecordDialog } from "./add-health-record-dialog";
import { useBirdMutations } from "@/hooks/useBirdMutations";
import { useLofts } from "@/hooks/useLofts";
import { useBirds } from "@/hooks/useBirds";
import { Bird } from "@shared/interfaces/bird.interface";
import { BirdGender, BirdStatus, BirdType } from "@shared/enums/bird.enums";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

// Form Schema
const formSchema = z.object({
  ringNumber: z.string().min(3, "Ring number is required"),
  name: z.string().min(2, "Name is required"),
  gender: z.nativeEnum(BirdGender).optional(),
  color: z.string().min(1, "Color is required"),
  status: z.nativeEnum(BirdStatus).optional(),
  type: z.nativeEnum(BirdType).optional(),
  birthDate: z.date().optional(),
  loft: z.string().min(1, "Loft is required"),
  father: z.string().optional(),
  mother: z.string().optional(),
  totalRaces: z.coerce.number().min(0).default(0),
  wins: z.coerce.number().min(0).default(0),
  weight: z.string().optional(),
  notes: z.string().optional(),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface PigeonPagesProps {
  currentPage: "all" | "add" | "pedigree" | "health";
  onBack: () => void;
  onNavigate?: (page: "all" | "add" | "pedigree" | "health") => void;
}

export function PigeonPages({
  currentPage,
  onBack,
  onNavigate,
}: PigeonPagesProps) {
  const { t, dir, language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [selectedPigeon, setSelectedPigeon] = useState<Bird | null>(null);
  const [showPedigreeModal, setShowPedigreeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { lofts } = useLofts();
  const { createBird, updateBird, deleteBird } = useBirdMutations();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ringNumber: "",
      name: "",
      gender: BirdGender.MALE,
      color: "",
      status: BirdStatus.HEALTHY,
      type: BirdType.UNKNOWN,
      totalRaces: 0,
      wins: 0,
      weight: "",
      notes: "",
      loft: "",
      father: "",
      mother: "",
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("File must be JPG, PNG, or WEBP");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== "loft" &&
        key !== "father" &&
        key !== "mother"
      ) {
        if (key === "birthDate" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    formData.append("loftId", data.loft);
    if (data.father) formData.append("fatherId", data.father);
    if (data.mother) formData.append("motherId", data.mother);
    if (selectedFile) formData.append("image", selectedFile);

    if (editingId) {
      updateBird.mutate(
        { id: editingId, data: formData },
        {
          onSuccess: () => {
            toast.success(t("pigeonUpdated") || "Pigeon updated successfully");
            form.reset();
            setEditingId(null);
            setPreviewUrl(null);
            setSelectedFile(null);
            if (onNavigate) {
              onNavigate("all");
            } else {
              onBack();
            }
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update pigeon");
          },
        },
      );
    } else {
      createBird.mutate(formData as any, {
        onSuccess: () => {
          toast.success(t("pigeonCreated") || "Pigeon created successfully");
          form.reset();
          setPreviewUrl(null);
          setSelectedFile(null);
          if (onNavigate) {
            onNavigate("all");
          } else {
            onBack();
          }
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create pigeon");
        },
      });
    }
  }

  const handleDelete = (id: string) => {
    // In a real app, use a proper dialog. Using window.confirm for simplicity or if you prefer
    // But since the user asked for deletion, let's make it direct or add a small confirmation logic
    // We can use the toast generic with a promise or just simple confirm
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذه الحمامة؟"
          : "Are you sure you want to delete this pigeon?",
      )
    ) {
      deleteBird.mutate(id, {
        onSuccess: () => {
          toast.success(
            language === "ar" ? "تم حذف الحمامة" : "Pigeon deleted",
          );
        },
        onError: () => {
          toast.error(
            language === "ar" ? "خطأ في الحذف" : "Error deleting pigeon",
          );
        },
      });
    }
  };

  const handleEdit = (pigeon: Bird) => {
    setEditingId(pigeon.id);
    form.reset({
      ringNumber: pigeon.ringNumber,
      name: pigeon.name,
      gender: pigeon.gender as BirdGender,
      color: pigeon.color,
      status: pigeon.status as BirdStatus,
      type: pigeon.type as BirdType,
      birthDate: pigeon.birthDate ? new Date(pigeon.birthDate) : undefined,
      loft: pigeon.loftId || pigeon.loft?.id || "",
      father: pigeon.fatherId || "",
      mother: pigeon.motherId || "",
      totalRaces: pigeon.totalRaces || 0,
      wins: pigeon.wins || 0,
      weight: pigeon.weight || "",
      notes: pigeon.notes || "",
    });
    setPreviewUrl(
      pigeon.image && pigeon.image.startsWith("/")
        ? `${API_URL}${pigeon.image}`
        : pigeon.image || null,
    );

    if (onNavigate) {
      onNavigate("add");
    }
  };

  const {
    data: birds,
    isLoading,
    error,
    refetch,
  } = useQuery<Bird[]>({
    queryKey: ["birds", searchTerm, statusFilter, genderFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (genderFilter !== "all") params.append("gender", genderFilter);

      const res = await apiClient.get(`/birds?${params.toString()}`);
      return res.data;
    },
  });

  const filteredPigeons = birds || []; // Use fetched data

  const getStatusColor = (status: string) => {
    switch (status) {
      case BirdStatus.HEALTHY:
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case BirdStatus.SICK:
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case BirdStatus.UNDER_OBSERVATION:
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case BirdStatus.DECEASED:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      case BirdStatus.SOLD:
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case BirdStatus.HEALTHY:
        return t("healthy");
      case BirdStatus.SICK:
        return t("sick");
      case BirdStatus.UNDER_OBSERVATION:
        return t("observation");
      case BirdStatus.DECEASED:
        return t("deceased");
      case BirdStatus.SOLD:
        return t("sold");
      default:
        return status;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "vaccination":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "treatment":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "checkup":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "illness":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getRecordTypeText = (type: string) => {
    switch (type) {
      case "vaccination":
        return t("vaccination");
      case "treatment":
        return t("treatment");
      case "checkup":
        return t("checkup");
      case "illness":
        return t("illness");
      default:
        return type;
    }
  };

  const renderAddPigeon = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {editingId
              ? language === "ar"
                ? "تعديل بيانات"
                : "Edit Pigeon"
              : t("addNewPigeon")}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar" ? "أدخل بيانات الحمام" : "Enter pigeon details"}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setEditingId(null);
            form.reset();
            setPreviewUrl(null);
            onBack();
          }}
          className="rounded-2xl"
        >
          {t("cancel")}
        </Button>
      </div>

      <Card className="rounded-3xl border-none shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() =>
                    document.getElementById("pigeon-image-upload")?.click()
                  }
                >
                  <div
                    className={cn(
                      "w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
                      previewUrl
                        ? "border-primary"
                        : "border-muted-foreground/30 hover:border-primary/50",
                    )}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-medium">Upload</span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="pigeon-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Max 2MB. Format: JPG, PNG, WEBP
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ringNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("ringNumber")} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="EGY-2024-XXX"
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pigeonName")} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            language === "ar" ? "اسم الطائر" : "Bird Name"
                          }
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("gender")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BirdGender.MALE}>
                            {t("male")}
                          </SelectItem>
                          <SelectItem value={BirdGender.FEMALE}>
                            {t("female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("color")}</FormLabel>
                      <Input className="rounded-xl" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("birthDate")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal rounded-xl",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("status")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BirdStatus.HEALTHY}>
                            {t("healthy")}
                          </SelectItem>
                          <SelectItem value={BirdStatus.SICK}>
                            {t("sick")}
                          </SelectItem>
                          <SelectItem value={BirdStatus.UNDER_OBSERVATION}>
                            {t("observation")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("breed")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BirdType.RACING}>
                            {language === "ar" ? "زاجل" : "Racing"}
                          </SelectItem>
                          <SelectItem value={BirdType.ORNAMENTAL}>
                            {language === "ar" ? "زينة" : "Ornamental"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("loft")} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder={t("selectLoft")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lofts?.map((loft) => (
                            <SelectItem key={loft.id} value={loft.id}>
                              {loft.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="father"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("father")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder={t("selectFather")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {birds
                            ?.filter((b) => b.gender === "male")
                            .map((bird) => (
                              <SelectItem key={bird.id} value={bird.id}>
                                {bird.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mother"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("mother")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder={t("selectMother")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {birds
                            ?.filter((b) => b.gender === "female")
                            .map((bird) => (
                              <SelectItem key={bird.id} value={bird.id}>
                                {bird.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("weight")}</FormLabel>
                      <Input
                        placeholder="450g"
                        className="rounded-xl"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "ar" ? "ملاحظات" : "Notes"}
                        </FormLabel>
                        <Textarea className="rounded-xl" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                  className="rounded-xl"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl px-8"
                  disabled={createBird.isPending || updateBird.isPending}
                >
                  {createBird.isPending || updateBird.isPending
                    ? "Saving..."
                    : editingId
                      ? language === "ar"
                        ? "حفظ التعديلات"
                        : "Save Changes"
                      : t("savePigeon")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const renderAllPigeons = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("allPigeonsTitle")}</h1>
          <p className="text-muted-foreground">{t("pigeonManagementTitle")}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("totalPigeons")}
                </p>
                <p className="text-2xl font-bold">{filteredPigeons.length}</p>
              </div>
              <BirdIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("healthyPigeons")}
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {
                    filteredPigeons.filter(
                      (p) => p.status === BirdStatus.HEALTHY,
                    ).length
                  }
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("male")}</p>
                <p className="text-2xl font-bold text-blue-500">
                  {
                    filteredPigeons.filter((p) => p.gender === BirdGender.MALE)
                      .length
                  }
                </p>
              </div>
              <BirdIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("female")}</p>
                <p className="text-2xl font-bold text-pink-500">
                  {
                    filteredPigeons.filter(
                      (p) => p.gender === BirdGender.FEMALE,
                    ).length
                  }
                </p>
              </div>
              <BirdIcon className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                className={cn(
                  "absolute top-3 h-4 w-4 text-muted-foreground",
                  dir === "rtl" ? "right-3" : "left-3",
                )}
              />
              <Input
                placeholder={t("searchPigeons")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] rounded-2xl">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value={BirdStatus.HEALTHY}>
                  {t("healthy")}
                </SelectItem>
                <SelectItem value={BirdStatus.SICK}>{t("sick")}</SelectItem>
                <SelectItem value={BirdStatus.UNDER_OBSERVATION}>
                  {t("observation")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-[180px] rounded-2xl">
                <SelectValue placeholder={t("filterByGender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allGenders")}</SelectItem>
                <SelectItem value={BirdGender.MALE}>{t("male")}</SelectItem>
                <SelectItem value={BirdGender.FEMALE}>{t("female")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pigeons Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPigeons.map((pigeon) => (
          <motion.div
            key={pigeon.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="overflow-hidden rounded-3xl hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
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
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pigeon.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pigeon.ringNumber}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-xl",
                          getStatusColor(pigeon.status),
                        )}
                      >
                        {getStatusText(pigeon.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {pigeon.gender === "male" ? t("male") : t("female")}
                      </span>
                      <span>•</span>
                      <span>{pigeon.color}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{pigeon.loft?.name || t("unknownLoft")}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span>
                          {pigeon.totalRaces} {t("totalRaces")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span>
                          {pigeon.wins} {t("wins")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setSelectedPigeon(pigeon);
                          setShowPedigreeModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-green-500 hover:text-green-600 hover:bg-green-50"
                        onClick={() => handleEdit(pigeon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(pigeon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pedigree Modal */}
      <Dialog open={showPedigreeModal} onOpenChange={setShowPedigreeModal}>
        <DialogContent className="max-w-4xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>{t("viewPedigree")}</DialogTitle>
            <DialogDescription>
              {selectedPigeon &&
                (language === "ar"
                  ? selectedPigeon.name
                  : selectedPigeon.nameEn)}{" "}
              - {selectedPigeon?.ringNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedPigeon && (
            <div className="space-y-6">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                  <TabsTrigger value="info" className="rounded-xl">
                    {t("viewDetails")}
                  </TabsTrigger>
                  <TabsTrigger value="pedigree" className="rounded-xl">
                    {t("pedigree")}
                  </TabsTrigger>
                  <TabsTrigger value="racing" className="rounded-xl">
                    {t("racingRecord")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("ringNumber")}
                      </Label>
                      <p className="font-medium">{selectedPigeon.ringNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("pigeonName")}
                      </Label>
                      <p className="font-medium">{selectedPigeon.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("gender")}
                      </Label>
                      <p className="font-medium">
                        {selectedPigeon.gender === "male"
                          ? t("male")
                          : t("female")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("color")}
                      </Label>
                      <p className="font-medium">{selectedPigeon.color}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("breed")}
                      </Label>
                      <p className="font-medium">
                        {selectedPigeon.type || "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("birthDate")}
                      </Label>
                      <p className="font-medium">
                        {selectedPigeon.birthDate
                          ? new Date(
                              selectedPigeon.birthDate,
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("weight")}
                      </Label>
                      <p className="font-medium">{selectedPigeon.weight}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        {t("loft")}
                      </Label>
                      <p className="font-medium">
                        {selectedPigeon.loft?.name || "-"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="pedigree" className="mt-4">
                  <div className="flex flex-col items-center gap-4">
                    {/* Current Pigeon */}
                    <Card className="rounded-2xl border-2 border-primary w-48">
                      <CardContent className="p-3 text-center">
                        <BirdIcon className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="font-semibold text-sm">
                          {selectedPigeon.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPigeon.ringNumber}
                        </p>
                      </CardContent>
                    </Card>
                    {/* Parents */}
                    <div className="flex items-center gap-8">
                      <Card className="rounded-2xl w-40">
                        <CardContent className="p-3 text-center">
                          <BirdIcon className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                          <p className="font-medium text-sm">{t("father")}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedPigeon.father?.name || "-"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="rounded-2xl w-40">
                        <CardContent className="p-3 text-center">
                          <BirdIcon className="h-6 w-6 mx-auto text-pink-500 mb-2" />
                          <p className="font-medium text-sm">{t("mother")}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedPigeon.mother?.name || "-"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="racing" className="mt-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card className="rounded-2xl">
                      <CardContent className="p-4 text-center">
                        <Trophy className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                        <p className="text-2xl font-bold">
                          {(selectedPigeon as any).races || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("totalRaces")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl">
                      <CardContent className="p-4 text-center">
                        <Activity className="h-8 w-8 mx-auto text-green-500 mb-2" />
                        <p className="text-2xl font-bold">
                          {(selectedPigeon as any).wins || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("wins")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl">
                      <CardContent className="p-4 text-center">
                        <Trophy className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <p className="text-2xl font-bold">
                          {Math.round(
                            (((selectedPigeon as any).wins || 0) /
                              ((selectedPigeon as any).races || 1)) *
                              100,
                          )}
                          %
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("topFinishes")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl">
                      <CardContent className="p-4 text-center">
                        <Activity className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                        <p className="text-2xl font-bold">85</p>
                        <p className="text-sm text-muted-foreground">
                          {t("avgSpeed")} km/h
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderPedigree = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("pedigreeTitle")}</h1>
          <p className="text-muted-foreground">{t("pigeonManagementTitle")}</p>
        </div>
      </div>

      {/* Search */}
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search
              className={cn(
                "absolute top-3 h-4 w-4 text-muted-foreground",
                dir === "rtl" ? "right-3" : "left-3",
              )}
            />
            <Input
              placeholder={t("searchPigeons")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pigeons List for Pedigree */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredPigeons.map((pigeon) => (
          <Card
            key={pigeon.id}
            className="rounded-3xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
            onClick={() => {
              setSelectedPigeon(pigeon);
              setShowPedigreeModal(true);
            }}
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
                    {language === "ar" ? pigeon.name : pigeon.nameEn}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pigeon.ringNumber}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>
                      {t("father")}: {pigeon.father?.name || "-"}
                    </span>
                    <span>•</span>
                    <span>
                      {t("mother")}: {pigeon.mother?.name || "-"}
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
        ))}
      </div>

      {/* Pedigree Modal */}
      <Dialog open={showPedigreeModal} onOpenChange={setShowPedigreeModal}>
        <DialogContent className="max-w-4xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>{t("pedigreeTitle")}</DialogTitle>
            <DialogDescription>
              {selectedPigeon &&
                (language === "ar"
                  ? selectedPigeon.name
                  : selectedPigeon.nameEn)}{" "}
              - {selectedPigeon?.ringNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedPigeon && (
            <div className="py-6">
              <div className="flex flex-col items-center gap-6">
                {/* Generation 1 - Current Pigeon */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("generation")} 1
                  </p>
                  <Card className="rounded-2xl border-2 border-primary w-56">
                    <CardContent className="p-4 text-center">
                      <BirdIcon className="h-10 w-10 mx-auto text-primary mb-2" />
                      <p className="font-bold">
                        {language === "ar"
                          ? selectedPigeon.name
                          : selectedPigeon.nameEn}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPigeon.ringNumber}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-xl mt-2",
                          selectedPigeon.gender === "male"
                            ? "text-blue-500"
                            : "text-pink-500",
                        )}
                      >
                        {selectedPigeon.gender === "male"
                          ? t("male")
                          : t("female")}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Generation 2 - Parents */}
                <div className="text-center w-full">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("generation")} 2
                  </p>
                  <div className="flex items-center justify-center gap-12">
                    <Card className="rounded-2xl w-48 border-blue-500/50">
                      <CardContent className="p-3 text-center">
                        <BirdIcon className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <p className="font-semibold text-sm">{t("father")}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedPigeon as any).father?.name ||
                            (selectedPigeon as any).father ||
                            "-"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl w-48 border-pink-500/50">
                      <CardContent className="p-3 text-center">
                        <BirdIcon className="h-8 w-8 mx-auto text-pink-500 mb-2" />
                        <p className="font-semibold text-sm">{t("mother")}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedPigeon as any).mother?.name ||
                            (selectedPigeon as any).mother ||
                            "-"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Generation 3 - Grandparents */}
                <div className="text-center w-full">
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("generation")} 3
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Card className="rounded-2xl w-36">
                      <CardContent className="p-2 text-center">
                        <BirdIcon className="h-6 w-6 mx-auto text-blue-400 mb-1" />
                        <p className="text-xs font-medium">GF-1</p>
                        <p className="text-[10px] text-muted-foreground">
                          EGY-2020-XXX
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl w-36">
                      <CardContent className="p-2 text-center">
                        <BirdIcon className="h-6 w-6 mx-auto text-pink-400 mb-1" />
                        <p className="text-xs font-medium">GM-1</p>
                        <p className="text-[10px] text-muted-foreground">
                          EGY-2020-XXX
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl w-36">
                      <CardContent className="p-2 text-center">
                        <BirdIcon className="h-6 w-6 mx-auto text-blue-400 mb-1" />
                        <p className="text-xs font-medium">GF-2</p>
                        <p className="text-[10px] text-muted-foreground">
                          EGY-2020-XXX
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="rounded-2xl w-36">
                      <CardContent className="p-2 text-center">
                        <BirdIcon className="h-6 w-6 mx-auto text-pink-400 mb-1" />
                        <p className="text-xs font-medium">GM-2</p>
                        <p className="text-[10px] text-muted-foreground">
                          EGY-2020-XXX
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "ar" ? "السجلات الصحية" : "Health Records"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "إدارة الحالة الصحية والتطعيمات"
              : "Manage health status and vaccinations"}
          </p>
        </div>
      </div>

      <HealthRecordsList onAddClick={() => setShowHealthModal(true)} />

      <AddHealthRecordDialog
        open={showHealthModal}
        onOpenChange={setShowHealthModal}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {currentPage === "all" && renderAllPigeons()}
      {currentPage === "add" && renderAddPigeon()}

      {currentPage === "pedigree" && renderPedigree()}
      {currentPage === "health" && renderHealth()}

      {/* Bird Modal */}
      <BirdModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        existingBirds={birds || []}
      />
    </motion.div>
  );
}
