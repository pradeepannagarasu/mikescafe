import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Mike's Cafe, Notting Hill.",
};

export default function PrivacyPage() {
  return (
    <article className="section-pad mx-auto max-w-3xl py-28 md:py-36">
      <p className="text-[11px] tracking-[0.28em] uppercase text-copper mb-4">Legal</p>
      <h1 className="font-serif text-4xl md:text-5xl text-walnut">Privacy Policy</h1>
      <p className="mt-6 text-muted leading-relaxed">
        Mike&apos;s Cafe (&quot;we&quot;, &quot;us&quot;) respects your privacy. This notice explains what
        information we collect when you use our website and how we use it.
      </p>

      <section className="mt-12 space-y-8 text-walnut/85 leading-relaxed">
        <div>
          <h2 className="font-serif text-2xl mb-3">Information we collect</h2>
          <p>
            When you submit a reservation request, we collect your name, phone number, party size,
            preferred date and time, and any notes you provide. We do not sell your personal data.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">How we use it</h2>
          <p>
            Reservation details are used solely to manage bookings and communicate with you about
            your visit. Site analytics may be collected in aggregate if enabled by the café.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">Storage</h2>
          <p>
            Admin content edits made in the browser are stored locally on that device. Reservation
            submissions are processed by our servers and, if configured, forwarded to our booking
            tools.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">Contact</h2>
          <p>
            Questions about privacy:{" "}
            <a className="text-racing underline" href="mailto:hello@mikescafenottinghill.co.uk">
              hello@mikescafenottinghill.co.uk
            </a>
          </p>
        </div>
      </section>

      <Link href="/" className="inline-block mt-14 text-sm tracking-wide uppercase text-racing">
        ← Back to Mike&apos;s Cafe
      </Link>
    </article>
  );
}
