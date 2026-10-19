import { getPublic } from "./api";

/** Paramètres du site (siteInfo, homeHeroImages...) : un seul appel, mis en cache 5 min. */
export async function getSettings() {
  return getPublic("/api/site/settings", { revalidate: 300, fallback: {} });
}

export async function getSiteInfo() {
  return (await getSettings()).siteInfo || {};
}

export async function getDomains() {
  return getPublic("/api/domains", { revalidate: 300, fallback: [] });
}
