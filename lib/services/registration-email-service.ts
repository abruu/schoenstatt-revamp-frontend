import { Resend } from "resend";
import {
  generatePdfForRecipient,
  StudentData,
} from "@/lib/pdf-generator";

export type RecipientType = "student" | "admin" | "both";

export interface SendRegistrationEmailParams {
  studentDetails: StudentData;
  courseLevelShort: string;
  centerEmail: string;
  photoUrl: string;
  aadhaarUrl: string;
  studentDocId: string;
  adminNotificationEmails: string[];
  recipientType: RecipientType;
  appBaseUrl: string;
  proofFile?: Buffer;
  howDidYouHearAboutUs?: string;
  howDidYouHearAboutUsOther?: string;
}

export interface SendRegistrationEmailResult {
  adminEmailSent: boolean;
  studentEmailSent: boolean;
  adminPdfGenerated: boolean;
  studentPdfGenerated: boolean;
  errors: string[];
}

const resend = new Resend(process.env.RESEND_API_KEY!);

function buildAdminEmailHtml(params: {
  studentDetails: StudentData;
  courseLevelShort: string;
  photoUrl: string;
  aadhaarUrl: string;
  appBaseUrl: string;
  studentDocId: string;
  howDidYouHearAboutUs?: string;
  howDidYouHearAboutUsOther?: string;
}): string {
  const {
    studentDetails: s,
    courseLevelShort,
    photoUrl,
    aadhaarUrl,
    appBaseUrl,
    studentDocId,
    howDidYouHearAboutUs,
    howDidYouHearAboutUsOther,
  } = params;
  const logoUrl = appBaseUrl;

  return `
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
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Full Name</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 15px;">${s.firstName} ${s.lastName}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Date of Birth</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.dateOfBirth}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Email</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.email}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Phone</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.phone}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Address</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.address}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Course Level</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 15px;"><span style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a2e; padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">${courseLevelShort}</span></td></tr>
                  </table>
                </div>

                <!-- Parent Information -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 19px; font-weight: 700;">Parent Details</h3>
                  </div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Father's Name</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.fathersName}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Mother's Name</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.mothersName}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Contact</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.parentContact}</td></tr>
                  </table>
                </div>

                <!-- Educational & German Background -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 19px; font-weight: 700;">Educational Background</h3>
                  </div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Qualification</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.highestQualification || ""}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Studied German</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.studiedGerman ? "Yes" : "No"}${s.studiedGerman && s.levelCompleted ? ` (${s.levelCompleted})` : ""}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Learning Purpose</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${(s.purposeLearningGerman || []).join(", ")}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Work Experience</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.workExperience ? "Yes" : "No"}</td></tr>
                    <tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Hostel Required</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${s.hostelFacility ? "Yes" : "No"}</td></tr>
                  </table>
                </div>

                <!-- How Did You Hear About Us -->
                ${
                  howDidYouHearAboutUs
                    ? `
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 19px; font-weight: 700;">How Did You Hear About Us</h3>
                  </div>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; width: 40%; font-size: 14px;">Source</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${howDidYouHearAboutUs}</td></tr>
                    ${howDidYouHearAboutUs === "Other" && howDidYouHearAboutUsOther ? `<tr style="border-top: 1px solid #e2e8f0;"><td class="text-secondary" style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 14px;">Please Specify</td><td class="text-primary" style="padding: 10px 0; color: #1e293b; font-size: 15px;">${howDidYouHearAboutUsOther}</td></tr>` : ""}
                  </table>
                </div>
                `
                    : ""
                }

                <!-- Training Center -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div>
                      <h3 style="color: #0f172a; margin: 0 0 4px 0; font-size: 14px; font-weight: 600; opacity: 0.7;">Training Center</h3>
                      <p style="margin: 0; color: #0f172a; font-weight: 700; font-size: 18px;">${s.centerName}</p>
                    </div>
                  </div>
                </div>

                <!-- Photo & Aadhaar Buttons -->
                <div style="text-align: center; margin: 30px 0; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                  <a href="${photoUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4); transition: all 0.3s ease;">📸 View Student Photo</a>
                  <a href="${aadhaarUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4); transition: all 0.3s ease;">🪪 View Aadhaar Document</a>
                </div>

                <!-- View Student Record Button -->
                <div style="text-align: center; margin: 20px 0 30px 0;">
                  <a href="${appBaseUrl?.replace(/\/$/, "")}/admin/students/${studentDocId}" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a2e; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.4); transition: all 0.3s ease;">👤 Click Here to View Student</a>
                </div>

                <!-- Registration Meta -->
                <div class="section-card" style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; border-left: 5px solid #fbbf24;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 20px;">📋</span>
                    <h3 class="section-title" style="color: #0f172a; margin: 0; font-size: 17px; font-weight: 700;">Registration Details</h3>
                  </div>
                  <p class="text-secondary" style="margin: 8px 0; color: #64748b; font-size: 14px;"><strong>ID:</strong> <span style="background: #e2e8f0; padding: 4px 10px; border-radius: 6px; font-family: monospace; color: #0f172a; font-weight: 600;">#${s.registrationId}</span></p>
                  <p class="text-secondary" style="margin: 8px 0; color: #64748b; font-size: 14px;"><strong>Submitted:</strong> ${s.submittedDate} at ${s.submittedTime}</p>
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
        `;
}

