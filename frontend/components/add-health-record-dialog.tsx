"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  Stethoscope,
  Syringe,
  Activity,
  Pill,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface AddHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birdId?: string;
  birdName?: string;
  recordToEdit?: any; // If provided, we are in edit mode
}

export function AddHealthRecordDialog({
  open,
  onOpenChange,
  birdId,
  birdName,
  recordToEdit,
}: AddHealthRecordDialogProps) {
  const { t, language, dir } = useLanguage();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch birds if not provided (global add mode)
  const { data: birds, isLoading: isLoadingBirds } = useQuery({
    queryKey: ["birds-list-simple"],
    queryFn: async () => {
      const res = await apiClient.get("/birds");
      return res.data.data; // Extract array from { data: [...], total: ... }
    },
    enabled: !birdId && open, // Only fetch if no birdId provided
  });

  const formSchema = z.object({
    date: z.date({
      required_error: language === "ar" ? "التاريخ مطلوب" : "Date is required",
    }),
    type: z
      .string()
      .min(1, language === "ar" ? "النوع مطلوب" : "Type is required"),
    description: z
      .string()
      .min(1, language === "ar" ? "الوصف مطلوب" : "Description is required"),
    vetName: z.string().optional(),
    status: z
      .string()
      .min(1, language === "ar" ? "الحالة مطلوبة" : "Status is required"),
    birdId: z
      .string()
      .min(1, language === "ar" ? "الحمامة مطلوبة" : "Bird is required"),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: "checkup",
      description: "",
      vetName: "",
      status: "healthy",
      birdId: birdId || "",
      notes: "",
    },
  });

  // Reset/Populate form when opening or editing
  useEffect(() => {
    if (open) {
      if (recordToEdit) {
        form.reset({
          date: new Date(recordToEdit.date),
          type: recordToEdit.type,
          description: recordToEdit.description,
          vetName: recordToEdit.vetName || "",
          status: recordToEdit.status,
          birdId: recordToEdit.birdId || birdId || "",
          notes: recordToEdit.notes || "",
        });
      } else {
        form.reset({
          date: new Date(),
          type: "checkup",
          description: "",
          vetName: "",
          status: "healthy",
          birdId: birdId || "",
          notes: "",
        });
      }
    }
  }, [open, recordToEdit, birdId, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (recordToEdit) {
        await apiClient.patch(`/health/${recordToEdit.id}`, data);
        toast.success(
          language === "ar"
            ? "تم تحديث السجل بنجاح"
            : "Health record updated successfully",
        );
      } else {
        await apiClient.post("/health", data);
        toast.success(
          language === "ar"
            ? "تم إضافة السجل بنجاح"
            : "Health record added successfully",
        );
      }
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      onOpenChange(false);
    } catch (error) {
      toast.error(
        language === "ar" ? "حدث خطأ أثناء الحفظ" : "Failed to save record",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string; icon: any }> = {
      checkup: { ar: "فحص", en: "Checkup", icon: Stethoscope },
      vaccination: { ar: "تطعيم", en: "Vaccination", icon: Syringe },
      treatment: { ar: "علاج", en: "Treatment", icon: Pill },
      illness: { ar: "مرض", en: "Illness", icon: Activity },
      injury: { ar: "إصابة", en: "Injury", icon: AlertTriangle },
    };
    return labels[type] || { ar: type, en: type, icon: Activity };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto rounded-2xl"
        dir={dir}
      >
        <DialogHeader>
          <DialogTitle>
            {recordToEdit
              ? language === "ar"
                ? "تعديل سجل صحي"
                : "Edit Health Record"
              : language === "ar"
                ? "إضافة سجل صحي"
                : "Add Health Record"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? "أدخل بيانات السجل الصحي للحمام"
              : "Enter health record details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Bird Selection (only if not pre-selected) */}
            {!birdId && !recordToEdit && (
              <FormField
                control={form.control}
                name="birdId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "ar" ? "اختر الحمامة" : "Select Pigeon"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue
                            placeholder={
                              language === "ar"
                                ? "اختر حمامة..."
                                : "Select pigeon..."
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingBirds ? (
                          <div className="p-2 text-center text-xs text-muted-foreground">
                            {language === "ar"
                              ? "جاري التحميل..."
                              : "Loading..."}
                          </div>
                        ) : (
                          birds?.map((bird: any) => (
                            <SelectItem key={bird.id} value={bird.id}>
                              {bird.ringNumber} - {bird.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "ar" ? "نوع السجل" : "Record Type"}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            language === "ar" ? "اختر النوع" : "Select type"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "checkup",
                        "vaccination",
                        "treatment",
                        "illness",
                        "injury",
                      ].map((type) => {
                        const info = getTypeLabel(type);
                        const Icon = info.icon;
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>
                                {language === "ar" ? info.ar : info.en}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {language === "ar" ? "تاريخ السجل" : "Record Date"}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal rounded-2xl",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>
                              {language === "ar" ? "اختر تاريخ" : "Pick a date"}
                            </span>
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

            {/* Vet Name */}
            <FormField
              control={form.control}
              name="vetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "ar" ? "الطبيب البيطري" : "Veterinarian"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        language === "ar"
                          ? "اسم الطبيب البيطري..."
                          : "Vet name..."
                      }
                      className="rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "ar" ? "الوصف" : "Description"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        language === "ar"
                          ? "وصف الحالة أو الإجراء..."
                          : "Description of condition or procedure..."
                      }
                      className="resize-none h-24 rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "ar" ? "الحالة" : "Status"}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            language === "ar" ? "اختر الحالة" : "Select status"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="healthy">
                        {language === "ar" ? "سليم" : "Healthy"}
                      </SelectItem>
                      <SelectItem value="sick">
                        {language === "ar" ? "مريض" : "Sick"}
                      </SelectItem>
                      <SelectItem value="under_observation">
                        {language === "ar"
                          ? "تحت الملاحظة"
                          : "Under Observation"}
                      </SelectItem>
                      <SelectItem value="recovered">
                        {language === "ar" ? "متعافي" : "Recovered"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "ar" ? "ملاحظات" : "Notes"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        language === "ar"
                          ? "ملاحظات إضافية..."
                          : "Additional notes..."
                      }
                      className="resize-none rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-2xl">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
