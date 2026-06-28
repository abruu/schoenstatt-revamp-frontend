import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const BATCH_SIZE = 100;

interface StrapiStudent {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  dateOfBirth: string;
  address: string;
  fathersName?: string;
  mothersName?: string;
  parentName: string;
  parentContact: string;
  hostelFacility?: boolean;
  highestQualification?: string;
  otherQualification?: string;
  studiedGerman?: boolean;
  levelCompleted?: string;
  purposeLearningGerman?: string[];
  workExperience?: boolean;
  statuses: "pending" | "accepted" | "rejected" | "enquired";
  photo?: {
    id: number;
    url: string;
  };
  aadhaarFile?: {
    id: number;
    url: string;
    name?: string;
    ext?: string;
    mime?: string;
  };
  center?: {
    id: number;
    documentId: string;
    name: string;
    header: string;
  };
  courseLevel?: {
    id: number;
    documentId: string;
    LabelFull: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: number;
  isSuperAdmin: boolean;
  assignedCenter?: {
    id: number;
    documentId: string;
    name: string;
  };
}

async function validateAuth(token: string): Promise<UserProfile | null> {
  try {
    const response = await axios.get(`${STRAPI_URL}/user-profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch {
    return null;
  }
}

async function fetchAllStudents(
  token: string,
  userProfile: UserProfile,
  filters?: {
    registrationDate?: string;
    courseLevel?: string;
    center?: string;
    search?: string;
  },
): Promise<StrapiStudent[]> {
  const allStudents: StrapiStudent[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const queryParams: any = {
      pagination: {
        page,
        pageSize: BATCH_SIZE,
      },
      populate: {
        center: true,
        courseLevel: true,
        photo: true,
        aadhaarFile: true,
      },
      sort: ["createdAt:desc"],
      filters: {},
    };

    // Apply center filter for non-super admins
    if (!userProfile.isSuperAdmin && userProfile.assignedCenter) {
      queryParams.filters.center = {
        documentId: { $eq: userProfile.assignedCenter.documentId },
      };
    }

    // Apply optional filters
    if (filters?.search) {
      queryParams.filters.$or = [
        { firstName: { $containsi: filters.search } },
        { lastName: { $containsi: filters.search } },
        { email: { $containsi: filters.search } },
        { phone: { $containsi: filters.search } },
      ];
    }
    if (filters?.registrationDate) {
      const rangeMatch = filters.registrationDate.match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})$/,
      );
      if (rangeMatch) {
        const [, sDay, sMonth, sYear, eDay, eMonth, eYear] = rangeMatch;
        const isoStart = `${sYear}-${sMonth}-${sDay}`;
        const isoEnd = `${eYear}-${eMonth}-${eDay}`;
        const nextDay = new Date(`${isoEnd}T00:00:00Z`);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        const isoNextDay = nextDay.toISOString().split("T")[0];
        queryParams.filters.createdAt = {
          $gte: isoStart,
          $lt: isoNextDay,
        };
      } else {
        const dateMatch = filters.registrationDate.match(
          /^(\d{2})\/(\d{2})\/(\d{4})$/,
        );
        if (dateMatch) {
          const [, day, month, year] = dateMatch;
          const isoDate = `${year}-${month}-${day}`;
          const nextDay = new Date(`${isoDate}T00:00:00Z`);
          nextDay.setUTCDate(nextDay.getUTCDate() + 1);
          const isoNextDay = nextDay.toISOString().split("T")[0];
          queryParams.filters.createdAt = {
            $gte: isoDate,
            $lt: isoNextDay,
          };
        }
      }
    }
    if (filters?.courseLevel && filters.courseLevel !== "all") {
      queryParams.filters.courseLevel = {
        documentId: { $eq: filters.courseLevel },
      };
    }
    if (
      filters?.center &&
      filters.center !== "all" &&
      userProfile.isSuperAdmin
    ) {
      queryParams.filters.center = { documentId: { $eq: filters.center } };
    }

    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });

    try {
      const response = await axios.get(
        `${STRAPI_URL}/students?${queryString}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        },
      );

      const { data, meta } = response.data;
      allStudents.push(...data);

      const { page: currentPage, pageCount } = meta.pagination;
      hasMore = currentPage < pageCount;
      page++;

      // Safety check to prevent infinite loops
      if (page > 1000) {
        console.warn("Export: Reached maximum page limit (1000)");
        break;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      throw new Error(`Failed to fetch students at page ${page}`);
    }
  }

  return allStudents;
}

function escapeCSVField(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return `"${value.join(", ").replace(/"/g, '""')}"`;
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Convert to string
  const str = String(value);

  // Check if escaping is needed
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch {
    return "";
  }
}

