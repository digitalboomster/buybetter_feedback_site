import { neon } from "@neondatabase/serverless";

// Lazily create the SQL client so the app can still build without DATABASE_URL set.
let _sql = null;
function sql() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// Creates the table on first use, so there's no separate migration step to run.
export async function ensureTable() {
  await sql()`
    CREATE TABLE IF NOT EXISTS responses (
      id                 BIGSERIAL PRIMARY KEY,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
      store              TEXT NOT NULL,
      rating_overall     INT,
      rating_staff       INT,
      rating_facilities  INT,
      recommend_staff    TEXT,
      complaint_category TEXT,
      complaint_details  TEXT,
      suggestions        TEXT
    )
  `;
}

export async function insertResponse(r) {
  await ensureTable();
  // Values are parameterised by the driver -> safe from SQL injection.
  await sql()`
    INSERT INTO responses
      (store, rating_overall, rating_staff, rating_facilities,
       recommend_staff, complaint_category, complaint_details, suggestions)
    VALUES
      (${r.store}, ${r.rating_overall}, ${r.rating_staff}, ${r.rating_facilities},
       ${r.recommend_staff}, ${r.complaint_category}, ${r.complaint_details}, ${r.suggestions})
  `;
}

export async function getResponses() {
  await ensureTable();
  return await sql()`SELECT * FROM responses ORDER BY created_at DESC LIMIT 2000`;
}
