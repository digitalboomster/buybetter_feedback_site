import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { expectedToken, COOKIE } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }
  const c = await cookies();
  c.set(COOKIE, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return NextResponse.json({ ok: true });
}
