#!/usr/bin/env node
// Run before starting beautyup-shop with PM2. Checks that:
//   1. our PM2 app names are not already used by another project on the server
//   2. our ports are free, or held by our own running apps (when redeploying)
//   3. PostgreSQL is reachable
//
//   node scripts/check-ports.cjs
//   API_PORT=4100 WEB_PORT=3100 ADMIN_PORT=3101 node scripts/check-ports.cjs
//
// Exits with code 1 when something would conflict.
const net = require("node:net");
const path = require("node:path");
const { execSync } = require("node:child_process");
const { ports } = require("./ports.cjs");

const ROOT = path.resolve(__dirname, "..");
const ecosystem = require(path.join(ROOT, "ecosystem.config.cjs"));
const appForPort = { api: "beautyup-shop-api", web: "beautyup-shop-web", admin: "beautyup-shop-admin" };

const run = (cmd) => {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
};

/** Something accepts connections on the port (works where bind checks are unreliable, e.g. Docker on Windows). */
function accepts(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });
    socket.setTimeout(800);
    socket.once("connect", () => (socket.destroy(), resolve(true)));
    socket.once("timeout", () => (socket.destroy(), resolve(false)));
    socket.once("error", () => resolve(false));
  });
}

/** The port cannot be bound. */
function bindFails(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(true));
    srv.once("listening", () => srv.close(() => resolve(false)));
    srv.listen(port, "0.0.0.0");
  });
}

const inUse = async (port) => (await accepts(port)) || (await bindFails(port));

/** Best effort: which process holds the port. */
function owner(port) {
  if (process.platform === "win32") {
    const line = run("netstat -ano")
      .split("\n")
      .find((l) => /LISTENING/.test(l) && new RegExp(`:${port}\\s`).test(l));
    const pid = line?.trim().split(/\s+/).pop();
    if (!pid) return "";
    const name = run(`tasklist /FI "PID eq ${pid}" /NH`).split(/\s+/)[0];
    return `pid ${pid}${name ? ` (${name})` : ""}`;
  }
  const lsof = run(`lsof -nP -iTCP:${port} -sTCP:LISTEN`).split("\n")[1];
  if (lsof) {
    const [cmd, pid] = lsof.split(/\s+/);
    return `pid ${pid} (${cmd})`;
  }
  const m = run(`ss -ltnp 'sport = :${port}'`).match(/users:\(\("([^"]+)",pid=(\d+)/);
  return m ? `pid ${m[2]} (${m[1]})` : "";
}

/** Processes PM2 knows about (empty when PM2 is not installed). */
function pm2List() {
  const out = run("pm2 jlist");
  try {
    return JSON.parse(out.slice(out.indexOf("[")));
  } catch {
    return [];
  }
}

(async () => {
  let problems = 0;
  const running = pm2List();
  const ours = new Set();

  console.log("PM2 names");
  if (!running.length) console.log("  (pm2 not installed or no processes)");
  for (const { name, cwd } of ecosystem.apps) {
    const found = running.find((p) => p.name === name);
    const foundCwd = found?.pm2_env?.pm_cwd ?? "";
    if (!found) {
      console.log(`  ✓  ${name}  not used`);
    } else if (path.resolve(foundCwd) === path.resolve(cwd)) {
      ours.add(name);
      console.log(`  ✓  ${name}  already running from this project (${found.pm2_env.status})`);
    } else {
      problems++;
      console.log(`  ✗  ${name}  USED BY ANOTHER PROJECT (${foundCwd})`);
    }
  }

  console.log("\nPorts");
  for (const { name, port, expectRunning } of ports) {
    const busy = await inUse(port);
    const label = `${name.padEnd(9)} ${String(port).padEnd(5)}`;
    if (expectRunning) {
      if (busy) console.log(`  ✓  ${label} running`);
      else {
        problems++;
        console.log(`  ✗  ${label} NOT RUNNING (start it first, e.g. docker compose up -d)`);
      }
    } else if (!busy) {
      console.log(`  ✓  ${label} free`);
    } else if (ours.has(appForPort[name])) {
      console.log(`  ✓  ${label} used by ${appForPort[name]} (this project)`);
    } else {
      problems++;
      const who = owner(port);
      console.log(`  ✗  ${label} IN USE${who ? ` by ${who}` : ""}`);
    }
  }

  if (problems) {
    console.log(
      `\n${problems} problem(s). Free the port or pick others, e.g.\n` +
        "  export API_PORT=4100 WEB_PORT=3100 ADMIN_PORT=3101\n" +
        "  node scripts/check-ports.cjs && pm2 start ecosystem.config.cjs\n" +
        "Then update API_URL, WEB_URL, CORS_ORIGINS and API_PUBLIC_URL in the env files to match.",
    );
    process.exit(1);
  }
  console.log("\nAll good.");
})();
