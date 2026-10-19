// Session navigateur : les jetons émis par l'API sont gardés en cookies httpOnly,
// invisibles pour le JavaScript de la page (pas de vol de jeton par XSS).

export const ACCESS_COOKIE = "liam_at";
export const REFRESH_COOKIE = "liam_rt";

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

/** Pose les cookies de session à partir d'une TokenResponse de l'API. */
export function setSessionCookies(response, tokens) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, { ...baseCookie, maxAge: tokens.expiresIn });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, { ...baseCookie, maxAge: tokens.refreshExpiresIn });
}

export function clearSessionCookies(response) {
  response.cookies.set(ACCESS_COOKIE, "", { ...baseCookie, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...baseCookie, maxAge: 0 });
}
