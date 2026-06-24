"use client";

import { useEffect, useState } from "react";

function miniStars(n) {
  if (!n) return "—";
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function Admin() {
  const [authed, setAuthed] = useState(null); // null = checking
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadResponses() {
    setLoading(true);
    const res = await fetch("/api/responses", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setRows(data.rows || []);
    setAuthed(true);
    setLoading(false);
  }

  useEffect(() => {
    loadResponses();
  }, []);

  async function login(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setErr("Wrong password.");
      return;
    }
    setPassword("");
    loadResponses();
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setAuthed(false);
    setRows([]);
  }

  if (authed === null) {
    return (
      <div className="wrap">
        <p className="muted center" style={{ marginTop: 60 }}>Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="wrap">
        <div className="card center" style={{ marginTop: 56, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
          <div className="logo" />
          <p className="eyebrow">BuyBetter</p>
          <h1>Admin</h1>
          <p className="muted" style={{ marginTop: 6 }}>Sign in to view feedback.</p>
          <form onSubmit={login}>
            <label htmlFor="pw">Password</label>
            <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {err && <p className="note bad">{err}</p>}
            <button className="btn btn-block" style={{ marginTop: 18 }} type="submit">Sign in</button>
          </form>
        </div>
      </div>
    );
  }

  const total = rows.length;
  const withComplaints = rows.filter((r) => r.complaint_category).length;
  const avg =
    rows.filter((r) => r.rating_overall).length > 0
      ? (
          rows.reduce((a, r) => a + (r.rating_overall || 0), 0) /
          rows.filter((r) => r.rating_overall).length
        ).toFixed(1)
      : "—";

  return (
    <div className="wrap-wide">
      <div className="toolbar">
        <div>
          <p className="eyebrow">BuyBetter · In-store feedback</p>
          <h2>Responses</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a className="btn-ghost" href="/api/export">Export CSV</a>
          <button className="btn-ghost" onClick={loadResponses}>Refresh</button>
          <button className="btn-ghost" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat"><div className="n">{total}</div><div className="l">Responses</div></div>
        <div className="stat"><div className="n">{avg}</div><div className="l">Avg overall</div></div>
        <div className="stat"><div className="n">{withComplaints}</div><div className="l">Complaints</div></div>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : total === 0 ? (
        <div className="card"><p className="muted">No responses yet.</p></div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>When</th><th>Store</th><th>Overall</th><th>Staff</th><th>Store cond.</th>
                <th>Recommends</th><th>Complaint</th><th>Suggestions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{r.store}</td>
                  <td className="ministars">{miniStars(r.rating_overall)}</td>
                  <td className="ministars">{miniStars(r.rating_staff)}</td>
                  <td className="ministars">{miniStars(r.rating_facilities)}</td>
                  <td>{r.recommend_staff || "—"}</td>
                  <td>
                    {r.complaint_category ? (
                      <span>
                        <span className="tag bad">{r.complaint_category}</span>
                        {r.complaint_details ? <div style={{ marginTop: 4 }}>{r.complaint_details}</div> : null}
                      </span>
                    ) : "—"}
                  </td>
                  <td>{r.suggestions || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
