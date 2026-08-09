import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center section-pad text-center">
      <p className="text-[11px] tracking-[0.3em] uppercase text-copper">404</p>
      <h1 className="font-serif text-4xl md:text-5xl text-walnut mt-3">Page not found</h1>
      <p className="mt-4 text-muted max-w-md">
        This page isn&apos;t on the menu. Head back to La Piccola Deli.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center px-6 bg-racing text-ivory text-[11px] tracking-[0.14em] uppercase rounded-sm"
      >
        Back home
      </Link>
    </main>
  );
}
