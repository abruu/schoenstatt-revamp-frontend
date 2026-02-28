import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

interface StudentData {
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
  aadhaarNumber: string;
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
  logoUrl: string;
  submittedDate: string;
  submittedTime: string;
}

function maskAadhaar(aadhaar: string): string {
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
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
          padding: 20px;
          font-size: 10px;
          line-height: 1.3;
        }

        .header {
          text-align: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #333;
        }

        .header h1 {
          font-size: 16px;
          margin-bottom: 2px;
        }

        .header p {
          font-size: 11px;
          color: #666;
        }

        .content {
          display: flex;
          gap: 12px;
        }

        .left-column {
          width: 100px;
          flex-shrink: 0;
        }

        .right-column {
          flex: 1;
        }

        .student-photo {
          width: 90px;
          height: 90px;
          border: 1px solid #333;
          object-fit: cover;
          display: block;
          margin-bottom: 4px;
        }

        .section {
          margin-bottom: 8px;
        }

        .section-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 4px;
          padding-bottom: 2px;
          border-bottom: 1px solid #999;
          color: #1a1a2e;
        }

        .info-row {
          display: flex;
          padding: 2px 0;
        }

        .info-label {
          width: 120px;
          font-weight: bold;
          color: #333;
          font-size: 9px;
        }

        .info-value {
          flex: 1;
          color: #000;
          font-size: 9px;
        }

        .footer {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #999;
          text-align: center;
          font-size: 8px;
          color: #666;
        }

        .declaration {
          margin-top: 10px;
          padding: 8px;
          border: 1px solid #ccc;
          background: #f9f9f9;
          font-size: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>STUDENT REGISTRATION FORM</h1>
        <p>Schoenstatt Language Academy</p>
        <p style="font-size: 9px; margin-top: 2px;">Registration ID: ${data.registrationId} | Date: ${data.submittedDate}</p>
      </div>

      <div class="content">
        <div class="left-column">
          <img src="${data.photoUrl}" alt="Student Photo" class="student-photo" />
          <p style="font-size: 8px; text-align: center; color: #666;">Student Photo</p>
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

          <!-- Identification -->
          <div class="section">
            <div class="section-title">Identification</div>
            <div class="info-row">
              <div class="info-label">Aadhaar Number:</div>
              <div class="info-value">${maskAadhaar(data.aadhaarNumber)}</div>
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
            ${data.purposeLearningGerman && data.purposeLearningGerman.length > 0 ? `<div class="info-row"><div class="info-label">Learning Purpose:</div><div class="info-value">${data.purposeLearningGerman.join(", ")}</div></div>` : ""}
            ${data.workExperience !== undefined ? `<div class="info-row"><div class="info-label">Work Experience:</div><div class="info-value">${data.workExperience ? "Yes" : "No"}</div></div>` : ""}
          </div>
        </div>
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

export async function generateRegistrationPDF(
  studentData: StudentData,
): Promise<Buffer> {
  let browser = null;

  try {
    const isDev = process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isDev
        ? puppeteer.defaultArgs()
        : [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      executablePath: isDev
        ? process.env.PUPPETEER_EXECUTABLE_PATH ||
          "/usr/bin/google-chrome-stable" ||
          "/usr/bin/chromium-browser"
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    const htmlContent = generatePDFHTML(studentData);

    await page.setContent(htmlContent, {
      waitUntil: ["networkidle0", "load"],
    });

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
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
