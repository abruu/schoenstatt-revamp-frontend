import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  uploadPhotoToStrapi,
  registerStudentInStrapi,
  checkStudentExists,
  getAdminNotificationEmails,
} from "@/lib/strapi-api";
import { generateRegistrationPDF } from "@/lib/pdf-generator";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

// Helper function to mask Aadhaar number
function maskAadhaar(aadhaar: string): string {
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const photo = formData.get("photo") as File;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirthRaw = formData.get("dateOfBirth") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const turnstileToken = formData.get("turnstileToken") as string;

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
    const aadhaarNumber = formData.get("aadhaarNumber") as string;
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

    // Determine final qualification value (use otherQualification if "Other" was selected)
    const finalQualification =
      highestQualification === "Other"
        ? otherQualification
        : highestQualification;

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

    // Validate required fields
    if (
      !photo ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phone ||
      !address ||
      !fathersName ||
      !mothersName ||
      !parentContact ||
      !aadhaarNumber ||
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

    // Validate file type and size
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
      // 5MB limit
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
      photoUploadResult = await uploadPhotoToStrapi(photo);
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 },
      );
    }

    // Register student in Strapi
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
        aadhaarNumber,
        center: center,
        photo: photoUploadResult.id,
        courseLevel: courseLevel,
        hostelFacility,
        highestQualification: finalQualification,
        studiedGerman,
        levelCompleted,
        purposeLearningGerman,
        workExperience,
      });
    } catch (registrationError) {
      console.error("Registration error:", registrationError);
      return NextResponse.json(
        {
          error: "Failed to save registration data",
          details:
            registrationError instanceof Error
              ? registrationError.message
              : "Unknown error",
        },
        { status: 500 },
      );
    }

    // Get center data from registration response
    const centerData = registrationData.data.center;
    const courseLevelData = registrationData.data.courseLevel;

    const photoData = registrationData.data.photo;

    // Build photo URL - check if it's already an absolute URL
    const photoUrl = photoData.url.startsWith("http")
      ? photoData.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "")}${
          photoData.url
        }`;

    // Build logo URL for email - use deployed app URL or fallback to localhost
    const appBaseUrl = process.env.NEXT_LOGO_PATH;
    const logoUrl = `${appBaseUrl}`;

    // Fetch admin notification emails for CC
    const adminNotificationEmails = await getAdminNotificationEmails();
    console.log("Admin notification emails fetched:", adminNotificationEmails);

    // Debug email sending conditions
    console.log("Email sending debug:", {
      hasCenterData: !!centerData,
      centerEmail: centerData?.email,
      hasPhotoUrl: !!photoUrl,
      resendFrom: process.env.RESEND_FROM,
      resendApiKey: process.env.RESEND_API_KEY ? "Set" : "Missing",
      adminCCCount: adminNotificationEmails.length,
    });

    // Send email notification if center email is found
    if (centerData?.email && photoUrl) {
      try {
        // Clean and validate the email address
        const cleanEmail = centerData.email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
          console.error("Invalid email format:", cleanEmail);
          throw new Error(`Invalid email format: ${cleanEmail}`);
        }

        console.log("Attempting to send email to:", cleanEmail);
        console.log("CC recipients:", adminNotificationEmails);

        // Generate PDF attachment
        console.log("Generating PDF attachment...");
        let pdfBuffer: Buffer | null = null;
        try {
          pdfBuffer = await generateRegistrationPDF({
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
            aadhaarNumber,
            courseLevel: courseLevelData?.LabelFull || courseLevel,
            centerName: centerData?.name || center,
            hostelFacility,
            highestQualification: finalQualification,
            studiedGerman,
            levelCompleted,
            purposeLearningGerman,
            workExperience,
            registrationId: registrationData.data.id,
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
          });
          console.log(
            "PDF generated successfully, size:",
            pdfBuffer.length,
            "bytes",
          );
        } catch (pdfError) {
          console.error("PDF generation failed:", pdfError);
          // Continue with email even if PDF generation fails
        }

        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM!,
          to: cleanEmail,
          cc:
            adminNotificationEmails.length > 0
              ? adminNotificationEmails
              : undefined,
          subject: `🎓 New Student Registration - ${firstName} ${lastName}`,
          attachments: pdfBuffer
            ? [
                {
                  filename: `Registration_${firstName}_${lastName}_${registrationData.data.id}.pdf`,
                  content: pdfBuffer,
                },
              ]
            : undefined,
          html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">
            <title>New Student Registration</title>
            <style>
              :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
              }
              @media (prefers-color-scheme: dark) {
                .email-container { background: #1a1a2e !important; }
                .header-title { color: #ffffff !important; }
                .section-card { background: #252541 !important; border-color: #3a3a5c !important; }
                .section-title { color: #f1f5f9 !important; }
                .text-primary { color: #e2e8f0 !important; }
                .text-secondary { color: #94a3b8 !important; }
                .footer-bg { background: #0f0f1e !important; }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 20px 0;">
            <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);">

              <!-- Header -->
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 4s ease-in-out infinite;"></div>
                <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 16px; padding: 20px; display: inline-block; position: relative; z-index: 1;">
                  <img src="${logoUrl}" alt="SLA" style="height: 70px; margin-bottom: 15px;" />
                </div>
                <h1 class="header-title" style="color: #1a1a2e; margin: 20px 0 8px 0; font-size: 28px; font-weight: 800; position: relative; z-index: 1; letter-spacing: -0.5px;">New Student Registration</h1>
                <p style="color: rgba(26, 26, 46, 0.9); margin: 0; font-size: 15px; position: relative; z-index: 1; font-weight: 500;">Schoenstatt Language Academy</p>
              </div>

              <!-- Content -->
              <div style="padding: 35px 30px;">



                <!-- Student Information -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px; transition: all 0.3s ease;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">

                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 19px; font-weight: 700;">Student Information</h3>
                  </div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Full Name</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 15px;">${firstName} ${lastName}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Date of Birth</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${dateOfBirthRaw}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Email</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${email}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Phone</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${phone}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Address</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${address}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Aadhaar</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px; font-family: monospace;">${maskAadhaar(
                      aadhaarNumber,
                    )}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Course Level</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 15px;"><span style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a2e; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">${
                      courseLevelData?.LabelShort || courseLevel
                    }</span></td></tr>
                  </table>
                </div>

                <!-- Parent Information -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">

                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 19px; font-weight: 700;">Parent Details</h3>
                  </div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Father's Name</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${fathersName}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Mother's Name</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${mothersName}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Contact</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${parentContact}</td></tr>
                  </table>
                </div>

                <!-- Educational & German Background -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 19px; font-weight: 700;">Educational Background</h3>
                  </div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Qualification</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${finalQualification}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Studied German</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${studiedGerman ? "Yes" : "No"}${studiedGerman && levelCompleted ? ` (${levelCompleted})` : ""}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Learning Purpose</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${purposeLearningGerman.join(", ")}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Work Experience</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${workExperience ? "Yes" : "No"}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Hostel Required</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${hostelFacility ? "Yes" : "No"}</td></tr>
                  </table>
                </div>

                <!-- Training Center -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px;">

                    <div>
                      <h3 style="color: #0f172a; margin: 0 0 4px 0; font-size: 14px; font-weight: 600; opacity: 0.7;">Training Center</h3>
                      <p style="margin: 0; color: #0f172a; font-weight: 700; font-size: 18px;">${
                        centerData?.name || center
                      }</p>
                    </div>
                  </div>
                </div>

                <!-- Photo Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${photoUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4); transition: all 0.3s ease;">📸 View Student Photo</a>
                </div>

                <!-- Registration Meta -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; border-left: 5px solid #fbbf24;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 20px;">📋</span>
                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 17px; font-weight: 700;">Registration Details</h3>
                  </div>
                  <p class="text-secondary" style="margin: 8px 0; color: #64748b; font-size: 14px;"><strong>ID:</strong> <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 6px; font-family: monospace; color: #0f172a; font-weight: 600;">#${
                    registrationData.data.id
                  }</span></p>
                  <p class="text-secondary" style="margin: 8px 0; color: #64748b; font-size: 14px;"><strong>Submitted:</strong> ${new Date().toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "long", year: "numeric" },
                  )} at ${new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>
                </div>

              </div>

              <!-- Footer -->
              <div class="footer-bg" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center;">
                <p style="color: #cbd5e1; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Schoenstatt Language Academy</p>
                <p style="color: #64748b; margin: 0; font-size: 12px;">Automated notification • Do not reply to this email</p>
              </div>

            </div>
          </body>
          </html>
        `,
        });
        console.log("Institution email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Institution email sending error:", emailError);
        // Log the full error details for debugging
        if (emailError instanceof Error) {
          console.error("Error message:", emailError.message);
          console.error("Error stack:", emailError.stack);
        }
      }
    } else {
      console.log("Institution email not sent because:", {
        noCenterEmail: !centerData?.email,
        noPhotoUrl: !photoUrl,
        centerData,
      });
    }

    // Send confirmation email to candidate
    let pdfBuffer: Buffer | null = null;
    try {
      console.log("Sending confirmation email to candidate:", email);
      pdfBuffer = await generateRegistrationPDF({
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
        aadhaarNumber,
        courseLevel: courseLevelData?.LabelFull || courseLevel,
        centerName: centerData?.name || center,
        hostelFacility,
        highestQualification: finalQualification,
        studiedGerman,
        levelCompleted,
        purposeLearningGerman,
        workExperience,
        registrationId: registrationData.data.id,
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
      });
      const confirmationResult = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: email,
        subject: "Registration Confirmation - Schoenstatt Language Academy",
        attachments: pdfBuffer
          ? [
              {
                filename: `Registration_${firstName}_${lastName}_${registrationData.data.id}.pdf`,
                content: pdfBuffer,
              },
            ]
          : undefined,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">
            <title>Registration Confirmation</title>
            <style>
              :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
              }
              @media (prefers-color-scheme: dark) {
                .email-body { background: #0f0f1e !important; }
                .email-container { background: #1a1a2e !important; }
                .section-card { background: #252541 !important; border-color: #3a3a5c !important; }
                .section-title { color: #f1f5f9 !important; }
                .text-primary { color: #e2e8f0 !important; }
                .text-secondary { color: #94a3b8 !important; }
                .text-muted { color: #cbd5e1 !important; }
                .footer-bg { background: #0f0f1e !important; }
                .next-steps-card { background: #1e3a2e !important; border-color: #2d5a45 !important; }
                .help-card { background: #2e1e3a !important; border-color: #4a2d5a !important; }
              }
            </style>
          </head>
          <body class="email-body" style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">

              <!-- Header with Logo and Success Animation -->
              <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="success" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="2" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23success)"/></svg></div>
                <img src="${logoUrl}" alt="Schoenstatt Language Academy" style="height: 60px; margin-bottom: 20px; position: relative; z-index: 1;" />

                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; position: relative; z-index: 1;">Registration Confirmed!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; position: relative; z-index: 1;">Thank you for joining Schoenstatt Language Academy</p>
              </div>

              <!-- Content -->
              <div style="padding: 30px 20px;">

                <!-- Welcome Message -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 class="section-title" style="color: #1e293b; margin: 0 0 10px 0; font-size: 22px; font-weight: 600;">Welcome to Our Community! 🎉</h2>
                  <p class="text-muted" style="color: #64748b; margin: 0; font-size: 16px;">Your registration has been successfully submitted and is being processed.</p>
                </div>

                <!-- Registration Details -->
                <div class="section-card" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #fbbf24 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 class="section-title" style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; position: relative; z-index: 1;">Your Registration Details</h3>
                  <table style="width: 100%; border-collapse: collapse; position: relative; z-index: 1;">
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569; width: 40%;">Name:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500;">${firstName} ${lastName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569;">Date of Birth:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500;">${dateOfBirthRaw}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569;">Email:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500;">${email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569;">Phone:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500;">${phone}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569;">Course Level:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500;">${
                        courseLevelData?.LabelShort || courseLevel
                      }</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569;">Training Center:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500;">${
                        centerData?.name || center
                      }</td>
                    </tr>
                    <tr>
                      <td class="text-secondary" style="padding: 12px 0; font-weight: 600; color: #475569;">Registration ID:</td>
                      <td class="text-primary" style="padding: 12px 0; color: #1e293b; font-weight: 500; font-family: monospace; background: #f1f5f9; padding: 8px 12px; border-radius: 6px; display: inline-block;">${
                        registrationData.data.id
                      }</td>
                    </tr>
                  </table>
                </div>

                <!-- Next Steps -->
                <div class="next-steps-card" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 25px; margin-bottom: 25px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, #22c55e 0%, transparent 70%); opacity: 0.05;"></div>
                  <h3 class="section-title" style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">What Happens Next?</h3>
                  <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px;"></div>
                      <p class="text-primary" style="margin: 0; color: #1e293b; font-weight: 500;">Our team will review your application</p>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px;"></div>
                      <p class="text-primary" style="margin: 0; color: #1e293b; font-weight: 500;">You will be contacted within 2-3 business days</p>
                    </div>
                    <div style="display: flex; align-items: center;">
                      <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px;"></div>
                      <p class="text-primary" style="margin: 0; color: #1e293b; font-weight: 500;">Please keep this email for your records</p>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="help-card" style="background: linear-gradient(135deg, #fef7ff 0%, #faf5ff 100%); border: 1px solid #e9d5ff; border-radius: 12px; padding: 20px; text-align: center;">
                  <h3 class="section-title" style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📞 Need Help?</h3>
                  <p class="text-muted" style="color: #64748b; margin: 0; font-size: 14px;">If you have any questions, please contact us at your selected training center.</p>
                </div>

              </div>

              <!-- Footer -->
              <div class="footer-bg" style="background: #1e293b; padding: 25px 20px; text-align: center;">
                <p style="color: #94a3b8; margin: 0 0 5px 0; font-size: 13px; font-weight: 500;">Schoenstatt Language Academy</p>
                <p style="color: #64748b; margin: 0; font-size: 11px;">This is an automated confirmation email • Please do not reply</p>
              </div>

            </div>
          </body>
          </html>
        `,
      });

      console.log("Confirmation email sent successfully:", confirmationResult);
    } catch (confirmationError) {
      console.error("Confirmation email sending error:", confirmationError);
      // Don't fail the registration if confirmation email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully!",
      registrationId: registrationData.data,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
