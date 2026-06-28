import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as qs from "qs";
import { formatStudentDataForPDF } from "@/lib/pdf-generator";
import { getAdminNotificationEmails } from "@/lib/strapi-api";
import {
  sendRegistrationEmails,
  RecipientType,
} from "@/lib/services/registration-email-service";
import { getStrapiBaseUrl } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
    const strapiBase = getStrapiBaseUrl();
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
    console.error("[send-email] Failed to fetch proof file:", error);
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: documentId } = await params;

    const body = await request.json().catch(() => ({}));
    const recipientType = body.recipientType as RecipientType;

    if (
      !recipientType ||
      !["student", "admin", "both"].includes(recipientType)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing recipientType. Must be 'student', 'admin', or 'both'.",
        },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    const userProfile = await validateAuth(token);
    if (!userProfile) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 },
      );
    }

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
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 },
      );
    }

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

    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "localhost:3000";
    const appBaseUrl = `${protocol}://${host}`;

    const strapiBase = getStrapiBaseUrl();

    let photoUrl = "";
    if (student.photo?.url) {
      photoUrl = student.photo.url.startsWith("http")
        ? student.photo.url
        : `${strapiBase}${student.photo.url}`;
    }

    let aadhaarUrl = "";
    if (student.aadhaarFile?.url) {
      aadhaarUrl = student.aadhaarFile.url.startsWith("http")
        ? student.aadhaarFile.url
        : `${strapiBase}${student.aadhaarFile.url}`;
    }

    let proofFile: Buffer | null = null;
    if (student.aadhaarFile?.url) {
      proofFile = await fetchProofFile(token, student.aadhaarFile.url);
    }

    const studentDetails = formatStudentDataForPDF(student, appBaseUrl);

    const courseLevelShort =
      student.courseLevel?.LabelShort ||
      student.courseLevel?.LabelFull ||
      "";

    const centerEmail = student.center?.email || "";

    const adminNotificationEmails = await getAdminNotificationEmails();

    const result = await sendRegistrationEmails({
      studentDetails,
      courseLevelShort,
      centerEmail,
      photoUrl,
      aadhaarUrl,
      studentDocId: documentId,
      adminNotificationEmails,
      recipientType,
      appBaseUrl,
      proofFile: proofFile || undefined,
      howDidYouHearAboutUs: student.howDidYouHearAboutUs,
      howDidYouHearAboutUsOther: student.howDidYouHearAboutUsOther,
    });

    return NextResponse.json({
      success: true,
      message: "Email sending complete",
      details: result,
    });
  } catch (error: any) {
    console.error("[send-email] Error:", error);

    if (
      error.code === "ECONNABORTED" ||
      error.message?.includes("timeout")
    ) {
      return NextResponse.json(
        { error: "Request timed out. Please try again." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 },
    );
  }
}
