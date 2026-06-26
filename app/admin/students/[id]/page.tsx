"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { StrapiProtectedRoute } from "@/components/strapi-protected-route";
import { studentService } from "@/lib/services/student-service";
import { useStudent } from "@/hooks/use-students-query";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Download,
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  GraduationCap,
  Users,
  BookOpen,
  Building,
  Briefcase,
  Home,
  MessageCircle,
  FileText,
} from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default function StudentDetailPage() {
  return (
    <StrapiProtectedRoute>
      <Suspense>
        <StudentDetailContent />
      </Suspense>
    </StrapiProtectedRoute>
  );
}

function StudentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPage = searchParams.get("returnPage");
  const returnPageSize = searchParams.get("returnPageSize");
  const backHref = returnPage
    ? `/admin/dashboard?page=${returnPage}${returnPageSize ? `&pageSize=${returnPageSize}` : ""}`
    : "/admin/dashboard";
  const queryClient = useQueryClient();
  const documentId = (params.id as string) || null;

  const goBack = () => {
    router.push(backHref);
  };

  const { data: student, isLoading: loading, isError } = useStudent(documentId);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const strapiBaseUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
      "http://localhost:1337",
    [],
  );

  const photoUrl = useMemo(() => {
    if (!student?.photo?.url) return null;
    return student.photo.url.startsWith("http")
      ? student.photo.url
      : `${strapiBaseUrl}${student.photo.url}`;
  }, [student?.photo?.url, strapiBaseUrl]);

  const idProofUrl = useMemo(() => {
    if (!student?.aadhaarFile?.url) return null;
    return student.aadhaarFile.url.startsWith("http")
      ? student.aadhaarFile.url
      : `${strapiBaseUrl}${student.aadhaarFile.url}`;
  }, [student?.aadhaarFile?.url, strapiBaseUrl]);

  useEffect(() => {
    if (isError) {
      router.push("/admin/dashboard");
    }
  }, [isError, router]);

  const handleDeleteStudent = async () => {
    if (!student) return;
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await studentService.delete(student.documentId);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", documentId] });
      router.push(backHref);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const downloadPhoto = async () => {
    if (!photoUrl) {
      alert("No photo available to download");
      return;
    }
    try {
      const a = document.createElement("a");
      a.href = photoUrl;
      a.download = `${student?.firstName}_${student?.lastName}_photo.jpg`;
      a.target = "_blank";
      a.click();
    } catch (error) {
      console.error("Error downloading photo:", error);
      alert("Failed to download photo");
    }
  };

  const downloadIdProof = async () => {
    if (!idProofUrl) {
      alert("No ID proof available to download");
      return;
    }
    try {
      const a = document.createElement("a");
      a.href = idProofUrl;
      const ext = student?.aadhaarFile?.ext || ".pdf";
      a.download = `${student?.firstName}_${student?.lastName}_id_proof${ext}`;
      a.target = "_blank";
      a.click();
    } catch (error) {
      console.error("Error downloading ID proof:", error);
      alert("Failed to download ID proof");
    }
  };

  const downloadStudentPdf = async () => {
    if (!student) return;

    setDownloadingPdf(true);
    try {
      const token = localStorage.getItem("strapi_jwt");
      if (!token) {
        alert("Please log in to download the PDF");
        return;
      }

      const response = await fetch(
        `/api/students/${student.documentId}/download-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      setDownloadingPdf(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "enquired":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-blue-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-300">Student not found</p>
          <Link href="/admin/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon?: any;
    label: string;
    value: string | undefined;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-blue-500/10 last:border-0">
      {Icon && <Icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-white mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30 sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={goBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-blue-700/30" />
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-xs text-blue-300">Student Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${getStatusColor(student.statuses)} border font-medium`}
              >
                {student.statuses?.charAt(0).toUpperCase() +
                  student.statuses?.slice(1)}
              </Badge>
              <Button
                onClick={downloadStudentPdf}
                variant="outline"
                size="sm"
                disabled={downloadingPdf}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                {downloadingPdf ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Student Detail
                  </>
                )}
              </Button>
              {student.photo && (
                <Button
                  onClick={downloadPhoto}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  title="Download Photo"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {student.aadhaarFile?.url && (
                <Button
                  onClick={downloadIdProof}
                  variant="outline"
                  size="sm"
                  className="bg-amber-600/80 hover:bg-amber-600 text-white border-amber-600"
                  title="Download ID Proof"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  ID Proof
                </Button>
              )}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteStudent}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block py-6 text-center border-b">
        <h1 className="text-xl font-bold text-slate-900">
          Schoenstatt Language Academy
        </h1>
        <p className="text-sm text-slate-600 mt-1">Student Registration Form</p>
        <p className="text-xs text-slate-500 mt-2">
          Generated: {format(new Date(), "MMMM dd, yyyy")}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Photo & Quick Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Photo */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden">
              <div className="aspect-square relative bg-slate-900/50">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={`${student.firstName} ${student.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="h-16 w-16 text-slate-500" />
                  </div>
                )}
              </div>
              <div className="p-4 text-center border-t border-blue-500/20">
                <h2 className="font-semibold text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-sm text-blue-300 mt-1">
                  {student.courseLevel?.LabelFull || "No course assigned"}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-4">
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-3">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-100">
                    {student.center?.name || "No center"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-100">
                    {format(new Date(student.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-100">
                    {student.hostelFacility ? "Hostel Required" : "Day Scholar"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-9 space-y-6">
            {/* Personal Information */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                  <InfoRow label="First Name" value={student.firstName} />
                  <InfoRow label="Last Name" value={student.lastName} />
                  <InfoRow label="Gender" value={student.gender} />
                  <InfoRow
                    icon={Calendar}
                    label="Date of Birth"
                    value={
                      student.dateOfBirth
                        ? format(new Date(student.dateOfBirth), "PPP")
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white">
                  Contact Information
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                  <InfoRow icon={Mail} label="Email" value={student.email} />
                  <InfoRow icon={Phone} label="Phone" value={student.phone} />
                  <InfoRow
                    icon={MessageCircle}
                    label="WhatsApp"
                    value={student.whatsappNumber}
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <InfoRow
                      icon={MapPin}
                      label="Address"
                      value={student.address}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Family Information */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white">Family Information</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                  <InfoRow label="Father's Name" value={student.fathersName} />
                  <InfoRow label="Mother's Name" value={student.mothersName} />
                  <InfoRow
                    icon={Phone}
                    label="Parent Contact"
                    value={student.parentContact}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white">
                  Academic Information
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                  <InfoRow
                    icon={Building}
                    label="Center"
                    value={student.center?.name}
                  />
                  <InfoRow
                    icon={BookOpen}
                    label="Course Level"
                    value={student.courseLevel?.LabelFull}
                  />
                  <InfoRow
                    label="Highest Qualification"
                    value={
                      student.highestQualification === "Other"
                        ? student.otherQualification
                        : student.highestQualification
                    }
                  />
                  <InfoRow
                    icon={Briefcase}
                    label="Work Experience"
                    value={student.workExperience ? "Yes" : "No"}
                  />
                  <InfoRow
                    label="Studied German Before"
                    value={
                      student.studiedGerman
                        ? `Yes (${student.levelCompleted || "Level not specified"})`
                        : "No"
                    }
                  />
                  <InfoRow
                    icon={Home}
                    label="Hostel Facility"
                    value={student.hostelFacility ? "Required" : "Not Required"}
                  />
                </div>
              </div>
            </div>

            {/* Purpose of Learning */}
            {student.purposeLearningGerman &&
              student.purposeLearningGerman.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20">
                  <div className="px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-white">
                      Purpose of Learning German
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {student.purposeLearningGerman.map((purpose, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-200 border-blue-500/30"
                        >
                          {purpose}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Documents */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white">Documents</h3>
              </div>
              <div className="p-5 space-y-3">
                {/* Photo */}
                <div className="flex items-center justify-between py-2 border-b border-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Profile Photo
                      </p>
                      <p className="text-xs text-blue-300">
                        {student.photo?.url ? "Available" : "Not uploaded"}
                      </p>
                    </div>
                  </div>
                  {student.photo?.url && (
                    <Button
                      onClick={downloadPhoto}
                      variant="outline"
                      size="sm"
                      className="bg-cyan-600/80 hover:bg-cyan-600 text-white border-cyan-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                {/* ID Proof */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">ID Proof</p>
                      <p className="text-xs text-blue-300">
                        {student.aadhaarFile?.url
                          ? `${student.aadhaarFile.name || "id_proof"}${student.aadhaarFile.ext || ".pdf"}`
                          : "Not uploaded"}
                      </p>
                    </div>
                  </div>
                  {student.aadhaarFile?.url && (
                    <Button
                      onClick={downloadIdProof}
                      variant="outline"
                      size="sm"
                      className="bg-amber-600/80 hover:bg-amber-600 text-white border-amber-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
