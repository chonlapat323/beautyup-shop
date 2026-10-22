import "server-only";

/** The public website address (SITE_URL); WEB_URL may be an internal address used for revalidation. */
export const siteUrl = () => (process.env.SITE_URL || process.env.WEB_URL || "http://localhost:3000").replace(/\/$/, "");