function buildStudentEmailHtml(params: {
  studentDetails: StudentData;
  courseLevelShort: string;
  appBaseUrl: string;
}): string {
  const { studentDetails: s, courseLevelShort, appBaseUrl } = params;
  const logoUrl = appBaseUrl;

  return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">

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
                  <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 22px; font-weight: 600;">Welcome to Our Community! 🎉</h2>
                  <p style="color: #475569; margin: 0; font-size: 16px;">Your registration has been successfully submitted and is being processed.</p>
                </div>

                <!-- Registration Details -->
                <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                  <h3 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Your Registration Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 12px 0; font-weight: 600; color: #334155; width: 40%;">Name:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 500;">${s.firstName} ${s.lastName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 12px 0; font-weight: 600; color: #334155;">Date of Birth:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 500;">${s.dateOfBirth}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 12px 0; font-weight: 600; color: #334155;">Email:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 500;">${s.email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 12px 0; font-weight: 600; color: #334155;">Phone:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 500;">${s.phone}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 12px 0; font-weight: 600; color: #334155;">Course Level:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 500;">${courseLevelShort}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #cbd5e1;">
                      <td style="padding: 12px 0; font-weight: 600; color: #334155;">Training Center:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 500;">${s.centerName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; font-weight: 600; color: #334155;">Registration ID:</td>
                      <td style="padding: 12px 0; color: #0f172a; font-weight: 600; font-family: monospace; background: #e2e8f0; padding: 8px 12px; border-radius: 6px; display: inline-block;">${s.registrationId}</td>
                    </tr>
                  </table>
                </div>

                <!-- Next Steps -->
                <div style="background: #ecfdf5; border: 2px solid #86efac; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                  <h3 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What Happens Next?</h3>
                  <div>
                    <div style="margin-bottom: 12px;">
                      <p style="margin: 0; color: #0f172a; font-weight: 500;">✓ Our team will review your application</p>
                    </div>
                    <div style="margin-bottom: 12px;">
                      <p style="margin: 0; color: #0f172a; font-weight: 500;">✓ You will be contacted within 2-3 business days</p>
                    </div>
                    <div>
                      <p style="margin: 0; color: #0f172a; font-weight: 500;">✓ Please keep this email for your records</p>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div style="background: #faf5ff; border: 2px solid #d8b4fe; border-radius: 12px; padding: 20px; text-align: center;">
                  <h3 style="color: #0f172a; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📞 Need Help?</h3>
                  <p style="color: #475569; margin: 0; font-size: 14px;">If you have any questions, please contact us at your selected training center.</p>
                </div>

              </div>

              <!-- Footer -->
              <div style="background: #1e293b; padding: 25px 20px; text-align: center;">
                <p style="color: #cbd5e1; margin: 0 0 5px 0; font-size: 13px; font-weight: 500;">Schoenstatt Language Academy</p>
                <p style="color: #94a3b8; margin: 0; font-size: 11px;">This is an automated confirmation email • Please do not reply</p>
              </div>

            </div>
          </body>
          </html>
        `;
}

export async function sendRegistrationEmails(
  params: SendRegistrationEmailParams,
): Promise<SendRegistrationEmailResult> {
  const {
    studentDetails,
    courseLevelShort,
    centerEmail,
    photoUrl,
    aadhaarUrl,
    studentDocId,
    adminNotificationEmails,
    recipientType,
    appBaseUrl,
    proofFile,
    howDidYouHearAboutUs,
    howDidYouHearAboutUsOther,
  } = params;

  const result: SendRegistrationEmailResult = {
    adminEmailSent: false,
    studentEmailSent: false,
    adminPdfGenerated: false,
    studentPdfGenerated: false,
    errors: [],
  };

  const sendAdmin = recipientType === "admin" || recipientType === "both";
  const sendStudent = recipientType === "student" || recipientType === "both";

  // ── Admin email ──────────────────────────────────────────────────────────
  if (sendAdmin && centerEmail && photoUrl) {
    try {
      const cleanEmail = centerEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        throw new Error(`Invalid email format: ${cleanEmail}`);
      }

      // Generate admin PDF (student details + proof merged)
      let adminPdfBuffer: Buffer | null = null;
      try {
        adminPdfBuffer = await generatePdfForRecipient({
          studentDetails,
          proofFile: proofFile || undefined,
          recipientType: "admin",
        });
        result.adminPdfGenerated = true;
      } catch (pdfError) {
        console.error("[registration-email] Admin PDF generation failed:", pdfError);
        result.errors.push("Admin PDF generation failed");
      }

      const attachmentFilename = `${studentDetails.firstName}_${studentDetails.lastName}_${studentDetails.registrationId}_Registration.pdf`;

      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: cleanEmail,
        cc:
          adminNotificationEmails.length > 0
            ? adminNotificationEmails
            : undefined,
        subject: `🎓 New Student Registration - ${studentDetails.firstName} ${studentDetails.lastName}`,
        attachments: adminPdfBuffer
          ? [{ filename: attachmentFilename, content: adminPdfBuffer }]
          : undefined,
        html: buildAdminEmailHtml({
          studentDetails,
          courseLevelShort,
          photoUrl,
          aadhaarUrl,
          appBaseUrl,
          studentDocId,
          howDidYouHearAboutUs,
          howDidYouHearAboutUsOther,
        }),
      });
      result.adminEmailSent = true;
    } catch (emailError) {
      console.error("[registration-email] Admin email error:", emailError);
      result.errors.push("Failed to send admin email");
    }
  } else if (sendAdmin && (!centerEmail || !photoUrl)) {
    result.errors.push("Admin email skipped — missing centerEmail or photoUrl");
  }

  // ── Student email ────────────────────────────────────────────────────────
  if (sendStudent) {
    try {
      // Generate student PDF (details only, no proof)
      let studentPdfBuffer: Buffer | null = null;
      try {
        studentPdfBuffer = await generatePdfForRecipient({
          studentDetails,
          recipientType: "student",
        });
        result.studentPdfGenerated = true;
      } catch (pdfError) {
        console.error("[registration-email] Student PDF generation failed:", pdfError);
        result.errors.push("Student PDF generation failed");
      }

      const attachmentFilename = `${studentDetails.firstName}_${studentDetails.lastName}_${studentDetails.registrationId}_Registration.pdf`;

      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: studentDetails.email,
        subject: "Registration Confirmation - Schoenstatt Language Academy",
        attachments: studentPdfBuffer
          ? [{ filename: attachmentFilename, content: studentPdfBuffer }]
          : undefined,
        html: buildStudentEmailHtml({
          studentDetails,
          courseLevelShort,
          appBaseUrl,
        }),
      });
      result.studentEmailSent = true;
    } catch (confirmationError) {
      console.error("[registration-email] Student email error:", confirmationError);
      result.errors.push("Failed to send student email");
    }
  }

  return result;
}
