import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center section-pad text-center bg-cream">
      <p className="text-[11px] tracking-[0.28em] uppercase text-copper mb-4">404</p>
      <h1 className="font-serif text-4xl md:text-6xl text-walnut">Page not found</h1>
      <p className="mt-4 text-muted max-w-md">
        This table isn&apos;t reserved. Head back to Mike&apos;s Cafe for breakfast.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center px-7 py-3.5 text-[13px] tracking-[0.14em] uppercase bg-racing text-ivory rounded-sm min-h-12"
      >
        Back home
      </Link>
    </div>
  );
}
