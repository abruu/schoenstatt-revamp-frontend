import { NextResponse } from "next/server";
import { getAdminNotificationEmails } from "@/lib/strapi-api";

export async function GET() {
  try {
    const emails = await getAdminNotificationEmails();
    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching admin notification emails:", error);
    return NextResponse.json({ emails: [] });
  }
}
