// Single source of truth for the ports used by beautyup-shop.
// Override with environment variables when the defaults are taken on a server.
const num = (v, d) => (v && /^\d+$/.test(v) ? Number(v) : d);

const API_PORT = num(process.env.API_PORT, 4000);
const WEB_PORT = num(process.env.WEB_PORT, 3000);
const ADMIN_PORT = num(process.env.ADMIN_PORT, 3001);
const DB_PORT = num(process.env.DB_PORT, 5433);

module.exports = {
  API_PORT,
  WEB_PORT,
  ADMIN_PORT,
  DB_PORT,
  ports: [
    { name: "api", port: API_PORT },
    { name: "web", port: WEB_PORT },
    { name: "admin", port: ADMIN_PORT },
    // PostgreSQL should already be up (docker compose) before the apps start
    { name: "postgres", port: DB_PORT, expectRunning: true },
  ],
};
