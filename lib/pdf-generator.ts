import puppeteer, { Browser } from "puppeteer-core";
import { PDFDocument, rgb } from "pdf-lib";
import { getStrapiBaseUrl } from "@/lib/constants";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type RecipientType = "admin" | "student";

export interface GeneratePdfOptions {
  studentDetails: StudentData;
  proofFile?: Buffer;
  recipientType: RecipientType;
}

/**
 * Generates the final PDF buffer based on recipient type.
 *
 * - admin:   student details page + all pages of proofFile merged into one PDF
 * - student: student details page only; proofFile is never included
 *
 * Does NOT send any email — the caller handles that.
 */
export async function generatePdfForRecipient(
  options: GeneratePdfOptions,
): Promise<Buffer> {
  const { studentDetails, proofFile, recipientType } = options;

  if (recipientType === "admin" && !proofFile) {
    throw new Error(
      "proofFile is required for admin recipient but was not provided.",
    );
  }

  // Generate the student details PDF page
  const studentPdfBuffer = await generateRegistrationPDF(studentDetails);

  if (recipientType === "student") {
    return studentPdfBuffer;
  }

  // recipientType === "admin": merge studentPdf + proofFile
  const merged = await PDFDocument.create();

  // Copy student details pages
  const studentDoc = await PDFDocument.load(studentPdfBuffer);
  const studentPages = await merged.copyPages(
    studentDoc,
    studentDoc.getPageIndices(),
  );
  studentPages.forEach((p) => merged.addPage(p));

  // Copy proof pages
  let proofDoc: PDFDocument;
  try {
    proofDoc = await PDFDocument.load(proofFile!);
  } catch (err: any) {
    const msg: string = err?.message ?? "";
    if (
      msg.toLowerCase().includes("encrypt") ||
      msg.toLowerCase().includes("password")
    ) {
      throw new Error(
        "The uploaded proof PDF is password protected and cannot be merged.",
      );
    }
    throw new Error(
      "The uploaded proof file appears to be corrupted and cannot be merged.",
    );
  }

  const proofPages = await merged.copyPages(
    proofDoc,
    proofDoc.getPageIndices(),
  );
  proofPages.forEach((p) => merged.addPage(p));

  // Draw "ID Proof" header at the top of the first proof page
  const helvBold = await merged.embedFont("Helvetica-Bold");
  const firstProofPage = proofPages[0];
  const { width: pw, height: ph } = firstProofPage.getSize();
  const headerText = "ID Proof";
  const headerSize = 14;
  firstProofPage.drawText(headerText, {
    x: pw / 2 - helvBold.widthOfTextAtSize(headerText, headerSize) / 2,
    y: ph - 20,
    size: headerSize,
    font: helvBold,
    color: rgb(0, 0, 0),
  });

  // Add page numbers to all pages
  const helvSmall = await merged.embedFont("Helvetica");
  const totalPages = merged.getPageCount();
  merged.getPages().forEach((page, idx) => {
    const pageLabel = `Page ${idx + 1} of ${totalPages}`;
    const textWidth = helvSmall.widthOfTextAtSize(pageLabel, 9);
    const { width } = page.getSize();
    page.drawText(pageLabel, {
      x: width - textWidth - 20,
      y: 12,
      size: 9,
      font: helvSmall,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  const mergedBytes = await merged.save();
  const finalBuffer = Buffer.from(mergedBytes);

  if (finalBuffer.byteLength > 10 * 1024 * 1024) {
    console.warn(
      "[pdf-generator] Admin combined PDF exceeds 10 MB:",
      (finalBuffer.byteLength / (1024 * 1024)).toFixed(2),
      "MB",
    );
  }

  return finalBuffer;
}
export interface StudentData {
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address: string;
  fathersName: string;
  mothersName: string;
  parentContact: string;
  courseLevel: string;
  centerName: string;
  hostelFacility?: boolean;
  highestQualification?: string;
  studiedGerman?: boolean;
  levelCompleted?: string;
  purposeLearningGerman?: string[];
  workExperience?: boolean;
  registrationId: number;
  photoUrl: string;
  logoUrl?: string;
  submittedDate: string;
  submittedTime: string;
}

function generatePDFHTML(data: StudentData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Student Registration - ${data.firstName} ${data.lastName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          padding: 16px;
          font-size: 14px;
          line-height: 1.4;
        }

        .header {
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 2px solid #333;
        }

        .header-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-logo {
          flex-shrink: 0;
          height: 60px;
          object-fit: contain;
          display: block;
        }

        .header-text {
          flex: 1;
          text-align: center;
        }

        .header-text h1 {
          font-size: 21px;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
        }

        .header-text p {
          font-size: 15px;
          color: #555;
        }

        .header-meta {
          margin-top: 5px;
          text-align: center;
          font-size: 10px;
          color: #444;
          margin-left:10px;
        }

        .content {
          display: flex;
          gap: 14px;
        }

        .left-column {
          width: 140px;
          flex-shrink: 0;
           margin-top:6px;
        }

        .right-column {
          flex: 1;
          margin-top:6px;
        }

        .student-photo {
          width: 130px;
          height: 130px;
          border: 1px solid #333;
          object-fit: cover;
          display: block;
          margin-bottom: 4px;
        }

        .section {
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 15.5px;
          font-weight: bold;
          margin-bottom: 6px;
          padding-bottom: 3px;
          border-bottom: 1.5px solid #888;
          color: #1a1a2e;
          letter-spacing: 0.3px;
        }

        .info-row {
          display: flex;
          padding: 3.5px 0;
        }

        .info-label {
          width: 165px;
          font-weight: bold;
          color: #444;
          font-size: 13px;
        }

        .info-value {
          flex: 1;
          color: #111;
          font-size: 14.5px;
          font-weight: 500;
        }

        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 6px 16px;
          border-top: 1px solid #999;
          text-align: center;
          font-size: 11px;
          color: #666;
          background: #fff;
        }

        .declaration {
          margin-top: 14px;
          padding: 10px 12px;
          border: 1px solid #ccc;
          background: #f9f9f9;
          font-size: 12px;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-top">
          ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Logo" class="header-logo" onerror="this.style.display='none'" />` : ""}
          <div class="header-text">
            <h1>STUDENT REGISTRATION FORM</h1>
            <p>Schoenstatt Language Academy</p>
          </div>
        </div>
        <div class="header-meta">Registration ID: ${data.registrationId} &nbsp;|&nbsp; Date: ${data.submittedDate}</div>
      </div>


      <div class="content">
        <div class="left-column">
          <img src="${data.photoUrl}" alt="Student Photo" class="student-photo" />
          <p style="font-size: 11px; text-align: center; color: #666;">Student Photo</p>
        </div>

        <div class="right-column">
          <!-- Personal Information -->
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="info-row">
              <div class="info-label">Full Name:</div>
              <div class="info-value">${data.firstName} ${data.lastName}</div>
            </div>
            ${data.gender ? `<div class="info-row"><div class="info-label">Gender:</div><div class="info-value">${data.gender}</div></div>` : ""}
            <div class="info-row">
              <div class="info-label">Date of Birth:</div>
              <div class="info-value">${data.dateOfBirth}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${data.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Mobile:</div>
              <div class="info-value">${data.phone}</div>
            </div>
            ${data.whatsappNumber ? `<div class="info-row"><div class="info-label">WhatsApp:</div><div class="info-value">${data.whatsappNumber}</div></div>` : ""}
            <div class="info-row">
              <div class="info-label">Address:</div>
              <div class="info-value">${data.address}</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Parent Details -->
      <div class="section">
        <div class="section-title">Parent Details</div>
        <div class="info-row">
          <div class="info-label">Father's Name:</div>
          <div class="info-value">${data.fathersName}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Mother's Name:</div>
          <div class="info-value">${data.mothersName}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Parent Contact:</div>
          <div class="info-value">${data.parentContact}</div>
        </div>
      </div>

      <!-- Course Information -->
      <div class="section">
        <div class="section-title">Course Information</div>
        <div class="info-row">
          <div class="info-label">Training Center:</div>
          <div class="info-value"><strong>${data.centerName}</strong></div>
        </div>
        <div class="info-row">
          <div class="info-label">Course Level:</div>
          <div class="info-value"><strong>${data.courseLevel}</strong></div>
        </div>
        ${data.hostelFacility !== undefined ? `<div class="info-row"><div class="info-label">Hostel Required:</div><div class="info-value">${data.hostelFacility ? "Yes" : "No"}</div></div>` : ""}
      </div>

      <!-- Educational Qualification -->
      <div class="section">
        <div class="section-title">Educational Qualification</div>
        ${data.highestQualification ? `<div class="info-row"><div class="info-label">Qualification:</div><div class="info-value">${data.highestQualification}</div></div>` : ""}
      </div>

      <!-- German Language Background -->
      <div class="section">
        <div class="section-title">German Language Background</div>
        ${data.studiedGerman !== undefined ? `<div class="info-row"><div class="info-label">Studied German:</div><div class="info-value">${data.studiedGerman ? "Yes" : "No"}${data.studiedGerman && data.levelCompleted ? ` (${data.levelCompleted})` : ""}</div></div>` : ""}
        ${
          data.purposeLearningGerman && data.purposeLearningGerman.length > 0
            ? `<div class="info-row"><div class="info-label">Learning Purpose:</div><div class="info-value">${
                data.purposeLearningGerman
                  ?.flatMap((v) => v.split(","))
                  .map((v) => v.trim())
                  .filter(Boolean)
                  .join(", ") || ""
              }</div></div>`
            : ""
        }
        ${data.workExperience !== undefined ? `<div class="info-row"><div class="info-label">Work Experience:</div><div class="info-value">${data.workExperience ? "Yes" : "No"}</div></div>` : ""}
      </div>

      <!-- Declaration -->
      <div class="declaration">
        <strong>Declaration:</strong> I hereby declare that the information provided is true and correct to the best of my knowledge.
      </div>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })} at ${new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })} | Schoenstatt Language Academy</p>
      </div>
    </body>
    </html>
  `;
}

export function formatStudentDataForPDF(
  student: any,
  baseUrl: string,
): StudentData {
  const strapiUrl = getStrapiBaseUrl();

  let photoUrl = "";
  if (student.photo?.url) {
    photoUrl = student.photo.url.startsWith("http")
      ? student.photo.url
      : `${strapiUrl}${student.photo.url}`;
  }

  const createdDate = new Date(student.createdAt);

  return {
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    gender: student.gender,
    dateOfBirth: student.dateOfBirth
      ? new Date(student.dateOfBirth).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    email: student.email || "",
    phone: student.phone || "",
    whatsappNumber: student.whatsappNumber,
    address: student.address || "",
    fathersName: student.fathersName || student.parentName || "",
    mothersName: student.mothersName || "",
    parentContact: student.parentContact || "",
    courseLevel: student.courseLevel?.LabelFull || "Not assigned",
    centerName: student.center?.name || "Not assigned",
    hostelFacility: student.hostelFacility,
    highestQualification:
      student.highestQualification === "Other"
        ? student.otherQualification
        : student.highestQualification,
    studiedGerman: student.studiedGerman,
    levelCompleted: student.levelCompleted,
    purposeLearningGerman: student.purposeLearningGerman,
    workExperience: student.workExperience,
    registrationId: student.id,
    photoUrl,
    logoUrl: `${baseUrl}/images/logo.png`,
    submittedDate: createdDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    submittedTime: createdDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export async function generateStudentPDF(
  student: any,
  baseUrl: string,
): Promise<Buffer> {
  const studentData = formatStudentDataForPDF(student, baseUrl);
  return generateRegistrationPDF(studentData);
}

export async function generateRegistrationPDF(
  studentData: StudentData,
): Promise<Buffer> {
  let browser: Browser | null = null;

  try {
    const isDev = process.env.NODE_ENV !== "production";

    const executablePath = isDev
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : "/usr/bin/chromium"; // installed via Docker on Railway

    console.log("PDF Generation Environment:", {
      isDev,
      nodeEnv: process.env.NODE_ENV,
      executablePath,
    });

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--no-zygote",
        "--single-process",
      ],
    });

    const page = await browser.newPage();

    // Fetch the student photo server-side and embed as a data URL.
    // This avoids network requests during page.setContent (which would
    // prevent networkidle0 from settling) and prevents Puppeteer from
    // embedding an oversized remote image in the PDF.
    const fetchAsDataUrl = async (
      url: string,
      timeoutMs = 10000,
    ): Promise<string | null> => {
      if (!url || url.startsWith("data:")) return url;
      try {
        const resp = await fetch(url, {
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          const mime = resp.headers.get("content-type") || "image/jpeg";
          return `data:${mime};base64,${buf.toString("base64")}`;
        }
      } catch (err) {
        console.warn(
          `[pdf-generator] Fetch failed for ${url}:`,
          err instanceof Error ? err.message : err,
        );
      }
      return null;
    };

    let photoUrlForPdf = studentData.photoUrl;
    const fetchedPhoto = await fetchAsDataUrl(studentData.photoUrl);
    if (fetchedPhoto) photoUrlForPdf = fetchedPhoto;

    // Also fetch the logo as a data URL to avoid any network requests
    let logoDataUrl: string | null = null;
    if (process.env.NEXT_LOGO_PATH) {
      logoDataUrl = await fetchAsDataUrl(process.env.NEXT_LOGO_PATH);
    }

    const htmlContent = generatePDFHTML({
      ...studentData,
      photoUrl: photoUrlForPdf,
      logoUrl: logoDataUrl || undefined,
    });

    // Use domcontentloaded since all images are now data URLs —
    // no network requests to wait for.
    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.emulateMediaType("screen");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      nodeEnv: process.env.NODE_ENV,
    });
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}
