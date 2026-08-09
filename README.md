# Mike's Cafe — Production Website

Premium Next.js site for **Mike's Cafe**, Notting Hill (est. 1962).

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin (PIN from `NEXT_PUBLIC_ADMIN_PIN`)

## Deploy on Cloudflare (Workers + OpenNext)

This app is configured for **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) — not a static `/dist` Pages build.

### Option A — Dashboard (Git connected)

In **Workers & Pages → Create → Connect to Git**:

| Setting | Value |
|---|---|
| Framework preset | **Next.js (OpenNext)** if available, otherwise **None** |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |
| Build output directory | **Leave empty** (do **not** use `/dist`) |
| Production branch | `main` |
| Root directory | `/` (repo root) |

**Important:** Do not set Build output directory to `/dist`. That is for Vite/static apps and will break this Next.js site.

Environment variables (Workers → Settings → Variables):

- `NEXT_PUBLIC_SITE_URL` = your live URL (e.g. `https://mikescafe.pages.dev` or custom domain)
- `NEXT_PUBLIC_ADMIN_PIN` = a strong PIN
- `RESERVATION_WEBHOOK_URL` = optional booking webhook

### Option B — CLI

```bash
npm run deploy
```

Local Workers preview:

```bash
npm run preview
```

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (no trailing slash) |
| `NEXT_PUBLIC_ADMIN_PIN` | Yes | PIN for `/admin` |
| `RESERVATION_WEBHOOK_URL` | Recommended | Zapier / Make / Slack / CRM webhook |

## Launch checklist

- [ ] Change `NEXT_PUBLIC_ADMIN_PIN` from the default
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live domain
- [ ] Connect `RESERVATION_WEBHOOK_URL` so bookings are delivered
- [ ] Replace Unsplash placeholders with café photography when available
- [ ] Confirm phone, email, and opening hours in admin or `src/lib/data.ts`

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP · Lenis · Embla · OpenNext Cloudflare · Wrangler

## Production features

- Cloudflare Workers deploy via OpenNext
- Security headers, Restaurant JSON-LD, sitemap, robots
- Reservation API with validation, honeypot, and rate limiting
- Reduced-motion support; deferred hero video
- Error / 404 pages, privacy & terms
- Lightweight admin CMS (browser localStorage) with session PIN auth
