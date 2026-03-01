import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as qs from "qs";
import { generateStudentPDF } from "@/lib/pdf-generator";

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
    },
  };

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
  const response = await axios.get(
    `${STRAPI_URL}/students/${documentId}?${queryString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    },
  );
  return response.data.data;
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

    // Generate PDF
    const pdfBuffer = await generateStudentPDF(student, baseUrl);

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
