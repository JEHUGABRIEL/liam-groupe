import { NextResponse } from "next/server";
import { REFRESH_COOKIE } from "@/lib/session";

/** Pages réservées aux comptes : sans session, renvoi vers la connexion puis retour à la page demandée. */
export function proxy(request) {
  // L'invitation d'un administrateur s'ouvre sans compte.
  if (request.cookies.has(REFRESH_COOKIE) || request.nextUrl.pathname.startsWith("/admin/invitation")) {
    return NextResponse.next();
  }
  // La modale de connexion s'ouvre sur l'accueil, puis ramène à la page demandée.
  const login = new URL("/", request.url);
  login.searchParams.set("auth", "connexion");
  login.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/mon-compte/:path*", "/commande/:path*", "/admin/:path*"],
};
