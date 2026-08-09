import type { Booking } from "@/types/booking";
import { BOOKING_STATUS_LABEL } from "@/lib/bookings-store";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function printBookingTicket(booking: Booking) {
  const kind =
    booking.fulfillment === "collect" ? "COLLECT ORDER" : "TABLE RESERVATION";
  const lines =
    booking.items.length > 0
      ? booking.items
          .map(
            (i) =>
              `<tr><td>${esc(String(i.qty))}× ${esc(i.name)}</td><td style="text-align:right">£${(
                i.price * i.qty
              ).toFixed(2)}</td></tr>`
          )
          .join("")
      : `<tr><td colspan="2">No menu items listed</td></tr>`;

  const logoUrl = `${window.location.origin}/images/logo.png`;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>La Piccola Deli, ${esc(kind)}</title>
  <style>
    @page { margin: 10mm; }
    body { font-family: Georgia, "Times New Roman", serif; color: #1a1a1a; padding: 12px; }
    .logo { display:block; height: 48px; width: auto; margin: 0 0 10px; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    .meta { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px; }
    .row { margin: 6px 0; font-size: 15px; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #555; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    td { padding: 4px 0; border-bottom: 1px solid #ddd; font-size: 14px; }
    .total { font-size: 20px; margin-top: 14px; }
    .notes { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #999; font-size: 14px; }
    .foot { margin-top: 18px; font-size: 11px; color: #666; }
  </style>
</head>
<body>
  <img class="logo" src="${logoUrl}" alt="La Piccola Deli" />
  <h1>La Piccola Deli</h1>
  <div class="meta">${esc(kind)} · ${esc(BOOKING_STATUS_LABEL[booking.status])}</div>
  <div class="row"><div class="label">Guest</div><strong>${esc(booking.name)}</strong></div>
  <div class="row"><div class="label">Phone</div>${esc(booking.phone)}</div>
  <div class="row"><div class="label">${booking.fulfillment === "collect" ? "Portions" : "Guests"}</div>${booking.guests}</div>
  <div class="row"><div class="label">When</div>${esc(booking.date)} at ${esc(booking.time)}</div>
  <table>${lines}</table>
  <div class="total">Total £${booking.total.toFixed(2)}</div>
  ${
    booking.notes
      ? `<div class="notes"><div class="label">Notes</div>${esc(booking.notes)}</div>`
      : ""
  }
  <div class="foot">${esc(booking.id)} · printed ${new Date().toLocaleString()}</div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };</script>
</body>
</html>`;

  const w = window.open("", "_blank", "noopener, noreferrer, width=480, height=720");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}
