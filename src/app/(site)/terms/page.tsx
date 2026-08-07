import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Mike's Cafe website.",
};

export default function TermsPage() {
  return (
    <article className="section-pad mx-auto max-w-3xl py-28 md:py-36">
      <p className="text-[11px] tracking-[0.28em] uppercase text-copper mb-4">Legal</p>
      <h1 className="font-serif text-4xl md:text-5xl text-walnut">Terms of Use</h1>
      <p className="mt-6 text-muted leading-relaxed">
        By using the Mike&apos;s Cafe website you agree to these terms. The site is provided for
        information and reservation enquiries.
      </p>

      <section className="mt-12 space-y-8 text-walnut/85 leading-relaxed">
        <div>
          <h2 className="font-serif text-2xl mb-3">Reservations</h2>
          <p>
            Online requests are not confirmed until we reply by phone or message. We may decline or
            amend bookings subject to availability and opening hours.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">Content</h2>
          <p>
            Menu items, prices and hours may change without notice. Photographs are illustrative.
            Please contact the café for the latest information.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">Liability</h2>
          <p>
            We aim to keep the website accurate and available, but we do not guarantee uninterrupted
            access or error-free content.
          </p>
        </div>
      </section>

      <Link href="/" className="inline-block mt-14 text-sm tracking-wide uppercase text-racing">
        ← Back to Mike&apos;s Cafe
      </Link>
    </article>
  );
}
