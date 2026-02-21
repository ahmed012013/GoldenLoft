/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Upload, Bird, Activity, Trophy } from "lucide-react";
import { format } from "date-fns";
import { compressImage } from "@/lib/image-compression";

import { useToast } from "@/components/ui/use-toast";
import { useBirdMutations } from "@/hooks/useBirdMutations";
import { useLofts } from "@/hooks/useLofts";
import { CreateBirdDto } from "@shared/dtos/create-bird.dto";
import { BirdGender, BirdStatus, BirdType } from "@shared/enums/bird.enums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, calculateAge } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { Separator } from "@/components/ui/separator";
import { normalizeRingNumber, suggestRingNumber } from "@/lib/ring-number-utils";

// Form Schema
const formSchema = z.object({
  ringNumber: z.string().min(3, "Ring number is required"),
  name: z.string().min(2, "Name is required"),
  gender: z.nativeEnum(BirdGender).optional(), // Use nativeEnum for shared Enum
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

interface BirdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingBirds?: any[]; // Simplified for now
  onSuccess?: () => void;
}

export function BirdModal({
  open,
  onOpenChange,
  existingBirds = [],
  onSuccess,
}: BirdModalProps) {
  const { t, language } = useLanguage();
  const { lofts } = useLofts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ringNumber: suggestRingNumber(),
      name: "",
      gender: BirdGender.MALE,
      color: "",
      status: BirdStatus.HEALTHY,
      type: BirdType.UNKNOWN,
      totalRaces: 0,
      wins: 0,
    },
  });

  const { toast } = useToast();

  const { createBird } = useBirdMutations();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Validation - Relaxed to 20MB to allow client-side compression
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 20MB",
          variant: "destructive",
        });
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "File must be JPG, PNG, or WEBP",
          variant: "destructive",
        });
        return;
      }

      try {
        const compressed = await compressImage(file);
        setSelectedFile(compressed);
        const url = URL.createObjectURL(compressed);
        setPreviewUrl(url);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to compress image",
          variant: "destructive",
        });
      }
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();

    // Append all fields
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== "loft" &&
        key !== "father" &&
        key !== "mother" &&
        key !== "image"
      ) {
        if (key === "birthDate" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append mapped fields
    formData.append("loftId", data.loft);
    if (data.father) formData.append("fatherId", data.father);
    if (data.mother) formData.append("motherId", data.mother);

    // Append Image
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    // We need to cast to any because createBird expects CreateBirdDto JSON, but axios handles FormData
    // We might need to update the hook signature or just suppress type for now.
    // The API client interceptor should handle multipart/form-data.
    createBird.mutate(formData as any, {
      onSuccess: () => {
        toast({
          title: t("pigeonCreated"),
          description: `${data.name} (${data.ringNumber})`,
        });
        onOpenChange(false);
        form.reset();
        setPreviewUrl(null);
        setSelectedFile(null);
        if (onSuccess) onSuccess();
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-3xl bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="flex flex-col w-full max-h-[85vh]">
          <DialogHeader className="px-6 py-4 border-b bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Bird className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {t("addNewPigeon")}
                </DialogTitle>
                <DialogDescription>
                  {language === "ar"
                    ? "أدخل بيانات الطائر الجديد بدقة"
                    : "Enter the new bird details precisely"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  toast({
                    title: "Validation Error",
                    description: `Please check: ${Object.keys(errors).join(", ")}`,
                    variant: "destructive",
                  });
                })}
                className="space-y-8"
              >
                {/* Image Upload Section */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
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
                    {previewUrl && (
                      <div className="absolute bottom-0 right-0 p-1.5 bg-background rounded-full border shadow-sm">
                        <Upload className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <Input
                      id="image-upload"
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

                {/* Basic Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
                    <Bird className="w-4 h-4" />
                    <span>{t("pigeonDetails")}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ringNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ringNumber")} *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="-EGY-2026-XXX"
                              className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                              {...field}
                              onChange={(e) => {
                                field.onChange(normalizeRingNumber(e.target.value));
                              }}
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
                              className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all">
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
                              <SelectItem value={BirdGender.UNKNOWN}>
                                {t("unknown")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all">
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all">
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
                              <SelectItem value={BirdType.UNKNOWN}>
                                {language === "ar" ? "غير معروف" : "Unknown"}
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
                          <Input
                            placeholder={
                              language === "ar"
                                ? "اللون (مثال: أزرق)"
                                : "Color (e.g. Blue)"
                            }
                            className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                            {...field}
                          />
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
                                    "w-full pl-3 text-left font-normal rounded-xl bg-muted/50 border-transparent hover:bg-muted/70",
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {field.value && (
                            <p className="mt-1 text-sm text-primary/80 font-medium">
                              {language === "ar" ? "العمر: " : "Age: "}
                              {calculateAge(field.value, t, language)}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Pedigree & Loft */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
                    <Activity className="w-4 h-4" />
                    <span>{t("pedigreeAndLocation")}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("loft")} *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all">
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

                    {/* Parents Placeholders - ideally dynamic */}
                    <FormField
                      control={form.control}
                      name="father"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("father")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all">
                                <SelectValue placeholder={t("selectFather")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {existingBirds
                                ?.filter((b) => b.gender === "male")
                                .map((bird) => (
                                  <SelectItem key={bird.id} value={bird.id}>
                                    {bird.name} ({bird.ringNumber})
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all">
                                <SelectValue placeholder={t("selectMother")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {existingBirds
                                ?.filter((b) => b.gender === "female")
                                .map((bird) => (
                                  <SelectItem key={bird.id} value={bird.id}>
                                    {bird.name} ({bird.ringNumber})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Performance Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
                    <Trophy className="w-4 h-4" />
                    <span>{t("racingPerformance")}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalRaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("totalRaces")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wins"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("wins")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-muted/20 gap-2 shrink-0">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl hover:bg-background/80"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={createBird.isPending}
              className="rounded-xl px-8 shadow-lg shadow-primary/20"
            >
              {createBird.isPending ? "Saving..." : t("savePigeon")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
