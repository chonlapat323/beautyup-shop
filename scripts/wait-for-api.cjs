#!/usr/bin/env node
// Used by `pnpm dev` in apps/web: waits until the API answers /health, so the
// first page load does not fail while Nest is still compiling.
const url = process.argv[2] || process.env.API_HEALTH_URL || "http://localhost:4000/api/health";
const deadline = Date.now() + 60_000;

(async () => {
  let said = false;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return console.log(`✓ API ready (${url})`);
    } catch {}
    if (!said) console.log(`… waiting for API at ${url}`), (said = true);
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.warn(`! API not ready after 60s (${url}); starting the website anyway`);
})();
