import { getPublic } from "@/lib/api";
import { domainHref } from "@/lib/links";
import { getDomains } from "@/lib/site";

const SITE_URL = process.env.SITE_URL || "https://liamgroupe.org";

export default async function sitemap() {
  const [domains, news, upcoming, past, products] = await Promise.all([
    getDomains(),
    getPublic("/api/news", { fallback: [] }),
    getPublic("/api/events", { fallback: [] }),
    getPublic("/api/events?past=true", { fallback: [] }),
    getPublic("/api/products", { fallback: [] }),
  ]);
  const paths = [
    "/", "/a-propos", "/boutique", "/actualites", "/mentions-legales", "/politique-de-confidentialite",
    ...domains.map((d) => domainHref(d.slug)),
    ...news.map((n) => `/actualites/${n.slug}`),
    ...[...upcoming, ...past].map((e) => `/evenements/${e.slug}`),
    ...products.map((p) => `/boutique/${p.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({ url: `${SITE_URL}${path}` }));
}
