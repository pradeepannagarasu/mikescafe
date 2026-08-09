"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "Georgia, serif",
          background: "#f7f1e8",
          color: "#2c2118",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>
            Critical error
          </p>
          <h1 style={{ fontSize: "2.5rem", marginTop: 12 }}>La Piccola Deli</h1>
          <p style={{ opacity: 0.7, maxWidth: 420, margin: "1rem auto" }}>
            {error.message || "Something went wrong loading the site."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              background: "#1b3a2f",
              color: "#faf6f0",
              border: 0,
              padding: "12px 28px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
