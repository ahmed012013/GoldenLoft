import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLanguage } from "@/lib/language-context";
import { InventoryItem } from "@/lib/services/inventory-service";

const inventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or more"),
  unit: z.string().min(1, "Unit is required"),
  minStock: z.coerce.number().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
  supplier: z.string().optional(),
  expiryDate: z.string().optional(),
  location: z.string().optional(),
  condition: z.string().optional(),
  purchaseDate: z.string().optional(),
  notes: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  category: "feed" | "medications" | "equipment"; // Used to filter/provide type options
  defaultValues?: Partial<InventoryItem>;
  onSubmit: (data: InventoryFormValues) => void;
}

export function InventoryItemDialog({
  open,
  onOpenChange,
  mode,
  category,
  defaultValues,
  onSubmit,
}: InventoryItemDialogProps) {
  const { t, language, dir } = useLanguage();

  // Define type options based on category
  const getTypeOptions = () => {
    switch (category) {
      case "feed":
        return [
          { value: "seed", label: t("feedTypeSeed" as any) || "Seed" },
          { value: "grain", label: t("feedTypeGrain" as any) || "Grain" },
          { value: "pellet", label: t("feedTypePellet" as any) || "Pellet" },
          { value: "mix", label: t("feedTypeMix" as any) || "Mix" },
          { value: "grit", label: t("feedTypeGrit" as any) || "Grit" },
          {
            value: "supplement",
            label: t("feedTypeSupplement" as any) || "Supplement",
          },
        ];
      case "medications":
        return [
          { value: "vaccine", label: t("medTypeVaccine" as any) || "Vaccine" },
          {
            value: "antibiotic",
            label: t("medTypeAntibiotic" as any) || "Antibiotic",
          },
          { value: "vitamin", label: t("medTypeVitamin" as any) || "Vitamin" },
          {
            value: "antiparasitic",
            label: t("medTypeAntiparasitic" as any) || "Antiparasitic",
          },
          {
            value: "probiotic",
            label: t("medTypeProbiotic" as any) || "Probiotic",
          },
          { value: "other", label: t("medTypeOther" as any) || "Other" },
        ];
      case "equipment":
        return [
          { value: "feeder", label: t("equipTypeFeeder" as any) || "Feeder" },
          {
            value: "drinker",
            label: t("equipTypeDrinker" as any) || "Drinker",
          },
          {
            value: "nestBox",
            label: t("equipTypeNestBox" as any) || "Nest Box",
          },
          { value: "perch", label: t("equipTypePerch" as any) || "Perch" },
          { value: "trap", label: t("equipTypeTrap" as any) || "Trap" },
          { value: "cage", label: t("equipTypeCage" as any) || "Cage" },
          {
            value: "cleaning",
            label: t("equipTypeCleaning" as any) || "Cleaning",
          },
          {
            value: "training",
            label: t("equipTypeTraining" as any) || "Training",
          },
          { value: "other", label: t("equipTypeOther" as any) || "Other" },
        ];
      default:
        return [];
    }
  };

  const typeOptions = getTypeOptions();

  const unitOptions = [
    { value: "kg", label: t("unitKg" as any) || "kg" },
    { value: "g", label: t("unitG" as any) || "g" },
    { value: "mg", label: t("unitMg" as any) || "mg" },
    { value: "l", label: t("unitL" as any) || "l" },
    { value: "ml", label: t("unitMl" as any) || "ml" },
    { value: "pcs", label: t("unitPcs" as any) || "pcs" },
    { value: "dose", label: t("unitDose" as any) || "dose" },
    { value: "tablets", label: t("unitTablets" as any) || "tablets" },
    { value: "cm", label: t("unitCm" as any) || "cm" },
    { value: "m", label: t("unitM" as any) || "m" },
  ];

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      type: "",
      quantity: 0,
      unit: "pcs",
      minStock: 0,
      cost: 0,
      supplier: "",
      expiryDate: "",
      location: "",
      condition: "",
      purchaseDate: "",
      notes: "",
      ...defaultValues,
    },
  });

  // Reset form when dialog opens or defaults change
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        type: "",
        quantity: 0,
        unit: "pcs",
        minStock: 0,
        cost: 0,
        supplier: "",
        location: "",
        condition: "",
        notes: "",
        ...defaultValues,
        expiryDate: defaultValues?.expiryDate
          ? new Date(defaultValues.expiryDate).toISOString().split("T")[0]
          : "",
        purchaseDate: defaultValues?.purchaseDate
          ? new Date(defaultValues.purchaseDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (data: InventoryFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? t("addItem" as any) || "Add Item"
              : t("editItem" as any) || "Edit Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? category === "feed"
                ? "Add new feed to inventory"
                : category === "medications"
                  ? "Add new medication"
                  : "Add new equipment"
              : "Update item details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("itemName" as any) || "Item Name"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("itemType" as any) || "Type"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("quantity" as any) || "Quantity"}</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("unit" as any) || "Unit"}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unitOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("unitPrice" as any) || "Unit Price"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("minStock" as any) || "Minimum Stock"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("supplier" as any) || "Supplier"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Supplier name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category specifics */}
              {category !== "equipment" && (
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("expiryDate" as any) || "Expiry Date"}
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {category === "equipment" && (
                <>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "ar" ? "الموقع" : "Location"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Warehouse A..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {language === "ar" ? "الحالة" : "Condition"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="worn">Worn</SelectItem>
                            <SelectItem value="broken">Broken</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("purchaseDate" as any) || "Purchase Date"}
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel" as any) || "Cancel"}
              </Button>
              <Button type="submit">
                {mode === "add"
                  ? t("addItem" as any) || "Add Item"
                  : t("saveChanges" as any) || "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
