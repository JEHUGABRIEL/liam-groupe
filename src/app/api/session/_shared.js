import { NextResponse } from "next/server";
import { ApiError, apiJson } from "@/lib/api";
import { setSessionCookies } from "@/lib/session";

/** Réponse d'erreur dans l'enveloppe de l'API, pour que le navigateur la lise comme les autres. */
export function errorResponse(error) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, message: error.message, errors: error.errors },
      { status: error.status || 500 },
    );
  }
  console.error("[session]", error);
  return NextResponse.json({ success: false, message: "Service momentanément indisponible" }, { status: 503 });
}

/**
 * Appelle une route de l'API qui ouvre une session (connexion, inscription,
 * invitation acceptée) : les jetons vont en cookies, seul l'utilisateur est renvoyé.
 */
export async function openSession(request, apiPath, status = 200) {
  try {
    const body = await request.json();
    const tokens = await apiJson(apiPath, { method: "POST", body });
    const response = NextResponse.json({ success: true, data: tokens.user }, { status });
    setSessionCookies(response, tokens);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
