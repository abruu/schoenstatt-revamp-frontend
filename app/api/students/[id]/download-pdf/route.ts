import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as qs from "qs";
import {
  generateStudentPDF,
  generatePdfForRecipient,
  formatStudentDataForPDF,
} from "@/lib/pdf-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

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

async function fetchStudent(token: string, documentId: string) {
  const queryParams = {
    populate: {
      center: true,
      courseLevel: true,
      photo: true,
      aadhaarFile: true,
    },
  };

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const response = await axios.get(
    `${STRAPI_URL}/students?filters[documentId][$eq]=${documentId}&${queryString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    },
  );
  return response.data.data[0];
}

async function fetchProofFile(
  token: string,
  fileUrl: string,
): Promise<Buffer | null> {
  try {
    const strapiBase =
      STRAPI_URL?.replace("/api", "") || "http://localhost:1337";
    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `${strapiBase}${fileUrl}`;
    const response = await axios.get(fullUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
      timeout: 30000,
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to fetch proof file:", error);
    return null;
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_").substring(0, 50);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: documentId } = await params;

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

    // Fetch student data
    let student;
    try {
      student = await fetchStudent(token, documentId);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 },
        );
      }
      throw error;
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check center access for non-super admins
    if (!userProfile.isSuperAdmin && userProfile.assignedCenter) {
      if (
        student.center?.documentId !== userProfile.assignedCenter.documentId
      ) {
        return NextResponse.json(
          { error: "Forbidden: You do not have access to this student" },
          { status: 403 },
        );
      }
    }

    // Get base URL for assets
    const baseUrl = request.nextUrl.origin;

    // Fetch ID proof file if available
    let proofFile: Buffer | null = null;
    if (student.aadhaarFile?.url) {
      proofFile = await fetchProofFile(token, student.aadhaarFile.url);
    }

    // Generate PDF — merge with ID proof if available, otherwise student details only
    let pdfBuffer: Buffer;
    if (proofFile) {
      const studentData = formatStudentDataForPDF(student, baseUrl);
      pdfBuffer = await generatePdfForRecipient({
        studentDetails: studentData,
        proofFile,
        recipientType: "admin",
      });
    } else {
      pdfBuffer = await generateStudentPDF(student, baseUrl);
    }

    // Create filename
    const firstName = sanitizeFilename(student.firstName || "Student");
    const lastName = sanitizeFilename(student.lastName || "");
    const filename = `${firstName}-${lastName}-${student.id}_Details.pdf`;

    // Return PDF response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
