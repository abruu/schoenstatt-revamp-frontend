import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

interface StudentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentContact: string;
  aadhaarNumber: string;
  courseLevel: string;
  centerName: string;
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
          font-size: 11px;
          line-height: 1.4;
        }

        .header {
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #333;
        }

        .header h1 {
          font-size: 18px;
          margin-bottom: 3px;
        }

        .header p {
          font-size: 12px;
          color: #666;
        }

        .content {
          display: flex;
          gap: 15px;
        }

        .left-column {
          width: 120px;
          flex-shrink: 0;
        }

        .right-column {
          flex: 1;
        }

        .student-photo {
          width: 100px;
          height: 100px;
          border: 1px solid #333;
          object-fit: cover;
          display: block;
          margin-bottom: 5px;
        }

        .section {
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 5px;
          padding-bottom: 2px;
          border-bottom: 1px solid #999;
        }

        .info-row {
          display: flex;
          padding: 3px 0;
        }

        .info-label {
          width: 140px;
          font-weight: bold;
          color: #333;
        }

        .info-value {
          flex: 1;
          color: #000;
        }

        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #999;
          text-align: center;
          font-size: 9px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>STUDENT REGISTRATION FORM</h1>
        <p>Schoenstatt Language Academy</p>
        <p style="font-size: 10px; margin-top: 3px;">Registration ID: ${data.registrationId} | Date: ${data.submittedDate}</p>
      </div>

      <div class="content">
        <div class="left-column">
          <img src="${data.photoUrl}" alt="Student Photo" class="student-photo" />
          <p style="font-size: 9px; text-align: center; color: #666;">Student Photo</p>
        </div>

        <div class="right-column">
          <div class="section">
            <div class="section-title">Student Information</div>
            <div class="info-row">
              <div class="info-label">Full Name:</div>
              <div class="info-value">${data.firstName} ${data.lastName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Date of Birth:</div>
              <div class="info-value">${data.dateOfBirth}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${data.email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value">${data.phone}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Address:</div>
              <div class="info-value">${data.address}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Aadhaar Number:</div>
              <div class="info-value">${maskAadhaar(data.aadhaarNumber)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Course Level:</div>
              <div class="info-value"><strong>${data.courseLevel}</strong></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Parent/Guardian Information</div>
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${data.parentName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Contact:</div>
              <div class="info-value">${data.parentContact}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Training Center</div>
            <div class="info-row">
              <div class="info-label">Center Name:</div>
              <div class="info-value"><strong>${data.centerName}</strong></div>
            </div>
          </div>
        </div>
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