function formatStatus(status: string): string {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPhotoUrl(photo?: { id: number; url: string }): string {
  if (!photo?.url) return "";
  const url = photo.url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = (STRAPI_URL || "").replace(/\/api$/, "");
  return `${baseUrl}${url}`;
}

function getProofUrl(aadhaarFile?: { id: number; url: string }): string {
  if (!aadhaarFile?.url) return "";
  const url = aadhaarFile.url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = (STRAPI_URL || "").replace(/\/api$/, "");
  return `${baseUrl}${url}`;
}

function transformStudentForExport(
  student: StrapiStudent,
): Record<string, any> {
  return {
    "Photo URL": getPhotoUrl(student.photo),
    "Proof Document URL": getProofUrl(student.aadhaarFile),
    "First Name": student.firstName || "",
    "Last Name": student.lastName || "",
    Gender: student.gender || "",
    Email: student.email || "",
    Phone: student.phone || "",
    "WhatsApp Number": student.whatsappNumber || "",
    "Date of Birth": formatDate(student.dateOfBirth),
    Address: student.address || "",
    "Father's Name": student.fathersName || "",
    "Mother's Name": student.mothersName || "",
    "Parent Contact": student.parentContact || "",
    "Hostel Facility": student.hostelFacility ? "Yes" : "No",
    "Highest Qualification": student.highestQualification || "",
    "Other Qualification": student.otherQualification || "",
    "Studied German Before": student.studiedGerman ? "Yes" : "No",
    "Level Completed": student.levelCompleted || "",
    "Purpose of Learning German": Array.isArray(student.purposeLearningGerman)
      ? student.purposeLearningGerman.join(", ")
      : "",
    "Work Experience": student.workExperience ? "Yes" : "No",
    Status: formatStatus(student.statuses),
    Center: student.center?.name || "",
    "Course Level": student.courseLevel?.LabelFull || "",
    "Registration Date": formatDate(student.createdAt),
    "Last Updated": formatDate(student.updatedAt),
  };
}

function generateCSV(students: StrapiStudent[]): string {
  if (students.length === 0) {
    // Return headers only for empty dataset
    const headers = Object.keys(transformStudentForExport({} as StrapiStudent));
    return headers.join(",") + "\n";
  }

  const transformedData = students.map(transformStudentForExport);
  const headers = Object.keys(transformedData[0]);

  // Build CSV with BOM for UTF-8 support in Excel
  const BOM = "\uFEFF";
  const headerRow = headers.map(escapeCSVField).join(",");
  const dataRows = transformedData.map((row) =>
    headers.map((header) => escapeCSVField(row[header])).join(","),
  );

  return BOM + [headerRow, ...dataRows].join("\n");
}

async function generateExcel(students: StrapiStudent[]): Promise<Uint8Array> {
  // Dynamic import for xlsx
  const XLSX = await import("xlsx");

  const transformedData = students.map(transformStudentForExport);

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(
    transformedData.length > 0 ? transformedData : [{}],
  );

  // Set column widths for better readability
  const headers = Object.keys(transformStudentForExport({} as StrapiStudent));
  worksheet["!cols"] = headers.map((header) => ({
    wch: Math.max(header.length, 15),
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  // Generate array buffer
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return new Uint8Array(buffer);
}

export async function GET(request: NextRequest) {
  try {
    // Extract authorization token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    // Validate user authentication
    const userProfile = await validateAuth(token);
    if (!userProfile) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 },
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const registrationDate = searchParams.get("registrationDate") || undefined;
    const courseLevel = searchParams.get("courseLevel") || undefined;
    const center = searchParams.get("center") || undefined;
    const search = searchParams.get("search") || undefined;

    // Validate format
    if (!["csv", "xlsx"].includes(format)) {
      return NextResponse.json(
        { error: "Invalid format. Use 'csv' or 'xlsx'" },
        { status: 400 },
      );
    }

    // Fetch all students with batched pagination
    const students = await fetchAllStudents(token, userProfile, {
      registrationDate,
      courseLevel,
      center,
      search,
    });

    // Generate filename
    const dateStr = new Date().toISOString().split("T")[0];
    const hasFilters = !!(
      registrationDate ||
      courseLevel ||
      (center && center !== "all") ||
      search
    );
    const scope = hasFilters
      ? "filtered"
      : userProfile.isSuperAdmin
        ? "all"
        : userProfile.assignedCenter?.name || "unknown";
    const filename = `students_export_${scope}_${dateStr}`;

    if (format === "csv") {
      const csvContent = generateCSV(students);

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
          "Cache-Control": "no-cache",
        },
      });
    } else {
      const excelBuffer = await generateExcel(students);

      return new NextResponse(excelBuffer.buffer as ArrayBuffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch (error: any) {
    console.error("Export error:", error);

    // Handle specific error types
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return NextResponse.json(
        { error: "Export timed out. Please try again or contact support." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to export students" },
      { status: 500 },
    );
  }
}
