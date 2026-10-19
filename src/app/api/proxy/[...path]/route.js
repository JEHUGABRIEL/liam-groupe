import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiJson, apiRequest } from "@/lib/api";
import { ACCESS_COOKIE, REFRESH_COOKIE, clearSessionCookies, setSessionCookies } from "@/lib/session";

/**
 * Relaie /api/proxy/<chemin> vers /api/<chemin> de l'API en ajoutant le jeton
 * d'accès de la session. Si le jeton a expiré, il est renouvelé une fois avec le
 * jeton de rafraîchissement (à usage unique) et la requête est rejouée.
 */
async function forward(request, { params }) {
  const { path } = await params;
  const target = `/api/${path.map(encodeURIComponent).join("/")}${new URL(request.url).search}`;
  const store = await cookies();
  let accessToken = store.get(ACCESS_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  // Corps lu une seule fois : il peut être renvoyé après un renouvellement de session.
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
  const contentType = request.headers.get("content-type");
  const send = (token) => apiRequest(target, {
    method: request.method,
    body,
    token,
    headers: contentType ? { "Content-Type": contentType } : {},
  });

  let renewed = null;
  let res = accessToken ? await send(accessToken) : null;
  if ((!res || res.status === 401) && refreshToken) {
    renewed = await apiJson("/api/auth/refresh", { method: "POST", body: { refreshToken } }).catch(() => null);
    if (renewed) {
      accessToken = renewed.accessToken;
      res = await send(accessToken);
    }
  }
  if (!res) {
    res = await send(undefined);
  }

  const payload = await res.text();
  const response = new NextResponse(payload || null, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
  if (renewed) {
    setSessionCookies(response, renewed);
  } else if (res.status === 401 && refreshToken) {
    // Session expirée ou révoquée (mot de passe changé) : on nettoie.
    clearSessionCookies(response);
  }
  return response;
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
