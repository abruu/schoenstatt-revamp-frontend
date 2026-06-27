"use client";

import { useState, useEffect, Suspense } from "react";
import { useStrapiAuth } from "@/contexts/strapi-auth-context";
import { StrapiProtectedRoute } from "@/components/strapi-protected-route";
import { studentService, StrapiStudent } from "@/lib/services/student-service";
import { useCourseLevels } from "@/hooks/use-course-levels";
import { useCenters } from "@/hooks/use-centers";
import { useStudents } from "@/hooks/use-students-query";
import { getStrapiBaseUrl } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  LogOut,
  Users,
  GraduationCap,
  RefreshCw,
  RotateCcw,
  Mail,
  Shield,
  Check,
  X,
  HelpCircle,
  FileSpreadsheet,
  User,
  Phone,
  MessageCircle,
  Calendar,
  CreditCard,
  Building,
  BookOpen,
  Briefcase,
  Home,
  Camera,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parse } from "date-fns";

export default function AdminDashboard() {
  return (
    <StrapiProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </StrapiProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout, signingOut, isSuperAdmin, centerName } =
    useStrapiAuth();
  const { courseLevels, loading: courseLevelsLoading } = useCourseLevels();
  const { centers, loading: centersLoading } = useCenters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeParam = searchParams.get("pageSize");
  const studentsPerPage =
    pageSizeParam === "all" ? 999999 : parseInt(pageSizeParam || "10", 10);
  const queryClient = useQueryClient();
  const urlSearch = searchParams.get("search") || "";
  const urlCourseFilter = searchParams.get("courseLevel") || "all";
  const urlDateFilter = searchParams.get("registrationDate") || "";
  const urlInstitutionFilter = searchParams.get("center") || "all";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [dateFilter, setDateFilter] = useState(urlDateFilter);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"csv" | "xlsx" | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exportChoice, setExportChoice] = useState<"all" | "filtered">(
    "filtered",
  );
  const [selectedStudent, setSelectedStudent] = useState<StrapiStudent | null>(
    null,
  );
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const [downloadingPhoto, setDownloadingPhoto] = useState<string | null>(null);
  const [downloadingIdProof, setDownloadingIdProof] = useState<string | null>(
    null,
  );

  const debouncedSearchTerm = urlSearch;
  const courseFilter = urlCourseFilter;
  const institutionFilter = urlInstitutionFilter;

  const {
    data: studentsData,
    isLoading: loading,
    isFetching,
  } = useStudents({
    page: currentPage,
    pageSize: studentsPerPage,
    search: debouncedSearchTerm,
    courseLevel: courseFilter,
    registrationDate: dateFilter,
    center: institutionFilter,
  });

  const students = studentsData?.data ?? [];
  const totalCount = studentsData?.meta?.pagination?.total ?? 0;

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

  const buildReturnQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    if (dateFilter) {
      params.set("registrationDate", dateFilter);
    } else {
      params.delete("registrationDate");
    }
    return params.toString();
  };

  const saveScrollPosition = () => {
    sessionStorage.setItem("dashboardScrollY", String(window.scrollY));
  };

  // Restore scroll position on mount
  useEffect(() => {
    const savedScrollY = sessionStorage.getItem("dashboardScrollY");
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY, 10));
      sessionStorage.removeItem("dashboardScrollY");
    }
  }, []);

  // Debounce search term - update URL after 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm === urlSearch) return;
      const params = new URLSearchParams(window.location.search);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.delete("page");
      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`);
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Sync dateFilter to URL
  useEffect(() => {
    if (dateFilter === urlDateFilter) return;
    const params = new URLSearchParams(window.location.search);
    if (dateFilter) {
      params.set("registrationDate", dateFilter);
    } else {
      params.delete("registrationDate");
    }
    params.delete("page");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "10") {
      params.delete("pageSize");
    } else {
      params.set("pageSize", value);
    }
    params.delete("page");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleDeleteStudent = async (documentId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await studentService.delete(documentId);
      queryClient.invalidateQueries({ queryKey: ["students"] });
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const handleStatusUpdate = async (
    documentId: string,
    newStatus: "accepted" | "rejected" | "enquired",
  ) => {
    setUpdatingStatus(documentId);
    try {
      await studentService.updateStatus(documentId, newStatus);

      // Invalidate cache so the table refetches with updated status
      queryClient.invalidateQueries({ queryKey: ["students"] });
    } catch (error) {
      console.error("Error updating student status:", error);
      alert("Failed to update student status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleExport = async (format: "csv" | "xlsx", exportAll: boolean) => {
    setExporting(format);
    setExportModalOpen(false);
    try {
      // Get auth token
      const token = localStorage.getItem("strapi_jwt");
      if (!token) {
        alert("Please log in again to export data.");
        return;
      }

      // Build query params for filters
      const params = new URLSearchParams();
      params.set("format", format);
      if (!exportAll) {
        if (dateFilter) params.set("registrationDate", dateFilter);
        if (courseFilter !== "all") params.set("courseLevel", courseFilter);
        if (institutionFilter !== "all")
          params.set("center", institutionFilter);
        if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      }

      const response = await fetch(
        `/api/students/export?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Export failed with status ${response.status}`,
        );
      }

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `students_export_${format === "csv" ? "csv" : "xlsx"}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Export error:", error);
      alert(error.message || "Failed to export. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const openExportModal = (format: "csv" | "xlsx") => {
    setExportFormat(format);
    setExportModalOpen(true);
  };

  const handleDownloadPdf = async (student: StrapiStudent) => {
    setDownloadingPdf(student.documentId);
    try {
      const token = localStorage.getItem("strapi_jwt");
      if (!token) {
        alert("Please log in to download the PDF");
        return;
      }
      const response = await fetch(
        `/api/students/${student.documentId}/download-pdf`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to download PDF");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${student.firstName}-${student.lastName}-${student.id}_Details.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      alert(error.message || "Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleDownloadPhoto = async (student: StrapiStudent) => {
    if (!student.photo?.url) {
      alert("No photo available to download");
      return;
    }
    setDownloadingPhoto(student.documentId);
    try {
      const photoUrl = student.photo.url.startsWith("http")
        ? student.photo.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace(
            "/api",
            "",
          )}${student.photo.url}`;
      const ext = photoUrl.split(".").pop()?.split("?")[0] || "jpg";
      const fileName = `${student.firstName}_${student.lastName}_${student.documentId}_photo.${ext}`;
      const proxyUrl = `/api/students/download-file?url=${encodeURIComponent(photoUrl)}&name=${encodeURIComponent(fileName)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Failed to download photo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading photo:", error);
      alert("Failed to download photo");
    } finally {
      setDownloadingPhoto(null);
    }
  };

  const handleDownloadIdProof = async (student: StrapiStudent) => {
    if (!student.aadhaarFile?.url) {
      alert("No ID proof available to download");
      return;
    }
    setDownloadingIdProof(student.documentId);
    try {
      const fileUrl = student.aadhaarFile.url.startsWith("http")
        ? student.aadhaarFile.url
        : `${getStrapiBaseUrl()}${student.aadhaarFile.url}`;
      const ext = student.aadhaarFile.ext || "pdf";
      const fileName = `${student.firstName}_${student.lastName}_${student.documentId}_id_proof.${ext}`;
      const proxyUrl = `/api/students/download-file?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Failed to download ID proof");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ID proof:", error);
      alert("Failed to download ID proof");
    } finally {
      setDownloadingIdProof(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "enquired":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-yellow-400/20 text-yellow-300 border-yellow-400/30";
    }
  };

  const totalPages = Math.ceil(totalCount / studentsPerPage);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* Logo matching website */}
              <div className="relative mr-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    SCHOENSTATT ADMIN
                  </h1>
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-400/20 text-yellow-400 rounded-full border border-yellow-400/30">
                    {isSuperAdmin
                      ? "Super Admin"
                      : "SLA - " + (centerName || "").toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-blue-300 font-medium tracking-wider">
                  STUDENT MANAGEMENT PORTAL
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              disabled={signingOut}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {signingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/90 via-blue-800/90 to-slate-700/90 border border-blue-600/30 shadow-xl shadow-blue-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  <Users className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin User Info Card - Visible to all admins */}
          <Card className="bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-700/90 border border-purple-600/30 shadow-xl shadow-purple-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-300">
                    Admin User
                  </p>
                  <p className="text-lg font-bold text-white truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-purple-200 capitalize">
                    {isSuperAdmin ? "Super Admin" : "Center Admin"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-400/30">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Center Card - Only for regular admins, not super_admin */}
          {!isSuperAdmin && centerName && (
            <Card className="bg-gradient-to-br from-slate-800/90 via-yellow-900/90 to-orange-900/90 border border-yellow-600/30 shadow-xl shadow-yellow-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-300">
                      Your Center
                    </p>
                    <p className="text-2xl font-bold text-white capitalize">
                      {centerName}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-gradient-to-r from-slate-800/95 via-blue-900/95 to-slate-800/95 border border-blue-700/50 shadow-xl backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative flex flex-col gap-1">
                  <label className="text-xs font-medium text-blue-300">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-8 bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300 focus:border-yellow-400 focus:ring-yellow-400/20"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                {/* Registration Date Filter */}
                <div className="relative flex flex-col gap-1">
                  <label className="text-xs font-medium text-blue-300">
                    Registration Date
                  </label>
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4 pointer-events-none" />
                        <Input
                          readOnly
                          placeholder="DD/MM/YYYY - DD/MM/YYYY"
                          value={dateFilter}
                          className="pl-10 w-[260px] bg-slate-700/50 border-blue-600/30 text-white placeholder-blue-300 focus:border-yellow-400 focus:ring-yellow-400/20 cursor-pointer"
                        />
                        {dateFilter && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDateFilter("");
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white z-10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-slate-800 border-blue-600/30"
                      align="start"
                    >
                      <CalendarPicker
                        mode="range"
                        numberOfMonths={2}
                        selected={(() => {
                          try {
                            const rangeMatch = dateFilter.match(
                              /^(\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})$/,
                            );
                            if (rangeMatch) {
                              const from = parse(
                                rangeMatch[1],
                                "dd/MM/yyyy",
                                new Date(),
                              );
                              const to = parse(
                                rangeMatch[2],
                                "dd/MM/yyyy",
                                new Date(),
                              );
                              if (
                                !isNaN(from.getTime()) &&
                                !isNaN(to.getTime())
                              ) {
                                return { from, to } as DateRange;
                              }
                            }
                            const singleMatch = dateFilter.match(
                              /^(\d{2}\/\d{2}\/\d{4})$/,
                            );
                            if (singleMatch) {
                              const parsed = parse(
                                singleMatch[1],
                                "dd/MM/yyyy",
                                new Date(),
                              );
                              if (!isNaN(parsed.getTime())) {
                                return { from: parsed } as DateRange;
                              }
                            }
                            return undefined;
                          } catch {
                            return undefined;
                          }
                        })()}
                        onSelect={(range) => {
                          if (!range) {
                            setDateFilter("");
                            return;
                          }
                          if (range.from && range.to) {
                            setDateFilter(
                              `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`,
                            );
                            setDatePickerOpen(false);
                          } else if (range.from) {
                            setDateFilter(format(range.from, "dd/MM/yyyy"));
                          }
                        }}
                        className="bg-slate-800"
                        classNames={{
                          day: "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
                          today: "bg-blue-500/20 text-blue-300 rounded-md",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Institution Filter - Only for Super Admin */}
                {isSuperAdmin && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-blue-300">
                      Institution
                    </label>
                    <Select
                      value={institutionFilter}
                      onValueChange={(v) => updateUrlParam("center", v)}
                    >
                      <SelectTrigger className="w-[180px] bg-slate-700/50 border-blue-600/30 text-white">
                        <SelectValue placeholder="Filter by institution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Institutions</SelectItem>
                        {centers.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-blue-300">
                    Course
                  </label>
                  <Select
                    value={courseFilter}
                    onValueChange={(v) => updateUrlParam("courseLevel", v)}
                  >
                    <SelectTrigger className="w-[180px] bg-slate-700/50 border-blue-600/30 text-white">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courseLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Buttons */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-blue-300">
                    Export
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openExportModal("csv")}
                      disabled={exporting !== null}
                      variant="outline"
                      size="sm"
                      className="text-green-400 hover:text-black hover:bg-green-400 border-green-400/50 hover:border-green-400 disabled:opacity-50"
                    >
                      {exporting === "csv" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {exporting === "csv" ? "Exporting..." : "CSV"}
                    </Button>
                    <Button
                      onClick={() => openExportModal("xlsx")}
                      disabled={exporting !== null}
                      variant="outline"
                      size="sm"
                      className="text-green-400 hover:text-black hover:bg-green-400 border-green-400/50 hover:border-green-400 disabled:opacity-50"
                    >
                      {exporting === "xlsx" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                      )}
                      {exporting === "xlsx" ? "Exporting..." : "Excel"}
                    </Button>
                  </div>
                </div>
                {/* Reset Filters Button */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-blue-300">
                    Reset
                  </label>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setDateFilter("");
                      router.replace(pathname);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-black hover:bg-red-400 border-red-400/50 hover:border-red-400"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-slate-800/95 border border-blue-600/30 shadow-xl shadow-blue-900/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Students ({totalCount})
              </div>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["students"] })
                }
                disabled={loading || isFetching}
                variant="outline"
                size="sm"
                className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              {/* Fetching overlay (shows on top of cached data during page change / refresh) */}
              {isFetching && !loading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm pt-12">
                  <div className="flex items-center gap-2 bg-slate-800/90 px-4 py-2 rounded-lg border border-blue-500/30 shadow-xl">
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                    <span className="text-sm text-blue-200">Loading…</span>
                  </div>
                </div>
              )}
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/80 to-blue-800/80 border-b border-blue-600/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Course Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Status
                    </th>
                    {isSuperAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                        Institution
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider sticky right-0 bg-gradient-to-r from-slate-700 to-blue-800 border-l border-blue-600/30">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/50 divide-y divide-blue-700/30">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={isSuperAdmin ? 9 : 8}
                        className="px-6 py-8 text-center"
                      >
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-yellow-400 mr-2" />
                          <span className="text-blue-300">
                            Loading students...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isSuperAdmin ? 9 : 8}
                        className="px-6 py-8 text-center text-blue-300"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.documentId}
                        className="hover:bg-blue-800/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {student.firstName} {student.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-300">
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-300">
                            {student.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                            {student.courseLevel?.LabelFull || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(student.statuses)}`}
                          >
                            {student.statuses?.charAt(0).toUpperCase() +
                              student.statuses?.slice(1)}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-blue-300 capitalize">
                              {student.center?.name || "N/A"}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-300">
                            {format(
                              new Date(student.createdAt),
                              "MMM dd, yyyy",
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-slate-800 border-l border-blue-700/30">
                          <div className="flex items-center gap-2">
                            {/* Status Action Buttons */}
                            <div className="flex gap-1">
                              {/* <Button
                                onClick={() =>
                                  handleStatusUpdate(
                                    student.documentId,
                                    "accepted",
                                  )
                                }
                                disabled={
                                  updatingStatus === student.documentId ||
                                  student.statuses === "accepted"
                                }
                                variant="outline"
                                size="sm"
                                className={`h-8 w-8 p-0 ${
                                  student.statuses === "accepted"
                                    ? "bg-green-500/20 text-green-300 border-green-500/50"
                                    : "text-green-400 hover:text-black hover:bg-green-400 border-green-400/50 hover:border-green-400"
                                }`}
                                title="Accept Student"
                              >
                                {updatingStatus === student.documentId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(
                                    student.documentId,
                                    "rejected",
                                  )
                                }
                                disabled={
                                  updatingStatus === student.documentId ||
                                  student.statuses === "rejected"
                                }
                                variant="outline"
                                size="sm"
                                className={`h-8 w-8 p-0 ${
                                  student.statuses === "rejected"
                                    ? "bg-red-500/20 text-red-300 border-red-500/50"
                                    : "text-red-400 hover:text-black hover:bg-red-400 border-red-400/50 hover:border-red-400"
                                }`}
                                title="Reject Student"
                              >
                                {updatingStatus === student.documentId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(
                                    student.documentId,
                                    "enquired",
                                  )
                                }
                                disabled={updatingStatus === student.documentId}
                                variant="outline"
                                size="sm"
                                className={`h-8 w-8 p-0 ${
                                  student.statuses === "enquired"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                                    : "text-blue-400 hover:text-black hover:bg-blue-400 border-blue-400/50 hover:border-blue-400"
                                }`}
                                title="Mark Student as Enquired"
                              >
                                {updatingStatus === student.documentId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <HelpCircle className="h-3 w-3" />
                                )}
                              </Button> */}
                            </div>

                            {/* View Button */}
                            <Link
                              href={`/admin/students/${student.documentId}${buildReturnQuery() ? `?returnQuery=${encodeURIComponent(buildReturnQuery())}` : ""}`}
                              onClick={saveScrollPosition}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            {/* Detail Button */}
                            {/* <Button
                              onClick={() => setSelectedStudent(student)}
                              variant="outline"
                              size="sm"
                              className="text-purple-400 hover:text-black hover:bg-purple-400 border-purple-400/50 hover:border-purple-400"
                              title="Quick Student Detail"
                            >
                              <User className="h-4 w-4 mr-1" />
                              Detail
                            </Button> */}
                            {/* Download PDF Button */}
                            <Button
                              onClick={() => handleDownloadPdf(student)}
                              disabled={downloadingPdf === student.documentId}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-sky-400 hover:text-black hover:bg-sky-400 border-sky-400/50 hover:border-sky-400 disabled:opacity-50"
                              title="Download student details"
                            >
                              {downloadingPdf === student.documentId ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Download className="h-3 w-3" />
                              )}
                            </Button>
                            {/* Download Photo Button */}
                            {student.photo?.url && (
                              <Button
                                onClick={() => handleDownloadPhoto(student)}
                                disabled={
                                  downloadingPhoto === student.documentId
                                }
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-cyan-400 hover:text-black hover:bg-cyan-400 border-cyan-400/50 hover:border-cyan-400 disabled:opacity-50"
                                title="Download Photo"
                              >
                                {downloadingPhoto === student.documentId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Camera className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                            {/* Download ID Proof Button */}
                            {student.aadhaarFile?.url && (
                              <Button
                                onClick={() => handleDownloadIdProof(student)}
                                disabled={
                                  downloadingIdProof === student.documentId
                                }
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-amber-400 hover:text-black hover:bg-amber-400 border-amber-400/50 hover:border-amber-400 disabled:opacity-50"
                                title="Download ID Proof"
                              >
                                {downloadingIdProof === student.documentId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <FileText className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalCount > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-300">
                Showing {(currentPage - 1) * studentsPerPage + 1} to{" "}
                {Math.min(currentPage * studentsPerPage, totalCount)} of{" "}
                {totalCount} students
              </div>
              {/* Page size selector */}
              <Select
                value={
                  studentsPerPage >= 999999 ? "all" : String(studentsPerPage)
                }
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[90px] h-8 bg-slate-700/50 border-blue-600/30 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updatePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400 disabled:opacity-50 disabled:hover:text-yellow-400 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-blue-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updatePage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-yellow-400 hover:text-black hover:bg-yellow-400 border-yellow-400/50 hover:border-yellow-400 disabled:opacity-50 disabled:hover:text-yellow-400 disabled:hover:bg-transparent"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Student Detail Modal */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border border-blue-500/20 text-white overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-blue-500/20 flex-shrink-0">
            <DialogTitle className="text-white flex items-center gap-3 flex-wrap">
              <User className="h-5 w-5 text-blue-400" />
              {selectedStudent?.firstName} {selectedStudent?.lastName}
              {selectedStudent && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadgeColor(selectedStudent.statuses)}`}
                >
                  {selectedStudent.statuses?.charAt(0).toUpperCase() +
                    selectedStudent.statuses?.slice(1)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="overflow-y-auto max-h-[calc(90vh-5rem)]">
            {selectedStudent && (
              <div className="px-6 py-4 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left – Photo & Quick Info */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 overflow-hidden">
                      <div className="aspect-square relative bg-slate-900/50">
                        {selectedStudent.photo?.url ? (
                          <Image
                            src={
                              selectedStudent.photo.url.startsWith("http")
                                ? selectedStudent.photo.url
                                : `${getStrapiBaseUrl()}${selectedStudent.photo.url}`
                            }
                            alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <User className="h-16 w-16 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 text-center border-t border-blue-500/20">
                        <h2 className="font-semibold text-white text-sm">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </h2>
                        <p className="text-xs text-blue-300 mt-0.5">
                          {selectedStudent.courseLevel?.LabelFull ||
                            "No course assigned"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 p-4">
                      <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-3">
                        Quick Info
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-blue-100 truncate">
                            {selectedStudent.center?.name || "No center"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-blue-100">
                            {format(
                              new Date(selectedStudent.createdAt),
                              "MMM dd, yyyy",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Home className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-blue-100">
                            {selectedStudent.hostelFacility
                              ? "Hostel Required"
                              : "Day Scholar"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right – Details */}
                  <div className="lg:col-span-9 space-y-4">
                    {/* Personal Info */}
                    <div className="bg-slate-800/50 rounded-xl border border-blue-500/20">
                      <div className="px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <h3 className="font-semibold text-white text-sm">
                          Personal Information
                        </h3>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: "First Name",
                            value: selectedStudent.firstName,
                          },
                          {
                            label: "Last Name",
                            value: selectedStudent.lastName,
                          },
                          { label: "Gender", value: selectedStudent.gender },
                          {
                            label: "Date of Birth",
                            value: selectedStudent.dateOfBirth
                              ? format(
                                  new Date(selectedStudent.dateOfBirth),
                                  "PPP",
                                )
                              : undefined,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="py-2 border-b border-blue-500/10 last:border-0"
                          >
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                              {label}
                            </p>
                            <p className="text-sm text-white mt-0.5">
                              {value || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-slate-800/50 rounded-xl border border-blue-500/20">
                      <div className="px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <h3 className="font-semibold text-white text-sm">
                          Contact Information
                        </h3>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { label: "Email", value: selectedStudent.email },
                          { label: "Phone", value: selectedStudent.phone },
                          {
                            label: "WhatsApp",
                            value: selectedStudent.whatsappNumber,
                          },
                          {
                            label: "Address",
                            value: selectedStudent.address,
                            wide: true,
                          },
                        ].map(({ label, value, wide }) => (
                          <div
                            key={label}
                            className={`py-2 border-b border-blue-500/10 last:border-0 ${wide ? "col-span-2 md:col-span-3" : ""}`}
                          >
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                              {label}
                            </p>
                            <p className="text-sm text-white mt-0.5">
                              {value || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Family Info */}
                    <div className="bg-slate-800/50 rounded-xl border border-blue-500/20">
                      <div className="px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <h3 className="font-semibold text-white text-sm">
                          Family Information
                        </h3>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Father's Name",
                            value: selectedStudent.fathersName,
                          },
                          {
                            label: "Mother's Name",
                            value: selectedStudent.mothersName,
                          },
                          {
                            label: "Parent Contact",
                            value: selectedStudent.parentContact,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="py-2 border-b border-blue-500/10 last:border-0"
                          >
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                              {label}
                            </p>
                            <p className="text-sm text-white mt-0.5">
                              {value || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="bg-slate-800/50 rounded-xl border border-blue-500/20">
                      <div className="px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <h3 className="font-semibold text-white text-sm">
                          Academic Information
                        </h3>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Center",
                            value: selectedStudent.center?.name,
                          },
                          {
                            label: "Course Level",
                            value: selectedStudent.courseLevel?.LabelFull,
                          },
                          {
                            label: "Highest Qualification",
                            value:
                              selectedStudent.highestQualification === "Other"
                                ? selectedStudent.otherQualification
                                : selectedStudent.highestQualification,
                          },
                          {
                            label: "Work Experience",
                            value: selectedStudent.workExperience
                              ? "Yes"
                              : "No",
                          },
                          {
                            label: "Studied German",
                            value: selectedStudent.studiedGerman
                              ? `Yes (${selectedStudent.levelCompleted || "Level not specified"})`
                              : "No",
                          },
                          {
                            label: "Hostel Facility",
                            value: selectedStudent.hostelFacility
                              ? "Required"
                              : "Not Required",
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="py-2 border-b border-blue-500/10 last:border-0"
                          >
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                              {label}
                            </p>
                            <p className="text-sm text-white mt-0.5">
                              {value || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Purpose of Learning */}
                    {selectedStudent.purposeLearningGerman &&
                      selectedStudent.purposeLearningGerman.length > 0 && (
                        <div className="bg-slate-800/50 rounded-xl border border-blue-500/20">
                          <div className="px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <h3 className="font-semibold text-white text-sm">
                              Purpose of Learning German
                            </h3>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2">
                            {selectedStudent.purposeLearningGerman.map(
                              (purpose, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-500/20 text-blue-200 border border-blue-500/30"
                                >
                                  {purpose}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="max-w-md p-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border border-blue-500/20 text-white overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-blue-500/20">
            <DialogTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-green-400" />
              Export as {exportFormat === "csv" ? "CSV" : "Excel"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <RadioGroup
              value={exportChoice}
              onValueChange={(val) =>
                setExportChoice(val as "all" | "filtered")
              }
              className="space-y-3"
            >
              <div
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  exportChoice === "all"
                    ? "border-green-400/50 bg-green-400/10"
                    : "border-blue-500/20 hover:bg-slate-800/50"
                }`}
                onClick={() => setExportChoice("all")}
              >
                <RadioGroupItem value="all" id="export-all" className="mt-1" />
                <div className="flex-1">
                  <Label
                    htmlFor="export-all"
                    className="text-white font-medium cursor-pointer"
                  >
                    Download All Students
                    <span className="text-blue-300 text-sm ml-1">
                      (Total: {totalCount} Students)
                    </span>
                  </Label>
                  <p className="text-xs text-blue-300/70 mt-1">
                    Export all student records, regardless of any filters.
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  exportChoice === "filtered"
                    ? "border-green-400/50 bg-green-400/10"
                    : "border-blue-500/20 hover:bg-slate-800/50"
                }`}
                onClick={() => setExportChoice("filtered")}
              >
                <RadioGroupItem
                  value="filtered"
                  id="export-filtered"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="export-filtered"
                    className="text-white font-medium cursor-pointer"
                  >
                    Download Current Filtered Results
                    <span className="text-blue-300 text-sm ml-1">
                      ({totalCount} Students)
                    </span>
                  </Label>
                  <p className="text-xs text-blue-300/70 mt-1">
                    Export only the students matching the currently applied
                    filters.
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportModalOpen(false)}
                className="border-blue-500/30 text-blue-300 hover:text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  handleExport(exportFormat, exportChoice === "all")
                }
                disabled={exporting !== null}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download {exportFormat === "csv" ? "CSV" : "Excel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
