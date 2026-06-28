import { NextResponse } from "next/server";
import { getAdminNotificationEmails } from "@/lib/strapi-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const emails = await getAdminNotificationEmails();
    return NextResponse.json(
      { emails },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Error fetching admin notification emails:", error);
    return NextResponse.json({ emails: [] });
  }
}
