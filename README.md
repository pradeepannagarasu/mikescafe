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

In **Workers & Pages → mikescafe → Settings → Builds**:

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` |
| Build output directory | `pages-bridge` |
| Root directory | `/` |
| Production branch | `main` |

That keeps the real Next.js app on **Workers**, and makes **https://mikescafe.pages.dev** proxy to it.

**Do not** set output to `/dist` — that caused the 404s.

### Live URLs

- **https://mikescafe.pages.dev**
- **https://mikescafe.pradeepandigital.workers.dev**

### Option B — CLI

```bash
npm run deploy
```

This builds the Worker and refreshes the Pages bridge in one step.
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
