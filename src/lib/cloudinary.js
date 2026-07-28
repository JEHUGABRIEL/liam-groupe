// Configuration Cloudinary centralisée avec validation explicite

const missing = [];

const CLOUD_NAME_FROM_ENV =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) ||
  (typeof process !== "undefined" && process.env?.CLOUDINARY_CLOUD_NAME);

if (!CLOUD_NAME_FROM_ENV) missing.push("CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");

export const CLOUD_NAME = CLOUD_NAME_FROM_ENV || "dwmrzp61c";
export const UPLOAD_PRESET = "liam-groupe";

if (missing.length > 0) {
  console.warn(
    `[Cloudinary] Variables d'environnement manquantes : ${missing.join(", ")}. ` +
    `Le cloud name par défaut "dwmrzp61c" sera utilisé. Si le build échoue, vérifie ` +
    `que le fichier .env contient ces clés ou qu'un redémarrage du serveur suffit.`
  );
}

export const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
export const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
