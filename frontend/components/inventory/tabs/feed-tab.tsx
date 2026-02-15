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
import {
  AlertTriangle,
  DollarSign,
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCard } from "../ui/stats-card";
import { Badge } from "@/components/ui/badge";

interface InventoryFeedTabProps {
  items: InventoryItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onAdd: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getComputedStatus: (item: InventoryItem) => string;
}

export function InventoryFeedTab({
  items,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  onAdd,
  onEdit,
  onDelete,
  getStatusBadge,
  getComputedStatus,
}: InventoryFeedTabProps) {
  const { t, language, dir } = useLanguage();

  const stats = {
    total: items.length,
    lowStock: items.filter((i) => getComputedStatus(i) === "lowStock").length,
    outOfStock: items.filter((i) => getComputedStatus(i) === "outOfStock")
      .length,
    totalValue: items.reduce((acc, i) => acc + i.quantity * (i.cost || 0), 0),
  };

  const feedTypes = [
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("totalItems" as any) || "Total Items"}
          value={stats.total}
          icon={Package}
          iconColorClass="text-blue-500"
          iconBgClass="bg-blue-500/10"
        />
        <StatsCard
          title={t("lowStockItems" as any) || "Low Stock"}
          value={stats.lowStock}
          icon={TrendingDown}
          iconColorClass="text-amber-500"
          valueColorClass="text-amber-500"
          iconBgClass="bg-amber-500/10"
        />
        <StatsCard
          title={t("outOfStock" as any) || "Out of Stock"}
          value={stats.outOfStock}
          icon={AlertTriangle}
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
                  language === "ar" ? "بحث عن صنف..." : "Search items..."
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
                  {feedTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] rounded-2xl">
                  <SelectValue placeholder={t("status" as any) || "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("allStatuses" as any) || "All Statuses"}
                  </SelectItem>
                  <SelectItem value="inStock">
                    {t("inStock" as any) || "In Stock"}
                  </SelectItem>
                  <SelectItem value="lowStock">
                    {t("lowStock" as any) || "Low Stock"}
                  </SelectItem>
                  <SelectItem value="outOfStock">
                    {t("outOfStock" as any) || "Out of Stock"}
                  </SelectItem>
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
              <TableHead>{t("minStock" as any) || "Min Stock"}</TableHead>
              <TableHead>{t("unitPrice" as any) || "Unit Price"}</TableHead>
              <TableHead>{t("expiryDate" as any) || "Expiry Date"}</TableHead>
              <TableHead>{t("status" as any) || "Status"}</TableHead>
              <TableHead className="text-center">
                {language === "ar" ? "إجراءات" : "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {language === "ar" ? "لا توجد عناصر" : "No items found"}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    {feedTypes.find((t) => t.value === item.type)?.label ||
                      item.type}
                  </TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>
                    {item.minStock} {item.unit}
                  </TableCell>
                  <TableCell>${item.cost || 0}</TableCell>
                  <TableCell>
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(getComputedStatus(item))}
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
