// Appels à l'API Spring Boot depuis le serveur Next.js (composants serveur, routes /api).
// Le navigateur ne contacte jamais l'API directement : cf. lib/client.js.

export const API_URL = process.env.API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message || "Erreur de l'API");
    this.status = status;
    this.errors = errors;
  }
}

/** Requête brute vers l'API : renvoie la réponse fetch, sans interpréter le corps. */
export function apiRequest(path, { method = "GET", body, token, headers = {}, ...init } = {}) {
  return fetch(`${API_URL}${path}`, {
    method,
    body,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
    ...init,
  });
}

/** Appel JSON : renvoie `data` de l'enveloppe ApiResponse, ou lève une ApiError. */
export async function apiJson(path, { body, ...options } = {}) {
  const res = await apiRequest(path, {
    ...options,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? options.headers : { "Content-Type": "application/json", ...options.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message, json?.errors);
  }
  return json.data;
}

/**
 * Contenu public pour le rendu serveur, mis en cache `revalidate` secondes.
 * Renvoie `fallback` si la ressource n'existe pas ou si l'API est injoignable :
 * une page du site ne doit pas planter parce qu'un bloc est indisponible.
 */
export async function getPublic(path, { revalidate = 60, fallback = null } = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) {
      if (res.status !== 404) console.error(`[api] GET ${path} → ${res.status}`);
      return fallback;
    }
    const json = await res.json();
    return json?.data ?? fallback;
  } catch (error) {
    console.error(`[api] GET ${path} injoignable : ${error.message}`);
    return fallback;
  }
}
