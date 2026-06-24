"use client";

import { useState } from "react";
import { STORES } from "../lib/stores";

const COMPLAINT_CATEGORIES = ["Staff conduct", "Facilities / cleanliness", "Wait time", "Stock availability", "Other"];

function Stars({ value, onChange, label }) {
  return (
    <div>
      <div className="stars" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={"star" + (n <= value ? " on" : "")}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n === value ? 0 : n)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeedbackForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const [store, setStore] = useState("");
  const [overall, setOverall] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [facilities, setFacilities] = useState(0);
  const [recommend, setRecommend] = useState("");
  const [complaintCat, setComplaintCat] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [suggestions, setSuggestions] = useState("");

  async function submit() {
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store,
          rating_overall: overall,
          rating_staff: staffRating,
          rating_facilities: facilities,
          recommend_staff: recommend.trim(),
          complaint_category: complaintCat,
          complaint_details: complaintDetails.trim(),
          suggestions: suggestions.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="wrap">
        <div className="card center" style={{ marginTop: 48 }}>
          <div className="logo" />
          <p className="eyebrow">BuyBetter</p>
          <h1>Thank you.</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            Your feedback goes straight to the team. We read every one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="center" style={{ marginBottom: 18 }}>
        <div className="logo" />
        <p className="eyebrow">BuyBetter · In-store</p>
      </div>

      <div className="progress">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= step ? "on" : ""} />
        ))}
      </div>

      <div className="card">
        {/* STEP 1 — store + ratings (required) */}
        {step === 1 && (
          <div>
            <h2>How was your visit?</h2>
            <label htmlFor="store">Which store did you visit?</label>
            <select id="store" value={store} onChange={(e) => setStore(e.target.value)}>
              <option value="">Choose a store…</option>
              {STORES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <p className="q">Your overall rating of the store</p>
            <Stars value={overall} onChange={setOverall} label="Overall rating" />

            <p className="q">The staff</p>
            <p className="hint">How helpful and friendly was the team?</p>
            <Stars value={staffRating} onChange={setStaffRating} label="Staff rating" />

            <p className="q">The store itself</p>
            <p className="hint">Cleanliness, layout, facilities.</p>
            <Stars value={facilities} onChange={setFacilities} label="Facilities rating" />

            {err && <p className="note bad">{err}</p>}
            <div className="nav">
              <span />
              <button
                className="btn"
                disabled={!store || !overall}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
            {(!store || !overall) && (
              <p className="note soft">Pick a store and an overall rating to continue.</p>
            )}
          </div>
        )}

        {/* STEP 2 — staff shout-out / complaint (skippable) */}
        {step === 2 && (
          <div>
            <h2>Anything to flag?</h2>
            <p className="muted">Optional — skip if nothing stood out.</p>

            <label htmlFor="recommend">Want to recommend a staff member?</label>
            <input
              id="recommend"
              placeholder="Their name, and what they did well"
              value={recommend}
              onChange={(e) => setRecommend(e.target.value)}
            />

            <label htmlFor="cat">Or make a complaint?</label>
            <select id="cat" value={complaintCat} onChange={(e) => setComplaintCat(e.target.value)}>
              <option value="">No complaint</option>
              {COMPLAINT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {complaintCat && (
              <>
                <label htmlFor="cdetails">Tell us what happened</label>
                <textarea
                  id="cdetails"
                  placeholder="The more detail, the better we can act on it."
                  value={complaintDetails}
                  onChange={(e) => setComplaintDetails(e.target.value)}
                />
              </>
            )}

            <div className="nav">
              <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn-ghost" onClick={() => setStep(3)}>Skip</button>
                <button className="btn" onClick={() => setStep(3)}>Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — suggestions (skippable) + submit */}
        {step === 3 && (
          <div>
            <h2>Anything else?</h2>
            <p className="muted">Suggestions or general remarks — optional.</p>
            <label htmlFor="sugg">Your thoughts</label>
            <textarea
              id="sugg"
              placeholder="What would make your next visit better?"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
            />
            {err && <p className="note bad">{err}</p>}
            <div className="nav">
              <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn" disabled={sending} onClick={submit}>
                {sending ? "Sending…" : "Submit feedback"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
