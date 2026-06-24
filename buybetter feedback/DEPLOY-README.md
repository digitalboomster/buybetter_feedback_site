# BuyBetter — In-store Feedback

A small full-stack app:

- **`/`** — the customer feedback form (the QR code points here). Step 1 (store + star ratings) is required; the rest can be skipped.
- **`/admin`** — password-protected page to view every response and export CSV.

Built with Next.js. Data is stored in Postgres (Neon, via Vercel). Nothing to install on a shopper's phone — it's a normal web page.

---

## What you need

1. A **GitHub** account (free) — to hold the code.
2. A **Vercel** account (free) — to host it.
3. About 15 minutes. (Kamsi can do this in 5.)

---

## Deploy — step by step

### 1. Put the code on GitHub
- Create a new repository on GitHub (e.g. `buybetter-feedback`), keep it private.
- Upload this whole folder to it. (Easiest: GitHub's "uploading an existing file" page, drag the folder contents in. Or `git push` if you're comfortable.)

### 2. Import into Vercel
- Go to vercel.com → **Add New… → Project** → pick your GitHub repo → **Import**.
- Don't deploy yet — first add the database and password (next two steps). If it deploys before that, just redeploy after.

### 3. Add the database (Neon)
- In your Vercel project: **Storage → Create Database → Neon (Postgres)** → follow the prompts.
- Vercel automatically adds the `DATABASE_URL` environment variable for you. You don't have to copy anything.
- The table is created automatically the first time a response is submitted — no SQL to run.

### 4. Set the admin password
- In your Vercel project: **Settings → Environment Variables**.
- Add: name `ADMIN_PASSWORD`, value = a strong password of your choice. Apply to Production.

### 5. Deploy
- **Deployments → Redeploy** (or it deploys automatically once connected).
- You'll get a URL like `https://buybetter-feedback.vercel.app`.

### 6. Point the QR code at it
- The form lives at the root URL. Generate a QR code from that link and you're live.
- The admin view is that same URL with `/admin` on the end.

---

## Day-to-day

- **View responses:** go to `your-url/admin`, type the password, see the table.
- **Export:** click **Export CSV** on the admin page.
- **Change the store list:** edit `lib/stores.js` and redeploy.
- **Change the rules/labels of the form:** edit `app/page.js`.
- **Change the admin password:** update `ADMIN_PASSWORD` in Vercel and redeploy. (This signs everyone out.)

## Run it locally (optional)
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` (from the Neon dashboard) and `ADMIN_PASSWORD`.
3. `npm run dev` → open http://localhost:3000

---

## Honest notes

- The admin login is a single shared password — fine for an internal tool, and enough for "log in to view responses." If you later want individual logins per person, that's a sensible upgrade Kamsi can add.
- Responses are stored unencrypted in the database (standard for this kind of tool). Don't collect anything more sensitive than the current fields without a rethink.
