"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { compressImage } from "@/lib/image-compression";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
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

interface BirdFormProps {
  editingBird?: Bird | null;
  onBack: () => void;
  onSuccess: () => void;
}

export function BirdForm({ editingBird, onBack, onSuccess }: BirdFormProps) {
  const { t, language } = useLanguage();
  const { createBird, updateBird } = useBirdMutations();
  const { lofts } = useLofts();
  const { data: birdsData } = useBirds(); // Fetch all birds for parent selection
  const birds = birdsData?.data || [];

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (editingBird) {
      form.reset({
        ringNumber: editingBird.ringNumber,
        name: editingBird.name,
        gender: editingBird.gender as BirdGender,
        color: editingBird.color,
        status: editingBird.status as BirdStatus,
        type: editingBird.type as BirdType,
        birthDate: editingBird.birthDate
          ? new Date(editingBird.birthDate)
          : undefined,
        loft: editingBird.loftId || editingBird.loft?.id || "",
        father: editingBird.fatherId || "",
        mother: editingBird.motherId || "",
        totalRaces: editingBird.totalRaces || 0,
        wins: editingBird.wins || 0,
        weight: editingBird.weight || "",
        notes: editingBird.notes || "",
      });
      setPreviewUrl(
        editingBird.image && editingBird.image.startsWith("/")
          ? `${API_URL}${editingBird.image}`
          : editingBird.image || null,
      );
    }
  }, [editingBird, form]);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Image size must be less than 20MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("File must be JPG, PNG, or WEBP");
        return;
      }

      try {
        const compressed = await compressImage(file);
        setSelectedFile(compressed);
        const url = URL.createObjectURL(compressed);
        setPreviewUrl(url);
      } catch (error) {
        toast.error("Failed to process image");
        console.error(error);
      }
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

    if (editingBird) {
      updateBird.mutate(
        { id: editingBird.id, data: formData },
        {
          onSuccess: () => {
            toast.success(t("pigeonUpdated") || "Pigeon updated successfully");
            form.reset();
            setPreviewUrl(null);
            setSelectedFile(null);
            onSuccess();
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
          onSuccess();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create pigeon");
        },
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {editingBird
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
                    : editingBird
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
}
