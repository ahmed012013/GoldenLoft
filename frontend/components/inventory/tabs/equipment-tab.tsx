import { useLanguage } from "@/lib/language-context";
import { InventoryItem } from "@/lib/services/inventory-service";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Edit, Plus, Search, Trash2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCard } from "../ui/stats-card";
import { Badge } from "@/components/ui/badge";

interface InventoryEquipmentTabProps {
  items: InventoryItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  onAdd: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  getConditionBadge: (condition: string) => React.ReactNode;
}

export function InventoryEquipmentTab({
  items,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onAdd,
  onEdit,
  onDelete,
  getConditionBadge,
}: InventoryEquipmentTabProps) {
  const { t, language, dir } = useLanguage();

  const stats = {
    total: items.length,
    totalQuantity: items.reduce((acc, i) => acc + i.quantity, 0),
    worn: items.filter((i) => i.condition === "worn").length,
    totalValue: items.reduce((acc, i) => acc + i.quantity * (i.cost || 0), 0),
  };

  const equipTypes = [
    { value: "feeder", label: t("equipTypeFeeder" as any) || "Feeder" },
    { value: "drinker", label: t("equipTypeDrinker" as any) || "Drinker" },
    { value: "nestBox", label: t("equipTypeNestBox" as any) || "Nest Box" },
    { value: "perch", label: t("equipTypePerch" as any) || "Perch" },
    { value: "trap", label: t("equipTypeTrap" as any) || "Trap" },
    { value: "cage", label: t("equipTypeCage" as any) || "Cage" },
    { value: "cleaning", label: t("equipTypeCleaning" as any) || "Cleaning" },
    { value: "training", label: t("equipTypeTraining" as any) || "Training" },
    { value: "other", label: t("equipTypeOther" as any) || "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("totalItems" as any) || "Total Items"}
          value={stats.total}
          icon={Wrench}
          iconColorClass="text-blue-500"
          iconBgClass="bg-blue-500/10"
        />
        {/* Note: I reused Wrench for Total Quantity as placeholder, usually would be different */}
        <StatsCard
          title={t("totalQuantity" as any) || "Total Quantity"}
          value={stats.totalQuantity}
          icon={Wrench}
          iconColorClass="text-purple-500"
          valueColorClass="text-purple-500"
          iconBgClass="bg-purple-500/10"
        />
        <StatsCard
          title={t("wornItems" as any) || "Worn Items"}
          value={stats.worn}
          icon={Wrench}
          iconColorClass="text-red-500"
          valueColorClass="text-red-500"
          iconBgClass="bg-red-500/10"
        />
        <StatsCard
          title={t("totalInventoryValue" as any) || "Total Value"}
          value={`$${stats.totalValue.toFixed(2)}`}
          icon={DollarSign}
          iconColorClass="text-green-500"
          valueColorClass="text-green-500"
          iconBgClass="bg-green-500/10"
        />
      </div>

      {/* Filters and Add */}
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className={cn(
                  "absolute top-3 h-4 w-4 text-muted-foreground",
                  dir === "rtl" ? "right-3" : "left-3",
                )}
              />
              <Input
                placeholder={
                  language === "ar" ? "بحث عن معدات..." : "Search equipment..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px] rounded-2xl">
                  <SelectValue placeholder={t("itemType" as any) || "Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === "ar" ? "الكل" : "All Types"}
                  </SelectItem>
                  {equipTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="rounded-2xl" onClick={onAdd}>
                <Plus
                  className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                />
                {t("addItem" as any) || "Add Item"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card className="rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("itemName" as any) || "Item Name"}</TableHead>
              <TableHead>{t("itemType" as any) || "Type"}</TableHead>
              <TableHead>{t("quantity" as any) || "Quantity"}</TableHead>
              <TableHead>{t("location" as any) || "Location"}</TableHead>
              <TableHead>{t("unitPrice" as any) || "Unit Price"}</TableHead>
              <TableHead>{t("condition" as any) || "Condition"}</TableHead>
              <TableHead className="text-center">
                {language === "ar" ? "إجراءات" : "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {language === "ar" ? "لا توجد عناصر" : "No items found"}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {equipTypes.find((t) => t.value === item.type)?.label ||
                      item.type}
                  </TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>${item.cost || 0}</TableCell>
                  <TableCell>
                    {getConditionBadge(item.condition || "good")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => {
                          if (
                            window.confirm(
                              language === "ar"
                                ? "هل أنت متأكد؟"
                                : "Are you sure?",
                            )
                          ) {
                            onDelete(item.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
