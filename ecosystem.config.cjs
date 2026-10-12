// PM2 process file for production.
//
//   pm2 start ecosystem.config.cjs          # start all
//   pm2 start ecosystem.config.cjs --only beautyup-api
//   pm2 reload ecosystem.config.cjs         # zero-downtime reload after a deploy
//   pm2 logs beautyup-web
//   pm2 save && pm2 startup                 # restart on server reboot
//
// Each app reads its own env file from its folder:
//   apps/api/.env, apps/web/.env.local, apps/admin/.env.local
// See README "Deploy with PM2" for the full build order.

const path = require("node:path");

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
      name: "beautyup-api",
      cwd: app("api"),
      // cwd matters: .env and the uploads/ folder are resolved from here
      script: "dist/main.js",
      exec_mode: "fork",
      instances: 1, // uploads live on local disk and inquiry rate limits are in memory
      max_memory_restart: "512M",
      env: { NODE_ENV: "production", PORT: 4000 },
      ...logs("api"),
    },
    {
      name: "beautyup-web",
      cwd: app("web"),
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "768M",
      env: { NODE_ENV: "production" },
      ...logs("web"),
    },
    {
      name: "beautyup-admin",
      cwd: app("admin"),
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "512M",
      env: { NODE_ENV: "production" },
      ...logs("admin"),
    },
  ],
};
