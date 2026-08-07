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

## Production

```bash
npm run build
npm run start
```

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (no trailing slash) |
| `NEXT_PUBLIC_ADMIN_PIN` | Yes | PIN for `/admin` |
| `RESERVATION_WEBHOOK_URL` | Recommended | Zapier / Make / Slack / CRM webhook for bookings |

### Deploy (Vercel)

1. Push the repo and import in Vercel (London region preconfigured in `vercel.json`).
2. Set env vars in the Vercel project settings.
3. Deploy. Sitemap: `/sitemap.xml` · Robots: `/robots.txt`

### Launch checklist

- [ ] Change `NEXT_PUBLIC_ADMIN_PIN` from the default
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the live domain
- [ ] Connect `RESERVATION_WEBHOOK_URL` so bookings are delivered
- [ ] Replace Unsplash placeholders with café photography when available
- [ ] Confirm phone, email, and opening hours in admin or `src/lib/data.ts`

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP · Lenis · Embla

## Production features

- Security headers (HSTS, frame options, nosniff, referrer policy)
- Restaurant JSON-LD, Open Graph, Twitter cards, sitemap, robots
- Reservation API with validation, honeypot, and rate limiting
- Reduced-motion support; hero video deferred / skipped on mobile & slow networks
- Error / 404 / global error pages, privacy & terms
- Lightweight admin CMS (browser localStorage) with session PIN auth
