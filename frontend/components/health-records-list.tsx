"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  FileText,
  Syringe,
  Stethoscope,
  Activity,
  HeartPulse,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AddHealthRecordDialog } from "./add-health-record-dialog";
import { ViewHealthRecordDialog } from "./view-health-record-dialog";

interface HealthRecordsListProps {
  birdId?: string;
  onAddClick?: () => void;
}

export function HealthRecordsList({
  birdId,
  onAddClick,
}: HealthRecordsListProps) {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [recordToEdit, setRecordToEdit] = useState<any>(null);
  const [recordToView, setRecordToView] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: records, isLoading } = useQuery({
    queryKey: ["health-records", birdId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (birdId) params.append("birdId", birdId);
      const res = await apiClient.get(`/health?${params.toString()}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/health/${id}`);
    },
    onSuccess: () => {
      toast.success(language === "ar" ? "تم حذف السجل" : "Record deleted");
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
    },
    onError: () => {
      toast.error(language === "ar" ? "خطأ في الحذف" : "Error deleting record");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(language === "ar" ? "هل أنت متأكد؟" : "Are you sure?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (record: any) => {
    setRecordToEdit(record);
    setIsEditModalOpen(true);
  };

  const handleView = (record: any) => {
    setRecordToView(record);
    setIsViewModalOpen(true);
  };

  const getRecordIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "vaccination":
        return <Syringe className="h-4 w-4" />;
      case "checkup":
        return <Stethoscope className="h-4 w-4" />;
      case "illness":
        return <HeartPulse className="h-4 w-4" />;
      case "injury":
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "recovered":
        return "bg-green-100 text-green-700 hover:bg-green-100/80";
      case "sick":
      case "critical":
        return "bg-red-100 text-red-700 hover:bg-red-100/80";
      case "under_observation":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100/80";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100/80";
    }
  };

  const filteredRecords =
    records?.filter(
      (record: any) =>
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.vetName &&
          record.vetName.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || [];

  return (
    <>
      <Card className="rounded-3xl border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {language === "ar" ? "السجلات الصحية" : "Health Records"}
            </CardTitle>
            {onAddClick && (
              <Button
                size="sm"
                onClick={onAddClick}
                className="gap-2 rounded-2xl"
              >
                <Plus className="h-4 w-4" />
                {language === "ar" ? "إضافة سجل" : "Add Record"}
              </Button>
            )}
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
            <Input
              placeholder={
                language === "ar" ? "بحث في السجلات..." : "Search records..."
              }
              className="pl-9 rtl:pr-9 rtl:pl-4 rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Activity className="h-12 w-12 opacity-20 mb-3" />
              <p>
                {language === "ar"
                  ? "لا توجد سجلات صحية"
                  : "No health records found"}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">
                      {language === "ar" ? "التاريخ" : "Date"}
                    </TableHead>
                    <TableHead className="text-start">
                      {language === "ar" ? "النوع" : "Type"}
                    </TableHead>
                    <TableHead className="text-start">
                      {language === "ar" ? "الوصف" : "Description"}
                    </TableHead>
                    <TableHead className="text-start">
                      {language === "ar" ? "الطبيب" : "Vet"}
                    </TableHead>
                    <TableHead className="text-start">
                      {language === "ar" ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className="w-[100px] text-start">
                      {language === "ar" ? "إجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium whitespace-nowrap text-start">
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-start">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-muted">
                            {getRecordIcon(record.type)}
                          </div>
                          <span className="capitalize">
                            {t(record.type.toLowerCase() as any) || record.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] text-start"
                        title={record.description}
                      >
                        <div className="truncate">{record.description}</div>
                        {record.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {record.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-start">
                        {record.vetName || "-"}
                      </TableCell>
                      <TableCell className="text-start">
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(record.status)} rounded-2xl`}
                        >
                          {t(
                            record.status
                              .toLowerCase()
                              .replace(/_/g, " ") as any,
                          ) || record.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-2xl text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleView(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(record)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {language === "ar" ? "تعديل" : "Edit"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(record.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {language === "ar" ? "حذف" : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <AddHealthRecordDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        recordToEdit={recordToEdit}
      />

      {/* View Modal */}
      <ViewHealthRecordDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        record={recordToView}
      />
    </>
  );
}
