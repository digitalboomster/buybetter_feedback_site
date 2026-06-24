import { NextResponse } from "next/server";
import { insertResponse } from "../../../lib/db";

export const dynamic = "force-dynamic";

const star = (v) => (Number.isFinite(v) && v >= 1 && v <= 5 ? Math.round(v) : null);
const text = (v, n) => (v ? String(v).slice(0, n) : null);

export async function POST(req) {
  const b = await req.json().catch(() => null);
  if (!b || !b.store) {
    return NextResponse.json({ ok: false, error: "Please choose a store." }, { status: 400 });
  }
  try {
    await insertResponse({
      store: text(b.store, 120),
      rating_overall: star(b.rating_overall),
      rating_staff: star(b.rating_staff),
      rating_facilities: star(b.rating_facilities),
      recommend_staff: text(b.recommend_staff, 500),
      complaint_category: text(b.complaint_category, 80),
      complaint_details: text(b.complaint_details, 2000),
      suggestions: text(b.suggestions, 2000),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Could not save. Is DATABASE_URL set correctly?" },
      { status: 500 }
    );
  }
}
