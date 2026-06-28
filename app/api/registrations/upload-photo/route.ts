import { NextRequest, NextResponse } from "next/server";
import { uploadPhotoToStrapi } from "@/lib/strapi-api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const photo = formData.get("photo") as File;
    const firstName = formData.get("firstName") as string;
    const turnstileToken = formData.get("turnstileToken") as string;

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security verification is required" },
        { status: 400 },
      );
    }

    // Verify Turnstile token with Cloudflare
    const turnstileVerifyUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const turnstileResponse = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult);
      return NextResponse.json(
        { error: "Security verification failed. Please try again." },
        { status: 400 },
      );
    }

    // Validate photo
    if (!photo) {
      return NextResponse.json(
        { error: "Photo is required" },
        { status: 400 },
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photo.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
        },
        { status: 400 },
      );
    }

    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "File size too large. Please upload an image smaller than 5MB.",
        },
        { status: 400 },
      );
    }

    // Upload photo to Strapi
    let photoUploadResult;
    try {
      photoUploadResult = await uploadPhotoToStrapi(photo, firstName);
    } catch (uploadError) {
      console.error("Photo upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 },
      );
    }

    // Build photo URL
    const photoUrl = (photoUploadResult as any).url
      ? (photoUploadResult as any).url.startsWith("http")
        ? (photoUploadResult as any).url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "")}${(photoUploadResult as any).url}`
      : `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "")}/uploads/${photoUploadResult.name}`;

    return NextResponse.json({
      success: true,
      photoId: photoUploadResult.id,
      photoUrl,
    });
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
