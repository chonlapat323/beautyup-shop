#!/usr/bin/env node
// Runs before `pnpm dev`: makes sure PostgreSQL is up, starting it with docker compose
// when needed, so the apps don't fail with long connection errors.
const net = require("node:net");
const { execSync } = require("node:child_process");
const { DB_PORT } = require("./ports.cjs");

const accepts = (port) =>
  new Promise((resolve) => {
    const s = net.connect({ port, host: "127.0.0.1" });
    s.setTimeout(800);
    s.once("connect", () => (s.destroy(), resolve(true)));
    s.once("timeout", () => (s.destroy(), resolve(false)));
    s.once("error", () => resolve(false));
  });

const fail = (lines) => {
  console.error(["", "✗ Cannot start dev servers", ...lines.map((l) => `  ${l}`), ""].join("\n"));
  process.exit(1);
};

(async () => {
  if (await accepts(DB_PORT)) return console.log(`✓ PostgreSQL is running on port ${DB_PORT}`);

  try {
    execSync("docker info", { stdio: "ignore" });
  } catch {
    fail([
      "Docker is not running, so the database cannot start.",
      "→ Open Docker Desktop, wait until it says \"Engine running\", then run `pnpm dev` again.",
      "  (Docker ยังไม่ได้เปิด: เปิด Docker Desktop รอจนขึ้น Engine running แล้วรัน pnpm dev ใหม่)",
    ]);
  }

  console.log("… starting PostgreSQL (docker compose up -d)");
  execSync("docker compose up -d", { stdio: "inherit" });
  for (let i = 0; i < 30; i++) {
    if (await accepts(DB_PORT)) return console.log(`✓ PostgreSQL is running on port ${DB_PORT}`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  fail([`PostgreSQL did not start on port ${DB_PORT}. Check \`docker compose logs postgres\`.`]);
})();
