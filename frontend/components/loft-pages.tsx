"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bird,
  Plus,
  Search,
  Settings,
  Warehouse,
  MapPin,
  Thermometer,
  Droplets,
  Users,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Save,
  X,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Fetch Lofts Function
async function fetchLofts() {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");

  const res = await fetch(`${API_URL}/lofts/my-loft`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch lofts");
  return res.json();
}

// Create Loft Function
async function createLoft(data: any) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");

  const res = await fetch(`${API_URL}/lofts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create loft");
  return res.json();
}

interface LoftPagesProps {
  currentPage: "all" | "add" | "settings";
  onBack: () => void;
}

export function LoftPages({ currentPage, onBack }: LoftPagesProps) {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoft, setSelectedLoft] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loftToDelete, setLoftToDelete] = useState<string | null>(null);

  // React Query for fetching lofts
  const {
    data: lofts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lofts"],
    queryFn: fetchLofts,
  });

  // Fetch bird stats for occupancy
  const { data: birdStats } = useQuery({
    queryKey: ["birds/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/birds/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { total: 0 };
      return res.json();
    },
  });

  // Settings state
  const [settingsData, setSettingsData] = useState({
    autoClimate: true,
    enableNotifications: true,
    lowCapacityAlert: true,
    cleaningReminder: true,
    temperatureAlert: true,
    cleaningSchedule: "daily",
    maintenanceSchedule: "weekly",
  });

  const filteredLofts = lofts.filter((loft: any) => {
    // Backend only returns English fields usually, or whatever is stored
    const name = loft.name;
    const location = loft.location || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "racing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "breeding":
        return "bg-pink-500/10 text-pink-500 border-pink-500/30";
      case "young":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "quarantine":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "racing":
        return t("racing");
      case "breeding":
        return t("breeding");
      case "young":
        return t("young");
      case "quarantine":
        return t("quarantine");
      default:
        return type || "General"; // Fallback name
    }
  };

  // Add Loft Dialog Component
  function AddLoftDialog({ trigger }: { trigger: React.ReactNode }) {
    const { language, t, dir } = useLanguage();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      location: "",
      description: "",
    });

    const router = useRouter();
    const queryClient = useQueryClient();

    const createLoftMutation = useMutation({
      mutationFn: createLoft,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lofts"] });
        toast.success("Loft created successfully! 🏠");
        setOpen(false);
        setFormData({
          name: "",
          location: "",
          description: "",
        });
        router.refresh();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create loft");
      },
    });

    const handleSaveLoft = () => {
      if (!formData.name) {
        toast.error("Loft name is required");
        return;
      }
      createLoftMutation.mutate(formData);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="rounded-3xl sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("addLoftTitle")}</DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? "أضف لوفت جديد إلى نظامك"
                : "Add a new loft to your system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("loftName")}</Label>
                <Input
                  id="name"
                  placeholder={t("loftNamePlaceholder")}
                  className="rounded-2xl"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t("loftLocation")}</Label>
                <Input
                  id="location"
                  placeholder={t("loftLocationPlaceholder")}
                  className="rounded-2xl"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("loftDescription")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("loftDescriptionPlaceholder")}
                  className="rounded-2xl min-h-[100px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-2xl bg-transparent"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              className="rounded-2xl"
              onClick={handleSaveLoft}
              disabled={createLoftMutation.isPending}
            >
              <Save
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {createLoftMutation.isPending ? "Saving..." : t("saveLoft")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Edit Loft Dialog Component
  function EditLoftDialog({
    trigger,
    loft,
    open,
    onOpenChange,
  }: {
    trigger?: React.ReactNode;
    loft: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    const { language, t, dir } = useLanguage();
    const [formData, setFormData] = useState({
      name: loft.name || "",
      location: loft.location || "",
      description: loft.description || "",
    });

    // Update form data when loft changes
    // useEffect(() => {
    //   setFormData({
    //     name: loft.name || "",
    //     location: loft.location || "",
    //     description: loft.description || "",
    //   })
    // }, [loft])
    // Better to just rely on initial state or key change if controlled externally

    const router = useRouter();
    const queryClient = useQueryClient();

    const updateLoftMutation = useMutation({
      mutationFn: async (data: any) => {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_URL}/lofts/${loft.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update loft");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lofts"] });
        toast.success("Loft updated successfully! 🏠");
        onOpenChange(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update loft");
      },
    });

    const handleUpdateLoft = () => {
      if (!formData.name) {
        toast.error("Loft name is required");
        return;
      }
      updateLoftMutation.mutate(formData);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-3xl sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("editLoft")}</DialogTitle>
            <DialogDescription>
              {language === "ar" ? "تعديل بيانات اللوفت" : "Edit loft details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t("loftName")}</Label>
                <Input
                  id="edit-name"
                  placeholder={t("loftNamePlaceholder")}
                  className="rounded-2xl"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">{t("loftLocation")}</Label>
                <Input
                  id="edit-location"
                  placeholder={t("loftLocationPlaceholder")}
                  className="rounded-2xl"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t("loftDescription")}</Label>
                <Textarea
                  id="edit-description"
                  placeholder={t("loftDescriptionPlaceholder")}
                  className="rounded-2xl min-h-[100px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-2xl bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              className="rounded-2xl"
              onClick={handleUpdateLoft}
              disabled={updateLoftMutation.isPending}
            >
              <Save
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {updateLoftMutation.isPending ? "Saving..." : t("saveLoft")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Delete Loft Mutation
  const deleteLoftMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/lofts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete loft");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lofts"] });
      toast.success("Loft deleted successfully! 🗑️");
      setShowDeleteDialog(false);
      setLoftToDelete(null);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete loft");
    },
  });

  // State for Edit Loft
  const [loftToEdit, setLoftToEdit] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Loft Settings Page (Unchanged logic, just keeping it here)
  const LoftSettingsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("loftSettingsTitle")}</h1>
        </div>
      </div>
      <div className="p-4 rounded-3xl border bg-card text-card-foreground shadow-sm">
        <p className="text-muted-foreground">
          Settings configuration would go here (same as before).
        </p>
      </div>
    </div>
  );

  const queryClient = useQueryClient();
  const router = useRouter();

  if (currentPage === "settings") return <LoftSettingsPage />;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading lofts...
      </div>
    );
  }

  // If no lofts
  if (lofts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="p-6 rounded-full bg-primary/10">
          <Warehouse className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to Golden Loft!</h2>
        <p className="max-w-md text-muted-foreground">
          You haven&apos;t created any lofts yet. Start managing your pigeons by
          adding your first loft.
        </p>
        <AddLoftDialog
          trigger={
            <Button className="rounded-2xl">
              <Plus
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {t("addNewLoft")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("allLoftsTitle")}</h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? `${lofts.length} لوفت مسجل`
                : `${lofts.length} lofts registered`}
            </p>
          </div>
          {/* This button functionality also depends on switching page state */}
          <AddLoftDialog
            trigger={
              <Button className="rounded-2xl">
                <Plus
                  className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
                />
                {t("addNewLoft")}
              </Button>
            }
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className={cn(
              "absolute top-3 h-4 w-4 text-muted-foreground",
              dir === "rtl" ? "right-3" : "left-3",
            )}
          />
          <Input
            type="search"
            placeholder={t("search")}
            className={cn("rounded-2xl", dir === "rtl" ? "pr-10" : "pl-10")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Warehouse className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lofts.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("allLofts")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Bird className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{birdStats?.total || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("currentOccupancy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lofts Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLofts.map((loft: any) => (
            <motion.div
              key={loft.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                        <Warehouse className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{loft.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {loft.location || "No Location"}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align={dir === "rtl" ? "start" : "end"}
                      >
                        <DropdownMenuItem>
                          <Eye
                            className={cn(
                              "h-4 w-4",
                              dir === "rtl" ? "ml-2" : "mr-2",
                            )}
                          />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setLoftToEdit(loft);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit
                            className={cn(
                              "h-4 w-4",
                              dir === "rtl" ? "ml-2" : "mr-2",
                            )}
                          />
                          {t("editLoft")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => {
                            setLoftToDelete(loft.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2
                            className={cn(
                              "h-4 w-4",
                              dir === "rtl" ? "ml-2" : "mr-2",
                            )}
                          />
                          {t("deleteLoft")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn("rounded-xl", getTypeColor("racing"))}
                    >
                      {getTypeLabel("racing")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-xl",
                        "bg-green-500/10 text-green-500 border-green-500/30",
                      )}
                    >
                      {t("active")}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("currentOccupancy")}
                      </span>
                      <span className="font-medium">
                        {loft._count?.birds || 0} / 50
                      </span>
                    </div>
                    <Progress
                      value={((loft._count?.birds || 0) / 50) * 100}
                      className="h-2 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span>24°C</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>55%</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {loft.description || "No description"}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t("lastCleaned")}: 2024-01-20
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteLoft")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmDelete")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                className="rounded-2xl"
                onClick={() => setShowDeleteDialog(false)}
              >
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="rounded-2xl bg-red-500 hover:bg-red-600"
                onClick={() => {
                  if (loftToDelete) {
                    deleteLoftMutation.mutate(loftToDelete);
                  }
                }}
              >
                {deleteLoftMutation.isPending ? "Deleting..." : t("deleteLoft")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        {loftToEdit && (
          <EditLoftDialog
            loft={loftToEdit}
            open={showEditDialog}
            onOpenChange={(open) => {
              setShowEditDialog(open);
              if (!open) setLoftToEdit(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
