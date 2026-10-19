"use client";

// Appels depuis le navigateur. Tout passe par le serveur Next.js :
//   /api/session/*  connexion, inscription, déconnexion, invitation (pose les cookies)
//   /api/proxy/*    toute autre route de l'API, avec le jeton de la session

export class RequestError extends Error {
  constructor(message, status, errors) {
    super(message || "Une erreur est survenue, veuillez réessayer");
    this.status = status;
    /** Erreurs de validation par champ, ex. { email: "E-mail invalide" }. */
    this.errors = errors || {};
  }
}

async function send(url, { method = "GET", body, form } = {}) {
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new RequestError("Connexion impossible, vérifiez votre réseau", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new RequestError(json?.message, res.status, json?.errors);
  }
  return json.data;
}

/** Route de l'API, ex. api("/orders", { method: "POST", body }). */
export function api(path, options) {
  return send(`/api/proxy${path}`, options);
}

/** Action de session : login, register, logout, invitation/preview, invitation/accept. */
export function sessionAction(action, body) {
  return send(`/api/session/${action}`, { method: "POST", body });
}
