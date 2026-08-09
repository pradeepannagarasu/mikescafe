# Mike's Cafe - Production Website

Premium Next.js site for **Mike's Cafe**, Notting Hill (est. 1962).

Live Worker: `https://mikescafe.pradeepandigital.workers.dev`

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (PIN from `NEXT_PUBLIC_ADMIN_PIN`, default `1962`)

## Deploy (Git → Cloudflare)

```
Edit → commit → push main → Cloudflare builds → live
```

**Build settings** (Workers & Pages → mikescafe → Settings → Builds):

| Setting | Value |
|---|---|
| Build command | `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` |
| Build output directory | `pages-bridge` |
| Production branch | `main` |

Optional CLI: `npm run deploy` (still push to Git so the repo stays the source of truth).

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (no trailing slash) |
| `NEXT_PUBLIC_ADMIN_PIN` | Yes | PIN for `/admin` - change before launch |
| `RESERVATION_WEBHOOK_URL` | Recommended | Zapier / Make / Slack / Sheets for bookings |

Set these in Cloudflare → Settings → Environment variables (Production).

## Launch checklist

- [x] Production build / typecheck
- [x] Security headers, SEO schema, sitemap, robots
- [x] Reservation API (validation, honeypot, rate limit)
- [x] Order bag + eat-in / collect bookings
- [x] Admin bookings tracker + export
- [ ] Change `NEXT_PUBLIC_ADMIN_PIN` from `1962`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your final domain
- [ ] Connect `RESERVATION_WEBHOOK_URL` for staff alerts
- [ ] Confirm phone / hours in admin after deploy

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP · Lenis · Embla · OpenNext Cloudflare · Wrangler
