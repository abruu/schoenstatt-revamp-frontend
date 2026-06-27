import { NextRequest, NextResponse } from "next/server";
import { uploadAadhaarToStrapi } from "@/lib/strapi-api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const aadhaarFile = formData.get("aadhaarFile") as File;
    const firstName = formData.get("firstName") as string;

    // Validate Aadhaar file
    if (!aadhaarFile) {
      return NextResponse.json(
        { error: "ID proof document is required" },
        { status: 400 },
      );
    }

    if (aadhaarFile.type !== "application/pdf") {
      return NextResponse.json(
        {
          error:
            "Invalid document type. The ID proof must be a PDF. Please re-upload using the document uploader.",
        },
        { status: 400 },
      );
    }

    if (aadhaarFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "Document file size too large. Please upload a file smaller than 5MB.",
        },
        { status: 400 },
      );
    }

    // Upload Aadhaar document to Strapi
    let aadhaarUploadResult;
    try {
      aadhaarUploadResult = await uploadAadhaarToStrapi(aadhaarFile, firstName);
    } catch (uploadError) {
      console.error("Aadhaar upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload ID proof document" },
        { status: 500 },
      );
    }

    // Build Aadhaar file URL
    const aadhaarFileUrl = aadhaarUploadResult.url.startsWith("http")
      ? aadhaarUploadResult.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "")}${aadhaarUploadResult.url}`;

    return NextResponse.json({
      success: true,
      aadhaarId: aadhaarUploadResult.id,
      aadhaarUrl: aadhaarFileUrl,
    });
  } catch (error) {
    console.error("Upload proof error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
