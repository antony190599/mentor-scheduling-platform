
export const APP_HOSTNAMES = new Set([
  `app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "localhost:8888",
  "localhost",
]);

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : "http://localhost:8888";

export const API_HOSTNAMES = new Set([
  `api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "api.localhost:8888",
]);

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : "http://api.localhost:8888";

export const ADMIN_HOSTNAMES = new Set([
  `admin.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "admin.localhost:8888",
]);
