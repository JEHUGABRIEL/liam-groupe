const SITE_URL = process.env.SITE_URL || "https://liamgroupe.org";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/mon-compte", "/commande", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
