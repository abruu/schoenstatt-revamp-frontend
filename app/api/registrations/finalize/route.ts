import { NextRequest, NextResponse } from "next/server";
import { getAdminNotificationEmails } from "@/lib/strapi-api";
import { sendRegistrationEmails } from "@/lib/services/registration-email-service";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log("[finalize] Route hit, parsing form data...");
    const formData = await request.formData();

    // Student + registration details
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirthRaw = formData.get("dateOfBirth") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const address = formData.get("address") as string;
    const fathersName = formData.get("fathersName") as string;
    const mothersName = formData.get("mothersName") as string;
    const parentContact = formData.get("parentContact") as string;
    const centerName = formData.get("centerName") as string;
    const centerEmail = formData.get("centerEmail") as string;
    const courseLevelLabel = formData.get("courseLevelLabel") as string;
    const courseLevelShort = formData.get("courseLevelShort") as string;
    const hostelFacility = formData.get("hostelFacility") === "true";
    const highestQualification = formData.get("highestQualification") as string;
    const studiedGerman = formData.get("studiedGerman") === "true";
    const levelCompleted = formData.get("levelCompleted") as string;
    const purposeLearningGerman = JSON.parse(
      formData.get("purposeLearningGerman") as string,
    ) as string[];
    const workExperience = formData.get("workExperience") === "true";
    const howDidYouHearAboutUs = formData.get("howDidYouHearAboutUs") as string;
    const howDidYouHearAboutUsOther = formData.get(
      "howDidYouHearAboutUsOther",
    ) as string;
    const registrationId = formData.get("registrationId") as string;
    const photoUrl = formData.get("photoUrl") as string;
    const aadhaarUrl = formData.get("aadhaarUrl") as string;
    const studentDocId = formData.get("studentDocId") as string;

    // Proof file (PDF) for admin email attachment
    const proofFile = formData.get("proofFile") as File | null;

    console.log("[finalize] Form data parsed:", {
      firstName,
      lastName,
      email,
      centerName,
      centerEmail: centerEmail || "(empty)",
      photoUrl: photoUrl || "(empty)",
      registrationId,
    });

    // Admin emails (pre-fetched from client or fetched server-side)
    const adminEmailsRaw = formData.get("adminEmails") as string | null;
    let adminNotificationEmails: string[];
    if (adminEmailsRaw) {
      try {
        adminNotificationEmails = JSON.parse(adminEmailsRaw);
        if (!Array.isArray(adminNotificationEmails)) {
          adminNotificationEmails = await getAdminNotificationEmails();
        }
      } catch {
        adminNotificationEmails = await getAdminNotificationEmails();
      }
    } else {
      adminNotificationEmails = await getAdminNotificationEmails();
    }

    // Build base URL from request headers
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "localhost:3000";
    const appBaseUrl = `${protocol}://${host}`;
    const logoUrl = appBaseUrl;

    const studentDetails = {
      firstName,
      lastName,
      gender,
      dateOfBirth: dateOfBirthRaw,
      email,
      phone,
      whatsappNumber,
      address,
      fathersName,
      mothersName,
      parentContact,
      courseLevel: courseLevelLabel,
      centerName,
      hostelFacility,
      highestQualification,
      studiedGerman,
      levelCompleted,
      purposeLearningGerman,
      workExperience,
      registrationId: Number(registrationId),
      photoUrl,
      logoUrl,
      submittedDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      submittedTime: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    console.log(
      "[finalize] Admin notification emails:",
      adminNotificationEmails,
    );

    // ── Prepare proof file buffer ────────────────────────────────────────────
    let proofBuffer: Buffer | null = null;
    try {
      if (proofFile) {
        const proofBytes = await proofFile.arrayBuffer();
        proofBuffer = Buffer.from(proofBytes);
      } else if (aadhaarUrl) {
        console.log(
          "[finalize] proofFile missing — fetching from aadhaarUrl:",
          aadhaarUrl,
        );
        const proofResponse = await fetch(aadhaarUrl);
        if (proofResponse.ok) {
          const proofBytes = await proofResponse.arrayBuffer();
          proofBuffer = Buffer.from(proofBytes);
          const proofMB = proofBuffer.byteLength / (1024 * 1024);
          console.log(
            `[finalize] Proof file fetched from URL successfully (${proofMB.toFixed(2)} MB)`,
          );
          if (proofMB > 4) {
            console.warn(
              `[finalize] Proof file from URL exceeds 4 MB (${proofMB.toFixed(2)} MB) — combined PDF may exceed 10 MB`,
            );
          }
        } else {
          console.error(
            "[finalize] Failed to fetch proof from URL:",
            proofResponse.status,
          );
        }
      }
    } catch (proofError) {
      console.error("[finalize] Proof file preparation failed:", proofError);
    }

    // ── Send registration emails via shared service ──────────────────────────
    const emailResult = await sendRegistrationEmails({
      studentDetails,
      courseLevelShort,
      centerEmail,
      photoUrl,
      aadhaarUrl,
      studentDocId,
      adminNotificationEmails,
      recipientType: "both",
      appBaseUrl,
      proofFile: proofBuffer || undefined,
      howDidYouHearAboutUs,
      howDidYouHearAboutUsOther,
    });

    console.log("[finalize] Finalization complete", emailResult);
    return NextResponse.json({
      success: true,
      message: "Finalization complete",
    });
  } catch (error) {
    console.error("[finalize] Finalize error:", error);
    return NextResponse.json(
      { error: "Internal server error during finalization" },
      { status: 500 },
    );
  }
}
