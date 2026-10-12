// Single source of truth for the ports used by beautyup-shop (PM2 + port check).
//
// Values come from, in order: environment variables, the root .env file, defaults.
// Defaults are for local development. On the server, copy .env.server.example to .env
// (docker compose reads the same file for DB_PORT).
const fs = require("node:fs");
const path = require("node:path");

function readRootEnv() {
  try {
    const text = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
    return Object.fromEntries(
      text
        .split(/\r?\n/)
        .map((l) => l.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"#\r\n]*)"?/))
        .filter(Boolean)
        .map((m) => [m[1], m[2].trim()]),
    );
  } catch {
    return {};
  }
}

const file = readRootEnv();
const get = (key, fallback) => process.env[key] || file[key] || fallback;
const num = (key, fallback) => {
  const v = get(key, "");
  return /^\d+$/.test(v) ? Number(v) : fallback;
};

const API_PORT = num("API_PORT", 4000);
const WEB_PORT = num("WEB_PORT", 3000);
const ADMIN_PORT = num("ADMIN_PORT", 3001);
const DB_PORT = num("DB_PORT", 5433);
/** Interface the apps listen on. 127.0.0.1 = only reachable through the reverse proxy (Caddy). */
const HOST = get("HOST", "0.0.0.0");

module.exports = {
  API_PORT,
  WEB_PORT,
  ADMIN_PORT,
  DB_PORT,
  HOST,
  ports: [
    { name: "api", port: API_PORT },
    { name: "web", port: WEB_PORT },
    { name: "admin", port: ADMIN_PORT },
    // PostgreSQL should already be up (docker compose) before the apps start
    { name: "postgres", port: DB_PORT, expectRunning: true },
  ],
};
