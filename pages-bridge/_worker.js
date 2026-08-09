/**
 * Cloudflare Pages entry — proxies to the OpenNext Worker.
 * Pages Git builds should use `pages-bridge` as the output directory
 * while `npm run deploy` keeps the real app on Workers.
 */
export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL(request.url);
    target.hostname = "mikescafe.pradeepandigital.workers.dev";
    target.protocol = "https:";

    const headers = new Headers(request.headers);
    headers.set("X-Forwarded-Host", incoming.host);
    headers.set("X-Forwarded-Proto", "https");
    headers.delete("host");

    /** @type {RequestInit} */
    const init = {
      method: request.method,
      headers,
      redirect: "manual",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
      // Required for streaming request bodies in the Workers runtime
      init.duplex = "half";
    }

    const response = await fetch(target.toString(), init);
    return new Response(response.body, response);
  },
};
