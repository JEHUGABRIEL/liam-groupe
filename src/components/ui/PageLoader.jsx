/** Écran de chargement d'une page : logo, filet rouge qui défile, libellé. */
export default function PageLoader({ label = "Chargement" }) {
  return (
    <div role="status" aria-live="polite" className="bloc-heros min-h-[60vh] items-center justify-center text-center">
      <img src="/images/logo-liam.png" alt="" width={120} height={60} className="h-14 w-auto animate-pulse" />
      <span aria-hidden="true" className="barre-chargement mt-8" />
      <p className="t-label-sm mt-5 text-encre/60">{label}…</p>
    </div>
  );
}

/** Bloc qui pulse à la place d'un contenu encore en chargement (blanc sur fond beige). */
export function Skeleton({ className = "", surBeige = false }) {
  return <span aria-hidden="true" className={`block animate-pulse ${surBeige ? "bg-white" : "bg-gris-clair"} ${className}`} />;
}

/** Lignes fantômes d'une liste du compte (commandes, abonnements…). */
export function ListSkeleton({ rows = 3 }) {
  return (
    <ul aria-label="Chargement" className="space-y-4">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center justify-between gap-4 border border-bordure p-5">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-24" />
        </li>
      ))}
    </ul>
  );
}
