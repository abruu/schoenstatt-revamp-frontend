import { NextRequest, NextResponse } from "next/server";
import { registerStudentInStrapi, checkStudentExists } from "@/lib/strapi-api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirthRaw = formData.get("dateOfBirth") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Pre-uploaded media IDs from upload-photo / upload-proof steps
    const photoId = formData.get("photoId") as string;
    const aadhaarId = formData.get("aadhaarId") as string;

    // Convert DD/MM/YYYY to YYYY-MM-DD for database storage
    const convertDateFormat = (ddmmyyyy: string): string => {
      const [day, month, year] = ddmmyyyy.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    const dateOfBirth = convertDateFormat(dateOfBirthRaw);
    const address = formData.get("address") as string;
    const fathersName = formData.get("fathersName") as string;
    const mothersName = formData.get("mothersName") as string;
    const parentContact = formData.get("parentContact") as string;
    const center = formData.get("center") as string;
    const courseLevel = formData.get("courseLevel") as string;
    const gender = formData.get("gender") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const isWhatsappSameAsPhone =
      formData.get("isWhatsappSameAsPhone") === "true";
    const hostelFacility = formData.get("hostelFacility") === "true";
    const highestQualification = formData.get("highestQualification") as string;
    const otherQualification = formData.get("otherQualification") as string;
    const studiedGerman = formData.get("studiedGerman") === "true";
    const levelCompleted = formData.get("levelCompleted") as string;
    const learningPurposeRaw = formData.getAll(
      "purposeLearningGerman",
    ) as string[];
    const purposeLearningGerman =
      learningPurposeRaw.length > 0 ? learningPurposeRaw : [];
    const workExperience = formData.get("workExperience") === "true";
    const howDidYouHearAboutUs = formData.get("howDidYouHearAboutUs") as string;
    const howDidYouHearAboutUsOther = formData.get(
      "howDidYouHearAboutUsOther",
    ) as string;

    // Determine final qualification value (use otherQualification if "Other" was selected)
    const finalQualification =
      highestQualification === "Other"
        ? otherQualification
        : highestQualification;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phone ||
      !address ||
      !fathersName ||
      !mothersName ||
      !parentContact ||
      !center ||
      !courseLevel ||
      hostelFacility === undefined ||
      hostelFacility === null ||
      !finalQualification ||
      studiedGerman === undefined ||
      studiedGerman === null ||
      !purposeLearningGerman ||
      workExperience === undefined ||
      workExperience === null
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!photoId || !aadhaarId) {
      return NextResponse.json(
        { error: "Photo and ID proof must be uploaded first" },
        { status: 400 },
      );
    }

    // Duplicate check (fallback in case the client-side validate step missed it)
    try {
      const duplicateResult = await checkStudentExists(
        email.toLowerCase().trim(),
        phone.trim(),
      );
      if (duplicateResult.exists) {
        return NextResponse.json(
          {
            error: `A registration already exists with this ${duplicateResult.field}. Please contact the institution if you need assistance.`,
            duplicate: true,
          },
          { status: 409 },
        );
      }
    } catch (dupCheckError) {
      console.error(
        "Duplicate check error in registration route:",
        dupCheckError,
      );
    }

    // Register student in Strapi (using pre-uploaded media IDs)
    let registrationData;
    try {
      registrationData = await registerStudentInStrapi({
        firstName,
        lastName,
        gender,
        dateOfBirth,
        email,
        phone,
        whatsappNumber,
        isWhatsappSameAsPhone,
        address,
        fathersName,
        mothersName,
        parentContact,
        center: center,
        photo: Number(photoId),
        aadhaarFile: Number(aadhaarId),
        courseLevel: courseLevel,
        hostelFacility,
        highestQualification: finalQualification,
        studiedGerman,
        levelCompleted,
        purposeLearningGerman,
        workExperience,
        howDidYouHearAboutUs: howDidYouHearAboutUs || undefined,
        howDidYouHearAboutUsOther: howDidYouHearAboutUsOther || undefined,
      });
    } catch (registrationError) {
      console.error("Registration error:", registrationError);
      const message =
        registrationError instanceof Error
          ? registrationError.message
          : "Unknown error";
      // Check if this is a duplicate conflict from Strapi
      if (message.includes("already exists")) {
        return NextResponse.json(
          {
            error: message,
            duplicate: true,
          },
          { status: 409 },
        );
      }
      return NextResponse.json(
        {
          error: "Failed to save registration data",
          details: message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully!",
      registrationData: registrationData.data,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
