import { isAdmin } from "../../../lib/auth";
import { getResponses } from "../../../lib/db";

export const dynamic = "force-dynamic";

const FIELDS = [
  "id", "created_at", "store", "rating_overall", "rating_staff", "rating_facilities",
  "recommend_staff", "complaint_category", "complaint_details", "suggestions",
];

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const rows = await getResponses();
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [FIELDS.join(",")]
    .concat(rows.map((r) => FIELDS.map((k) => esc(r[k])).join(",")))
    .join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="buybetter-feedback.csv"',
    },
  });
}
