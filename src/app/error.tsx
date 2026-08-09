"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center section-pad text-center bg-cream">
      <p className="text-[11px] tracking-[0.28em] uppercase text-copper mb-4">Something went wrong</p>
      <h1 className="font-serif text-4xl md:text-5xl text-walnut">We spilled the tea</h1>
      <p className="mt-4 text-muted max-w-md">
        An unexpected error occurred. Please try again, or return home for lunch.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button type="button" onClick={reset} variant="primary">
          Try again
        </Button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-7 py-3.5 text-[13px] tracking-[0.14em] uppercase border border-walnut/20 rounded-sm min-h-12"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
