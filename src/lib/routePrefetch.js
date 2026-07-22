

const routeImporters = {
  "/a-propos": () => import("../pages/About"),
  "/boutique": () => import("../pages/BoutiqueIndex"),
  "/actualites": () => import("../pages/News"),
  "/evenements": () => import("../pages/Events"),
  "/domaines": () => import("../pages/DomainsIndex"),
  "/admin": () => import("../pages/Admin"),
};

const prefetched = new Set();


export function prefetchRoute(path) {
  if (!path || prefetched.has(path)) return;

  const importer = routeImporters[path];
  if (importer) {
    prefetched.add(path);
    importer().catch(() => {});
    return;
  }

  
  if (path.startsWith("/domaines/") && !prefetched.has("__domain")) {
    prefetched.add("__domain");
    import("../pages/Domain").catch(() => {});
  }
}
