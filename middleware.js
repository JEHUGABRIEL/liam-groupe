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

function getLocaleFromPathname(pathname) {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match && locales.includes(match[1]) ? match[1] : null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Déterminer la locale courante depuis l'URL ou le navigateur
  const locale = getLocaleFromPathname(pathname) || getLocale(request);

  // Construire la réponse (next ou redirect) selon le chemin
  let response;
  if (getLocaleFromPathname(pathname) || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    response = NextResponse.next();
  } else {
    const newUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);
    response = NextResponse.redirect(newUrl);
  }

  // Toujours setter le cookie sur l'objet Response effectivement retourné
  response.cookies.set("lang", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 an
  });

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, images, favicon, etc.)
    "/((?!_next|images|favicon\\.png|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
