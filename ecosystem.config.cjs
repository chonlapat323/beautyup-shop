// PM2 process file for production.
//
// Run `node scripts/check-ports.cjs` first: it checks the ports AND that these
// PM2 names are not already used by another project on the server
// (the server already runs "beautyup-api" / "beautyup-admin" from the old project).
//
//   pm2 start ecosystem.config.cjs           # start all
//   pm2 start ecosystem.config.cjs --only beautyup-shop-api
//   pm2 reload beautyup-shop-web beautyup-shop-admin   # after a deploy (never "reload all": the server is shared)
//   pm2 logs beautyup-shop-web
//   pm2 save                                 # remember the process list for reboots
//
// Ports and HOST come from the root .env (see .env.server.example; dev defaults 4000 / 3000 / 3001).
// Each app reads its own env file: apps/api/.env, apps/web/.env.local, apps/admin/.env.local

const path = require("node:path");
const { API_PORT, WEB_PORT, ADMIN_PORT, HOST } = require("./scripts/ports.cjs");

const app = (dir) => path.join(__dirname, "apps", dir);
const logs = (name) => ({
  out_file: path.join(__dirname, "logs", `${name}.out.log`),
  error_file: path.join(__dirname, "logs", `${name}.error.log`),
  merge_logs: true,
  time: true,
});

module.exports = {
  apps: [
    {
      name: "beautyup-shop-api",
      cwd: app("api"),
      // cwd matters: .env and the uploads/ folder are resolved from here
      script: "dist/main.js",
      exec_mode: "fork",
      instances: 1, // uploads live on local disk and inquiry rate limits are in memory
      max_memory_restart: "512M",
      env: { NODE_ENV: "production", PORT: API_PORT, HOST },
      ...logs("api"),
    },
    {
      name: "beautyup-shop-web",
      cwd: app("web"),
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${WEB_PORT} -H ${HOST}`,
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "768M",
      env: { NODE_ENV: "production" },
      ...logs("web"),
    },
    {
      name: "beautyup-shop-admin",
      cwd: app("admin"),
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${ADMIN_PORT} -H ${HOST}`,
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "512M",
      env: { NODE_ENV: "production" },
      ...logs("admin"),
    },
  ],
};
