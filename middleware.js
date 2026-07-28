import { NextResponse } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

if (!Array.isArray(locales) || locales.length === 0) {
  throw new Error(
    "[middleware] La liste des locales est vide. Vérifie la constante `locales` dans middleware.js. " +
    "Elle doit contenir au moins une locale valide (ex: ['fr', 'en'])."
  );
}

if (!defaultLocale || typeof defaultLocale !== "string") {
  throw new Error(
    "[middleware] La locale par défaut est invalide. Vérifie la constante `defaultLocale` dans middleware.js. " +
    "Valeur actuelle : " + JSON.stringify(defaultLocale)
  );
}

function getLocale(request) {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (locales.includes(preferred)) return preferred;
  }
  return defaultLocale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect /admin and /api as-is (no locale prefix needed)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

  // Redirect root or unknown paths to the detected/default locale
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, images, favicon, etc.)
    "/((?!_next|images|favicon\\.png|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
