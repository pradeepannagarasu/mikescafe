# La Piccola Deli

Italian deli template site, panini, piadina, lasagna & mains. Eat in or collect.

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

Worker name in Cloudflare CI: `mikescafe` (must match Wrangler `name` + `WORKER_SELF_REFERENCE`). Bindings include `MIKES_BOOKINGS` KV for live bookings.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (no trailing slash) |
| `NEXT_PUBLIC_ADMIN_PIN` | Yes | PIN for `/admin` |
| `RESERVATION_WEBHOOK_URL` | Optional | Zapier / Make / Slack / Sheets |

## Notes

- Branding is **La Piccola Deli**; the Cloudflare worker project is still named `mikescafe` for deploy compatibility.
- Address / phone / hours: placeholders editable in Admin
