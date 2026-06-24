import crypto from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "bb_admin";

// The cookie stores a hash of the admin password (never the password itself).
// Changing ADMIN_PASSWORD automatically invalidates old sessions.
export function expectedToken() {
  const pw = process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update("buybetter::" + pw).digest("hex");
}

export async function isAdmin() {
  const c = await cookies();
  const val = c.get(COOKIE)?.value;
  return Boolean(val) && val === expectedToken();
}
