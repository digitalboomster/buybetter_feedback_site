import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { getResponses } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  try {
    const rows = await getResponses();
    return NextResponse.json({ ok: true, rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Database error." }, { status: 500 });
  }
}
