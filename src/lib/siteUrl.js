/**
 * Public URL helpers for browser redirects.
 *
 * Supabase email links must use a deploy URL instead of the Supabase dashboard's
 * fallback Site URL. In production, set VITE_SITE_URL to the canonical Netlify
 * origin. Without it, the current browser origin is used, which keeps local dev
 * working and also handles branch deploys.
 */
const FALLBACK_SITE_URL = "https://humphrey-come-home.netlify.app";

export function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return FALLBACK_SITE_URL;
}

export function getPublicRedirectUrl(path = "/") {
  const safePath =
    typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
      ? path
      : "/";
  return new URL(safePath, `${getSiteUrl()}/`).toString();
}
