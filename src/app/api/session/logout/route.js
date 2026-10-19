import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiJson } from "@/lib/api";
import { REFRESH_COOKIE, clearSessionCookies } from "@/lib/session";

/** Invalide le jeton de rafraîchissement côté API puis efface les cookies, même si l'API ne répond pas. */
export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    await apiJson("/api/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
  }
  const response = NextResponse.json({ success: true, data: null });
  clearSessionCookies(response);
  return response;
}
