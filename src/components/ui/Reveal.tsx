"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  fallbackMs?: number;
  y?: number;
  delay?: number;
  once?: boolean;
  style?: CSSProperties;
};

function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReduceSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reliable scroll reveal — never leaves content stuck at opacity 0.
 */
export function Reveal({
  children,
  className,
  fallbackMs = 1800,
  y = 28,
  delay = 0,
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSyncExternalStore(subscribeReduce, getReduceSnapshot, () => false);
  const [shown, setShown] = useState(false);
  const visible = reduce || shown;

  useEffect(() => {
    if (reduce) return;

    const el = ref.current;
    if (!el) return;

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      queueMicrotask(() => setShown(true));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            if (once) io.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    io.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      show();
    }

    const t = window.setTimeout(show, fallbackMs);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [fallbackMs, once, reduce]);

  return (
    <div
      ref={ref}
      className={cn("reveal-base", visible && "reveal-in", className)}
      style={{
        ...style,
        ["--reveal-y" as string]: `${y}px`,
        ["--reveal-delay" as string]: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
