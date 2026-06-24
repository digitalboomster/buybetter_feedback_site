import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const c = await cookies();
  c.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
